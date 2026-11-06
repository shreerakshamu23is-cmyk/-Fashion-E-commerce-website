import { query } from '../config/db.js';

/**
 * Chapter Model
 * Encapsulates all relational database operations for Chapters.
 */
export const ChapterModel = {
  async findBySeriesId(seriesId) {
    return query(
      'SELECT * FROM chapters WHERE series_id = ? ORDER BY sort_order ASC, number ASC',
      [seriesId]
    );
  },

  async findBySlug(slug) {
    const rows = await query('SELECT * FROM chapters WHERE slug = ?', [slug]);
    return rows[0] || null;
  },

  async findById(id) {
    const rows = await query('SELECT * FROM chapters WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create({
    series_id,
    number,
    title,
    slug,
    story,
    hero_image,
    status = 'published',
    sort_order = 0,
  }) {
    const result = await query(
      'INSERT INTO chapters (series_id, number, title, slug, story, hero_image, status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [series_id, number, title, slug, story || '', hero_image || '/assets/chapter-01.svg', status, sort_order]
    );
    return { id: result.insertId, series_id, number, title, slug, story, hero_image, status, sort_order };
  },

  async update(id, { number, title, slug, story, hero_image, status, sort_order }) {
    return query(
      'UPDATE chapters SET number = ?, title = ?, slug = ?, story = ?, hero_image = ?, status = ?, sort_order = ? WHERE id = ?',
      [number, title, slug, story, hero_image, status, sort_order, id]
    );
  },

  async delete(id) {
    return query('DELETE FROM chapters WHERE id = ?', [id]);
  },
};

