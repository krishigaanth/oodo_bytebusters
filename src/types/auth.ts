export type UserRole = 'employee' | 'admin' | 'hr';

export interface UserSession {
  id?: string;
  employeeId: string;
  loginId: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  token?: string;
  lastLoginAt: string;
}

export interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: UserSession }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };
