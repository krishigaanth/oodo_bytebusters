export interface MockUserRecord {
  loginId: string;
  password: string; // Centrally configured mock password
  employeeId: string;
  name: string;
  email: string;
  role: 'employee' | 'admin' | 'hr';
  avatarUrl: string;
  status: 'active' | 'suspended';
}

export const MOCK_USERS_DATA: MockUserRecord[] = [
  {
    loginId: 'ADMIN001',
    password: 'admin123',
    employeeId: 'ADMIN001',
    name: 'HR Administrator',
    email: 'admin@dayflow.io',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&h=256&fit=crop&crop=faces&auto=format&q=80',
    status: 'active',
  },
  {
    loginId: 'EMP001',
    password: 'password123',
    employeeId: 'EMP001',
    name: 'Alex Morgan',
    email: 'alex.morgan@dayflow.io',
    role: 'employee',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&h=256&fit=crop&crop=faces&auto=format&q=80',
    status: 'active',
  },
  {
    loginId: 'EMP002',
    password: 'password123',
    employeeId: 'EMP002',
    name: 'Marcus Vance',
    email: 'marcus.vance@dayflow.io',
    role: 'employee',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=faces&auto=format&q=80',
    status: 'active',
  }
];

export const AUTH_CONFIG = {
  allowPublicSignup: false,
  sessionStorageKey: 'dayflow_auth_session',
  mockNetworkDelayMs: 400,
};
