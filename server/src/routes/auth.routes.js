import express from 'express';
import { login, getProfile } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public login route
router.post('/login', login);

// Protected admin profile check
router.get('/me', requireAuth, getProfile);

export default router;

