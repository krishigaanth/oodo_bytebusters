# -*- coding: utf-8 -*-
from odoo import models, fields, api


class DayflowSalaryComponent(models.Model):
    _name = 'dayflow.salary.component'
    _description = 'Dayflow Salary Component'

    name = fields.Char(string='Component Name', required=True)
    component_code = fields.Char(string='Code')
    category = fields.Selection([
        ('Earning', 'Earning'),
        ('Deduction', 'Deduction'),
    ], string='Category', default='Earning', required=True)
    type = fields.Selection([
        ('percentage', 'Percentage of Base Salary'),
        ('fixed', 'Fixed Amount'),
    ], string='Calculation Type', default='percentage', required=True)
    value = fields.Float(string='Value / Percentage', default=0.0)
    description = fields.Text(string='Description')
    enabled = fields.Boolean(string='Enabled', default=True)

    def to_dayflow_dict(self):
        self.ensure_one()
        return {
            'id': self.component_code or f"COMP-{self.id:02d}",
            'odoo_id': self.id,
            'name': self.name,
            'category': self.category,
            'type': self.type,
            'value': self.value,
            'description': self.description or '',
            'enabled': self.enabled,
        }


class DayflowEmployeeSalary(models.Model):
    _name = 'dayflow.employee.salary'
    _description = 'Dayflow Employee Salary Structure'

    employee_id = fields.Many2one('hr.employee', string='Employee', required=True, ondelete='cascade')
    monthly_wage = fields.Float(string='Monthly Base Wage', related='employee_id.monthly_wage', readonly=False)
    pay_frequency = fields.Selection([
        ('Monthly', 'Monthly'),
        ('Bi-weekly', 'Bi-weekly'),
        ('Weekly', 'Weekly'),
    ], string='Pay Frequency', default='Monthly')
    effective_date = fields.Date(string='Effective Date', default=fields.Date.context_today)
    status = fields.Selection([
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ], string='Status', default='active')

    def get_salary_breakdown(self, components=None):
        self.ensure_one()
        base_salary = self.employee_id.monthly_wage or 50000.0
        if components is None:
            components = self.env['dayflow.salary.component'].search([('enabled', '=', True)])

        earnings_list = []
        deductions_list = []
        total_earnings = base_salary
        total_deductions = 0.0

        for comp in components:
            if not comp.enabled:
                continue
            amt = (base_salary * comp.value / 100.0) if comp.type == 'percentage' else comp.value
            item = {
                'id': comp.component_code or f"COMP-{comp.id:02d}",
                'name': comp.name,
                'category': comp.category,
                'type': comp.type,
                'value': comp.value,
                'amount': round(amt, 2)
            }

            if comp.category == 'Earning':
                earnings_list.append(item)
                total_earnings += amt
            else:
                deductions_list.append(item)
                total_deductions += amt

        net_salary = total_earnings - total_deductions

        return {
            'baseSalary': round(base_salary, 2),
            'totalEarnings': round(total_earnings, 2),
            'totalDeductions': round(total_deductions, 2),
            'netSalary': round(net_salary, 2),
            'grossSalary': round(total_earnings, 2),
            'earnings': earnings_list,
            'deductions': deductions_list
        }
