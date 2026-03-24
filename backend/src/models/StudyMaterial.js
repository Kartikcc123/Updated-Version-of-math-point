const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['pdf', 'video', 'notes', 'assignment', 'solution', 'dpp'], default: 'pdf' },
  fileUrl: String,
  fileName: String,
  fileSize: Number,
  subject: { type: String, required: true },
  topic: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  batch: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublic: { type: Boolean, default: false },
  downloads: { type: Number, default: 0 },
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
