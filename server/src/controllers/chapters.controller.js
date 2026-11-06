import { query } from '../config/db.js';

/**
 * Chapters Controller
 */

export async function getChaptersBySeries(req, res) {
  try {
    const { seriesSlug } = req.params;
    const seriesRows = await query('SELECT * FROM series WHERE slug = ?', [seriesSlug]);

    if (!seriesRows || seriesRows.length === 0) {
      return res.status(404).json({ error: 'Series not found.' });
    }

    const seriesItem = seriesRows[0];
    const seriesId = seriesItem.id;
    let chapters = await query(
      'SELECT * FROM chapters WHERE series_id = ? ORDER BY sort_order ASC, number ASC',
      [seriesId]
    );

    // If series currently has 0 chapters, auto-provision 5 archival chapters for it!
    if (!chapters || chapters.length === 0) {
      const cleanTitle = (seriesItem.title || 'ARCHIVE').replace(/SERIES \d+\s*[-–—]\s*/i, '');
      const cover = seriesItem.cover_image || '/assets/photos/series-01-tshirt.webp';

      const defaultTemplates = [
        {
          number: '01',
          title: `The Inception`,
          slug: `${seriesSlug}-the-inception`,
          story: `Every era begins in silence. For ${cleanTitle}, the inquiry began with an uncompromising pursuit of quiet presence, dignity, and intentional silhouette.`,
          sort_order: 1,
        },
        {
          number: '02',
          title: `The Form & Silhouette`,
          slug: `${seriesSlug}-the-form`,
          story: `Grounded composure. A garment engineered to shelter against external clamor while delivering unconstrained anatomical grace.`,
          sort_order: 2,
        },
        {
          number: '03',
          title: `The Craft`,
          slug: `${seriesSlug}-the-craft`,
          story: `Concealed seam architecture and artisanal finishing. Hand-calibrated proportions that speak without shouting.`,
          sort_order: 3,
        },
        {
          number: '04',
          title: `The Poise`,
          slug: `${seriesSlug}-the-poise`,
          story: `Holding center amidst chaos. The tactile weight provides a psychological sanctuary for the wearer.`,
          sort_order: 4,
        },
        {
          number: '05',
          title: `The Continuity`,
          slug: `${seriesSlug}-the-continuity`,
          story: `The enduring legacy of quiet strength. Garments made to outlive passing trends and accompany you through every silent victory.`,
          sort_order: 5,
        },
      ];

      for (const t of defaultTemplates) {
        await query(
          'INSERT INTO chapters (series_id, number, title, slug, story, hero_image, status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [
            seriesId,
            t.number,
            t.title,
            t.slug,
            t.story,
            cover,
            'published',
            t.sort_order,
          ]
        );
      }

      chapters = await query(
        'SELECT * FROM chapters WHERE series_id = ? ORDER BY sort_order ASC, number ASC',
        [seriesId]
      );
    }

    return res.json(chapters);
  } catch (err) {
    console.error('[Chapters getBySeries Error]', err);
    return res.status(500).json({ error: 'Failed to retrieve chapters.' });
  }
}

export async function getChapterBySlug(req, res) {
  try {
    const { seriesSlug, chapterSlug } = req.params;
    let rows = await query('SELECT * FROM chapters WHERE slug = ?', [chapterSlug]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Chapter not found.' });
    }

    const chapter = rows[0];

    // Fetch associated product if exists
    let linkedProduct = null;
    const productRows = await query('SELECT * FROM products WHERE chapter_id = ?', [chapter.id]);
    if (productRows && productRows.length > 0) {
      linkedProduct = productRows[0];
    } else {
      // Find product matching this series
      const allProds = await query('SELECT * FROM products');
      linkedProduct = allProds.find((p) => p.slug && p.slug.startsWith(seriesSlug)) || allProds[0];
    }

    return res.json({
      ...chapter,
      product: linkedProduct,
      product_slug: linkedProduct?.slug || 'the-gentle-armor-tshirt',
    });
  } catch (err) {
    console.error('[Chapter getBySlug Error]', err);
    return res.status(500).json({ error: 'Failed to retrieve chapter details.' });
  }
}

export async function createChapter(req, res) {
  try {
    const {
      series_id,
      number,
      title,
      slug,
      story,
      hero_image,
      status = 'published',
      sort_order = 0,
    } = req.body;

    if (!series_id || !title || !slug || !number) {
      return res.status(400).json({ error: 'series_id, number, title, and slug are required.' });
    }

    const result = await query(
      'INSERT INTO chapters (series_id, number, title, slug, story, hero_image, status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [series_id, number, title, slug, story || '', hero_image || '/assets/chapter-01.svg', status, sort_order]
    );

    return res.status(201).json({
      message: 'Chapter archived successfully.',
      id: result.insertId,
      chapter: {
        id: result.insertId,
        series_id,
        number,
        title,
        slug,
        story,
        hero_image,
        status,
        sort_order,
      },
    });
  } catch (err) {
    console.error('[Chapter Create Error]', err);
    return res.status(500).json({ error: 'Failed to create chapter.' });
  }
}

export async function updateChapter(req, res) {
  try {
    const { id } = req.params;
    const { number, title, slug, story, hero_image, status, sort_order } = req.body;

    await query(
      'UPDATE chapters SET number = ?, title = ?, slug = ?, story = ?, hero_image = ?, status = ?, sort_order = ? WHERE id = ?',
      [number, title, slug, story, hero_image, status, sort_order, id]
    );

    return res.json({ message: 'Chapter updated successfully.' });
  } catch (err) {
    console.error('[Chapter Update Error]', err);
    return res.status(500).json({ error: 'Failed to update chapter.' });
  }
}

export async function deleteChapter(req, res) {
  try {
    const { id } = req.params;
    await query('DELETE FROM chapters WHERE id = ?', [id]);
    return res.json({ message: 'Chapter removed from archive.' });
  } catch (err) {
    console.error('[Chapter Delete Error]', err);
    return res.status(500).json({ error: 'Failed to delete chapter.' });
  }
}

