const express = require('express');
const router = express.Router();
const c = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', authorize('admin', 'superadmin', 'teacher'), c.getAllStudents);
router.post('/', authorize('admin', 'superadmin'), c.createStudent);
router.get('/:id', authorize('admin', 'superadmin', 'teacher'), c.getStudentById);
router.put('/:id', authorize('admin', 'superadmin'), c.updateStudent);
router.delete('/:id', authorize('admin', 'superadmin'), c.deleteStudent);
router.get('/:id/stats', c.getStudentStats);

module.exports = router;
