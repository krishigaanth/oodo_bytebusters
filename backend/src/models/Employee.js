import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => `CERT-${Date.now().toString().slice(-6)}` },
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    issueDate: { type: String, required: true },
    expiryDate: { type: String },
    credentialId: { type: String },
    verificationUrl: { type: String },
  },
  { _id: false }
);

const workHistorySchema = new mongoose.Schema(
  {
    id: { type: String, default: () => `WH-${Date.now().toString().slice(-6)}` },
    role: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, default: 'Present' },
    description: { type: String },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    year: { type: String, required: true },
    grade: { type: String },
  },
  { _id: false }
);

const employeeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    loginId: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    jobTitle: { type: String, required: true },
    department: { type: String, required: true },
    workEmail: { type: String, required: true, lowercase: true, index: true },
    mobile: { type: String, default: '' },
    companyName: { type: String, default: 'Dayflow Technologies Inc.' },
    reportingManager: {
      id: { type: String, default: 'MGR001' },
      name: { type: String, default: 'Sarah Jenkins' },
      jobTitle: { type: String, default: 'VP of Product Engineering' },
      email: { type: String, default: 'sarah.jenkins@dayflow.io' },
      avatarUrl: { type: String, default: '' },
    },
    officeLocation: { type: String, default: 'San Francisco, CA (HQ) • Building 4' },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time',
    },
    joiningDate: { type: String, required: true },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Probation'],
      default: 'Active',
    },
    hasPayrollAccess: { type: Boolean, default: true },

    // Resume Info
    aboutBio: { type: String, default: '' },
    skills: { type: [String], default: [] },
    certifications: { type: [certificationSchema], default: [] },
    workHistory: { type: [workHistorySchema], default: [] },
    education: { type: [educationSchema], default: [] },

    // Private Info
    privateInfo: {
      dob: { type: String, default: '1995-01-01' },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
        default: 'Female',
      },
      maritalStatus: {
        type: String,
        enum: ['Single', 'Married', 'Divorced'],
        default: 'Single',
      },
      nationality: { type: String, default: 'United States' },
      personalEmail: { type: String, default: '' },
      residentialAddress: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        postalCode: { type: String, default: '' },
        country: { type: String, default: '' },
      },
      emergencyContact: {
        name: { type: String, default: '' },
        relationship: { type: String, default: '' },
        phone: { type: String, default: '' },
      },
      bankAccount: {
        bankName: { type: String, default: '' },
        accountNumber: { type: String, default: '••••••••4892' },
        accountHolder: { type: String, default: '' },
        ifscCode: { type: String, default: '' },
        branch: { type: String, default: '' },
      },
      taxIdentifiers: {
        panNumber: { type: String, default: '••••••429A' },
        ssnOrNationalId: { type: String, default: '•••-••-8821' },
        pfUanNumber: { type: String, default: '100982348712' },
      },
    },

    // Security Info
    securityInfo: {
      twoFactorEnabled: { type: Boolean, default: true },
      lastPasswordChange: { type: String, default: () => new Date().toISOString() },
      loginActivity: [
        {
          id: { type: String, default: () => `LOG-${Date.now().toString().slice(-6)}` },
          device: { type: String, default: 'Web Browser' },
          browser: { type: String, default: 'Chrome' },
          ipAddress: { type: String, default: '127.0.0.1' },
          location: { type: String, default: 'Local Session' },
          timestamp: { type: String, default: () => new Date().toLocaleString() },
          status: { type: String, enum: ['Success', 'Failed'], default: 'Success' },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const Employee = mongoose.model('Employee', employeeSchema);
