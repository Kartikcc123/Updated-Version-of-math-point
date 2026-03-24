const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true },
  phone: { type: String, required: [true, 'Phone is required'] },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  role: { type: String, enum: ['superadmin', 'admin', 'teacher', 'student'], default: 'student' },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  permissions: [{
    type: String,
    enum: [
      'manage_students', 'manage_teachers', 'manage_courses',
      'manage_fees', 'manage_attendance', 'manage_tests',
      'manage_study_material', 'view_analytics', 'send_notifications',
      'manage_roles'
    ]
  }],
  // Student specific
  studentId: { type: String, unique: true, sparse: true },
  parentName: String,
  parentPhone: String,
  address: String,
  dateOfBirth: Date,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  board: String,
  school: String,
  targetExam: [{ type: String, enum: ['JEE', 'NEET'] }],
  enrolledBatches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
  joiningDate: { type: Date, default: Date.now },
  // Teacher specific
  teacherId: { type: String, unique: true, sparse: true },
  qualification: String,
  subjects: [String],
  experience: Number,
  salary: Number,
  // Notifications
  notificationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    whatsapp: { type: Boolean, default: false }
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: Date,
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model('User', userSchema);
