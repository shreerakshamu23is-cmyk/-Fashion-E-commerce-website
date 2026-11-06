import express from 'express';
import { upload } from '../middleware/upload.middleware.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  uploadSingle,
  uploadMultiple,
  listImages,
} from '../controllers/upload.controller.js';

const router = express.Router();

// List all uploaded media (protected)
router.get('/', requireAuth, listImages);

// Upload single image (protected)
router.post('/single', requireAuth, upload.single('image'), uploadSingle);

// Upload multiple images (protected)
router.post('/multiple', requireAuth, upload.array('images', 8), uploadMultiple);

export default router;

