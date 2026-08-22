import { adminService } from '../services/adminService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const adminController = {
  /**
   * GET /api/v1/admin/employees
   */
  async listEmployees(req, res, next) {
    try {
      const data = await adminService.listEmployees(req.query);
      return sendSuccess(res, data, 'Employees listed successfully', 200);
    } catch (err) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * GET /api/v1/admin/employees/:id
   */
  async getEmployeeById(req, res, next) {
    try {
      const employee = await adminService.getEmployeeById(req.params.id);
      return sendSuccess(res, employee, 'Employee details fetched', 200);
    } catch (err) {
      return sendError(res, err.message, 404);
    }
  },

  /**
   * POST /api/v1/admin/employees
   */
  async createEmployee(req, res, next) {
    try {
      const result = await adminService.createEmployee(req.body);
      return sendSuccess(res, result, 'Employee created successfully with temporary credentials', 201);
    } catch (err) {
      return sendError(res, err.message, 400);
    }
  },

  /**
   * PUT /api/v1/admin/employees/:id
   */
  async updateEmployee(req, res, next) {
    try {
      const updated = await adminService.updateEmployee(req.params.id, req.body);
      return sendSuccess(res, updated, 'Employee updated successfully', 200);
    } catch (err) {
      return sendError(res, err.message, 400);
    }
  },

  /**
   * PATCH /api/v1/admin/employees/:id/status
   */
  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const updated = await adminService.updateStatus(req.params.id, status);
      return sendSuccess(res, updated, `Employee status changed to ${status}`, 200);
    } catch (err) {
      return sendError(res, err.message, 400);
    }
  },

  /**
   * POST /api/v1/admin/employees/:id/reset-password
   */
  async resetPassword(req, res, next) {
    try {
      const result = await adminService.resetPassword(req.params.id);
      return sendSuccess(res, result, 'Temporary password generated successfully', 200);
    } catch (err) {
      return sendError(res, err.message, 400);
    }
  },

  /**
   * GET /api/v1/admin/attendance
   */
  async listAttendance(req, res, next) {
    try {
      const data = await adminService.listAttendance(req.query);
      return sendSuccess(res, data, 'Company attendance logs fetched', 200);
    } catch (err) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * GET /api/v1/admin/leaves
   */
  async listLeaves(req, res, next) {
    try {
      const data = await adminService.listLeaves(req.query);
      return sendSuccess(res, data, 'Leave requests fetched', 200);
    } catch (err) {
      return sendError(res, err.message, 500);
    }
  },

  /**
   * PUT /api/v1/admin/leaves/:id/approve
   */
  async approveLeave(req, res, next) {
    try {
      const { comments } = req.body;
      const updated = await adminService.approveLeave(req.params.id, req.user, comments);
      return sendSuccess(res, updated, 'Leave request approved', 200);
    } catch (err) {
      return sendError(res, err.message, 400);
    }
  },

  /**
   * PUT /api/v1/admin/leaves/:id/reject
   */
  async rejectLeave(req, res, next) {
    try {
      const { comments } = req.body;
      const updated = await adminService.rejectLeave(req.params.id, req.user, comments);
      return sendSuccess(res, updated, 'Leave request rejected', 200);
    } catch (err) {
      return sendError(res, err.message, 400);
    }
  },
};
