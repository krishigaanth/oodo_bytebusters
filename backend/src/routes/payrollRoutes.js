import { Router } from 'express';
import { payrollController } from '../controllers/payrollController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

// Employee read-only payroll summary
router.get('/summary', payrollController.getPayrollSummary);
router.get('/me', payrollController.getPayrollSummary);

// Specific payslip item
router.get('/payslips/:payslipId', payrollController.getPayslip);

export default router;
