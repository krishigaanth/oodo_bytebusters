export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  verificationUrl?: string;
}

export interface WorkHistory {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface EditableProfileFields {
  phone: string;
  personalEmail: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  aboutBio: string;
  skills: string[];
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
}

export interface EmployeeProfile {
  id: string; // EMP001
  loginId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl: string;
  jobTitle: string;
  department: string;
  workEmail: string;
  mobile: string;
  companyName: string;
  reportingManager: {
    id: string;
    name: string;
    jobTitle: string;
    email: string;
    avatarUrl: string;
  };
  officeLocation: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  joiningDate: string;
  status: 'Active' | 'On Leave' | 'Probation';
  hasPayrollAccess: boolean;

  // Resume Tab Data
  aboutBio: string;
  skills: string[];
  certifications: Certification[];
  workHistory: WorkHistory[];
  education: {
    degree: string;
    institution: string;
    year: string;
    grade?: string;
  }[];

  // Private Info Data (with masking options)
  privateInfo: {
    dob: string;
    gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
    maritalStatus: 'Single' | 'Married' | 'Divorced';
    nationality: string;
    personalEmail: string;
    residentialAddress: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
    bankAccount: {
      bankName: string;
      accountNumber: string; // "••••••••4892" or raw
      accountHolder: string;
      ifscCode: string;
      branch: string;
    };
    taxIdentifiers: {
      panNumber: string; // "••••••429A"
      ssnOrNationalId: string;
      pfUanNumber: string;
    };
  };

  // Security Tab Data
  securityInfo: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    loginActivity: {
      id: string;
      device: string;
      browser: string;
      ipAddress: string;
      location: string;
      timestamp: string;
      status: 'Success' | 'Failed';
    }[];
  };
}
