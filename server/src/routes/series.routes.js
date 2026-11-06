import express from 'express';
import {
  getAllSeries,
  getSeriesBySlug,
  createSeries,
  updateSeries,
  deleteSeries,
} from '../controllers/series.controller.js';
import { getChaptersBySeries, getChapterBySlug } from '../controllers/chapters.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllSeries);
router.get('/:slug', getSeriesBySlug);
router.get('/:seriesSlug/chapters', getChaptersBySeries);
router.get('/:seriesSlug/chapters/:chapterSlug', getChapterBySlug);

// Protected administrative routes
router.post('/', requireAuth, createSeries);
router.put('/:id', requireAuth, updateSeries);
router.delete('/:id', requireAuth, deleteSeries);

export default router;

