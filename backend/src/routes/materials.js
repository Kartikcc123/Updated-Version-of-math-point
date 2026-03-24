// materials.js
const express = require('express');
const router = express.Router();
const c = require('../controllers/studyMaterialController');
const { protect, authorize } = require('../middleware/auth');
router.use(protect);
router.get('/my', c.getMyMaterials);
router.get('/', authorize('admin', 'superadmin', 'teacher'), c.getAllMaterials);
router.post('/', authorize('admin', 'superadmin', 'teacher'), c.uploadMaterial);
router.delete('/:id', authorize('admin', 'superadmin', 'teacher'), c.deleteMaterial);
router.get('/:id/download', c.downloadMaterial);
module.exports = router;
