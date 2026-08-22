import { EmployeeProfile, EditableProfileFields } from '../types/employee';
import { apiClient } from './apiClient';

export const employeeService = {
  /**
   * Fetch full employee profile
   * Backend Endpoint: GET /api/v1/employees/me (or /api/v1/employees/:id/profile)
   */
  async getProfile(employeeId?: string): Promise<EmployeeProfile> {
    const endpoint = employeeId ? `/employees/${employeeId}/profile` : '/employees/me';
    const profile = await apiClient.get<EmployeeProfile>(endpoint);
    return profile;
  },

  /**
   * Update permitted employee profile fields
   * Backend Endpoint: PUT /api/v1/employees/me (or /api/v1/employees/:id/profile)
   */
  async updateProfile(
    employeeId: string,
    payload: Partial<EditableProfileFields>
  ): Promise<EmployeeProfile> {
    const endpoint = employeeId ? `/employees/${employeeId}/profile` : '/employees/me';
    const updated = await apiClient.put<EmployeeProfile>(endpoint, payload);
    return updated;
  },
};
