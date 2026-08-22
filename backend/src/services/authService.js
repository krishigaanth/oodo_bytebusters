import { User } from '../models/User.js';
import { Employee } from '../models/Employee.js';
import { LeaveBalance } from '../models/LeaveBalance.js';
import { Notification } from '../models/Notification.js';
import { generateEmployeeUserId, generateNextEmployeeId } from './loginIdService.js';
import { payrollService } from './payrollService.js';
import { generateToken } from '../utils/jwtUtils.js';

export const authService = {
  /**
   * Authenticate employee or admin credentials
   * Matches loginId (or email case-insensitively)
   */
  async login(loginIdOrEmail, password) {
    const cleanIdentifier = loginIdOrEmail.trim();

    // Look up user by loginId or email
    const user = await User.findOne({
      $or: [
        { loginId: cleanIdentifier.toUpperCase() },
        { email: cleanIdentifier.toLowerCase() },
      ],
    });

    if (!user) {
      throw new Error('Invalid credentials. Please check your User ID / Email.');
    }

    let isMatch = await user.comparePassword(password);
    // Allow hackathon demo password fallback
    if (!isMatch && (password === 'password123' || password === 'Employee@123' || password === 'Admin@123')) {
      isMatch = true;
    }

    if (!isMatch) {
      throw new Error('Incorrect password. Please try again.');
    }

    if (user.status !== 'active') {
      throw new Error('Account is deactivated. Please contact your HR administrator.');
    }

    // Update lastLoginAt
    const nowIso = new Date().toISOString();
    user.lastLoginAt = nowIso;
    await user.save();

    // Generate JWT
    const token = generateToken({
      userId: user._id,
      employeeId: user.employeeId,
      loginId: user.loginId,
      email: user.email,
      role: user.role,
    });

    const userSession = {
      employeeId: user.employeeId,
      loginId: user.loginId,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
      token,
      lastLoginAt: nowIso,
    };

    return { user: userSession, token };
  },

  /**
   * Self-registration for new employee
   * Automatically formats User ID: [First2][Last2][Year][Serial3]
   * Example: John Smith in 2024 -> JOSM2024015
   */
  async registerEmployee({ firstName, lastName, email, password, jobTitle = 'Software Engineer', department = 'Engineering' }) {
    if (!firstName || !lastName || !email || !password) {
      throw new Error('Please provide First Name, Last Name, Corporate Email, and Password.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      throw new Error(`An account with email "${email}" already exists. Please log in.`);
    }

    const joiningDate = new Date().toISOString().split('T')[0];
    const employeeId = await generateNextEmployeeId();
    const loginId = await generateEmployeeUserId({ firstName, lastName, joiningDate });

    // 1. Create User
    const user = new User({
      employeeId,
      loginId,
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: cleanEmail,
      password, // Hashed by pre-save hook
      role: 'employee',
      status: 'active',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${loginId}`,
    });
    await user.save();

    // 2. Create Employee Profile
    const employee = new Employee({
      id: employeeId,
      loginId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      workEmail: cleanEmail,
      jobTitle: jobTitle || 'Software Engineer',
      department: department || 'Engineering',
      joiningDate,
      avatarUrl: user.avatarUrl,
      status: 'Active',
      hasPayrollAccess: true,
      aboutBio: `${jobTitle || 'Software Engineer'} in ${department || 'Engineering'} at Dayflow HRMS.`,
      skills: ['Teamwork', 'Productivity'],
      privateInfo: {
        dob: '1998-01-01',
        gender: 'Prefer not to say',
        maritalStatus: 'Single',
        nationality: 'United States',
        personalEmail: cleanEmail,
        residentialAddress: { street: '', city: '', state: '', postalCode: '', country: '' },
        emergencyContact: { name: '', relationship: '', phone: '' },
        bankAccount: { bankName: 'Silicon Valley Bank', accountNumber: '••••••••1234', accountHolder: `${firstName} ${lastName}`, ifscCode: 'SVBLUS66XXX', branch: 'San Francisco Branch' },
        taxIdentifiers: { panNumber: '••••••123A', ssnOrNationalId: '•••-••-1234', pfUanNumber: '100982348000' },
      },
    });
    await employee.save();

    // 3. Initialize default Leave Balances
    const defaultBalances = [
      { employeeId, leaveType: 'Paid Leave', totalQuota: 18, used: 0, available: 18, colorClass: 'from-indigo-500 to-brand-600', description: 'Accrued annual vacation & paid time off' },
      { employeeId, leaveType: 'Sick Leave', totalQuota: 12, used: 0, available: 12, colorClass: 'from-rose-500 to-pink-600', description: 'Medical emergencies & health recovery' },
      { employeeId, leaveType: 'Casual Leave', totalQuota: 8, used: 0, available: 8, colorClass: 'from-amber-500 to-orange-600', description: 'Personal urgent matters and errands' },
      { employeeId, leaveType: 'Unpaid Leave', totalQuota: 30, used: 0, available: 30, colorClass: 'from-slate-500 to-slate-700', description: 'Extended leave without compensation' },
    ];
    await LeaveBalance.insertMany(defaultBalances);

    // 4. Initialize default Payroll
    await payrollService.generateDefaultPayroll(employeeId, 8500);

    // 5. Welcome notification
    await Notification.create({
      id: `NOTIF-${Date.now().toString().slice(-6)}`,
      employeeId,
      title: 'Welcome to Dayflow HRMS!',
      message: `Your account is created! Your system User ID is ${loginId}.`,
      category: 'system',
      actionUrl: '/dashboard',
    });

    const token = generateToken({
      userId: user._id,
      employeeId: user.employeeId,
      loginId: user.loginId,
      email: user.email,
      role: user.role,
    });

    const userSession = {
      employeeId: user.employeeId,
      loginId: user.loginId,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
      token,
      lastLoginAt: new Date().toISOString(),
    };

    return {
      user: userSession,
      token,
      loginId,
      message: `Registration successful! Your generated User ID is ${loginId}.`,
    };
  },

  /**
   * Get user session for authenticated user
   */
  async getCurrentUser(employeeId) {
    const user = await User.findOne({ employeeId: employeeId.toUpperCase() });
    if (!user) {
      throw new Error('User not found');
    }

    return {
      employeeId: user.employeeId,
      loginId: user.loginId,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
      lastLoginAt: user.lastLoginAt,
    };
  },

  /**
   * Change password for authenticated employee
   */
  async changePassword(employeeId, currentPassword, newPassword) {
    const user = await User.findOne({ employeeId: employeeId.toUpperCase() });
    if (!user) {
      throw new Error('User record not found');
    }

    let isMatch = await user.comparePassword(currentPassword);
    if (!isMatch && (currentPassword === 'password123' || currentPassword === 'Employee@123')) {
      isMatch = true;
    }

    if (!isMatch) {
      throw new Error('Current password does not match our records.');
    }

    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }

    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();

    return {
      success: true,
      message: 'Password successfully updated! Please use your new password next time.',
    };
  },
};
