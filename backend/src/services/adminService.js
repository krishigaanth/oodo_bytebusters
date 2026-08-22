import crypto from 'crypto';
import { User } from '../models/User.js';
import { Employee } from '../models/Employee.js';
import { Attendance } from '../models/Attendance.js';
import { LeaveRequest } from '../models/LeaveRequest.js';
import { LeaveBalance } from '../models/LeaveBalance.js';
import { Payroll } from '../models/Payroll.js';
import { Notification } from '../models/Notification.js';
import { generateUniqueLoginId, generateNextEmployeeId } from './loginIdService.js';
import { payrollService } from './payrollService.js';

export const adminService = {
  /**
   * List all employees with search and pagination
   */
  async listEmployees({ search = '', department = '', status = '', page = 1, limit = 20 }) {
    const query = {};
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { id: { $regex: search, $options: 'i' } },
        { workEmail: { $regex: search, $options: 'i' } },
        { loginId: { $regex: search, $options: 'i' } },
      ];
    }
    if (department) query.department = department;
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [employees, total] = await Promise.all([
      Employee.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }).lean(),
      Employee.countDocuments(query),
    ]);

    return {
      employees,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  },

  /**
   * Get employee by ID
   */
  async getEmployeeById(employeeId) {
    const employee = await Employee.findOne({ id: employeeId.toUpperCase() }).lean();
    if (!employee) throw new Error(`Employee ${employeeId} not found`);
    return employee;
  },

  /**
   * Admin employee creation with auto-generated loginId and one-time temporary password
   */
  async createEmployee(data) {
    const {
      firstName,
      lastName,
      workEmail,
      jobTitle,
      department,
      role = 'employee',
      joiningDate = new Date().toISOString().split('T')[0],
      monthlyWage = 11250,
      mobile = '',
      officeLocation = 'San Francisco, CA (HQ)',
    } = data;

    // Check if email already registered
    const existingUser = await User.findOne({ email: workEmail.toLowerCase() });
    if (existingUser) {
      throw new Error(`An account with email "${workEmail}" already exists.`);
    }

    const employeeId = await generateNextEmployeeId();
    const loginId = await generateUniqueLoginId({
      companyInitials: 'DF',
      firstName,
      lastName,
      joiningDate,
    });

    // Generate secure 10-char temporary password
    const temporaryPassword = `Temp@${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // 1. Create User
    const user = new User({
      employeeId,
      loginId,
      name: `${firstName} ${lastName}`,
      email: workEmail.toLowerCase(),
      password: temporaryPassword, // Hashed by User model pre-save hook
      role,
      status: 'active',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${employeeId}`,
    });
    await user.save();

    // 2. Create Employee Profile
    const employee = new Employee({
      id: employeeId,
      loginId,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      workEmail: workEmail.toLowerCase(),
      jobTitle,
      department,
      mobile,
      officeLocation,
      joiningDate,
      avatarUrl: user.avatarUrl,
      status: 'Active',
      hasPayrollAccess: true,
      aboutBio: `${jobTitle} in the ${department} department at Dayflow Technologies.`,
      skills: [],
      privateInfo: {
        dob: '1995-01-01',
        gender: 'Prefer not to say',
        maritalStatus: 'Single',
        nationality: 'United States',
        personalEmail: workEmail.toLowerCase(),
        residentialAddress: { street: '', city: '', state: '', postalCode: '', country: '' },
        emergencyContact: { name: '', relationship: '', phone: '' },
        bankAccount: { bankName: '', accountNumber: '', accountHolder: '', ifscCode: '', branch: '' },
        taxIdentifiers: { panNumber: '', ssnOrNationalId: '', pfUanNumber: '' },
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

    // 4. Initialize Payroll
    await payrollService.generateDefaultPayroll(employeeId, Number(monthlyWage));

    // 5. Send welcome notification
    await Notification.create({
      id: `NOTIF-${Date.now().toString().slice(-6)}`,
      employeeId,
      title: 'Welcome to Dayflow HRMS!',
      message: `Welcome aboard ${firstName}! Your employee portal is active.`,
      category: 'system',
      actionUrl: '/dashboard',
    });

    return {
      employee: employee.toObject(),
      credentials: {
        employeeId,
        loginId,
        workEmail: workEmail.toLowerCase(),
        temporaryPassword, // returned once for handoff
      },
    };
  },

  /**
   * Update employee profile by Admin
   */
  async updateEmployee(employeeId, updateData) {
    const cleanId = employeeId.toUpperCase();
    const updated = await Employee.findOneAndUpdate(
      { id: cleanId },
      { $set: updateData },
      { new: true }
    );
    if (!updated) throw new Error(`Employee ${employeeId} not found`);

    if (updateData.fullName || updateData.jobTitle || updateData.workEmail) {
      await User.updateOne(
        { employeeId: cleanId },
        {
          $set: {
            ...(updateData.fullName && { name: updateData.fullName }),
            ...(updateData.workEmail && { email: updateData.workEmail.toLowerCase() }),
          },
        }
      );
    }

    return updated.toObject();
  },

  /**
   * Update employee status (active / suspended)
   */
  async updateStatus(employeeId, status) {
    const cleanId = employeeId.toUpperCase();
    const empStatus = status === 'active' ? 'Active' : 'On Leave';

    await User.updateOne({ employeeId: cleanId }, { $set: { status } });
    const emp = await Employee.findOneAndUpdate(
      { id: cleanId },
      { $set: { status: empStatus } },
      { new: true }
    );

    return emp ? emp.toObject() : null;
  },

  /**
   * Reset employee password by Admin
   */
  async resetPassword(employeeId) {
    const cleanId = employeeId.toUpperCase();
    const user = await User.findOne({ employeeId: cleanId });
    if (!user) throw new Error('User not found');

    const temporaryPassword = `Reset@${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    user.password = temporaryPassword;
    await user.save();

    await Notification.create({
      id: `NOTIF-${Date.now().toString().slice(-6)}`,
      employeeId: cleanId,
      title: 'Password Reset by Administrator',
      message: 'Your account password was reset by an HR Administrator.',
      category: 'system',
      actionUrl: '/profile?tab=security',
    });

    return {
      employeeId: cleanId,
      temporaryPassword,
    };
  },

  /**
   * List company-wide attendance logs
   */
  async listAttendance({ from, to, date, employeeId, page = 1, limit = 50 }) {
    const query = {};
    if (employeeId) query.employeeId = employeeId.toUpperCase();
    if (date) query.date = date;
    if (from && to) query.date = { $gte: from, $lte: to };

    const skip = (Number(page) - 1) * Number(limit);
    const [records, total] = await Promise.all([
      Attendance.find(query).sort({ date: -1 }).skip(skip).limit(Number(limit)).lean(),
      Attendance.countDocuments(query),
    ]);

    return { records, total, page: Number(page), limit: Number(limit) };
  },

  /**
   * List company leave requests
   */
  async listLeaves({ status, employeeId, page = 1, limit = 50 }) {
    const query = {};
    if (status) query.status = status;
    if (employeeId) query.employeeId = employeeId.toUpperCase();

    const skip = (Number(page) - 1) * Number(limit);
    const [requests, total] = await Promise.all([
      LeaveRequest.find(query).sort({ appliedOn: -1 }).skip(skip).limit(Number(limit)).lean(),
      LeaveRequest.countDocuments(query),
    ]);

    return { requests, total, page: Number(page), limit: Number(limit) };
  },

  /**
   * Approve leave request
   */
  async approveLeave(leaveId, adminUser, comments = 'Approved by administrator') {
    const request = await LeaveRequest.findOne({ id: leaveId });
    if (!request) throw new Error('Leave request not found');

    if (request.status !== 'Pending') {
      throw new Error(`Cannot approve a leave that is already ${request.status}`);
    }

    request.status = 'Approved';
    request.reviewedBy = `${adminUser.name} (${adminUser.role.toUpperCase()})`;
    request.reviewedOn = new Date().toISOString();
    request.reviewerComments = comments;
    await request.save();

    // Auto create notification
    await Notification.create({
      id: `NOTIF-${Date.now().toString().slice(-6)}`,
      employeeId: request.employeeId,
      title: 'Leave Request Approved',
      message: `Your ${request.leaveType} for ${request.startDate} to ${request.endDate} has been approved by ${adminUser.name}.`,
      category: 'leave',
      actionUrl: '/time-off',
    });

    return request.toObject();
  },

  /**
   * Reject leave request and refund balance
   */
  async rejectLeave(leaveId, adminUser, comments = 'Rejected by administrator') {
    const request = await LeaveRequest.findOne({ id: leaveId });
    if (!request) throw new Error('Leave request not found');

    if (request.status !== 'Pending') {
      throw new Error(`Cannot reject a leave that is already ${request.status}`);
    }

    request.status = 'Rejected';
    request.reviewedBy = `${adminUser.name} (${adminUser.role.toUpperCase()})`;
    request.reviewedOn = new Date().toISOString();
    request.reviewerComments = comments;
    await request.save();

    // Restore leave balance
    const balance = await LeaveBalance.findOne({
      employeeId: request.employeeId,
      leaveType: request.leaveType,
    });
    if (balance) {
      balance.available += request.totalDays;
      balance.used = Math.max(0, balance.used - request.totalDays);
      await balance.save();
    }

    // Auto create notification
    await Notification.create({
      id: `NOTIF-${Date.now().toString().slice(-6)}`,
      employeeId: request.employeeId,
      title: 'Leave Request Rejected',
      message: `Your ${request.leaveType} for ${request.startDate} to ${request.endDate} was declined. Notes: ${comments}`,
      category: 'leave',
      actionUrl: '/time-off',
    });

    return request.toObject();
  },
};
