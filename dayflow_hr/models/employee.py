# -*- coding: utf-8 -*-
from odoo import models, fields, api


class DayflowEmployee(models.Model):
    _inherit = 'hr.employee'

    employee_code = fields.Char(string='Employee ID Code', copy=False, help='Custom Dayflow ID e.g. EMP-1001')
    office_location = fields.Char(string='Office Location', default='Chennai')
    employment_type = fields.Selection([
        ('Full Time', 'Full Time'),
        ('Part Time', 'Part Time'),
        ('Contract', 'Contract'),
        ('Intern', 'Intern'),
    ], string='Employment Type', default='Full Time')
    
    working_days_per_week = fields.Integer(string='Working Days per Week', default=5)
    break_time = fields.Char(string='Break Time', default='1 Hour')
    attendance_status_custom = fields.Selection([
        ('Present', 'Present'),
        ('Checked Out', 'Checked Out'),
        ('On Leave', 'On Leave'),
        ('Absent', 'Absent'),
    ], string='Attendance Status', default='Present', compute='_compute_attendance_status_custom', store=True)

    monthly_wage = fields.Float(string='Monthly Base Wage', default=50000.0)
    joining_date = fields.Date(string='Joining Date', default=fields.Date.context_today)
    avatar_url = fields.Char(string='Avatar Image URL')

    @api.depends('attendance_ids', 'attendance_ids.check_out')
    def _compute_attendance_status_custom(self):
        for emp in self:
            last_att = self.env['hr.attendance'].search([('employee_id', '=', emp.id)], order='check_in desc', limit=1)
            if not last_att:
                emp.attendance_status_custom = 'Absent'
            elif not last_att.check_out:
                emp.attendance_status_custom = 'Present'
            else:
                emp.attendance_status_custom = 'Checked Out'

    def to_dayflow_dict(self):
        self.ensure_one()
        return {
            'id': self.employee_code or f"EMP-{self.id}",
            'odoo_id': self.id,
            'name': self.name or '',
            'role': self.job_title or self.job_id.name or 'Employee',
            'jobTitle': self.job_title or self.job_id.name or 'Employee',
            'department': self.department_id.name if self.department_id else 'General',
            'email': self.work_email or '',
            'phone': self.work_phone or self.mobile_phone or '',
            'location': self.office_location or 'Chennai',
            'officeLocation': self.office_location or 'Chennai',
            'status': 'Active' if self.active else 'Inactive',
            'attendanceStatus': self.attendance_status_custom or 'Present',
            'avatar': self.avatar_url or f"https://api.dicebear.com/7.x/avataaars/svg?seed={self.name}",
            'joiningDate': str(self.joining_date) if self.joining_date else '',
            'manager': self.parent_id.name if self.parent_id else 'N/A',
            'employmentType': self.employment_type or 'Full Time',
            'payFrequency': 'Monthly',
            'workingDaysPerWeek': self.working_days_per_week or 5,
            'breakTime': self.break_time or '1 Hour',
            'monthlyWage': self.monthly_wage or 50000.0,
        }
