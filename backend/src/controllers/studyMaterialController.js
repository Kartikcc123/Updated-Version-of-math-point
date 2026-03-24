const StudyMaterial = require('../models/StudyMaterial');
const path = require('path');
const fs = require('fs');

exports.getAllMaterials = async (req, res) => {
  const { subject, type, course, batch } = req.query;
  const query = {};
  if (subject) query.subject = subject;
  if (type) query.type = type;
  if (course) query.course = course;
  const materials = await StudyMaterial.find(query)
    .populate('uploadedBy', 'name').sort('-createdAt');
  res.json({ success: true, materials });
};

exports.getMyMaterials = async (req, res) => {
  const user = req.user;
  const materials = await StudyMaterial.find({
    $or: [
      { batch: { $in: user.enrolledBatches } },
      { isPublic: true }
    ]
  }).populate('uploadedBy', 'name').sort('-createdAt');
  res.json({ success: true, materials });
};

exports.uploadMaterial = async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ success: false, message: 'Please upload a file' });
  }
  const file = req.files.file;
  const uploadDir = path.join(__dirname, '../../uploads/materials');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
  const filePath = path.join(uploadDir, fileName);
  await file.mv(filePath);

  const material = await StudyMaterial.create({
    ...req.body,
    fileUrl: `/uploads/materials/${fileName}`,
    fileName: file.name,
    fileSize: file.size,
    uploadedBy: req.user.id,
  });
  res.status(201).json({ success: true, material });
};

exports.deleteMaterial = async (req, res) => {
  const material = await StudyMaterial.findById(req.params.id);
  if (!material) return res.status(404).json({ success: false, message: 'Material not found' });
  // Remove file
  const filePath = path.join(__dirname, '../..', material.fileUrl);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  await material.deleteOne();
  res.json({ success: true, message: 'Material deleted' });
};

exports.downloadMaterial = async (req, res) => {
  const material = await StudyMaterial.findById(req.params.id);
  if (!material) return res.status(404).json({ success: false, message: 'Not found' });
  material.downloads += 1;
  await material.save();
  const filePath = path.join(__dirname, '../..', material.fileUrl);
  res.download(filePath, material.fileName);
};
