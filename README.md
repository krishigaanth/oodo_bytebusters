# HRMS PRO - Enterprise Human Resource Management System

A full-stack, responsive Human Resource Management System (HRMS) built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **Supabase**, and **PostgreSQL**.

The system features a **Dark Charcoal / Black theme** with **Purple accents**, multi-tenant company support, automated concurrency-safe Login ID generation, temporary password onboarding, strict first-login security enforcement, role-based dashboards, attendance punch tracking, leave lifecycle management, payroll computation, reports, and audit logging.

---

## Key Features

### 1. Visual Design & Modern Dark Theme
- **Dark Palette**: Sleek charcoal backgrounds (`#08090d`, `#11131a`, `#1d212d`), purple primary buttons (`#7c3aed`, `#8b5cf6`), crisp white typography, and zinc secondary text.
- **Full Responsiveness**: Collapsible mobile sidebar, responsive data tables with horizontal scroll, and responsive stat and chart cards.
- **Interactive Visual Feedback**: Confetti animations on employee creation, real-time clocks, badge indicators, and toast alerts.

### 2. Strict Role-Based Access Control (RBAC) & PostgreSQL RLS
Three primary system roles with both frontend route guards and database Row Level Security:
- **ADMIN**: Complete system control, employee management, company profile, departments, attendance, leaves, payroll, reports, system settings, and audit trails.
- **HR_OFFICER**: Talent onboarding, directory management, attendance oversight, leave approval/rejection with mandatory reasons, and payroll generation.
- **EMPLOYEE**: Self-service portal: view personal profile, punch attendance, view leave balances, submit leave requests, view monthly payslips, and change passwords.

### 3. Concurrency-Safe Automatic Login ID Generation
- **No Manual ID Entry**: Login IDs are never typed manually.
- **Format**: `[COMPANY_CODE][FIRST 2 LETTERS OF FIRST NAME][FIRST 2 LETTERS OF LAST NAME][YEAR OF JOINING][4 DIGIT SERIAL NUMBER]`
- **Examples**:
  - *Company*: Odoo India (`OI`), *Employee*: John Doe, *Year*: 2026, *Serial*: 0001 &rarr; `OIJODO20260001`
  - *Company*: Odoo India (`OI`), *Employee*: Jane Smith, *Year*: 2026, *Serial*: 0002 &rarr; `OIJASM20260002`
- **PostgreSQL Function**: `public.generate_employee_login_id()` uses `company_serial_counters` with row-level locks to guarantee atomic uniqueness even under high concurrency.

### 4. Temporary Password System & First-Login Security
- **Temporary Password Generator**: Generated upon employee creation (e.g. `OI@2026Jd82`). Passwords are never stored in plain text.
- **Success Modal**: Displays the Login ID and Temporary Password with one-click **[ COPY LOGIN ID ]** and **[ COPY PASSWORD ]** buttons.
- **First Login Redirection**: New accounts have `first_login = true`. Logging in redirects immediately to `/change-password` and locks out dashboard access until a permanent password is set.

### 5. Attendance & Working Hours Tracking
- Single-click **Check In** / **Check Out** with real-time digital clock.
- Automatically computes total hours worked (e.g. `8h 15m`).
- Automatic status categorization: `PRESENT`, `LATE` (after 09:30 AM), `HALF_DAY` (<4 hours), `LEAVE`, and `ABSENT`.
- Management manual attendance entry and adjustment modal.

### 6. Leave Management & Approval Flow
- Four built-in leave types: **Casual Leave (CL)**, **Sick Leave (SL)**, **Privilege Leave (PL)**, and **Parental Leave (ML)**.
- Employees submit date ranges and justification notes.
- HR/Admin approval & rejection workflow (**Mandatory Rejection Reason** modal for audits).
- Real-time in-app notifications dispatched upon review.

### 7. Automated Payroll & Digital Payslips
- Form fields: Basic Salary, Allowances, Deductions, Month, Year, Payment Date.
- **Automatic Formula Calculation**:
  $$\text{Net Salary} = \text{Basic Salary} + \text{Allowances} - \text{Deductions}$$
- Viewable & printable official payslips with corporate letterhead, breakdown tables, and payment verification badges.

### 8. Reports & Analytics
- 5 comprehensive reports: **Employee Report**, **Attendance Report**, **Leave Report**, **Payroll Report**, and **Department Report**.
- Global search, date filters, one-click **CSV Export**, and **Print-Ready** styles.

### 9. Dual-Engine Architecture (Zero-Config + Supabase)
- Connects to Supabase (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) with complete PostgreSQL migrations and RLS policies.
- Includes a client-side reactive database service seeded with realistic demo records for immediate zero-config testing.

---

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts, Canvas Confetti
- **Routing**: React Router v6 (Protected routes, role guards, first-login enforcement)
- **Backend & Database**: Supabase, PostgreSQL 15, Row Level Security (RLS), PL/pgSQL Stored Procedures & Triggers
- **Storage**: Supabase Storage Buckets (`company-logos`, `profile-photos`)

---

## Project Structure

```
HRMS PRO/
├── supabase/
│   ├── migrations/
│   │   └── 20260822000001_initial_hrms_schema.sql  # Complete schema, RLS, functions & triggers
│   └── seed.sql                                    # Initial seed data
├── src/
│   ├── types/
│   │   └── hrms.ts                                 # TypeScript definitions & data contracts
│   ├── lib/
│   │   ├── supabase.ts                             # Supabase client initialization
│   │   └── database.ts                             # Local & Supabase hybrid database engine
│   ├── contexts/
│   │   ├── AuthContext.tsx                         # User session, role & first_login state
│   │   ├── ToastContext.tsx                        # Global alert toast banners
│   │   └── NotificationContext.tsx                 # Live notification system
│   ├── utils/
│   │   ├── loginIdGenerator.ts                     # Concurrency Login ID formatter
│   │   ├── passwordGenerator.ts                    # Temporary password generator
│   │   ├── formatters.ts                           # Currency (₹), Date & Time formatters
│   │   └── exportToCsv.ts                          # CSV export utility
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx, Input.tsx, Select.tsx, Modal.tsx
│   │   │   ├── Badge.tsx, Table.tsx, StatCard.tsx, ChartCard.tsx
│   │   │   └── NotificationDropdown.tsx
│   │   ├── employees/
│   │   │   └── EmployeeCreatedModal.tsx            # Credentials popup with Copy buttons
│   │   ├── attendance/
│   │   │   └── CheckInOutCard.tsx                  # Interactive daily punch card
│   │   ├── leave/
│   │   │   ├── ApplyLeaveModal.tsx
│   │   │   └── LeaveApprovalModal.tsx              # Approval & Rejection reason modal
│   │   └── payroll/
│   │       ├── PayslipModal.tsx                    # Printable payslip modal
│   │       └── GeneratePayrollModal.tsx            # Auto-calculated payroll modal
│   ├── layouts/
│   │   ├── AppLayout.tsx, Sidebar.tsx, Header.tsx, AuthLayout.tsx
│   ├── routes/
│   │   ├── AppRoutes.tsx                           # Master route configuration
│   │   └── ProtectedRoute.tsx                      # Role & First-login guards
│   ├── pages/
│   │   ├── auth/ (LoginPage, ChangePasswordPage, ForgotPasswordPage)
│   │   ├── admin/ (AdminDashboardPage)
│   │   ├── hr/ (HRDashboardPage)
│   │   ├── employee/ (EmployeeDashboardPage)
│   │   ├── employees/ (EmployeeListPage, AddEmployeePage, EmployeeDetailPage, EditEmployeePage)
│   │   ├── attendance/ (AttendancePage)
│   │   ├── leave/ (LeavePage)
│   │   ├── payroll/ (PayrollPage)
│   │   ├── departments/ (DepartmentPage)
│   │   ├── reports/ (ReportsPage)
│   │   ├── settings/ (SettingsPage)
│   │   ├── notifications/ (NotificationsPage)
│   │   └── profile/ (ProfilePage)
│   ├── main.tsx
│   ├── App.tsx
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## Database Architecture

### PostgreSQL Tables & Constraints

| Table Name | Description | Key Columns |
| :--- | :--- | :--- |
| `companies` | Corporate entities & branding | `id`, `company_name`, `company_code`, `logo_url`, `created_at` |
| `departments` | Organizational business units | `id`, `company_id`, `name`, `code`, `description`, `manager_id` |
| `profiles` | Staff user accounts | `id` (FK `auth.users`), `login_id`, `role`, `department_id`, `designation`, `first_login` |
| `company_serial_counters` | Sequence counters for atomic ID generation | `company_id`, `year`, `last_serial` |
| `attendance` | Daily check-in/out logs | `id`, `employee_id`, `date`, `check_in`, `check_out`, `total_hours`, `status` |
| `leave_types` | Leave balance categories | `id`, `company_id`, `name`, `code`, `days_allowed`, `is_paid` |
| `leave_requests` | Leave applications & reviews | `id`, `employee_id`, `start_date`, `end_date`, `status`, `rejection_reason` |
| `payroll` | Monthly compensation records | `id`, `employee_id`, `month`, `year`, `basic_salary`, `allowances`, `deductions`, `net_salary` |
| `notifications` | User alerts & system notices | `id`, `user_id`, `title`, `message`, `type`, `is_read`, `link` |
| `audit_logs` | Immutable operational logs | `id`, `actor_id`, `action`, `entity_type`, `details`, `created_at` |

---

## Test Accounts

The application includes pre-configured demo credentials accessible directly from the **Quick Demo Credentials** selector on the Login screen:

| Persona | Login ID / Email | Password | Role & Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `OIADUS20260001` or `admin@odooindia.com` | `Admin@2026#` | Full system access & master settings |
| **HR Officer** | `OIPRSH20260002` or `hr@odooindia.com` | `HROfficer@2026#` | Onboarding, Attendance & Leave review |
| **Employee** | `OIJODO20260003` or `john.doe@odooindia.com` | `Employee@2026#` | Self-service attendance, leave & payslips |
| **New Employee (First-Login)** | `OIJASM20260004` or `jane.smith@odooindia.com` | `OI@2026Jd82` | **Enforces immediate password change** |

---

## Getting Started

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm or yarn

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/hrms-system.git
cd hrms-system

# Install dependencies
npm install
```

### 2. Environment Setup (Optional for Supabase Live Mode)
Copy the example environment file:
```bash
cp .env.example .env
```
Fill in your Supabase project keys:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## Security Best Practices Implemented

1. **No Service Keys in Frontend**: Only public `VITE_SUPABASE_ANON_KEY` is referenced.
2. **PostgreSQL RLS**: All tables enforce row level security. Employees cannot read or modify other employees' payroll or leave records.
3. **No Plaintext Passwords**: Passwords and temporary credentials use strong cryptographic hashes.
4. **Mandatory First-Login Password Change**: Forces replacement of temporary passwords before granting dashboard authorization.
5. **Audit Trail**: Key actions (employee creation, leave approval/rejection, payroll processing, and password updates) are logged.
