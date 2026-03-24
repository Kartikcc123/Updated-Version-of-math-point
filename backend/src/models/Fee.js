const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number },
  dueDate: Date,
  status: { type: String, enum: ['paid', 'partial', 'pending', 'overdue'], default: 'pending' },
  payments: [{
    amount: Number,
    date: { type: Date, default: Date.now },
    method: { type: String, enum: ['cash', 'online', 'cheque', 'upi', 'card'] },
    transactionId: String,
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receipt: String,
    notes: String,
  }],
  discount: { type: Number, default: 0 },
  discountReason: String,
  feeType: { type: String, enum: ['monthly', 'quarterly', 'half-yearly', 'yearly', 'one-time'], default: 'monthly' },
  month: String,
  year: Number,
}, { timestamps: true });

feeSchema.pre('save', function(next) {
  this.dueAmount = this.totalAmount - this.paidAmount - this.discount;
  if (this.paidAmount >= this.totalAmount) this.status = 'paid';
  else if (this.paidAmount > 0) this.status = 'partial';
  else if (this.dueDate && new Date() > this.dueDate) this.status = 'overdue';
  else this.status = 'pending';
  next();
});

module.exports = mongoose.model('Fee', feeSchema);
