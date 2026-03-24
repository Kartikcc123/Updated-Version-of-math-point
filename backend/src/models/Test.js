const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, enum: ['mcq', 'numerical', 'subjective'], default: 'mcq' },
  options: [String],
  correctAnswer: mongoose.Schema.Types.Mixed,
  marks: { type: Number, default: 4 },
  negativeMarks: { type: Number, default: 1 },
  subject: String,
  topic: String,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  explanation: String,
  image: String,
});

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  batch: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
  type: { type: String, enum: ['chapter', 'unit', 'full-length', 'mock', 'revision'], default: 'chapter' },
  subject: String,
  topics: [String],
  questions: [questionSchema],
  totalMarks: Number,
  duration: { type: Number, default: 180 }, // minutes
  scheduledDate: Date,
  startTime: String,
  endTime: String,
  instructions: [String],
  isPublished: { type: Boolean, default: false },
  allowedAttempts: { type: Number, default: 1 },
  showResult: { type: Boolean, default: true },
  showAnswers: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const testResultSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    answer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    marksObtained: Number,
    timeSpent: Number,
  }],
  totalMarks: Number,
  obtainedMarks: Number,
  percentage: Number,
  rank: Number,
  startedAt: Date,
  submittedAt: Date,
  timeTaken: Number,
  status: { type: String, enum: ['ongoing', 'submitted', 'evaluated'], default: 'ongoing' },
  subjectWise: [{
    subject: String,
    totalQ: Number,
    attempted: Number,
    correct: Number,
    incorrect: Number,
    marks: Number,
  }],
}, { timestamps: true });

const Test = mongoose.model('Test', testSchema);
const TestResult = mongoose.model('TestResult', testResultSchema);

module.exports = { Test, TestResult };
