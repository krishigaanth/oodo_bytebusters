# -*- coding: utf-8 -*-
from odoo import models, fields, api


class DayflowAttendance(models.Model):
    _inherit = 'hr.attendance'

    status = fields.Selection([
        ('Present', 'Present'),
        ('Checked Out', 'Checked Out'),
        ('Absent', 'Absent'),
        ('On Break', 'On Break'),
    ], string='Status', compute='_compute_attendance_status', store=True)

    @api.depends('check_in', 'check_out')
    def _compute_attendance_status(self):
        for att in self:
            if att.check_in and not att.check_out:
                att.status = 'Present'
            elif att.check_out:
                att.status = 'Checked Out'
            else:
                att.status = 'Absent'

    def to_dayflow_dict(self):
        self.ensure_one()
        check_in_str = self.check_in.strftime('%I:%M %p') if self.check_in else '--:--'
        check_out_str = self.check_out.strftime('%I:%M %p') if self.check_out else '--:--'
        date_str = fields.Date.to_string(self.check_in.date()) if self.check_in else ''
        
        hours_worked = f"{round(self.worked_hours, 1)} hrs" if self.worked_hours else '0.0 hrs'

        return {
            'id': f"ATT-{self.id}",
            'odoo_id': self.id,
            'employeeId': self.employee_id.employee_code or f"EMP-{self.employee_id.id}",
            'employeeName': self.employee_id.name or '',
            'department': self.employee_id.department_id.name if self.employee_id.department_id else 'General',
            'date': date_str,
            'checkIn': check_in_str,
            'checkOut': check_out_str,
            'hoursWorked': hours_worked,
            'totalHours': round(self.worked_hours, 2) if self.worked_hours else 0.0,
            'status': self.status or ('Present' if not self.check_out else 'Checked Out'),
            'avatar': self.employee_id.avatar_url or f"https://api.dicebear.com/7.x/avataaars/svg?seed={self.employee_id.name}"
        }
