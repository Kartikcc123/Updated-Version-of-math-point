const User = require('../models/User');
const Fee = require('../models/Fee');
const Attendance = require('../models/Attendance');
const { TestResult } = require('../models/Test');

exports.getAllStudents = async (req, res) => {
  const { batch, course, search, page = 1, limit = 20 } = req.query;
  const query = { role: 'student' };
  if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }, { studentId: { $regex: search, $options: 'i' } }];
  if (batch) query.enrolledBatches = batch;

  const students = await User.find(query)
    .populate('enrolledBatches', 'name course')
    .skip((page - 1) * limit).limit(+limit).sort('-createdAt');
  const total = await User.countDocuments(query);
  res.json({ success: true, students, total, pages: Math.ceil(total / limit) });
};

exports.getStudentById = async (req, res) => {
  const student = await User.findById(req.params.id).populate('enrolledBatches');
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  res.json({ success: true, student });
};

exports.createStudent = async (req, res) => {
  const count = await User.countDocuments({ role: 'student' });
  const studentId = `MP-STU-${String(count + 1).padStart(4, '0')}`;
  const student = await User.create({ ...req.body, role: 'student', studentId });
  res.status(201).json({ success: true, student });
};

exports.updateStudent = async (req, res) => {
  const student = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  res.json({ success: true, student });
};

exports.deleteStudent = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Student deactivated' });
};

exports.getStudentStats = async (req, res) => {
  const { id } = req.params;
  const [fees, attendance, results] = await Promise.all([
    Fee.find({ student: id }),
    Attendance.find({ 'records.student': id }),
    TestResult.find({ student: id }).populate('test', 'title totalMarks type'),
  ]);

  const totalPaid = fees.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
  const totalDue = fees.reduce((sum, f) => sum + (f.dueAmount || 0), 0);

  let present = 0, totalClasses = 0;
  attendance.forEach(a => {
    const record = a.records.find(r => r.student && r.student.toString() === id);
    if (record) {
      totalClasses++;
      if (record.status === 'present') present++;
    }
  });

  const avgScore = results.length
    ? results.reduce((s, r) => s + (r.percentage || 0), 0) / results.length : 0;

  res.json({ success: true, stats: {
    fees: { totalPaid, totalDue, totalFees: fees.length },
    attendance: { present, total: totalClasses, percentage: totalClasses ? Math.round((present / totalClasses) * 100) : 0 },
    tests: { total: results.length, avgScore: Math.round(avgScore) },
  }});
};
