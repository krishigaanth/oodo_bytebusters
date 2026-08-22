import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/database.js';
import { User } from '../models/User.js';
import { Employee } from '../models/Employee.js';
import { Attendance } from '../models/Attendance.js';
import { LeaveBalance } from '../models/LeaveBalance.js';
import { LeaveRequest } from '../models/LeaveRequest.js';
import { Payroll } from '../models/Payroll.js';
import { Notification } from '../models/Notification.js';

export const seedInitialData = async (quiet = false) => {
  try {
    if (!quiet) console.log('[Seed]: Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Employee.deleteMany({}),
      Attendance.deleteMany({}),
      LeaveBalance.deleteMany({}),
      LeaveRequest.deleteMany({}),
      Payroll.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    if (!quiet) console.log('[Seed]: Populating Users...');
    // We use create / save so that pre-save bcrypt hook hashes the passwords!
    const users = await User.create([
      {
        employeeId: 'ADM001',
        loginId: 'ADMIN001',
        name: 'Sarah Jenkins',
        email: 'admin@dayflow.com',
        password: 'Admin@123',
        role: 'admin',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&h=256&fit=crop&crop=faces&auto=format&q=80',
        status: 'active',
      },
      {
        employeeId: 'EMP001',
        loginId: 'EMP001',
        name: 'Alex Morgan',
        email: 'alex.morgan@dayflow.io',
        password: 'Employee@123', // also can use password123
        role: 'employee',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&h=256&fit=crop&crop=faces&auto=format&q=80',
        status: 'active',
      },
      {
        employeeId: 'EMP002',
        loginId: 'EMP002',
        name: 'Marcus Vance',
        email: 'marcus.vance@dayflow.io',
        password: 'Employee@123',
        role: 'employee',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=faces&auto=format&q=80',
        status: 'active',
      },
    ]);

    console.log('[Seed]: Populating Employee Profiles...');
    await Employee.create([
      {
        id: 'EMP001',
        loginId: 'EMP001',
        firstName: 'Alex',
        lastName: 'Morgan',
        fullName: 'Alex Morgan',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&h=256&fit=crop&crop=faces&auto=format&q=80',
        jobTitle: 'Senior Frontend Engineer',
        department: 'Core Product Engineering',
        workEmail: 'alex.morgan@dayflow.io',
        mobile: '+1 (555) 234-8901',
        companyName: 'Dayflow Technologies Inc.',
        reportingManager: {
          id: 'ADM001',
          name: 'Sarah Jenkins',
          jobTitle: 'VP of Product Engineering',
          email: 'admin@dayflow.com',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&h=256&fit=crop&crop=faces&auto=format&q=80',
        },
        officeLocation: 'San Francisco, CA (HQ) • Building 4',
        employmentType: 'Full-time',
        joiningDate: '2023-03-15',
        status: 'Active',
        hasPayrollAccess: true,
        aboutBio:
          'Passionate Frontend Architect and UI/UX specialist with 6+ years of experience crafting enterprise-grade SaaS platforms, design systems, and responsive web applications.',
        skills: [
          'React',
          'TypeScript',
          'Next.js',
          'Tailwind CSS',
          'Design Systems',
          'State Management',
          'REST APIs',
          'Web Performance',
        ],
        certifications: [
          {
            id: 'CERT-001',
            name: 'AWS Certified Solutions Architect – Associate',
            issuer: 'Amazon Web Services',
            issueDate: '2023-08-10',
            expiryDate: '2026-08-10',
            credentialId: 'AWS-993821-SA',
            verificationUrl: 'https://aws.amazon.com/verification',
          },
          {
            id: 'CERT-002',
            name: 'Meta Front-End Developer Professional Certificate',
            issuer: 'Meta / Coursera',
            issueDate: '2022-11-20',
            credentialId: 'META-FE-558291',
            verificationUrl: 'https://coursera.org/verify/meta',
          },
        ],
        workHistory: [
          {
            id: 'WH-01',
            role: 'Senior Frontend Engineer',
            company: 'Dayflow Technologies Inc.',
            startDate: '2023-03',
            endDate: 'Present',
            description: 'Led modern frontend redesign and implemented reusable component library.',
          },
          {
            id: 'WH-02',
            role: 'Frontend Software Engineer',
            company: 'NovaCloud SaaS Labs',
            startDate: '2021-01',
            endDate: '2023-02',
            description: 'Engineered analytics dashboards with real-time feeds and collaborative tools.',
          },
        ],
        education: [
          {
            degree: 'B.S. in Computer Science',
            institution: 'University of California, Berkeley',
            year: '2017 - 2021',
            grade: 'Magna Cum Laude (3.88 GPA)',
          },
        ],
        privateInfo: {
          dob: '1995-07-24',
          gender: 'Female',
          maritalStatus: 'Single',
          nationality: 'United States',
          personalEmail: 'alex.morgan.personal@gmail.com',
          residentialAddress: {
            street: '742 Evergreen Terrace, Apt 4B',
            city: 'San Francisco',
            state: 'California',
            postalCode: '94107',
            country: 'United States',
          },
          emergencyContact: {
            name: 'David Morgan',
            relationship: 'Father',
            phone: '+1 (555) 987-6543',
          },
          bankAccount: {
            bankName: 'Silicon Valley Bank / First Republic',
            accountNumber: '••••••••4892',
            accountHolder: 'Alex Morgan',
            ifscCode: 'SVBLUS66XXX',
            branch: 'Market Street Commercial Branch, SF',
          },
          taxIdentifiers: {
            panNumber: '••••••429A',
            ssnOrNationalId: '•••-••-8821',
            pfUanNumber: '100982348712',
          },
        },
        securityInfo: {
          twoFactorEnabled: true,
          lastPasswordChange: '2026-05-10 14:22:00',
          loginActivity: [
            {
              id: 'LOG-01',
              device: 'MacBook Pro 16" (macOS Sonoma)',
              browser: 'Chrome 128.0',
              ipAddress: '192.168.1.104',
              location: 'San Francisco, United States',
              timestamp: '2026-08-22 09:15 AM',
              status: 'Success',
            },
            {
              id: 'LOG-02',
              device: 'iPhone 15 Pro (iOS 17.5)',
              browser: 'Mobile Safari',
              ipAddress: '172.56.21.90',
              location: 'San Francisco, United States',
              timestamp: '2026-08-21 07:45 PM',
              status: 'Success',
            },
          ],
        },
      },
      {
        id: 'EMP002',
        loginId: 'EMP002',
        firstName: 'Marcus',
        lastName: 'Vance',
        fullName: 'Marcus Vance',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=faces&auto=format&q=80',
        jobTitle: 'DevOps & Cloud Engineer',
        department: 'Infrastructure & Security',
        workEmail: 'marcus.vance@dayflow.io',
        mobile: '+1 (555) 432-9876',
        companyName: 'Dayflow Technologies Inc.',
        reportingManager: {
          id: 'ADM001',
          name: 'Sarah Jenkins',
          jobTitle: 'VP of Product Engineering',
          email: 'admin@dayflow.com',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&h=256&fit=crop&crop=faces&auto=format&q=80',
        },
        officeLocation: 'San Francisco, CA (HQ) • Building 4',
        employmentType: 'Full-time',
        joiningDate: '2023-06-01',
        status: 'Active',
        hasPayrollAccess: true,
        aboutBio: 'Cloud architect focused on Kubernetes, Terraform, and high-availability systems.',
        skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'CI/CD', 'Node.js'],
        certifications: [],
        workHistory: [],
        education: [],
        privateInfo: {
          dob: '1993-11-12',
          gender: 'Male',
          maritalStatus: 'Single',
          nationality: 'United States',
          personalEmail: 'marcus.vance.personal@gmail.com',
          residentialAddress: {
            street: '120 Market St',
            city: 'San Francisco',
            state: 'California',
            postalCode: '94105',
            country: 'United States',
          },
          emergencyContact: {
            name: 'Elena Vance',
            relationship: 'Sister',
            phone: '+1 (555) 321-7654',
          },
          bankAccount: {
            bankName: 'Chase Bank',
            accountNumber: '••••••••7731',
            accountHolder: 'Marcus Vance',
            ifscCode: 'CHASUS33XXX',
            branch: 'Downtown SF Branch',
          },
          taxIdentifiers: {
            panNumber: '••••••812B',
            ssnOrNationalId: '•••-••-1194',
            pfUanNumber: '100982348899',
          },
        },
      },
    ]);

    console.log('[Seed]: Populating Attendance records...');
    const attendanceRecords = [
      { id: 'ATT-20260821', employeeId: 'EMP001', date: '2026-08-21', checkIn: '09:05 AM', checkOut: '06:15 PM', workHours: 8.5, extraHours: 0.5, status: 'Present', notes: 'Regular day + release sync', isOvertime: true },
      { id: 'ATT-20260820', employeeId: 'EMP001', date: '2026-08-20', checkIn: '09:12 AM', checkOut: '05:45 PM', workHours: 8.0, extraHours: 0.0, status: 'Present', notes: 'Sprint planning' },
      { id: 'ATT-20260819', employeeId: 'EMP001', date: '2026-08-19', checkIn: '08:58 AM', checkOut: '06:30 PM', workHours: 8.7, extraHours: 0.7, status: 'Present', notes: 'Client tech demo', isOvertime: true },
      { id: 'ATT-20260818', employeeId: 'EMP001', date: '2026-08-18', checkIn: '09:30 AM', checkOut: '01:30 PM', workHours: 4.0, extraHours: 0.0, status: 'Half Day', notes: 'Doctor appointment' },
      { id: 'ATT-20260815', employeeId: 'EMP001', date: '2026-08-15', checkIn: null, checkOut: null, workHours: 0.0, extraHours: 0.0, status: 'Holiday', notes: 'National Holiday' },
      { id: 'ATT-20260814', employeeId: 'EMP001', date: '2026-08-14', checkIn: '09:00 AM', checkOut: '05:30 PM', workHours: 8.0, extraHours: 0.0, status: 'Present', notes: 'Unit test upgrades' },
      { id: 'ATT-20260813', employeeId: 'EMP001', date: '2026-08-13', checkIn: '09:10 AM', checkOut: '05:40 PM', workHours: 8.0, extraHours: 0.0, status: 'Present', notes: 'Design sync' },
      { id: 'ATT-20260812', employeeId: 'EMP001', date: '2026-08-12', checkIn: null, checkOut: null, workHours: 0.0, extraHours: 0.0, status: 'Leave', notes: 'Approved Sick Leave' },
      { id: 'ATT-20260811', employeeId: 'EMP001', date: '2026-08-11', checkIn: '08:45 AM', checkOut: '06:00 PM', workHours: 8.5, extraHours: 0.5, status: 'Present', notes: 'Refactoring', isOvertime: true },
      { id: 'ATT-20260810', employeeId: 'EMP001', date: '2026-08-10', checkIn: '09:02 AM', checkOut: '05:35 PM', workHours: 8.0, extraHours: 0.0, status: 'Present', notes: 'All-hands meeting' },
      { id: 'ATT-20260807', employeeId: 'EMP001', date: '2026-08-07', checkIn: '09:15 AM', checkOut: '05:50 PM', workHours: 8.0, extraHours: 0.0, status: 'Present', notes: 'Design tokens sync' },
      { id: 'ATT-20260806', employeeId: 'EMP001', date: '2026-08-06', checkIn: '09:00 AM', checkOut: '05:30 PM', workHours: 8.0, extraHours: 0.0, status: 'Present', notes: 'Integration tests' },
      { id: 'ATT-20260805', employeeId: 'EMP001', date: '2026-08-05', checkIn: '09:05 AM', checkOut: '06:05 PM', workHours: 8.2, extraHours: 0.2, status: 'Present', notes: 'Bug bash session' },
      { id: 'ATT-20260804', employeeId: 'EMP001', date: '2026-08-04', checkIn: '09:20 AM', checkOut: '05:40 PM', workHours: 7.8, extraHours: 0.0, status: 'Present', notes: 'Architecture review' },
      { id: 'ATT-20260803', employeeId: 'EMP001', date: '2026-08-03', checkIn: '08:50 AM', checkOut: '05:30 PM', workHours: 8.1, extraHours: 0.1, status: 'Present', notes: 'Monthly kick-off' },
    ];
    await Attendance.insertMany(attendanceRecords);

    console.log('[Seed]: Populating Leave Balances...');
    const leaveBalances = [
      { employeeId: 'EMP001', leaveType: 'Paid Leave', totalQuota: 18, used: 5, available: 13, colorClass: 'from-indigo-500 to-brand-600', description: 'Accrued annual vacation & paid time off' },
      { employeeId: 'EMP001', leaveType: 'Sick Leave', totalQuota: 12, used: 3, available: 9, colorClass: 'from-rose-500 to-pink-600', description: 'Medical emergencies & health recovery' },
      { employeeId: 'EMP001', leaveType: 'Casual Leave', totalQuota: 8, used: 2, available: 6, colorClass: 'from-amber-500 to-orange-600', description: 'Personal urgent matters and errands' },
      { employeeId: 'EMP001', leaveType: 'Unpaid Leave', totalQuota: 30, used: 0, available: 30, colorClass: 'from-slate-500 to-slate-700', description: 'Extended leave without compensation' },

      { employeeId: 'EMP002', leaveType: 'Paid Leave', totalQuota: 18, used: 2, available: 16, colorClass: 'from-indigo-500 to-brand-600', description: 'Accrued annual vacation & paid time off' },
      { employeeId: 'EMP002', leaveType: 'Sick Leave', totalQuota: 12, used: 1, available: 11, colorClass: 'from-rose-500 to-pink-600', description: 'Medical emergencies & health recovery' },
      { employeeId: 'EMP002', leaveType: 'Casual Leave', totalQuota: 8, used: 0, available: 8, colorClass: 'from-amber-500 to-orange-600', description: 'Personal urgent matters and errands' },
      { employeeId: 'EMP002', leaveType: 'Unpaid Leave', totalQuota: 30, used: 0, available: 30, colorClass: 'from-slate-500 to-slate-700', description: 'Extended leave without compensation' },
    ];
    await LeaveBalance.insertMany(leaveBalances);

    console.log('[Seed]: Populating Leave Requests...');
    const leaveRequests = [
      {
        id: 'LV-2026-003',
        employeeId: 'EMP001',
        leaveType: 'Paid Leave',
        startDate: '2026-09-14',
        endDate: '2026-09-18',
        totalDays: 5,
        reason: 'Family vacation trip to Yosemite National Park.',
        attachmentName: 'flight_tickets_confirmation.pdf',
        status: 'Pending',
        appliedOn: '2026-08-20T14:32:00Z',
      },
      {
        id: 'LV-2026-002',
        employeeId: 'EMP001',
        leaveType: 'Sick Leave',
        startDate: '2026-08-12',
        endDate: '2026-08-12',
        totalDays: 1,
        reason: 'Viral fever and doctor-prescribed rest.',
        attachmentName: 'medical_certificate.pdf',
        status: 'Approved',
        appliedOn: '2026-08-11T18:10:00Z',
        reviewedBy: 'Sarah Jenkins (VP of Product)',
        reviewedOn: '2026-08-12T08:30:00Z',
        reviewerComments: 'Get well soon Alex. Take care!',
      },
      {
        id: 'LV-2026-001',
        employeeId: 'EMP001',
        leaveType: 'Casual Leave',
        startDate: '2026-07-03',
        endDate: '2026-07-03',
        totalDays: 1,
        reason: 'Home maintenance and appliance installation.',
        status: 'Approved',
        appliedOn: '2026-06-28T09:15:00Z',
        reviewedBy: 'Sarah Jenkins (VP of Product)',
        reviewedOn: '2026-06-29T10:00:00Z',
        reviewerComments: 'Approved.',
      },
      {
        id: 'LV-2026-000',
        employeeId: 'EMP001',
        leaveType: 'Paid Leave',
        startDate: '2026-05-02',
        endDate: '2026-05-06',
        totalDays: 5,
        reason: 'Personal travel overlap during major product launch window.',
        status: 'Rejected',
        appliedOn: '2026-04-20T11:45:00Z',
        reviewedBy: 'Sarah Jenkins (VP of Product)',
        reviewedOn: '2026-04-22T14:00:00Z',
        reviewerComments: 'Required on-site for Q2 Major Release deployment. Please reschedule after May 15.',
      },
    ];
    await LeaveRequest.insertMany(leaveRequests);

    console.log('[Seed]: Populating Payroll summaries...');
    const payrollEMP001 = {
      employeeId: 'EMP001',
      annualCtc: 135000,
      monthlyGross: 11250,
      monthlyNet: 8970,
      totalAnnualDeductions: 27360,
      currencySymbol: '$',
      earningsBreakdown: [
        { name: 'Basic Salary', monthlyAmount: 5625, annualAmount: 67500, type: 'earning', isTaxable: true },
        { name: 'House Rent Allowance (HRA)', monthlyAmount: 2812.5, annualAmount: 33750, type: 'earning', isTaxable: true },
        { name: 'Special Allowance', monthlyAmount: 1812.5, annualAmount: 21750, type: 'earning', isTaxable: true },
        { name: 'Conveyance Allowance', monthlyAmount: 500, annualAmount: 6000, type: 'earning', isTaxable: false },
        { name: 'Medical Allowance', monthlyAmount: 500, annualAmount: 6000, type: 'earning', isTaxable: false },
      ],
      deductionsBreakdown: [
        { name: 'Provident Fund (401k / PF)', monthlyAmount: 675, annualAmount: 8100, type: 'deduction' },
        { name: 'Income Tax (TDS / Federal)', monthlyAmount: 1255, annualAmount: 15060, type: 'deduction' },
        { name: 'Health & Dental Insurance', monthlyAmount: 250, annualAmount: 3000, type: 'deduction' },
        { name: 'Professional State Tax', monthlyAmount: 100, annualAmount: 1200, type: 'deduction' },
      ],
      payslips: [
        {
          id: 'PS-2026-07',
          month: 'July 2026',
          monthKey: '2026-07',
          paymentDate: '2026-07-31',
          basicSalary: 5625,
          hra: 2812.5,
          specialAllowance: 1812.5,
          conveyanceAllowance: 500,
          medicalAllowance: 500,
          totalEarnings: 11250,
          pfDeduction: 675,
          professionalTax: 100,
          incomeTaxTds: 1255,
          healthInsurance: 250,
          totalDeductions: 2280,
          netPayable: 8970,
          paymentMethod: 'Direct Deposit / Wire',
          bankAccountMasked: 'Silicon Valley Bank (••••4892)',
          status: 'Paid',
          workingDays: 22,
          paidDays: 22,
          leavesTaken: 1,
        },
        {
          id: 'PS-2026-06',
          month: 'June 2026',
          monthKey: '2026-06',
          paymentDate: '2026-06-30',
          basicSalary: 5625,
          hra: 2812.5,
          specialAllowance: 1812.5,
          conveyanceAllowance: 500,
          medicalAllowance: 500,
          totalEarnings: 11250,
          pfDeduction: 675,
          professionalTax: 100,
          incomeTaxTds: 1255,
          healthInsurance: 250,
          totalDeductions: 2280,
          netPayable: 8970,
          paymentMethod: 'Direct Deposit / Wire',
          bankAccountMasked: 'Silicon Valley Bank (••••4892)',
          status: 'Paid',
          workingDays: 21,
          paidDays: 21,
          leavesTaken: 0,
        },
      ],
    };
    await Payroll.create(payrollEMP001);

    console.log('[Seed]: Populating Notifications...');
    const notifications = [
      {
        id: 'NOTIF-001',
        employeeId: 'EMP001',
        title: 'Leave Request Approved',
        message: 'Your Sick Leave for August 12, 2026 has been approved by Sarah Jenkins.',
        category: 'leave',
        timestamp: '2026-08-12T08:30:00Z',
        isRead: false,
        actionUrl: '/time-off',
      },
      {
        id: 'NOTIF-002',
        employeeId: 'EMP001',
        title: 'July 2026 Payslip Released',
        message: 'Your salary payslip for July 2026 is now available for download.',
        category: 'payroll',
        timestamp: '2026-07-31T17:00:00Z',
        isRead: false,
        actionUrl: '/payroll',
      },
      {
        id: 'NOTIF-003',
        employeeId: 'EMP001',
        title: 'Company Holiday Reminder',
        message: 'Dayflow offices will be closed on Friday, August 15 in observance of National Holiday.',
        category: 'announcement',
        timestamp: '2026-08-10T10:00:00Z',
        isRead: true,
        actionUrl: '/attendance',
      },
      {
        id: 'NOTIF-004',
        employeeId: 'EMP001',
        title: 'Quarterly HR Performance Review',
        message: 'Q3 Self-assessment cycle starts next Monday. Please review your goals.',
        category: 'system',
        timestamp: '2026-08-01T09:00:00Z',
        isRead: true,
        actionUrl: '/profile',
      },
    ];
    await Notification.insertMany(notifications);

    if (!quiet) {
      console.log('====================================================');
      console.log('  ✅ Database Seeding Completed Successfully!');
      console.log('  👥 Demo Accounts:');
      console.log('     • Admin:    admin@dayflow.com (ID: ADMIN001) / Admin@123');
      console.log('     • Employee: EMP001 (alex.morgan@dayflow.io) / Employee@123');
      console.log('     • Employee: EMP002 (marcus.vance@dayflow.io) / Employee@123');
      console.log('====================================================');
    }
    return true;
  } catch (error) {
    console.error('[Seed Error]:', error);
    throw error;
  }
};

// If run directly via CLI (e.g., node src/seeds/seedData.js)
if (process.argv[1] && process.argv[1].includes('seedData.js')) {
  (async () => {
    try {
      console.log('[Seed]: Connecting to database...');
      await connectDB();
      await seedInitialData(false);
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.error('[Seed Execution Failed]:', err);
      process.exit(1);
    }
  })();
}

