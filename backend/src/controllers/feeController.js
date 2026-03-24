const Fee = require('../models/Fee');
const User = require('../models/User');

exports.getAllFees = async (req, res) => {
  const { student, status, month, year, page = 1, limit = 20 } = req.query;
  const query = {};
  if (student) query.student = student;
  if (status) query.status = status;
  if (month) query.month = month;
  if (year) query.year = +year;

  const fees = await Fee.find(query)
    .populate('student', 'name studentId phone')
    .populate('batch', 'name')
    .populate('course', 'name')
    .skip((page - 1) * limit).limit(+limit).sort('-createdAt');
  const total = await Fee.countDocuments(query);
  res.json({ success: true, fees, total });
};

exports.getMyFees = async (req, res) => {
  const fees = await Fee.find({ student: req.user.id })
    .populate('batch', 'name').populate('course', 'name').sort('-createdAt');
  res.json({ success: true, fees });
};

exports.createFee = async (req, res) => {
  const fee = await Fee.create(req.body);
  res.status(201).json({ success: true, fee });
};

exports.collectPayment = async (req, res) => {
  const { amount, method, transactionId, notes } = req.body;
  const fee = await Fee.findById(req.params.id);
  if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found' });

  fee.payments.push({ amount, method, transactionId, notes, receivedBy: req.user.id });
  fee.paidAmount += amount;
  await fee.save();
  res.json({ success: true, fee, message: 'Payment recorded successfully' });
};

exports.getFeeStats = async (req, res) => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const [totalCollected, totalPending, overdueCount, monthlyCollection] = await Promise.all([
    Fee.aggregate([{ $group: { _id: null, total: { $sum: '$paidAmount' } } }]),
    Fee.aggregate([{ $match: { status: { $in: ['pending', 'overdue'] } } }, { $group: { _id: null, total: { $sum: '$dueAmount' } } }]),
    Fee.countDocuments({ status: 'overdue' }),
    Fee.aggregate([
      { $match: { year, month: month.toString() } },
      { $group: { _id: null, collected: { $sum: '$paidAmount' }, total: { $sum: '$totalAmount' } } }
    ]),
  ]);

  res.json({ success: true, stats: {
    totalCollected: totalCollected[0]?.total || 0,
    totalPending: totalPending[0]?.total || 0,
    overdueCount,
    monthlyCollected: monthlyCollection[0]?.collected || 0,
    monthlyTotal: monthlyCollection[0]?.total || 0,
  }});
};

exports.deleteFee = async (req, res) => {
  await Fee.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Fee record deleted' });
};
