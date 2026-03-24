const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  topic: String,
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: String,
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  replies: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    image: String,
    createdAt: { type: Date, default: Date.now },
  }],
  resolvedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Doubt', doubtSchema);
