# Dayflow HRMS - API Documentation

Comprehensive REST API specification for Dayflow HRMS.

Base URL: `http://localhost:5000/api/v1`

---

## 1. Authentication APIs (`/auth`)

### `POST /auth/login`
- **Auth**: Public
- **Description**: Authenticates user using `loginId` or `email` and password.
- **Request Body**:
```json
{
  "loginId": "EMP001",
  "password": "Employee@123"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "user": {
    "employeeId": "EMP001",
    "loginId": "EMP001",
    "name": "Alex Morgan",
    "email": "alex.morgan@dayflow.io",
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&h=256&fit=crop&crop=faces&auto=format&q=80",
    "role": "employee",
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "lastLoginAt": "2026-08-22T06:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "message": "Login successful"
}
```

### `GET /auth/me`
- **Auth**: Bearer JWT
- **Description**: Returns current authenticated user profile session.
- **Response `200 OK`**:
```json
{
  "success": true,
  "user": {
    "employeeId": "EMP001",
    "loginId": "EMP001",
    "name": "Alex Morgan",
    "email": "alex.morgan@dayflow.io",
    "avatarUrl": "https://...",
    "role": "employee",
    "lastLoginAt": "2026-08-22T06:30:00.000Z",
    "token": "eyJhbGci..."
  }
}
```

### `POST /auth/change-password`
- **Auth**: Bearer JWT
- **Request Body**:
```json
{
  "currentPassword": "Employee@123",
  "newPassword": "NewStrongPassword@2026"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Password successfully updated! Please use your new password next time."
}
```

### `POST /auth/logout`
- **Auth**: Bearer JWT
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 2. Employee Profile APIs (`/employees`)

### `GET /employees/me` (or `GET /employees/:employeeId/profile`)
- **Auth**: Bearer JWT
- **Description**: Fetches full employee profile.
- **Response `200 OK`**:
```json
{
  "id": "EMP001",
  "loginId": "EMP001",
  "firstName": "Alex",
  "lastName": "Morgan",
  "fullName": "Alex Morgan",
  "avatarUrl": "https://...",
  "jobTitle": "Senior Frontend Engineer",
  "department": "Core Product Engineering",
  "workEmail": "alex.morgan@dayflow.io",
  "mobile": "+1 (555) 234-8901",
  "companyName": "Dayflow Technologies Inc.",
  "reportingManager": {
    "id": "ADM001",
    "name": "Sarah Jenkins",
    "jobTitle": "VP of Product Engineering",
    "email": "admin@dayflow.com",
    "avatarUrl": "https://..."
  },
  "officeLocation": "San Francisco, CA (HQ) • Building 4",
  "employmentType": "Full-time",
  "joiningDate": "2023-03-15",
  "status": "Active",
  "hasPayrollAccess": true,
  "aboutBio": "Passionate Frontend Architect...",
  "skills": ["React", "TypeScript", "Tailwind CSS"],
  "certifications": [],
  "workHistory": [],
  "education": [],
  "privateInfo": {
    "dob": "1995-07-24",
    "gender": "Female",
    "maritalStatus": "Single",
    "nationality": "United States",
    "personalEmail": "alex.morgan.personal@gmail.com",
    "residentialAddress": {
      "street": "742 Evergreen Terrace, Apt 4B",
      "city": "San Francisco",
      "state": "California",
      "postalCode": "94107",
      "country": "United States"
    },
    "emergencyContact": {
      "name": "David Morgan",
      "relationship": "Father",
      "phone": "+1 (555) 987-6543"
    },
    "bankAccount": {
      "bankName": "Silicon Valley Bank",
      "accountNumber": "••••••••4892",
      "accountHolder": "Alex Morgan",
      "ifscCode": "SVBLUS66XXX",
      "branch": "Market Street Commercial Branch, SF"
    },
    "taxIdentifiers": {
      "panNumber": "••••••429A",
      "ssnOrNationalId": "•••-••-8821",
      "pfUanNumber": "100982348712"
    }
  },
  "securityInfo": {
    "twoFactorEnabled": true,
    "lastPasswordChange": "2026-05-10 14:22:00",
    "loginActivity": []
  }
}
```

### `PUT /employees/me` (or `PUT /employees/:employeeId/profile`)
- **Auth**: Bearer JWT
- **Description**: Updates permitted self-service employee fields.
- **Request Body**:
```json
{
  "phone": "+1 (555) 999-8888",
  "personalEmail": "alex.updated@gmail.com",
  "aboutBio": "Updated frontend bio summary.",
  "skills": ["React", "TypeScript", "GraphQL", "Next.js"],
  "address": "100 Innovation Way",
  "city": "San Francisco",
  "state": "California",
  "postalCode": "94107",
  "country": "United States",
  "emergencyContactName": "David Morgan",
  "emergencyContactRelationship": "Father",
  "emergencyContactPhone": "+1 (555) 987-6543"
}
```
- **Response `200 OK`**: Updated `EmployeeProfile` object.

---

## 3. Attendance APIs (`/attendance`)

### `GET /attendance/today` (or `GET /attendance/me/today`)
- **Auth**: Bearer JWT
- **Response `200 OK`**:
```json
{
  "isCheckedIn": true,
  "isCheckedOut": false,
  "checkInTime": "09:05 AM",
  "checkOutTime": null,
  "currentWorkDurationHours": 0,
  "status": "Present",
  "activeRecordId": "ATT-20260822"
}
```

### `POST /attendance/check-in`
- **Auth**: Bearer JWT
- **Response `200 OK`**: Returns updated `TodayAttendanceStatus`.

### `POST /attendance/check-out`
- **Auth**: Bearer JWT
- **Response `200 OK`**: Returns updated `TodayAttendanceStatus` with calculated `currentWorkDurationHours`.

### `GET /attendance` (or `GET /attendance/me`)
- **Auth**: Bearer JWT
- **Query Params**: `?month=7&year=2026&from=2026-08-01&to=2026-08-31`
- **Response `200 OK`**: Array of `AttendanceRecord` items:
```json
[
  {
    "id": "ATT-20260821",
    "employeeId": "EMP001",
    "date": "2026-08-21",
    "checkIn": "09:05 AM",
    "checkOut": "06:15 PM",
    "workHours": 8.5,
    "extraHours": 0.5,
    "status": "Present",
    "notes": "Regular day + release deployment sync",
    "isOvertime": true
  }
]
```

### `GET /attendance/summary` (or `GET /attendance/me/summary`)
- **Auth**: Bearer JWT
- **Response `200 OK`**:
```json
{
  "daysPresent": 14,
  "daysAbsent": 0,
  "leaveDays": 2,
  "totalWorkingDays": 16,
  "totalWorkingHours": 112.5,
  "extraHours": 4.2,
  "averageWorkingHoursPerDay": 8.1
}
```

---

## 4. Leave Management APIs (`/leaves`)

### `GET /leaves/balances` (or `GET /leaves/me/balance`)
- **Auth**: Bearer JWT
- **Response `200 OK`**:
```json
[
  {
    "leaveType": "Paid Leave",
    "totalQuota": 18,
    "used": 5,
    "available": 13,
    "colorClass": "from-indigo-500 to-brand-600",
    "description": "Accrued annual vacation & paid time off"
  }
]
```

### `GET /leaves/requests` (or `GET /leaves/me`)
- **Auth**: Bearer JWT
- **Response `200 OK`**: Array of `LeaveRequest` items.

### `POST /leaves/apply` (or `POST /leaves`)
- **Auth**: Bearer JWT
- **Request Body**:
```json
{
  "leaveType": "Paid Leave",
  "startDate": "2026-09-14",
  "endDate": "2026-09-18",
  "totalDays": 5,
  "reason": "Family vacation trip to Yosemite National Park.",
  "attachmentName": "flight_tickets_confirmation.pdf"
}
```
- **Response `201 Created`**: Returns created `LeaveRequest` object.

### `PUT /leaves/:id/cancel`
- **Auth**: Bearer JWT
- **Response `200 OK`**: Returns cancelled `LeaveRequest` and refunds balance.

---

## 5. Payroll APIs (`/payroll`)

### `GET /payroll/summary` (or `GET /payroll/me`)
- **Auth**: Bearer JWT
- **Response `200 OK`**:
```json
{
  "annualCtc": 135000,
  "monthlyGross": 11250,
  "monthlyNet": 8970,
  "totalAnnualDeductions": 27360,
  "currencySymbol": "$",
  "earningsBreakdown": [
    { "name": "Basic Salary", "monthlyAmount": 5625, "annualAmount": 67500, "type": "earning", "isTaxable": true }
  ],
  "deductionsBreakdown": [
    { "name": "Provident Fund (401k / PF)", "monthlyAmount": 675, "annualAmount": 8100, "type": "deduction" }
  ],
  "payslips": []
}
```

### `GET /payroll/payslips/:payslipId`
- **Auth**: Bearer JWT
- **Response `200 OK`**: Single `PayslipItem` object.

---

## 6. Notification APIs (`/notifications`)

### `GET /notifications`
- **Auth**: Bearer JWT
- **Response `200 OK`**: Array of `AppNotification` items.

### `PATCH /notifications/:id/read`
- **Auth**: Bearer JWT
- **Response `200 OK`**: `{ "success": true, "notification": { ... } }`

### `POST /notifications/mark-all-read`
- **Auth**: Bearer JWT
- **Response `200 OK`**: `{ "success": true, "data": { "modifiedCount": 3 } }`

### `DELETE /notifications`
- **Auth**: Bearer JWT
- **Response `200 OK`**: `{ "success": true, "message": "All notifications cleared" }`

---

## 7. Admin Management APIs (`/admin`)
*(Requires role `admin` or `hr`)*

- `GET /admin/employees`: List all employees with pagination (`page`, `limit`, `search`, `department`)
- `POST /admin/employees`: Create employee (generates unique `loginId` + temporary password, creates balances & payroll, returns credentials once)
- `PUT /admin/employees/:id`: Update employee records
- `PATCH /admin/employees/:id/status`: Change status (`active` / `suspended`)
- `POST /admin/employees/:id/reset-password`: Reset password & generate temp password
- `GET /admin/attendance`: List company attendance logs
- `GET /admin/leaves`: List company leave requests
- `PUT /admin/leaves/:id/approve`: Approve leave request & notify employee
- `PUT /admin/leaves/:id/reject`: Reject leave request, restore balance & notify employee
