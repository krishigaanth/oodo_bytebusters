import { UserSession } from '../types/auth';
import { apiClient, setStoredAuthToken, clearStoredAuth } from './apiClient';
import { getStoredItem, setStoredItem, removeStoredItem } from './apiUtils';

const SESSION_STORAGE_KEY = 'dayflow_auth_session';

export const authService = {
  /**
   * Authenticate employee credentials via Backend API
   * Endpoint: POST /api/v1/auth/login
   */
  async login(loginId: string, password: string): Promise<UserSession> {
    const cleanId = loginId.trim();

    const response = await apiClient.post<{
      success: boolean;
      user: UserSession;
      token: string;
      message?: string;
    }>('/auth/login', {
      loginId: cleanId,
      password,
    });

    if (!response || !response.user) {
      throw new Error('Invalid response from authentication server.');
    }

    const token = response.token || response.user.token;
    if (token) {
      setStoredAuthToken(token);
    }

    const session: UserSession = {
      ...response.user,
      token,
      lastLoginAt: response.user.lastLoginAt || new Date().toISOString(),
    };

    setStoredItem(SESSION_STORAGE_KEY, session);
    return session;
  },

  /**
   * Log out employee and invalidate local session
   * Endpoint: POST /api/v1/auth/logout
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors during logout
    } finally {
      clearStoredAuth();
      removeStoredItem(SESSION_STORAGE_KEY);
    }
  },

  /**
   * Get current authenticated user session from backend (with local fallback)
   * Endpoint: GET /api/v1/auth/me
   */
  async getCurrentUser(): Promise<UserSession | null> {
    const localSession = getStoredItem<UserSession | null>(SESSION_STORAGE_KEY, null);
    if (!localSession) return null;

    try {
      const response = await apiClient.get<{ success: boolean; user: UserSession }>('/auth/me');
      if (response && response.user) {
        const session: UserSession = {
          ...response.user,
          token: localSession.token,
        };
        setStoredItem(SESSION_STORAGE_KEY, session);
        return session;
      }
    } catch (err) {
      // If unauthorized, return null
      return null;
    }

    return localSession;
  },

  /**
   * Change password for the current employee
   * Endpoint: POST /api/v1/auth/change-password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      '/auth/change-password',
      {
        currentPassword,
        newPassword,
      }
    );

    return {
      success: true,
      message: response.message || 'Password successfully updated!',
    };
  },
};
