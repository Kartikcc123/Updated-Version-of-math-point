// courses.js
const express = require('express');
const router = express.Router();
const c = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', c.getAllCourses);
router.get('/batches', c.getAllBatches);

// Protected routes
router.use(protect);
router.post('/', authorize('admin', 'superadmin'), c.createCourse);
router.put('/:id', authorize('admin', 'superadmin'), c.updateCourse);
router.delete('/:id', authorize('admin', 'superadmin'), c.deleteCourse);

// Batch protected routes
router.post('/batches', authorize('admin', 'superadmin'), c.createBatch);
router.get('/batches/:id', c.getBatchById);
router.put('/batches/:id', authorize('admin', 'superadmin'), c.updateBatch);
router.post('/batches/:id/enroll', authorize('admin', 'superadmin'), c.enrollStudent);
router.post('/batches/:id/remove', authorize('admin', 'superadmin'), c.removeStudent);

module.exports = router;
