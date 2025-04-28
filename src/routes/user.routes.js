const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/verify-email/:token', userController.verifyEmail);
router.post('/resend-verification-email', userController.resendVerificationEmail);
router.post('/logout', authMiddleware.protect, userController.logout);
router.patch('/change-password', authMiddleware.protect, userController.changePassword);

router.use(authMiddleware.protect); 
router.get('/me', authMiddleware.protect, userController.getMyProfile);

module.exports = router;