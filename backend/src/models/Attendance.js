const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
  date: { type: Date, required: true },
  subject: String,
  topic: String,
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  records: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['present', 'absent', 'late', 'leave'], default: 'absent' },
    remark: String,
  }],
}, { timestamps: true });

attendanceSchema.index({ batch: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
