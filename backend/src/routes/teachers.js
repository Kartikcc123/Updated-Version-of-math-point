const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
router.use(protect);

router.get('/', authorize('admin', 'superadmin'), async (req, res) => {
  const { search } = req.query;
  const query = { role: 'teacher' };
  if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
  const teachers = await User.find(query).sort('-createdAt');
  res.json({ success: true, teachers });
});

router.post('/', authorize('admin', 'superadmin'), async (req, res) => {
  const count = await User.countDocuments({ role: 'teacher' });
  const teacherId = `MP-TCH-${String(count + 1).padStart(4, '0')}`;
  const teacher = await User.create({ ...req.body, role: 'teacher', teacherId });
  res.status(201).json({ success: true, teacher });
});

router.get('/:id', async (req, res) => {
  const teacher = await User.findById(req.params.id);
  if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });
  res.json({ success: true, teacher });
});

router.put('/:id', authorize('admin', 'superadmin'), async (req, res) => {
  const teacher = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, teacher });
});

router.delete('/:id', authorize('admin', 'superadmin'), async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Teacher deactivated' });
});

module.exports = router;
