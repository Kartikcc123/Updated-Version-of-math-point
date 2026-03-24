const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['announcement', 'fee', 'attendance', 'exam', 'result', 'general', 'alert'], default: 'general' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  recipients: {
    all: { type: Boolean, default: false },
    roles: [String],
    batches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  channels: {
    inApp: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    whatsapp: { type: Boolean, default: false },
  },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  scheduledAt: Date,
  sentAt: Date,
  status: { type: String, enum: ['draft', 'scheduled', 'sent'], default: 'draft' },
  attachment: String,
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
