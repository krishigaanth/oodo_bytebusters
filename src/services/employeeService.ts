import { EmployeeProfile, EditableProfileFields } from '../types/employee';
import { apiClient } from './apiClient';
import { MOCK_EMPLOYEE_DATA } from '../mocks/mockEmployees';

export const employeeService = {
  /**
   * Fetch full employee profile
   * Backend Endpoint: GET /api/v1/employees/me (or /api/v1/employees/:id/profile)
   */
  async getProfile(employeeId?: string): Promise<EmployeeProfile> {
    const id = employeeId || 'EMP001';
    const endpoint = `/employees/${id}/profile`;
    try {
      const profile = await apiClient.get<EmployeeProfile>(endpoint);
      if (profile && typeof profile === 'object' && profile.fullName) {
        return profile;
      }
    } catch (err) {
      console.warn('[employeeService] API fetch failed, using fallback mock profile.');
    }
    return MOCK_EMPLOYEE_DATA[id] || MOCK_EMPLOYEE_DATA['EMP001'];
  },

  /**
   * Update permitted employee profile fields
   * Backend Endpoint: PUT /api/v1/employees/me (or /api/v1/employees/:id/profile)
   */
  async updateProfile(
    employeeId: string,
    payload: Partial<EditableProfileFields>
  ): Promise<EmployeeProfile> {
    const id = employeeId || 'EMP001';
    const endpoint = `/employees/${id}/profile`;
    try {
      const updated = await apiClient.put<EmployeeProfile>(endpoint, payload);
      if (updated) return updated;
    } catch (err) {
      console.warn('[employeeService] API update failed, performing local mock profile update.');
    }

    const existing = MOCK_EMPLOYEE_DATA[id] || MOCK_EMPLOYEE_DATA['EMP001'];
    const updatedProfile: EmployeeProfile = {
      ...existing,
      mobile: payload.phone || existing.mobile,
      aboutBio: payload.aboutBio !== undefined ? payload.aboutBio : existing.aboutBio,
    };
    MOCK_EMPLOYEE_DATA[id] = updatedProfile;
    return updatedProfile;
  },
};
