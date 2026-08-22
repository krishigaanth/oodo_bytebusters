# -*- coding: utf-8 -*-
import json
import logging
from odoo import http, fields, _
from odoo.http import request

_logger = logging.getLogger(__name__)


def json_response(data=None, success=True, message="", error=None, code="OK", status=200):
    response_payload = {
        'success': success,
        'data': data if data is not None else [],
        'message': message,
    }
    if not success:
        response_payload['error'] = error or message or 'An error occurred'
        response_payload['code'] = code

    headers = [
        ('Content-Type', 'application/json'),
        ('Access-Control-Allow-Origin', '*'),
        ('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS'),
        ('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With'),
    ]
    return request.make_response(json.dumps(response_payload, default=str), headers=headers, status=status)


class DayflowAdminApiController(http.Controller):

    # CORS Preflight handler
    @http.route(['/api/admin/<path:subpath>', '/api/auth/<path:subpath>'], type='http', auth='none', methods=['OPTIONS'], csrf=False)
    def options_handler(self, subpath=None, **kw):
        headers = [
            ('Access-Control-Allow-Origin', '*'),
            ('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS'),
            ('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With'),
        ]
        return request.make_response('', headers=headers, status=204)

    # -------------------------------------------------------------
    # AUTHENTICATION ENDPOINTS
    # -------------------------------------------------------------
    @http.route('/api/auth/login', type='json', auth='none', methods=['POST'], csrf=False)
    def api_login(self, **kw):
        data = request.jsonrequest or kw
        db = data.get('db') or request.db or 'dayflow_db'
        login = data.get('username') or data.get('login')
        password = data.get('password')

        if not login or not password:
            return {'success': False, 'error': 'Username and password are required', 'code': 'BAD_REQUEST'}

        try:
            uid = request.session.authenticate(db, login, password)
            if uid:
                user = request.env['res.users'].browse(uid)
                emp = request.env['hr.employee'].search([('user_id', '=', uid)], limit=1)
                is_admin = user.has_group('dayflow_hr.group_dayflow_admin') or user.has_group('base.group_erp_manager')
                
                return {
                    'success': True,
                    'message': 'Login successful',
                    'data': {
                        'uid': uid,
                        'session_id': request.session.sid,
                        'name': user.name,
                        'email': user.email,
                        'role': 'Admin' if is_admin else 'Employee',
                        'employee_id': emp.employee_code if emp else None,
                    }
                }
        except Exception as e:
            _logger.error(f"Authentication failed: {str(e)}")
            return {'success': False, 'error': 'Invalid credentials', 'code': 'UNAUTHORIZED'}

    @http.route('/api/auth/session', type='http', auth='none', methods=['GET'], csrf=False)
    def api_session_status(self, **kw):
        if request.session.uid:
            user = request.env['res.users'].browse(request.session.uid)
            is_admin = user.has_group('dayflow_hr.group_dayflow_admin') or user.has_group('base.group_erp_manager')
            return json_response(data={
                'authenticated': True,
                'uid': request.session.uid,
                'name': user.name,
                'role': 'Admin' if is_admin else 'Employee'
            })
        return json_response(data={'authenticated': False})

    # -------------------------------------------------------------
    # DASHBOARD SUMMARY ENDPOINT
    # -------------------------------------------------------------
    @http.route('/api/admin/dashboard', type='http', auth='none', methods=['GET'], csrf=False)
    def get_dashboard_summary(self, **kw):
        try:
            employees = request.env['hr.employee'].sudo().search([])
            total_employees = len(employees)
            
            present_today = len(employees.filtered(lambda e: e.attendance_status_custom == 'Present'))
            absent_today = len(employees.filtered(lambda e: e.attendance_status_custom == 'Absent'))
            on_leave_today = len(employees.filtered(lambda e: e.attendance_status_custom == 'On Leave'))
            
            pending_leaves = request.env['hr.leave'].sudo().search_count([('state', 'in', ['draft', 'confirm', 'validate1'])])
            total_departments = request.env['hr.department'].sudo().search_count([])

            return json_response(data={
                'total_employees': total_employees,
                'present_today': present_today,
                'absent_today': absent_today,
                'on_leave_today': on_leave_today,
                'pending_leave_requests': pending_leaves,
                'total_departments': total_departments,
            }, message="Dashboard statistics loaded")
        except Exception as e:
            return json_response(success=False, error=str(e), status=500)

    # -------------------------------------------------------------
    # EMPLOYEE MANAGEMENT ENDPOINTS
    # -------------------------------------------------------------
    @http.route('/api/admin/employees', type='http', auth='none', methods=['GET'], csrf=False)
    def get_employees(self, search=None, department=None, status=None, limit=50, offset=0, **kw):
        try:
            domain = []
            if search:
                domain += ['|', ('name', 'ilike', search), ('employee_code', 'ilike', search)]
            if department and department != 'All':
                domain += [('department_id.name', '=', department)]
            if status and status != 'All':
                domain += [('attendance_status_custom', '=', status)]

            employees = request.env['hr.employee'].sudo().search(domain, limit=int(limit), offset=int(offset))
            res = [emp.to_dayflow_dict() for emp in employees]
            return json_response(data=res, message="Employees retrieved successfully")
        except Exception as e:
            return json_response(success=False, error=str(e), status=500)

    @http.route(['/api/admin/employees/<int:emp_id>', '/api/admin/employees/<string:emp_code>'], type='http', auth='none', methods=['GET'], csrf=False)
    def get_employee_detail(self, emp_id=None, emp_code=None, **kw):
        try:
            domain = [('id', '=', emp_id)] if emp_id else [('employee_code', '=', emp_code)]
            emp = request.env['hr.employee'].sudo().search(domain, limit=1)
            if not emp:
                return json_response(success=False, error="Employee not found", code="NOT_FOUND", status=404)
            return json_response(data=emp.to_dayflow_dict(), message="Employee details retrieved")
        except Exception as e:
            return json_response(success=False, error=str(e), status=500)

    @http.route('/api/admin/employees', type='json', auth='none', methods=['POST'], csrf=False)
    def create_employee(self, **kw):
        data = request.jsonrequest or kw
        name = data.get('name')
        if not name:
            return {'success': False, 'error': 'Employee name is required', 'code': 'BAD_REQUEST'}

        try:
            dept_name = data.get('department')
            dept = request.env['hr.department'].sudo().search([('name', '=', dept_name)], limit=1) if dept_name else False
            if dept_name and not dept:
                dept = request.env['hr.department'].sudo().create({'name': dept_name})

            emp = request.env['hr.employee'].sudo().create({
                'name': name,
                'employee_code': data.get('id') or data.get('employee_code'),
                'job_title': data.get('jobTitle') or data.get('role'),
                'department_id': dept.id if dept else False,
                'work_email': data.get('email'),
                'work_phone': data.get('phone'),
                'office_location': data.get('location') or data.get('officeLocation', 'Chennai'),
                'employment_type': data.get('employmentType', 'Full Time'),
                'joining_date': data.get('joiningDate') or fields.Date.context_today(request.env['hr.employee']),
                'monthly_wage': float(data.get('monthlyWage', 50000.0)),
                'avatar_url': data.get('avatar'),
            })
            return {'success': True, 'data': emp.to_dayflow_dict(), 'message': 'Employee created successfully'}
        except Exception as e:
            return {'success': False, 'error': str(e), 'code': 'SERVER_ERROR'}

    @http.route(['/api/admin/employees/<int:emp_id>', '/api/admin/employees/<string:emp_code>'], type='json', auth='none', methods=['PUT', 'PATCH'], csrf=False)
    def update_employee(self, emp_id=None, emp_code=None, **kw):
        data = request.jsonrequest or kw
        try:
            domain = [('id', '=', emp_id)] if emp_id else [('employee_code', '=', emp_code)]
            emp = request.env['hr.employee'].sudo().search(domain, limit=1)
            if not emp:
                return {'success': False, 'error': 'Employee not found', 'code': 'NOT_FOUND'}

            vals = {}
            if 'name' in data: vals['name'] = data['name']
            if 'jobTitle' in data: vals['job_title'] = data['jobTitle']
            if 'email' in data: vals['work_email'] = data['email']
            if 'phone' in data: vals['work_phone'] = data['phone']
            if 'location' in data: vals['office_location'] = data['location']
            if 'employmentType' in data: vals['employment_type'] = data['employmentType']
            if 'monthlyWage' in data: vals['monthly_wage'] = float(data['monthlyWage'])
            if 'avatar' in data: vals['avatar_url'] = data['avatar']

            emp.sudo().write(vals)
            return {'success': True, 'data': emp.to_dayflow_dict(), 'message': 'Employee updated successfully'}
        except Exception as e:
            return {'success': False, 'error': str(e), 'code': 'SERVER_ERROR'}

    # -------------------------------------------------------------
    # ATTENDANCE ENDPOINTS
    # -------------------------------------------------------------
    @http.route('/api/admin/attendance', type='http', auth='none', methods=['GET'], csrf=False)
    def get_attendance(self, employee_id=None, date_from=None, date_to=None, **kw):
        try:
            domain = []
            if employee_id:
                domain += ['|', ('employee_id.employee_code', '=', employee_id), ('employee_id.id', '=', int(employee_id) if employee_id.isdigit() else 0)]
            if date_from:
                domain += [('check_in', '>=', date_from)]
            if date_to:
                domain += [('check_in', '<=', date_to)]

            records = request.env['hr.attendance'].sudo().search(domain, order='check_in desc', limit=100)
            res = [r.to_dayflow_dict() for r in records]
            return json_response(data=res, message="Attendance records retrieved")
        except Exception as e:
            return json_response(success=False, error=str(e), status=500)

    @http.route('/api/admin/attendance/check-in', type='json', auth='none', methods=['POST'], csrf=False)
    def check_in(self, **kw):
        data = request.jsonrequest or kw
        emp_code = data.get('employeeId') or data.get('employee_id')
        if not emp_code:
            return {'success': False, 'error': 'employeeId is required', 'code': 'BAD_REQUEST'}

        try:
            emp = request.env['hr.employee'].sudo().search(['|', ('employee_code', '=', emp_code), ('id', '=', int(emp_code) if str(emp_code).isdigit() else 0)], limit=1)
            if not emp:
                return {'success': False, 'error': 'Employee not found', 'code': 'NOT_FOUND'}

            # Check open attendance
            open_att = request.env['hr.attendance'].sudo().search([('employee_id', '=', emp.id), ('check_out', '=', False)], limit=1)
            if open_att:
                return {'success': True, 'data': open_att.to_dayflow_dict(), 'message': 'Employee already checked in'}

            att = request.env['hr.attendance'].sudo().create({
                'employee_id': emp.id,
                'check_in': fields.Datetime.now(),
            })
            return {'success': True, 'data': att.to_dayflow_dict(), 'message': 'Check-in recorded successfully'}
        except Exception as e:
            return {'success': False, 'error': str(e), 'code': 'SERVER_ERROR'}

    @http.route('/api/admin/attendance/check-out', type='json', auth='none', methods=['POST'], csrf=False)
    def check_out(self, **kw):
        data = request.jsonrequest or kw
        emp_code = data.get('employeeId') or data.get('employee_id')
        if not emp_code:
            return {'success': False, 'error': 'employeeId is required', 'code': 'BAD_REQUEST'}

        try:
            emp = request.env['hr.employee'].sudo().search(['|', ('employee_code', '=', emp_code), ('id', '=', int(emp_code) if str(emp_code).isdigit() else 0)], limit=1)
            if not emp:
                return {'success': False, 'error': 'Employee not found', 'code': 'NOT_FOUND'}

            open_att = request.env['hr.attendance'].sudo().search([('employee_id', '=', emp.id), ('check_out', '=', False)], limit=1)
            if not open_att:
                return {'success': False, 'error': 'No active check-in record found for check-out', 'code': 'BAD_REQUEST'}

            open_att.sudo().write({'check_out': fields.Datetime.now()})
            return {'success': True, 'data': open_att.to_dayflow_dict(), 'message': 'Check-out recorded successfully'}
        except Exception as e:
            return {'success': False, 'error': str(e), 'code': 'SERVER_ERROR'}

    # -------------------------------------------------------------
    # LEAVE / TIME OFF ENDPOINTS
    # -------------------------------------------------------------
    @http.route('/api/admin/leaves', type='http', auth='none', methods=['GET'], csrf=False)
    def get_leaves(self, status=None, employee_id=None, leave_type=None, **kw):
        try:
            domain = []
            if employee_id:
                domain += ['|', ('employee_id.employee_code', '=', employee_id), ('employee_id.id', '=', int(employee_id) if employee_id.isdigit() else 0)]
            if status and status != 'All':
                status_state_map = {'Pending': ['draft', 'confirm', 'validate1'], 'Approved': ['validate'], 'Rejected': ['refuse']}
                if status in status_state_map:
                    domain += [('state', 'in', status_state_map[status])]
            
            leaves = request.env['hr.leave'].sudo().search(domain, order='create_date desc', limit=100)
            res = [l.to_dayflow_dict() for l in leaves]
            return json_response(data=res, message="Leave requests retrieved")
        except Exception as e:
            return json_response(success=False, error=str(e), status=500)

    @http.route('/api/admin/leaves', type='json', auth='none', methods=['POST'], csrf=False)
    def submit_leave(self, **kw):
        data = request.jsonrequest or kw
        emp_code = data.get('employeeId')
        start_date = data.get('startDate')
        end_date = data.get('endDate')

        if not emp_code or not start_date or not end_date:
            return {'success': False, 'error': 'employeeId, startDate, and endDate are required', 'code': 'BAD_REQUEST'}

        try:
            emp = request.env['hr.employee'].sudo().search(['|', ('employee_code', '=', emp_code), ('id', '=', int(emp_code) if str(emp_code).isdigit() else 0)], limit=1)
            if not emp:
                return {'success': False, 'error': 'Employee not found', 'code': 'NOT_FOUND'}

            leave_type = request.env['hr.leave.type'].sudo().search([], limit=1)
            
            leave_rec = request.env['hr.leave'].sudo().create({
                'employee_id': emp.id,
                'holiday_status_id': leave_type.id if leave_type else False,
                'date_from': start_date,
                'date_to': end_date,
                'name': data.get('reason', 'Time Off Request'),
            })
            return {'success': True, 'data': leave_rec.to_dayflow_dict(), 'message': 'Leave application submitted'}
        except Exception as e:
            return {'success': False, 'error': str(e), 'code': 'SERVER_ERROR'}

    @http.route(['/api/admin/leaves/<string:leave_id>/approve', '/api/admin/leaves/<int:id>/approve'], type='json', auth='none', methods=['POST'], csrf=False)
    def approve_leave(self, leave_id=None, id=None, **kw):
        target_id = leave_id or id
        try:
            lid = int(str(target_id).replace('LV-', ''))
            leave_rec = request.env['hr.leave'].sudo().browse(lid)
            if not leave_rec.exists():
                return {'success': False, 'error': 'Leave record not found', 'code': 'NOT_FOUND'}

            leave_rec.sudo().action_approve()
            return {'success': True, 'data': leave_rec.to_dayflow_dict(), 'message': 'Leave approved successfully'}
        except Exception as e:
            return {'success': False, 'error': str(e), 'code': 'SERVER_ERROR'}

    @http.route(['/api/admin/leaves/<string:leave_id>/reject', '/api/admin/leaves/<int:id>/reject'], type='json', auth='none', methods=['POST'], csrf=False)
    def reject_leave(self, leave_id=None, id=None, **kw):
        data = request.jsonrequest or kw
        target_id = leave_id or id
        reason = data.get('reason', 'Not approved by HR')
        try:
            lid = int(str(target_id).replace('LV-', ''))
            leave_rec = request.env['hr.leave'].sudo().browse(lid)
            if not leave_rec.exists():
                return {'success': False, 'error': 'Leave record not found', 'code': 'NOT_FOUND'}

            leave_rec.sudo().write({'reject_reason': reason, 'state': 'refuse'})
            return {'success': True, 'data': leave_rec.to_dayflow_dict(), 'message': 'Leave request rejected'}
        except Exception as e:
            return {'success': False, 'error': str(e), 'code': 'SERVER_ERROR'}

    # -------------------------------------------------------------
    # SALARY & COMPONENT ENDPOINTS
    # -------------------------------------------------------------
    @http.route('/api/admin/salary-components', type='http', auth='none', methods=['GET'], csrf=False)
    def get_salary_components(self, **kw):
        try:
            comps = request.env['dayflow.salary.component'].sudo().search([])
            res = [c.to_dayflow_dict() for c in comps]
            return json_response(data=res, message="Salary components retrieved")
        except Exception as e:
            return json_response(success=False, error=str(e), status=500)

    @http.route('/api/admin/salary-components', type='json', auth='none', methods=['POST'], csrf=False)
    def create_or_update_salary_component(self, **kw):
        data = request.jsonrequest or kw
        comp_id = data.get('id')
        name = data.get('name')

        try:
            comp = None
            if comp_id:
                comp = request.env['dayflow.salary.component'].sudo().search(['|', ('component_code', '=', comp_id), ('id', '=', int(comp_id) if str(comp_id).isdigit() else 0)], limit=1)

            if comp:
                comp.sudo().write({
                    'name': name or comp.name,
                    'category': data.get('category', comp.category),
                    'type': data.get('type', comp.type),
                    'value': float(data.get('value', comp.value)),
                    'enabled': data.get('enabled', comp.enabled),
                    'description': data.get('description', comp.description),
                })
            else:
                comp = request.env['dayflow.salary.component'].sudo().create({
                    'name': name or 'New Component',
                    'component_code': comp_id,
                    'category': data.get('category', 'Earning'),
                    'type': data.get('type', 'percentage'),
                    'value': float(data.get('value', 0.0)),
                    'enabled': data.get('enabled', True),
                    'description': data.get('description', ''),
                })
            return {'success': True, 'data': comp.to_dayflow_dict(), 'message': 'Salary component saved successfully'}
        except Exception as e:
            return {'success': False, 'error': str(e), 'code': 'SERVER_ERROR'}

    @http.route(['/api/admin/employees/<string:emp_code>/salary', '/api/admin/salaries/<string:emp_code>'], type='http', auth='none', methods=['GET'], csrf=False)
    def get_employee_salary(self, emp_code=None, **kw):
        try:
            emp = request.env['hr.employee'].sudo().search(['|', ('employee_code', '=', emp_code), ('id', '=', int(emp_code) if str(emp_code).isdigit() else 0)], limit=1)
            if not emp:
                return json_response(success=False, error="Employee not found", code="NOT_FOUND", status=404)

            salary_struct = request.env['dayflow.employee.salary'].sudo().search([('employee_id', '=', emp.id)], limit=1)
            if not salary_struct:
                salary_struct = request.env['dayflow.employee.salary'].sudo().create({'employee_id': emp.id})

            breakdown = salary_struct.get_salary_breakdown()
            
            return json_response(data={
                'employeeId': emp.employee_code or f"EMP-{emp.id}",
                'employeeName': emp.name,
                'jobTitle': emp.job_title or 'Employee',
                'department': emp.department_id.name if emp.department_id else 'General',
                'monthlyWage': emp.monthly_wage,
                'breakdown': breakdown
            }, message="Salary details retrieved")
        except Exception as e:
            return json_response(success=False, error=str(e), status=500)

    @http.route(['/api/admin/employees/<string:emp_code>/salary', '/api/admin/salaries/<string:emp_code>'], type='json', auth='none', methods=['PUT', 'PATCH'], csrf=False)
    def update_employee_salary(self, emp_code=None, **kw):
        data = request.jsonrequest or kw
        try:
            emp = request.env['hr.employee'].sudo().search(['|', ('employee_code', '=', emp_code), ('id', '=', int(emp_code) if str(emp_code).isdigit() else 0)], limit=1)
            if not emp:
                return {'success': False, 'error': 'Employee not found', 'code': 'NOT_FOUND'}

            if 'monthlyWage' in data:
                emp.sudo().write({'monthly_wage': float(data['monthlyWage'])})

            salary_struct = request.env['dayflow.employee.salary'].sudo().search([('employee_id', '=', emp.id)], limit=1)
            if not salary_struct:
                salary_struct = request.env['dayflow.employee.salary'].sudo().create({'employee_id': emp.id})

            breakdown = salary_struct.get_salary_breakdown()
            return {'success': True, 'data': {'employeeId': emp_code, 'monthlyWage': emp.monthly_wage, 'breakdown': breakdown}, 'message': 'Salary updated'}
        except Exception as e:
            return {'success': False, 'error': str(e), 'code': 'SERVER_ERROR'}
