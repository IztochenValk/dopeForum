// server/routes/userRoutes.js
import express from 'express';
import { registerUser, authUser, uploadAvatar } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);

export default router;
