import express from 'express';
import {
  createChapter,
  updateChapter,
  deleteChapter,
} from '../controllers/chapters.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected administrative CRUD
router.post('/', requireAuth, createChapter);
router.put('/:id', requireAuth, updateChapter);
router.delete('/:id', requireAuth, deleteChapter);

export default router;

