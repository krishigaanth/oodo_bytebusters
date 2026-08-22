/**
 * Automated Verification Script for Dayflow HRMS Backend REST APIs
 */

const BASE_URL = 'http://localhost:5000/api/v1';

const results = [];

const logResult = (name, passed, details = '') => {
  results.push({ name, passed, details });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} - ${name} ${details ? `(${details})` : ''}`);
};

const runTests = async () => {
  console.log('====================================================');
  console.log('  🧪 Running Dayflow HRMS Backend Verification Suite');
  console.log('  📡 Base URL:', BASE_URL);
  console.log('====================================================\n');

  let empToken = '';
  let adminToken = '';

  // 1. Health Check
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    logResult('Health Check (GET /health)', res.status === 200 && data.status === 'healthy');
  } catch (err) {
    logResult('Health Check (GET /health)', false, err.message);
  }

  // 2. Employee Login
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginId: 'EMP001', password: 'Employee@123' }),
    });
    const data = await res.json();
    empToken = data.token;
    logResult('Employee Login (POST /auth/login)', res.status === 200 && Boolean(empToken), `ID: ${data.user?.employeeId}`);
  } catch (err) {
    logResult('Employee Login (POST /auth/login)', false, err.message);
  }

  // 3. Admin Login
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginId: 'ADMIN001', password: 'Admin@123' }),
    });
    const data = await res.json();
    adminToken = data.token;
    logResult('Admin Login (POST /auth/login)', res.status === 200 && data.user?.role === 'admin');
  } catch (err) {
    logResult('Admin Login (POST /auth/login)', false, err.message);
  }

  // 4. Auth Me (Session Verify)
  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${empToken}` },
    });
    const data = await res.json();
    logResult('Get Auth Session (GET /auth/me)', res.status === 200 && data.user?.loginId === 'EMP001');
  } catch (err) {
    logResult('Get Auth Session (GET /auth/me)', false, err.message);
  }

  // 5. Employee Profile (GET /employees/me)
  try {
    const res = await fetch(`${BASE_URL}/employees/me`, {
      headers: { Authorization: `Bearer ${empToken}` },
    });
    const data = await res.json();
    logResult('Get Profile (GET /employees/me)', res.status === 200 && data.id === 'EMP001', `Name: ${data.fullName}`);
  } catch (err) {
    logResult('Get Profile (GET /employees/me)', false, err.message);
  }

  // 6. Update Profile (PUT /employees/me)
  try {
    const res = await fetch(`${BASE_URL}/employees/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${empToken}`,
      },
      body: JSON.stringify({
        aboutBio: 'Verified Automated Bio Update via Suite Test.',
        skills: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB'],
      }),
    });
    const data = await res.json();
    logResult('Update Profile (PUT /employees/me)', res.status === 200 && data.skills?.includes('Express'));
  } catch (err) {
    logResult('Update Profile (PUT /employees/me)', false, err.message);
  }

  // 7. Attendance Today (GET /attendance/today)
  try {
    const res = await fetch(`${BASE_URL}/attendance/today`, {
      headers: { Authorization: `Bearer ${empToken}` },
    });
    const data = await res.json();
    logResult('Get Today Attendance (GET /attendance/today)', res.status === 200 && 'isCheckedIn' in data);
  } catch (err) {
    logResult('Get Today Attendance (GET /attendance/today)', false, err.message);
  }

  // 8. Attendance Summary (GET /attendance/summary)
  try {
    const res = await fetch(`${BASE_URL}/attendance/summary`, {
      headers: { Authorization: `Bearer ${empToken}` },
    });
    const data = await res.json();
    logResult('Get Attendance Summary (GET /attendance/summary)', res.status === 200 && 'daysPresent' in data);
  } catch (err) {
    logResult('Get Attendance Summary (GET /attendance/summary)', false, err.message);
  }

  // 9. Leave Balances (GET /leaves/balances)
  try {
    const res = await fetch(`${BASE_URL}/leaves/balances`, {
      headers: { Authorization: `Bearer ${empToken}` },
    });
    const data = await res.json();
    logResult('Get Leave Balances (GET /leaves/balances)', res.status === 200 && Array.isArray(data) && data.length > 0, `Count: ${data.length}`);
  } catch (err) {
    logResult('Get Leave Balances (GET /leaves/balances)', false, err.message);
  }

  // 10. Leave Requests (GET /leaves/requests)
  try {
    const res = await fetch(`${BASE_URL}/leaves/requests`, {
      headers: { Authorization: `Bearer ${empToken}` },
    });
    const data = await res.json();
    logResult('Get Leave Requests (GET /leaves/requests)', res.status === 200 && Array.isArray(data));
  } catch (err) {
    logResult('Get Leave Requests (GET /leaves/requests)', false, err.message);
  }

  // 11. Payroll Summary (GET /payroll/summary)
  try {
    const res = await fetch(`${BASE_URL}/payroll/summary`, {
      headers: { Authorization: `Bearer ${empToken}` },
    });
    const data = await res.json();
    logResult('Get Payroll Summary (GET /payroll/summary)', res.status === 200 && data.monthlyGross > 0, `Monthly: $${data.monthlyGross}`);
  } catch (err) {
    logResult('Get Payroll Summary (GET /payroll/summary)', false, err.message);
  }

  // 12. Notifications (GET /notifications)
  try {
    const res = await fetch(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${empToken}` },
    });
    const data = await res.json();
    logResult('Get Notifications (GET /notifications)', res.status === 200 && Array.isArray(data));
  } catch (err) {
    logResult('Get Notifications (GET /notifications)', false, err.message);
  }

  // 13. Admin Employees List (GET /admin/employees)
  try {
    const res = await fetch(`${BASE_URL}/admin/employees`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    logResult('Admin List Employees (GET /admin/employees)', res.status === 200 && data.success && Array.isArray(data.data?.employees));
  } catch (err) {
    logResult('Admin List Employees (GET /admin/employees)', false, err.message);
  }

  // 14. Admin Attendance List (GET /admin/attendance)
  try {
    const res = await fetch(`${BASE_URL}/admin/attendance`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    logResult('Admin List Attendance (GET /admin/attendance)', res.status === 200 && data.success);
  } catch (err) {
    logResult('Admin List Attendance (GET /admin/attendance)', false, err.message);
  }

  // 15. Admin Leaves List (GET /admin/leaves)
  try {
    const res = await fetch(`${BASE_URL}/admin/leaves`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    logResult('Admin List Leaves (GET /admin/leaves)', res.status === 200 && data.success);
  } catch (err) {
    logResult('Admin List Leaves (GET /admin/leaves)', false, err.message);
  }

  // 16. RBAC Protection Check (Employee accessing Admin endpoint should return 403)
  try {
    const res = await fetch(`${BASE_URL}/admin/employees`, {
      headers: { Authorization: `Bearer ${empToken}` },
    });
    logResult('RBAC Enforcement (Employee blocked from /admin/*)', res.status === 403);
  } catch (err) {
    logResult('RBAC Enforcement (Employee blocked from /admin/*)', false, err.message);
  }

  // 17. Check-in and Check-out cycle
  try {
    const todayRes = await fetch(`${BASE_URL}/attendance/today`, {
      headers: { Authorization: `Bearer ${empToken}` },
    });
    const todayData = await todayRes.json();
    if (!todayData.isCheckedIn) {
      const inRes = await fetch(`${BASE_URL}/attendance/check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${empToken}` },
        body: JSON.stringify({}),
      });
      const inData = await inRes.json();
      logResult('Attendance Check-In (POST /attendance/check-in)', inRes.status === 200 && inData.isCheckedIn);

      const outRes = await fetch(`${BASE_URL}/attendance/check-out`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${empToken}` },
        body: JSON.stringify({}),
      });
      const outData = await outRes.json();
      logResult('Attendance Check-Out (POST /attendance/check-out)', outRes.status === 200 && outData.isCheckedOut);
    } else {
      logResult('Attendance Check-In/Out Cycle', true, 'Already checked in for today');
    }
  } catch (err) {
    logResult('Attendance Check-In/Out Cycle', false, err.message);
  }

  // 18. Leave Apply and Cancel Cycle
  let createdLeaveId = '';
  try {
    const applyRes = await fetch(`${BASE_URL}/leaves/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${empToken}` },
      body: JSON.stringify({
        leaveType: 'Casual Leave',
        startDate: '2026-10-05',
        endDate: '2026-10-06',
        totalDays: 2,
        reason: 'Automated backend integration verification test request.',
      }),
    });
    const applyData = await applyRes.json();
    createdLeaveId = applyData.id;
    logResult('Apply Leave (POST /leaves/apply)', applyRes.status === 201 && Boolean(createdLeaveId), `ID: ${createdLeaveId}`);

    if (createdLeaveId) {
      const cancelRes = await fetch(`${BASE_URL}/leaves/${createdLeaveId}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${empToken}` },
      });
      const cancelData = await cancelRes.json();
      logResult('Cancel Leave (PUT /leaves/:id/cancel)', cancelRes.status === 200 && cancelData.status === 'Cancelled');
    }
  } catch (err) {
    logResult('Apply/Cancel Leave Cycle', false, err.message);
  }

  // 19. Admin Employee Creation and Password Reset
  try {
    const uniqueEmail = `test.employee.${Date.now()}@dayflow.io`;
    const createRes = await fetch(`${BASE_URL}/admin/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        firstName: 'Taylor',
        lastName: 'Swift',
        workEmail: uniqueEmail,
        jobTitle: 'Audio Engineer',
        department: 'Core Product Engineering',
        role: 'employee',
      }),
    });
    const createData = await createRes.json();
    const newEmpId = createData.data?.employee?.id;
    const tempPass = createData.data?.credentials?.temporaryPassword;
    logResult('Admin Create Employee (POST /admin/employees)', createRes.status === 201 && Boolean(newEmpId) && Boolean(tempPass), `ID: ${newEmpId}`);

    if (newEmpId) {
      const resetRes = await fetch(`${BASE_URL}/admin/employees/${newEmpId}/reset-password`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const resetData = await resetRes.json();
      logResult('Admin Reset Password (POST /admin/employees/:id/reset-password)', resetRes.status === 200 && Boolean(resetData.data?.temporaryPassword));
    }
  } catch (err) {
    logResult('Admin Employee Management Cycle', false, err.message);
  }

  console.log('\n====================================================');
  const passCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  console.log(`  🎯 Results: ${passCount} / ${totalCount} Passed (${Math.round((passCount / totalCount) * 100)}%)`);
  console.log('====================================================');
};

runTests();
