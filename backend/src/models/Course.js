const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: String,
  targetExam: [{ type: String, enum: ['JEE', 'NEET'] }],
  duration: String, // e.g., "2 Years"
  subjects: [String],
  fee: { type: Number, required: true },
  features: [String],
  thumbnail: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  schedule: [{
    day: { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
    startTime: String,
    endTime: String,
    subject: String,
  }],
  startDate: Date,
  endDate: Date,
  maxStudents: { type: Number, default: 50 },
  room: String,
  isActive: { type: Boolean, default: true },
  notes: String,
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
const Batch = mongoose.model('Batch', batchSchema);

module.exports = { Course, Batch };
