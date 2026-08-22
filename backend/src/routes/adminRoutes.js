import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validatorMiddleware.js';
import {
  createEmployeeValidator,
  updateEmployeeStatusValidator,
  reviewLeaveValidator,
} from '../validators/adminValidators.js';

const router = Router();

// Protect all admin endpoints with authentication and admin/hr role check
router.use(authenticate, requireRole('admin', 'hr'));

// Employee administration
router.get('/employees', adminController.listEmployees);
router.get('/employees/:id', adminController.getEmployeeById);
router.post('/employees', createEmployeeValidator, validateRequest, adminController.createEmployee);
router.put('/employees/:id', adminController.updateEmployee);
router.patch('/employees/:id/status', updateEmployeeStatusValidator, validateRequest, adminController.updateStatus);
router.post('/employees/:id/reset-password', adminController.resetPassword);

// Attendance administration
router.get('/attendance', adminController.listAttendance);

// Leave management and review
router.get('/leaves', adminController.listLeaves);
router.put('/leaves/:id/approve', reviewLeaveValidator, validateRequest, adminController.approveLeave);
router.put('/leaves/:id/reject', reviewLeaveValidator, validateRequest, adminController.rejectLeave);

export default router;
