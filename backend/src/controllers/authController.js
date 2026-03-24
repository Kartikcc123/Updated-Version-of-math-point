const User = require('../models/User');
const crypto = require('crypto');

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };
  user.password = undefined;
  res.status(statusCode).cookie('token', token, options).json({
    success: true, token, user,
  });
};

exports.register = async (req, res) => {
  const { name, email, phone, password, role, ...rest } = req.body;
  // Generate IDs
  const count = await User.countDocuments({ role });
  const prefix = role === 'student' ? 'MP-STU' : role === 'teacher' ? 'MP-TCH' : 'MP-ADM';
  const idField = role === 'student' ? { studentId: `${prefix}-${String(count + 1).padStart(4, '0')}` }
    : role === 'teacher' ? { teacherId: `${prefix}-${String(count + 1).padStart(4, '0')}` } : {};

  const user = await User.create({ name, email, phone, password, role, ...idField, ...rest });
  sendToken(user, 201, res);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide email and password' });

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });
  sendToken(user, 200, res);
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate({ path: 'enrolledBatches', populate: [{ path: 'course', select: 'name code targetExam' }, { path: 'teacher', select: 'name email phone' }] })
  res.json({ success: true, user })
};

exports.updateProfile = async (req, res) => {
  const fields = ['name', 'phone', 'address', 'parentName', 'parentPhone', 'notificationPreferences', 'qualification', 'subjects'];
  const updates = {};
  fields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
  res.json({ success: true, user });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.matchPassword(currentPassword))) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }
  user.password = newPassword;
  await user.save();
  sendToken(user, 200, res);
};

exports.logout = (req, res) => {
  res.cookie('token', 'none', { expires: new Date(Date.now()), httpOnly: true });
  res.json({ success: true, message: 'Logged out' });
};
