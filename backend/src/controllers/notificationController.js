const Notification = require('../models/Notification');
const Doubt = require('../models/Doubt');

// === NOTIFICATIONS ===
exports.createNotification = async (req, res) => {
  const notification = await Notification.create({ ...req.body, sentBy: req.user.id, sentAt: new Date(), status: 'sent' });
  res.status(201).json({ success: true, notification });
};

exports.getNotifications = async (req, res) => {
  const notifications = await Notification.find()
    .populate('sentBy', 'name').sort('-createdAt').limit(50);
  res.json({ success: true, notifications });
};

exports.getMyNotifications = async (req, res) => {
  const notifications = await Notification.find({
    $or: [
      { 'recipients.all': true },
      { 'recipients.roles': req.user.role },
      { 'recipients.users': req.user.id },
      { 'recipients.batches': { $in: req.user.enrolledBatches || [] } },
    ]
  }).sort('-createdAt').limit(30);

  const unread = notifications.filter(n => !n.readBy.includes(req.user.id));
  res.json({ success: true, notifications, unreadCount: unread.length });
};

exports.markAsRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { $addToSet: { readBy: req.user.id } });
  res.json({ success: true });
};

exports.deleteNotification = async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Notification deleted' });
};

// === DOUBTS ===
exports.createDoubt = async (req, res) => {
  const doubt = await Doubt.create({ ...req.body, student: req.user.id });
  res.status(201).json({ success: true, doubt });
};

exports.getMyDoubts = async (req, res) => {
  const doubts = await Doubt.find({ student: req.user.id })
    .populate('assignedTo', 'name').sort('-createdAt');
  res.json({ success: true, doubts });
};

exports.getAllDoubts = async (req, res) => {
  const { status, subject } = req.query;
  const query = {};
  if (status) query.status = status;
  if (subject) query.subject = subject;
  const doubts = await Doubt.find(query)
    .populate('student', 'name studentId')
    .populate('assignedTo', 'name').sort('-createdAt');
  res.json({ success: true, doubts });
};

exports.replyToDoubt = async (req, res) => {
  const doubt = await Doubt.findById(req.params.id);
  if (!doubt) return res.status(404).json({ success: false, message: 'Doubt not found' });
  doubt.replies.push({ user: req.user.id, message: req.body.message });
  if (req.user.role !== 'student') doubt.status = 'in-progress';
  await doubt.save();
  const updated = await Doubt.findById(req.params.id)
    .populate('replies.user', 'name role avatar');
  res.json({ success: true, doubt: updated });
};

exports.updateDoubtStatus = async (req, res) => {
  const doubt = await Doubt.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, assignedTo: req.body.assignedTo, resolvedAt: req.body.status === 'resolved' ? new Date() : undefined },
    { new: true }
  );
  res.json({ success: true, doubt });
};
