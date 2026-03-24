const { Test, TestResult } = require('../models/Test');

exports.getAllTests = async (req, res) => {
  const { batch, type, subject } = req.query;
  const query = {};
  if (batch) query.batch = batch;
  if (type) query.type = type;
  if (subject) query.subject = subject;
  const tests = await Test.find(query).populate('course', 'name').populate('batch', 'name').sort('-scheduledDate');
  res.json({ success: true, tests });
};

exports.getMyTests = async (req, res) => {
  const user = req.user;
  const tests = await Test.find({
    $or: [{ batch: { $in: user.enrolledBatches } }, { isPublished: true }],
    isPublished: true,
  }).sort('-scheduledDate')

  const results = await TestResult.find({ student: user.id })
  const resultMap = {}
  results.forEach(r => { resultMap[r.test.toString()] = r })

  const testsWithStatus = tests.map(t => {
    const obj = t.toObject()
    // Remove questions and correct answers from listing
    delete obj.questions
    return { ...obj, myResult: resultMap[t._id.toString()] || null }
  })
  res.json({ success: true, tests: testsWithStatus })
};

exports.getTestById = async (req, res) => {
  const test = await Test.findById(req.params.id).populate('createdBy', 'name')
  if (!test) return res.status(404).json({ success: false, message: 'Test not found' })
  // Strip correct answers and explanations for students
  if (req.user?.role === 'student') {
    const safeTest = test.toObject()
    safeTest.questions = safeTest.questions.map(({ correctAnswer, explanation, ...rest }) => rest)
    return res.json({ success: true, test: safeTest })
  }
  res.json({ success: true, test })
};

exports.createTest = async (req, res) => {
  const test = await Test.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json({ success: true, test });
};

exports.updateTest = async (req, res) => {
  const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, test });
};

exports.deleteTest = async (req, res) => {
  await Test.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Test deleted' });
};

exports.startTest = async (req, res) => {
  const test = await Test.findById(req.params.id);
  if (!test || !test.isPublished) return res.status(404).json({ success: false, message: 'Test not available' });

  const existing = await TestResult.findOne({ test: req.params.id, student: req.user.id, status: 'ongoing' });
  if (existing) {
    // Return test without answers
    const safeTest = test.toObject();
    safeTest.questions = safeTest.questions.map(({ correctAnswer, explanation, ...rest }) => rest);
    return res.json({ success: true, result: existing, test: safeTest });
  }

  const attemptCount = await TestResult.countDocuments({ test: req.params.id, student: req.user.id });
  if (attemptCount >= test.allowedAttempts) {
    return res.status(400).json({ success: false, message: 'Maximum attempts reached' });
  }

  const result = await TestResult.create({
    test: req.params.id, student: req.user.id,
    startedAt: new Date(), status: 'ongoing',
  });

  const safeTest = test.toObject();
  safeTest.questions = safeTest.questions.map(({ correctAnswer, explanation, ...rest }) => rest);
  res.json({ success: true, result, test: safeTest });
};

exports.submitTest = async (req, res) => {
  const { answers } = req.body;
  const test = await Test.findById(req.params.id);
  const result = await TestResult.findOne({ test: req.params.id, student: req.user.id, status: 'ongoing' });
  if (!result) return res.status(404).json({ success: false, message: 'No ongoing attempt found' });

  let obtainedMarks = 0;
  const evaluatedAnswers = [];
  const subjectWise = {};

  test.questions.forEach((q, idx) => {
    const ans = answers.find(a => a.questionId === q._id.toString());
    const subj = q.subject || 'General';
    if (!subjectWise[subj]) subjectWise[subj] = { subject: subj, totalQ: 0, attempted: 0, correct: 0, incorrect: 0, marks: 0 };
    subjectWise[subj].totalQ++;

    let isCorrect = false, marks = 0;
    if (ans?.answer !== undefined && ans?.answer !== null && ans?.answer !== '') {
      subjectWise[subj].attempted++;
      if (q.type === 'mcq') isCorrect = ans.answer === q.correctAnswer;
      else if (q.type === 'numerical') isCorrect = Math.abs(+ans.answer - +q.correctAnswer) < 0.01;
      marks = isCorrect ? q.marks : -q.negativeMarks;
      if (isCorrect) subjectWise[subj].correct++;
      else subjectWise[subj].incorrect++;
      subjectWise[subj].marks += marks;
    }
    obtainedMarks += marks;
    evaluatedAnswers.push({ questionId: q._id, answer: ans?.answer, isCorrect, marksObtained: marks });
  });

  result.answers = evaluatedAnswers;
  result.obtainedMarks = Math.max(0, obtainedMarks);
  result.totalMarks = test.questions.reduce((s, q) => s + q.marks, 0);
  result.percentage = Math.round((result.obtainedMarks / result.totalMarks) * 100);
  result.submittedAt = new Date();
  result.timeTaken = Math.round((result.submittedAt - result.startedAt) / 60000);
  result.status = 'submitted';
  result.subjectWise = Object.values(subjectWise);
  await result.save();

  // Calculate rank
  const allResults = await TestResult.find({ test: req.params.id, status: 'submitted' }).sort('-obtainedMarks');
  const rank = allResults.findIndex(r => r._id.toString() === result._id.toString()) + 1;
  result.rank = rank;
  await result.save();

  res.json({ success: true, result });
};

exports.getTestResults = async (req, res) => {
  const results = await TestResult.find({ test: req.params.id })
    .populate('student', 'name studentId').sort('-obtainedMarks');
  res.json({ success: true, results });
};

exports.getMyTestResult = async (req, res) => {
  const result = await TestResult.findOne({ test: req.params.id, student: req.user.id, status: 'submitted' })
    .populate('test');
  if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
  res.json({ success: true, result });
};
