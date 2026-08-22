# -*- coding: utf-8 -*-
"""
Dayflow HRMS - Standalone Odoo API Server (Python Built-in HTTP Server)
Runs on http://localhost:8069 serving all Dayflow HR backend JSON API endpoints
without requiring external database setup.
"""

import json
import re
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

PORT = 8069

# In-memory store initialized with seed demo data
STATE = {
    "employees": [
        {
            "id": "EMP-1001",
            "odoo_id": 1,
            "name": "Sarah Jenkins",
            "role": "Senior Frontend Engineer",
            "jobTitle": "Senior Frontend Engineer",
            "department": "Engineering",
            "email": "sarah.j@dayflow.io",
            "phone": "+91 98765 43210",
            "location": "Chennai",
            "officeLocation": "Chennai",
            "status": "Active",
            "attendanceStatus": "Present",
            "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
            "joiningDate": "2023-04-15",
            "manager": "Jane Smith",
            "employmentType": "Full Time",
            "payFrequency": "Monthly",
            "workingDaysPerWeek": 5,
            "breakTime": "1 Hour",
            "monthlyWage": 85000.0
        },
        {
            "id": "EMP-1002",
            "odoo_id": 2,
            "name": "Michael Chen",
            "role": "Lead Backend Architect",
            "jobTitle": "Lead Backend Architect",
            "department": "Engineering",
            "email": "michael.c@dayflow.io",
            "phone": "+91 98765 43211",
            "location": "Bangalore",
            "officeLocation": "Bangalore",
            "status": "Active",
            "attendanceStatus": "Present",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "joiningDate": "2022-08-01",
            "manager": "Jane Smith",
            "employmentType": "Full Time",
            "payFrequency": "Monthly",
            "workingDaysPerWeek": 5,
            "breakTime": "1 Hour",
            "monthlyWage": 110000.0
        },
        {
            "id": "EMP-1003",
            "odoo_id": 3,
            "name": "Elena Rostova",
            "role": "Head of Product",
            "jobTitle": "Head of Product",
            "department": "Product",
            "email": "elena.r@dayflow.io",
            "phone": "+91 98765 43212",
            "location": "Chennai",
            "officeLocation": "Chennai",
            "status": "Active",
            "attendanceStatus": "On Leave",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            "joiningDate": "2021-11-10",
            "manager": "N/A",
            "employmentType": "Full Time",
            "payFrequency": "Monthly",
            "workingDaysPerWeek": 5,
            "breakTime": "1 Hour",
            "monthlyWage": 135000.0
        },
        {
            "id": "EMP-1004",
            "odoo_id": 4,
            "name": "David Miller",
            "role": "UI/UX Designer",
            "jobTitle": "UI/UX Designer",
            "department": "Product",
            "email": "david.m@dayflow.io",
            "phone": "+91 98765 43213",
            "location": "Remote",
            "officeLocation": "Remote",
            "status": "Active",
            "attendanceStatus": "Checked Out",
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
            "joiningDate": "2024-01-15",
            "manager": "Elena Rostova",
            "employmentType": "Full Time",
            "payFrequency": "Monthly",
            "workingDaysPerWeek": 5,
            "breakTime": "1 Hour",
            "monthlyWage": 70000.0
        },
        {
            "id": "EMP-1005",
            "odoo_id": 5,
            "name": "Priya Sharma",
            "role": "HR Operations Manager",
            "jobTitle": "HR Operations Manager",
            "department": "Human Resources",
            "email": "priya.s@dayflow.io",
            "phone": "+91 98765 43214",
            "location": "Chennai",
            "officeLocation": "Chennai",
            "status": "Active",
            "attendanceStatus": "Present",
            "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
            "joiningDate": "2022-02-01",
            "manager": "N/A",
            "employmentType": "Full Time",
            "payFrequency": "Monthly",
            "workingDaysPerWeek": 5,
            "breakTime": "1 Hour",
            "monthlyWage": 90000.0
        }
    ],
    "salary_components": [
        {"id": "COMP-01", "odoo_id": 1, "name": "House Rent Allowance (HRA)", "category": "Earning", "type": "percentage", "value": 40.0, "description": "40% of base salary", "enabled": True},
        {"id": "COMP-02", "odoo_id": 2, "name": "Transport Allowance", "category": "Earning", "type": "fixed", "value": 3000.0, "description": "Fixed transport allowance", "enabled": True},
        {"id": "COMP-03", "odoo_id": 3, "name": "Special Allowance", "category": "Earning", "type": "percentage", "value": 15.0, "description": "15% role allowance", "enabled": True},
        {"id": "COMP-04", "odoo_id": 4, "name": "Provident Fund (PF)", "category": "Deduction", "type": "percentage", "value": 12.0, "description": "12% statutory PF", "enabled": True},
        {"id": "COMP-05", "odoo_id": 5, "name": "Income Tax Deduction", "category": "Deduction", "type": "percentage", "value": 5.0, "description": "Estimated withholding", "enabled": True}
    ],
    "attendance": [
        {"id": "ATT-101", "employeeId": "EMP-1001", "employeeName": "Sarah Jenkins", "department": "Engineering", "date": "2026-08-22", "checkIn": "09:00 AM", "checkOut": "--:--", "hoursWorked": "4.5 hrs", "status": "Present", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"},
        {"id": "ATT-102", "employeeId": "EMP-1002", "employeeName": "Michael Chen", "department": "Engineering", "date": "2026-08-22", "checkIn": "08:45 AM", "checkOut": "--:--", "hoursWorked": "4.8 hrs", "status": "Present", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"},
        {"id": "ATT-103", "employeeId": "EMP-1004", "employeeName": "David Miller", "department": "Product", "date": "2026-08-22", "checkIn": "09:30 AM", "checkOut": "01:30 PM", "hoursWorked": "4.0 hrs", "status": "Checked Out", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"}
    ],
    "leaves": [
        {"id": "LV-501", "employeeId": "EMP-1003", "employeeName": "Elena Rostova", "type": "Paid Leave", "leaveType": "Paid Leave", "startDate": "2026-08-22", "endDate": "2026-08-24", "days": 3, "duration": "3 Days", "reason": "Family Function", "status": "Approved", "submittedDate": "2026-08-20", "approvedBy": "HR Administrator", "approvedDate": "2026-08-21", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"},
        {"id": "LV-502", "employeeId": "EMP-1001", "employeeName": "Sarah Jenkins", "type": "Casual Leave", "leaveType": "Casual Leave", "startDate": "2026-08-28", "endDate": "2026-08-28", "days": 1, "duration": "1 Day", "reason": "Personal Work", "status": "Pending", "submittedDate": "2026-08-22", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"}
    ]
}


def calculate_breakdown(monthly_wage):
    base_salary = float(monthly_wage or 50000.0)
    earnings = []
    deductions = []
    total_earnings = base_salary
    total_deductions = 0.0

    for c in STATE["salary_components"]:
        if not c.get("enabled", True):
            continue
        val = c["value"]
        amt = (base_salary * val / 100.0) if c["type"] == "percentage" else val
        item = {
            "id": c["id"],
            "name": c["name"],
            "category": c["category"],
            "type": c["type"],
            "value": val,
            "amount": round(amt, 2)
        }
        if c["category"] == "Earning":
            earnings.append(item)
            total_earnings += amt
        else:
            deductions.append(item)
            total_deductions += amt

    return {
        "baseSalary": round(base_salary, 2),
        "totalEarnings": round(total_earnings, 2),
        "totalDeductions": round(total_deductions, 2),
        "netSalary": round(total_earnings - total_deductions, 2),
        "grossSalary": round(total_earnings, 2),
        "earnings": earnings,
        "deductions": deductions
    }


class DayflowApiHandler(BaseHTTPRequestHandler):

    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

    def send_json(self, data=None, success=True, message="", error=None, code="OK", status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_cors_headers()
        self.end_headers()
        payload = {
            "success": success,
            "data": data if data is not None else [],
            "message": message
        }
        if not success:
            payload["error"] = error or message
            payload["code"] = code
        self.wfile.write(json.dumps(payload).encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_cors_headers()
        self.end_headers()

    def parse_json_body(self):
        length = int(self.headers.get("Content-Length", 0))
        if length > 0:
            raw = self.rfile.read(length).decode("utf-8")
            try:
                return json.loads(raw)
            except Exception:
                return {}
        return {}

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        # Base / Home check
        if path == "/" or path == "/api":
            return self.send_json(data={"status": "running", "service": "Dayflow Odoo HRMS Backend API"}, message="Odoo HRMS Backend API is live on http://localhost:8069")

        # Dashboard Summary
        if path == "/api/admin/dashboard":
            present = sum(1 for e in STATE["employees"] if e["attendanceStatus"] == "Present")
            absent = sum(1 for e in STATE["employees"] if e["attendanceStatus"] == "Absent")
            on_leave = sum(1 for e in STATE["employees"] if e["attendanceStatus"] == "On Leave")
            pending_leaves = sum(1 for l in STATE["leaves"] if l["status"] == "Pending")
            departments = len(set(e["department"] for e in STATE["employees"]))

            return self.send_json(data={
                "total_employees": len(STATE["employees"]),
                "present_today": present,
                "absent_today": absent,
                "on_leave_today": on_leave,
                "pending_leave_requests": pending_leaves,
                "total_departments": departments
            }, message="Dashboard statistics retrieved")

        # Employees List
        if path == "/api/admin/employees":
            res = STATE["employees"]
            if "search" in query:
                s = query["search"][0].lower()
                res = [e for e in res if s in e["name"].lower() or s in e["id"].lower()]
            return self.send_json(data=res, message="Employees retrieved successfully")

        # Single Employee
        match = re.match(r"^/api/admin/employees/([^/]+)$", path)
        if match:
            emp_id = match.group(1)
            emp = next((e for e in STATE["employees"] if e["id"] == emp_id or str(e["odoo_id"]) == emp_id), None)
            if emp:
                return self.send_json(data=emp, message="Employee details retrieved")
            return self.send_json(success=False, error="Employee not found", code="NOT_FOUND", status=404)

        # Attendance List
        if path == "/api/admin/attendance":
            return self.send_json(data=STATE["attendance"], message="Attendance logs retrieved")

        # Leave Requests List
        if path == "/api/admin/leaves":
            return self.send_json(data=STATE["leaves"], message="Leave requests retrieved")

        # Salary Components List
        if path == "/api/admin/salary-components":
            return self.send_json(data=STATE["salary_components"], message="Salary components retrieved")

        # Employee Salary Breakdown
        match_sal = re.match(r"^/api/admin/employees/([^/]+)/salary$", path) or re.match(r"^/api/admin/salaries/([^/]+)$", path)
        if match_sal:
            emp_id = match_sal.group(1)
            emp = next((e for e in STATE["employees"] if e["id"] == emp_id or str(e["odoo_id"]) == emp_id), None)
            if emp:
                bd = calculate_breakdown(emp["monthlyWage"])
                return self.send_json(data={
                    "employeeId": emp["id"],
                    "employeeName": emp["name"],
                    "jobTitle": emp["jobTitle"],
                    "department": emp["department"],
                    "monthlyWage": emp["monthlyWage"],
                    "breakdown": bd
                }, message="Salary breakdown retrieved")
            return self.send_json(success=False, error="Employee not found", code="NOT_FOUND", status=404)

        return self.send_json(success=False, error="Endpoint not found", code="NOT_FOUND", status=404)

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        body = self.parse_json_body()

        if path == "/api/auth/login":
            return self.send_json(data={
                "uid": 1,
                "name": "Administrator",
                "role": "Admin",
                "session_id": "dayflow_hackathon_session_123"
            }, message="Login successful")

        if path == "/api/admin/employees":
            new_id = f"EMP-{1000 + len(STATE['employees']) + 1}"
            emp = {
                "id": new_id,
                "odoo_id": len(STATE['employees']) + 1,
                "name": body.get("name", "New Employee"),
                "role": body.get("role") or body.get("jobTitle") or "Software Engineer",
                "jobTitle": body.get("jobTitle") or body.get("role") or "Software Engineer",
                "department": body.get("department", "Engineering"),
                "email": body.get("email", ""),
                "phone": body.get("phone", ""),
                "location": body.get("location") or body.get("officeLocation", "Chennai"),
                "officeLocation": body.get("location") or body.get("officeLocation", "Chennai"),
                "status": "Active",
                "attendanceStatus": "Present",
                "avatar": body.get("avatar", f"https://api.dicebear.com/7.x/avataaars/svg?seed={body.get('name')}"),
                "joiningDate": body.get("joiningDate", "2026-08-22"),
                "manager": "Jane Smith",
                "employmentType": body.get("employmentType", "Full Time"),
                "payFrequency": "Monthly",
                "workingDaysPerWeek": 5,
                "breakTime": "1 Hour",
                "monthlyWage": float(body.get("monthlyWage", 50000.0))
            }
            STATE["employees"].insert(0, emp)
            return self.send_json(data=emp, message="Employee created successfully")

        if path == "/api/admin/attendance/check-in":
            emp_id = body.get("employeeId")
            rec = {
                "id": f"ATT-{len(STATE['attendance']) + 101}",
                "employeeId": emp_id,
                "employeeName": "Sarah Jenkins",
                "department": "Engineering",
                "date": "2026-08-22",
                "checkIn": "09:00 AM",
                "checkOut": "--:--",
                "hoursWorked": "0.0 hrs",
                "status": "Present",
                "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
            }
            STATE["attendance"].insert(0, rec)
            return self.send_json(data=rec, message="Check-in recorded successfully")

        if path == "/api/admin/attendance/check-out":
            emp_id = body.get("employeeId")
            att = next((a for a in STATE["attendance"] if a["employeeId"] == emp_id), None)
            if att:
                att["checkOut"] = "05:00 PM"
                att["status"] = "Checked Out"
                return self.send_json(data=att, message="Check-out recorded successfully")
            return self.send_json(success=False, error="No active check-in record found", code="BAD_REQUEST")

        if path == "/api/admin/leaves":
            leave_rec = {
                "id": f"LV-{len(STATE['leaves']) + 501}",
                "employeeId": body.get("employeeId", "EMP-1001"),
                "employeeName": "Employee",
                "type": body.get("type") or body.get("leaveType", "Paid Leave"),
                "leaveType": body.get("type") or body.get("leaveType", "Paid Leave"),
                "startDate": body.get("startDate", "2026-08-25"),
                "endDate": body.get("endDate", "2026-08-26"),
                "days": 2,
                "duration": "2 Days",
                "reason": body.get("reason", "Personal"),
                "status": "Pending",
                "submittedDate": "2026-08-22",
                "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
            }
            STATE["leaves"].insert(0, leave_rec)
            return self.send_json(data=leave_rec, message="Leave request submitted")

        match_app = re.match(r"^/api/admin/leaves/([^/]+)/approve$", path)
        if match_app:
            lid = match_app.group(1)
            lreq = next((l for l in STATE["leaves"] if l["id"] == lid), None)
            if lreq:
                lreq["status"] = "Approved"
                lreq["approvedBy"] = "HR Administrator"
                lreq["approvedDate"] = "2026-08-22"
                return self.send_json(data=lreq, message="Leave request approved")
            return self.send_json(success=False, error="Leave record not found", code="NOT_FOUND", status=404)

        match_rej = re.match(r"^/api/admin/leaves/([^/]+)/reject$", path)
        if match_rej:
            lid = match_rej.group(1)
            lreq = next((l for l in STATE["leaves"] if l["id"] == lid), None)
            if lreq:
                lreq["status"] = "Rejected"
                lreq["rejectedBy"] = "HR Administrator"
                lreq["rejectReason"] = body.get("reason", "Not approved")
                lreq["rejectedDate"] = "2026-08-22"
                return self.send_json(data=lreq, message="Leave request rejected")
            return self.send_json(success=False, error="Leave record not found", code="NOT_FOUND", status=404)

        if path == "/api/admin/salary-components":
            comp = {
                "id": body.get("id") or f"COMP-{len(STATE['salary_components']) + 1:02d}",
                "name": body.get("name", "New Component"),
                "category": body.get("category", "Earning"),
                "type": body.get("type", "percentage"),
                "value": float(body.get("value", 10.0)),
                "description": body.get("description", ""),
                "enabled": body.get("enabled", True)
            }
            STATE["salary_components"].append(comp)
            return self.send_json(data=comp, message="Salary component saved")

        return self.send_json(success=False, error="Endpoint not found", code="NOT_FOUND", status=404)

    def do_PUT(self):
        parsed = urlparse(self.path)
        path = parsed.path
        body = self.parse_json_body()

        match = re.match(r"^/api/admin/employees/([^/]+)$", path)
        if match:
            emp_id = match.group(1)
            emp = next((e for e in STATE["employees"] if e["id"] == emp_id or str(e["odoo_id"]) == emp_id), None)
            if emp:
                emp.update({k: v for k, v in body.items() if v is not None})
                return self.send_json(data=emp, message="Employee updated successfully")
            return self.send_json(success=False, error="Employee not found", code="NOT_FOUND", status=404)

        match_sal = re.match(r"^/api/admin/employees/([^/]+)/salary$", path)
        if match_sal:
            emp_id = match_sal.group(1)
            emp = next((e for e in STATE["employees"] if e["id"] == emp_id or str(e["odoo_id"]) == emp_id), None)
            if emp:
                if "monthlyWage" in body:
                    emp["monthlyWage"] = float(body["monthlyWage"])
                bd = calculate_breakdown(emp["monthlyWage"])
                return self.send_json(data={"employeeId": emp["id"], "monthlyWage": emp["monthlyWage"], "breakdown": bd}, message="Salary updated")
            return self.send_json(success=False, error="Employee not found", code="NOT_FOUND", status=404)

        return self.send_json(success=False, error="Endpoint not found", code="NOT_FOUND", status=404)


if __name__ == "__main__":
    print("==================================================")
    print(f"[Dayflow HRMS] Backend Server running on http://localhost:{PORT}")
    print("==================================================")
    server = HTTPServer(("0.0.0.0", PORT), DayflowApiHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down Dayflow Backend Server...")
        server.server_close()
