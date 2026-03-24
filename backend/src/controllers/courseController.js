const { Course, Batch } = require('../models/Course');
const User = require('../models/User');

// === COURSES ===
exports.getAllCourses = async (req, res) => {
  const courses = await Course.find({ isActive: true });
  res.json({ success: true, courses });
};

exports.createCourse = async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json({ success: true, course });
};

exports.updateCourse = async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, course });
};

exports.deleteCourse = async (req, res) => {
  await Course.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Course deactivated' });
};

// === BATCHES ===
exports.getAllBatches = async (req, res) => {
  const { course } = req.query;
  const query = { isActive: true };
  if (course) query.course = course;
  const batches = await Batch.find(query)
    .populate('course', 'name code')
    .populate('teacher', 'name teacherId');
  res.json({ success: true, batches });
};

exports.getBatchById = async (req, res) => {
  const batch = await Batch.findById(req.params.id)
    .populate('course').populate('teacher', 'name email phone')
    .populate('students', 'name studentId email phone');
  if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
  res.json({ success: true, batch });
};

exports.createBatch = async (req, res) => {
  const batch = await Batch.create(req.body);
  res.status(201).json({ success: true, batch });
};

exports.updateBatch = async (req, res) => {
  const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, batch });
};

exports.enrollStudent = async (req, res) => {
  const { studentId } = req.body;
  const batch = await Batch.findById(req.params.id);
  if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
  if (batch.students.includes(studentId)) {
    return res.status(400).json({ success: false, message: 'Student already enrolled' });
  }
  if (batch.students.length >= batch.maxStudents) {
    return res.status(400).json({ success: false, message: 'Batch is full' });
  }
  batch.students.push(studentId);
  await batch.save();
  await User.findByIdAndUpdate(studentId, { $addToSet: { enrolledBatches: batch._id } });
  res.json({ success: true, message: 'Student enrolled successfully' });
};

exports.removeStudent = async (req, res) => {
  const { studentId } = req.body;
  await Batch.findByIdAndUpdate(req.params.id, { $pull: { students: studentId } });
  await User.findByIdAndUpdate(studentId, { $pull: { enrolledBatches: req.params.id } });
  res.json({ success: true, message: 'Student removed from batch' });
};
