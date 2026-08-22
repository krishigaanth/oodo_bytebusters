import { Router } from 'express';
import { attendanceController } from '../controllers/attendanceController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validatorMiddleware.js';
import { attendanceFilterValidator } from '../validators/attendanceValidators.js';

const router = Router();

router.use(authenticate);

// Today status
router.get('/today', attendanceController.getTodayStatus);
router.get('/me/today', attendanceController.getTodayStatus);

// Check-in and check-out
router.post('/check-in', attendanceController.checkIn);
router.post('/check-out', attendanceController.checkOut);

// Summary metrics
router.get('/summary', attendanceController.getAttendanceSummary);
router.get('/me/summary', attendanceController.getAttendanceSummary);

// History listing
router.get('/', attendanceFilterValidator, validateRequest, attendanceController.getAttendance);
router.get('/me', attendanceFilterValidator, validateRequest, attendanceController.getAttendance);

export default router;
