import { query } from '../config/db.js';

/**
 * Series Model
 * Encapsulates all relational database operations for archival Series.
 */
export const SeriesModel = {
  async findAll() {
    return query('SELECT * FROM series ORDER BY id ASC');
  },

  async findBySlug(slug) {
    const rows = await query('SELECT * FROM series WHERE slug = ?', [slug]);
    return rows[0] || null;
  },

  async findById(id) {
    const rows = await query('SELECT * FROM series WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create({ title, slug, description, cover_image, status = 'published' }) {
    const result = await query(
      'INSERT INTO series (title, slug, description, cover_image, status) VALUES (?, ?, ?, ?, ?)',
      [title, slug, description || '', cover_image || '/assets/photos/series-01-tshirt.webp', status]
    );
    return { id: result.insertId, title, slug, description, cover_image, status };
  },

  async update(id, { title, slug, description, cover_image, status }) {
    return query(
      'UPDATE series SET title = ?, slug = ?, description = ?, cover_image = ?, status = ? WHERE id = ?',
      [title, slug, description, cover_image, status, id]
    );
  },

  async delete(id) {
    return query('DELETE FROM series WHERE id = ?', [id]);
  },
};

