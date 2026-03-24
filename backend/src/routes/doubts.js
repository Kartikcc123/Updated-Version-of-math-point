const express = require('express');
const router = express.Router();
const c = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/my', c.getMyDoubts);
router.get('/', authorize('admin', 'superadmin', 'teacher'), c.getAllDoubts);
router.post('/', c.createDoubt);
router.post('/:id/reply', c.replyToDoubt);
router.put('/:id/status', authorize('admin', 'superadmin', 'teacher'), c.updateDoubtStatus);

module.exports = router;
