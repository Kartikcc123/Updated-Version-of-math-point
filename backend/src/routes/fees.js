// fees.js
const express = require('express');
const router = express.Router();
const c = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/auth');
router.use(protect);
router.get('/my', c.getMyFees);
router.get('/stats', authorize('admin', 'superadmin'), c.getFeeStats);
router.get('/', authorize('admin', 'superadmin'), c.getAllFees);
router.post('/', authorize('admin', 'superadmin'), c.createFee);
router.put('/:id/pay', authorize('admin', 'superadmin'), c.collectPayment);
router.delete('/:id', authorize('admin', 'superadmin'), c.deleteFee);
module.exports = router;
