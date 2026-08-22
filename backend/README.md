# Dayflow HRMS - Backend Service

Production-style RESTful API backend for the Dayflow Employee Self-Service & Attendance HRMS application. Built with Node.js, Express, MongoDB (Mongoose), JWT, and bcrypt.

---

## 🚀 Key Features

- **JWT Authentication & RBAC**: Token-based authentication with role-based authorization for `employee` and `admin`/`hr`.
- **Dual-Route Compatibility**: Supports standard `/me` routes and legacy parameter routes (e.g. `/api/v1/employees/:id/profile`) without breaking the frontend.
- **Identity-Derived Security**: All employee endpoints automatically derive employee identity from verified JWT tokens, preventing ID tampering.
- **Attendance Engine**: Daily check-in, check-out, working hours calculation, and aggregated summary metrics.
- **Leave Management**: Leave requests with balance enforcement, overlap prevention, and administrative review workflows.
- **Salary Engine**: Automated payroll component breakdown (Basic, HRA, PF, TDS) and monthly payslip generation.
- **Notification Center**: Event-driven notifications for leave requests, payroll releases, and system announcements.
- **Admin Automation**: Auto-generation of unique Employee Login IDs (`DF[F2][L2][YYYY][001]`) and temporary passwords.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB via Mongoose ORM
- **Security**: JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), CORS
- **Validation**: `express-validator`
- **File Uploads**: `multer`

---

## 📦 Directory Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/            # Route request handlers
│   │   ├── adminController.js
│   │   ├── attendanceController.js
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   ├── leaveController.js
│   │   ├── notificationController.js
│   │   └── payrollController.js
│   ├── middleware/             # Auth, role, validation, error handler
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── validatorMiddleware.js
│   ├── models/                 # Mongoose database models
│   │   ├── Attendance.js
│   │   ├── Employee.js
│   │   ├── LeaveBalance.js
│   │   ├── LeaveRequest.js
│   │   ├── Notification.js
│   │   ├── Payroll.js
│   │   └── User.js
│   ├── routes/                 # Express API routes
│   │   ├── adminRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   ├── index.js
│   │   ├── leaveRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── payrollRoutes.js
│   ├── seeds/
│   │   └── seedData.js          # DB seeder with demo dataset
│   ├── services/               # Business logic services
│   │   ├── adminService.js
│   │   ├── attendanceService.js
│   │   ├── authService.js
│   │   ├── employeeService.js
│   │   ├── leaveService.js
│   │   ├── loginIdService.js
│   │   ├── notificationService.js
│   │   └── payrollService.js
│   ├── utils/                  # Helper utilities
│   │   ├── dateUtils.js
│   │   ├── jwtUtils.js
│   │   └── responseHandler.js
│   ├── validators/             # Request payload validation schemas
│   │   ├── adminValidators.js
│   │   ├── attendanceValidators.js
│   │   ├── authValidators.js
│   │   ├── employeeValidators.js
│   │   └── leaveValidators.js
│   ├── app.js                  # Express app setup
│   └── server.js               # Entrypoint & listener
├── .env.example
├── API_DOCUMENTATION.md
├── package.json
├── postman_collection.json
└── README.md
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:

```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/dayflow_hrms
JWT_SECRET=dayflow_super_secret_jwt_key_2026_hrms_production_grade
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
MAX_FILE_SIZE=5242880
```

---

## 🚦 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Seed the Database
```bash
npm run seed
```

### 3. Start the Development Server
```bash
npm run dev
# or: npm start
```
The API server will run at: `http://localhost:5000/api/v1`

---

## 👥 Demo Credentials

| Role | Login ID / Email | Password | Name |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@dayflow.com` (or `ADMIN001`) | `Admin@123` | Sarah Jenkins |
| **Employee 1** | `EMP001` (or `alex.morgan@dayflow.io`) | `Employee@123` | Alex Morgan |
| **Employee 2** | `EMP002` (or `marcus.vance@dayflow.io`) | `Employee@123` | Marcus Vance |
