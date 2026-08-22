import { Router } from 'express';
import { leaveController } from '../controllers/leaveController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validatorMiddleware.js';
import { applyLeaveValidator } from '../validators/leaveValidators.js';

const router = Router();

router.use(authenticate);

// Leave balances
router.get('/balances', leaveController.getBalances);
router.get('/me/balance', leaveController.getBalances);

// Leave requests history
router.get('/requests', leaveController.getRequests);
router.get('/me', leaveController.getRequests);
router.get('/', leaveController.getRequests);

// Apply leave
router.post('/apply', applyLeaveValidator, validateRequest, leaveController.applyLeave);
router.post('/', applyLeaveValidator, validateRequest, leaveController.applyLeave);

// Cancel leave
router.put('/:id/cancel', leaveController.cancelLeave);

export default router;
