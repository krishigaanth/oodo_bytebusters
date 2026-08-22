import { Router } from 'express';
import { employeeController } from '../controllers/employeeController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validatorMiddleware.js';
import { updateProfileValidator } from '../validators/employeeValidators.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

// Protect all employee routes with JWT authentication
router.use(authenticate);

// Self-service identity-derived endpoints
router.get('/me', employeeController.getProfile);
router.put('/me', updateProfileValidator, validateRequest, employeeController.updateProfile);
router.get('/me/security', employeeController.getSecurityInfo);
router.post('/me/profile-picture', upload.single('file'), employeeController.uploadProfilePicture);

// Dual-route compatibility matching frontend legacy path: /api/v1/employees/:employeeId/profile
router.get('/:employeeId/profile', employeeController.getProfile);
router.put('/:employeeId/profile', updateProfileValidator, validateRequest, employeeController.updateProfile);

export default router;
