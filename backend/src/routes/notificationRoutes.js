import { Router } from 'express';
import { notificationController } from '../controllers/notificationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

// Get notifications and counts
router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);

// Mark read
router.patch('/:id/read', notificationController.markAsRead);
router.put('/:id/read', notificationController.markAsRead);

// Mark all read
router.post('/mark-all-read', notificationController.markAllAsRead);
router.put('/read-all', notificationController.markAllAsRead);

// Clear notifications
router.delete('/', notificationController.clearAll);

export default router;
