import { EmployeeProfile } from '../types/employee';

export const MOCK_EMPLOYEE_DATA: Record<string, EmployeeProfile> = {
  EMP001: {
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
      id: 'MGR042',
      name: 'Sarah Jenkins',
      jobTitle: 'VP of Product Engineering',
      email: 'sarah.jenkins@dayflow.io',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&h=256&fit=crop&crop=faces&auto=format&q=80',
    },
    officeLocation: 'San Francisco, CA (HQ) • Building 4',
    employmentType: 'Full-time',
    joiningDate: '2023-03-15',
    status: 'Active',
    hasPayrollAccess: true,

    // Resume Data
    aboutBio: 'Passionate Frontend Architect and UI/UX specialist with 6+ years of experience crafting enterprise-grade SaaS platforms, design systems, and responsive web applications. Dedicated to high-performance component architecture, strict accessibility standards, and clean developer ergonomics.',
    skills: [
      'React',
      'TypeScript',
      'Next.js',
      'Tailwind CSS',
      'Design Systems',
      'State Management (Zustand/Redux)',
      'GraphQL & REST APIs',
      'Web Performance & Web Vitals',
      'CI/CD Pipelines',
      'Jest / Vitest'
    ],
    certifications: [
      {
        id: 'CERT-001',
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        issueDate: '2023-08-10',
        expiryDate: '2026-08-10',
        credentialId: 'AWS-993821-SA',
        verificationUrl: 'https://aws.amazon.com/verification'
      },
      {
        id: 'CERT-002',
        name: 'Meta Front-End Developer Professional Certificate',
        issuer: 'Meta / Coursera',
        issueDate: '2022-11-20',
        credentialId: 'META-FE-558291',
        verificationUrl: 'https://coursera.org/verify/meta'
      }
    ],
    workHistory: [
      {
        id: 'WH-01',
        role: 'Senior Frontend Engineer',
        company: 'Dayflow Technologies Inc.',
        startDate: '2023-03',
        endDate: 'Present',
        description: 'Led modern frontend redesign, implemented reusable design system component library, and optimized core web vitals by 45%.'
      },
      {
        id: 'WH-02',
        role: 'Frontend Software Engineer',
        company: 'NovaCloud SaaS Labs',
        startDate: '2021-01',
        endDate: '2023-02',
        description: 'Engineered analytics dashboards with real-time WebSocket feeds and collaborative workspace tools.'
      }
    ],
    education: [
      {
        degree: 'B.S. in Computer Science',
        institution: 'University of California, Berkeley',
        year: '2017 - 2021',
        grade: 'Magna Cum Laude (3.88 GPA)'
      }
    ],

    // Private Info Data
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
      }
    },

    // Security Tab Data
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
          status: 'Success'
        },
        {
          id: 'LOG-02',
          device: 'iPhone 15 Pro (iOS 17.5)',
          browser: 'Mobile Safari',
          ipAddress: '172.56.21.90',
          location: 'San Francisco, United States',
          timestamp: '2026-08-21 07:45 PM',
          status: 'Success'
        },
        {
          id: 'LOG-03',
          device: 'Windows 11 PC (Office Workstation)',
          browser: 'Edge 126.0',
          ipAddress: '10.0.4.15',
          location: 'San Francisco, United States',
          timestamp: '2026-08-19 10:02 AM',
          status: 'Success'
        }
      ]
    }
  }
};
