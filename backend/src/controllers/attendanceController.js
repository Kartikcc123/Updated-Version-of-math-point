const Attendance = require('../models/Attendance');

exports.markAttendance = async (req, res) => {
  const { batch, date, records, subject, topic } = req.body;
  let attendance = await Attendance.findOne({ batch, date: new Date(date) });
  if (attendance) {
    attendance.records = records;
    attendance.subject = subject;
    attendance.topic = topic;
    attendance.markedBy = req.user.id;
  } else {
    attendance = new Attendance({ batch, date, records, subject, topic, markedBy: req.user.id });
  }
  await attendance.save();
  res.json({ success: true, attendance, message: 'Attendance saved' });
};

exports.getBatchAttendance = async (req, res) => {
  const { batch, startDate, endDate } = req.query;
  const query = { batch };
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  const attendance = await Attendance.find(query)
    .populate('records.student', 'name studentId').sort('-date');
  res.json({ success: true, attendance });
};

exports.getMyAttendance = async (req, res) => {
  const { startDate, endDate } = req.query;
  const query = {};
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  const allRecords = await Attendance.find(query).sort('-date');
  const myRecords = allRecords.filter(a =>
    a.records.some(r => r.student.toString() === req.user.id.toString())
  ).map(a => {
    const myRecord = a.records.find(r => r.student.toString() === req.user.id.toString());
    return { date: a.date, subject: a.subject, status: myRecord?.status, batch: a.batch };
  });

  const present = myRecords.filter(r => r.status === 'present').length;
  res.json({ success: true, records: myRecords, stats: {
    total: myRecords.length, present, absent: myRecords.length - present,
    percentage: myRecords.length ? Math.round((present / myRecords.length) * 100) : 0,
  }});
};

exports.getAttendanceReport = async (req, res) => {
  const { batchId } = req.params;
  const records = await Attendance.find({ batch: batchId }).populate('records.student', 'name studentId');
  const studentStats = {};
  records.forEach(a => {
    a.records.forEach(r => {
      const sid = r.student._id.toString();
      if (!studentStats[sid]) studentStats[sid] = { student: r.student, present: 0, absent: 0, late: 0, total: 0 };
      studentStats[sid].total++;
      studentStats[sid][r.status === 'present' ? 'present' : r.status === 'late' ? 'late' : 'absent']++;
    });
  });
  const report = Object.values(studentStats).map(s => ({
    ...s, percentage: Math.round((s.present / s.total) * 100)
  }));
  res.json({ success: true, report });
};
