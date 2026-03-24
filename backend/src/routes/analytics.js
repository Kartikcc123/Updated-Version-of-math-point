const express = require('express');
const router = express.Router();
const c = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');
router.use(protect);
router.get('/admin', authorize('admin', 'superadmin'), c.getAdminDashboard);
router.get('/student', authorize('student'), c.getStudentDashboard);
module.exports = router;
