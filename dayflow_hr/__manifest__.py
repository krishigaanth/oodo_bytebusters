# -*- coding: utf-8 -*-
{
    'name': 'Dayflow HRMS - Odoo Backend',
    'version': '1.0.0',
    'category': 'Human Resources',
    'summary': 'Enterprise Backend for Dayflow HRMS Admin & Employee Platform',
    'description': """
        Dayflow HRMS Odoo Backend Module
        ================================
        - Extended Employee Management (hr.employee)
        - Attendance Management & API (hr.attendance)
        - Time Off & Leave Management with HR Approval/Rejection (hr.leave)
        - Salary Structure & Component Management
        - JSON REST API for Dayflow Admin & Employee Portal
    """,
    'author': 'ByteBusters / Dayflow Team',
    'website': 'https://github.com/krishigaanth/oodo_bytebusters',
    'depends': [
        'base',
        'hr',
        'hr_attendance',
        'hr_holidays',
    ],
    'data': [
        'security/security.xml',
        'security/ir.model.access.csv',
        'views/employee_views.xml',
        'views/salary_views.xml',
        'views/menu_views.xml',
        'data/demo_data.xml',
    ],
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
