const User = require('../models/User');
const Fee = require('../models/Fee');
const Attendance = require('../models/Attendance');
const { Test, TestResult } = require('../models/Test');
const { Course, Batch } = require('../models/Course');
const Doubt = require('../models/Doubt');
const Notification = require('../models/Notification');

exports.getAdminDashboard = async (req, res) => {
  const [
    totalStudents, totalTeachers, totalBatches, totalCourses,
    feeStats, recentStudents, openDoubts,
    monthlyFees, testStats
  ] = await Promise.all([
    User.countDocuments({ role: 'student', isActive: true }),
    User.countDocuments({ role: 'teacher', isActive: true }),
    Batch.countDocuments({ isActive: true }),
    Course.countDocuments({ isActive: true }),
    Fee.aggregate([
      { $group: { _id: null, collected: { $sum: '$paidAmount' }, pending: { $sum: '$dueAmount' } } }
    ]),
    User.find({ role: 'student' }).sort('-createdAt').limit(5).select('name studentId targetExam createdAt'),
    Doubt.countDocuments({ status: 'open' }),
    Fee.aggregate([
      {
        $group: {
          _id: { month: '$month', year: '$year' },
          collected: { $sum: '$paidAmount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]),
    TestResult.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$percentage' }, totalAttempts: { $sum: 1 } } }
    ]),
  ]);

  // Attendance average
  const allAttendance = await Attendance.find().limit(100);
  let totalPresent = 0, totalRecords = 0;
  allAttendance.forEach(a => {
    a.records.forEach(r => {
      totalRecords++;
      if (r.status === 'present') totalPresent++;
    });
  });
  const avgAttendance = totalRecords ? Math.round((totalPresent / totalRecords) * 100) : 0;

  // Students by target exam
  const jeeCount = await User.countDocuments({ role: 'student', targetExam: 'JEE' });
  const neetCount = await User.countDocuments({ role: 'student', targetExam: 'NEET' });

  res.json({
    success: true,
    stats: {
      totalStudents, totalTeachers, totalBatches, totalCourses,
      totalCollected: feeStats[0]?.collected || 0,
      totalPending: feeStats[0]?.pending || 0,
      openDoubts, avgAttendance,
      avgTestScore: Math.round(testStats[0]?.avgScore || 0),
      jeeStudents: jeeCount, neetStudents: neetCount,
    },
    recentStudents,
    monthlyFees: monthlyFees.reverse(),
  });
};

exports.getStudentDashboard = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId).populate('enrolledBatches');

  const [fees, attendance, testResults, notifications] = await Promise.all([
    Fee.find({ student: userId }).sort('-createdAt').limit(3),
    Attendance.find({ 'records.student': userId }).sort('-date').limit(30),
    TestResult.find({ student: userId, status: 'submitted' }).populate('test', 'title type subject').sort('-submittedAt').limit(5),
    Notification.find({
      $or: [
        { 'recipients.all': true },
        { 'recipients.roles': 'student' },
        { 'recipients.users': userId },
      ]
    }).sort('-createdAt').limit(5),
  ]);

  let present = 0;
  const attendanceRecords = attendance.map(a => {
    const r = a.records.find(rec => rec.student.toString() === userId.toString());
    if (r?.status === 'present') present++;
    return { date: a.date, status: r?.status };
  });

  const totalDue = fees.reduce((s, f) => s + (f.dueAmount || 0), 0);
  const avgScore = testResults.length
    ? Math.round(testResults.reduce((s, r) => s + r.percentage, 0) / testResults.length) : 0;

  res.json({
    success: true,
    stats: {
      attendancePercentage: attendance.length ? Math.round((present / attendance.length) * 100) : 0,
      totalDueFees: totalDue,
      avgTestScore: avgScore,
      enrolledBatches: user.enrolledBatches?.length || 0,
    },
    recentFees: fees,
    recentResults: testResults,
    notifications,
    attendanceRecords,
  });
};
