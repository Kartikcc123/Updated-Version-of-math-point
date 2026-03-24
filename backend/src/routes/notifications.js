const express = require('express');
const router = express.Router();
const c = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Specific routes BEFORE parameterized routes to avoid conflicts
router.get('/my', c.getMyNotifications);
router.get('/', authorize('admin', 'superadmin'), c.getNotifications);
router.post('/', authorize('admin', 'superadmin'), c.createNotification);
router.put('/:id/read', c.markAsRead);
router.delete('/:id', authorize('admin', 'superadmin'), c.deleteNotification);

module.exports = router;
