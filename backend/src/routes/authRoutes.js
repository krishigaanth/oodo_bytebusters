import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validatorMiddleware.js';
import { loginValidator, changePasswordValidator } from '../validators/authValidators.js';

const router = Router();

// Public auth
router.post('/login', loginValidator, validateRequest, authController.login);

// Protected auth
router.get('/me', authenticate, authController.getCurrentUser);
router.post('/change-password', authenticate, changePasswordValidator, validateRequest, authController.changePassword);
router.post('/logout', authenticate, authController.logout);

export default router;
