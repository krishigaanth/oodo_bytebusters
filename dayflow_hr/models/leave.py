# -*- coding: utf-8 -*-
from odoo import models, fields, api


class DayflowLeave(models.Model):
    _inherit = 'hr.leave'

    reject_reason = fields.Text(string='Rejection Reason')
    approved_by_name = fields.Char(string='Approved By', default='HR Administrator')
    rejected_by_name = fields.Char(string='Rejected By', default='HR Administrator')

    def to_dayflow_dict(self):
        self.ensure_one()
        status_map = {
            'draft': 'Pending',
            'confirm': 'Pending',
            'refuse': 'Rejected',
            'validate1': 'Pending',
            'validate': 'Approved',
        }
        
        status_str = status_map.get(self.state, 'Pending')
        
        start_d = str(self.date_from.date()) if self.date_from else ''
        end_d = str(self.date_to.date()) if self.date_to else ''

        return {
            'id': f"LV-{self.id}",
            'odoo_id': self.id,
            'employeeId': self.employee_id.employee_code or f"EMP-{self.employee_id.id}",
            'employeeName': self.employee_id.name or '',
            'type': self.holiday_status_id.name if self.holiday_status_id else 'Paid Leave',
            'leaveType': self.holiday_status_id.name if self.holiday_status_id else 'Paid Leave',
            'startDate': start_d,
            'endDate': end_d,
            'days': int(self.number_of_days) or 1,
            'duration': f"{int(self.number_of_days)} Days" if self.number_of_days else '1 Day',
            'reason': self.name or 'Personal Leave',
            'status': status_str,
            'submittedDate': str(self.create_date.date()) if self.create_date else start_d,
            'approvedBy': self.approved_by_name if status_str == 'Approved' else None,
            'approvedDate': str(self.write_date.date()) if status_str == 'Approved' else None,
            'rejectedBy': self.rejected_by_name if status_str == 'Rejected' else None,
            'rejectedDate': str(self.write_date.date()) if status_str == 'Rejected' else None,
            'rejectReason': self.reject_reason if status_str == 'Rejected' else None,
            'avatar': self.employee_id.avatar_url or f"https://api.dicebear.com/7.x/avataaars/svg?seed={self.employee_id.name}"
        }
