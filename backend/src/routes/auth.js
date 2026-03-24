// routes/auth.js
const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/me', protect, auth.getMe);
router.put('/profile', protect, auth.updateProfile);
router.put('/change-password', protect, auth.changePassword);
router.post('/logout', protect, auth.logout);

module.exports = router;
