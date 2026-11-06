import { SeriesModel } from '../models/series.model.js';
import { ChapterModel } from '../models/chapter.model.js';
import { query } from '../config/db.js';

/**
 * Series Controller
 */

export async function getAllSeries(req, res) {
  try {
    const rows = await SeriesModel.findAll();
    return res.json(rows);
  } catch (err) {
    console.error('[Series getAll Error]', err);
    return res.status(500).json({ error: 'Failed to retrieve archival series.' });
  }
}

export async function getSeriesBySlug(req, res) {
  try {
    const { slug } = req.params;
    const series = await SeriesModel.findBySlug(slug);

    if (!series) {
      return res.status(404).json({ error: 'Series not found in archive.' });
    }

    const chapters = await ChapterModel.findBySeriesId(series.id);

    return res.json({
      ...series,
      chapters,
    });
  } catch (err) {
    console.error('[Series getBySlug Error]', err);
    return res.status(500).json({ error: 'Failed to retrieve series details.' });
  }
}

export async function createSeries(req, res) {
  try {
    const { title, slug, description, cover_image, status = 'published' } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ error: 'Title and slug are required.' });
    }

    const newSeries = await SeriesModel.create({
      title,
      slug,
      description,
      cover_image,
      status,
    });

    // Auto-create 5 archival chapters for any newly created series
    const cleanTitle = title.replace(/SERIES \d+\s*[-–—]\s*/i, '');
    const cover = cover_image || '/assets/photos/series-01-tshirt.webp';
    const defaultTemplates = [
      {
        number: '01',
        title: `The Inception`,
        slug: `${slug}-the-inception`,
        story: `Every era begins in silence. For ${cleanTitle}, the inquiry began with an uncompromising pursuit of quiet presence and intentional silhouette.`,
        sort_order: 1,
      },
      {
        number: '02',
        title: `The Form & Silhouette`,
        slug: `${slug}-the-form`,
        story: `Grounded composure. A garment engineered to shelter against external clamor while delivering unconstrained anatomical grace.`,
        sort_order: 2,
      },
      {
        number: '03',
        title: `The Craft`,
        slug: `${slug}-the-craft`,
        story: `Concealed seam architecture and artisanal finishing. Hand-calibrated proportions that speak without shouting.`,
        sort_order: 3,
      },
      {
        number: '04',
        title: `The Poise`,
        slug: `${slug}-the-poise`,
        story: `Holding center amidst chaos. The tactile weight provides a psychological sanctuary for the wearer.`,
        sort_order: 4,
      },
      {
        number: '05',
        title: `The Continuity`,
        slug: `${slug}-the-continuity`,
        story: `The enduring legacy of quiet strength. Garments made to outlive passing trends and accompany you through every silent victory.`,
        sort_order: 5,
      },
    ];

    for (const t of defaultTemplates) {
      await query(
        'INSERT INTO chapters (series_id, number, title, slug, story, hero_image, status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [newSeries.id, t.number, t.title, t.slug, t.story, cover, 'published', t.sort_order]
      );
    }

    return res.status(201).json({
      message: 'Series archived successfully.',
      id: newSeries.id,
      series: {
        ...newSeries,
        chapters_count: 5,
      },
    });
  } catch (err) {
    console.error('[Series Create Error]', err);
    return res.status(500).json({ error: 'Failed to archive series.' });
  }
}

export async function updateSeries(req, res) {
  try {
    const { id } = req.params;
    const { title, slug, description, cover_image, status } = req.body;

    await SeriesModel.update(id, { title, slug, description, cover_image, status });

    return res.json({ message: 'Series updated successfully.' });
  } catch (err) {
    console.error('[Series Update Error]', err);
    return res.status(500).json({ error: 'Failed to update series.' });
  }
}

export async function deleteSeries(req, res) {
  try {
    const { id } = req.params;
    await SeriesModel.delete(id);
    return res.json({ message: 'Series removed from archive.' });
  } catch (err) {
    console.error('[Series Delete Error]', err);
    return res.status(500).json({ error: 'Failed to delete series.' });
  }
}
