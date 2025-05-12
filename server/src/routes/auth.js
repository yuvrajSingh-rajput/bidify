import express from 'express';
import upload from '../utils/multer.js';
import { register, login, getProfile } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', upload.single('teamLogo'), register);
router.post('/login', login);
router.get('/profile', auth, getProfile);

export default router;
