import { query } from '../config/db.js';

/**
 * Product Model
 * Encapsulates all relational database operations for Garments / Products.
 */
export const ProductModel = {
  async findAll() {
    return query(`
      SELECT p.*, c.title AS chapter_title, c.slug AS chapter_slug, c.number AS chapter_number
      FROM products p
      LEFT JOIN chapters c ON p.chapter_id = c.id
      ORDER BY p.id ASC
    `);
  },

  async findBySlug(slug) {
    const rows = await query(
      `
      SELECT p.*, c.title AS chapter_title, c.slug AS chapter_slug, c.number AS chapter_number
      FROM products p
      LEFT JOIN chapters c ON p.chapter_id = c.id
      WHERE p.slug = ?
    `,
      [slug]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const rows = await query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findByChapterId(chapterId) {
    const rows = await query('SELECT * FROM products WHERE chapter_id = ?', [chapterId]);
    return rows[0] || null;
  },

  async create({
    chapter_id,
    name,
    slug,
    description,
    price,
    images = [],
    sizes = ['S', 'M', 'L', 'XL'],
    stock = 10,
  }) {
    const imagesJson = JSON.stringify(images);
    const sizesJson = JSON.stringify(sizes);

    const result = await query(
      'INSERT INTO products (chapter_id, name, slug, description, price, images, sizes, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [chapter_id || null, name, slug, description || '', price, imagesJson, sizesJson, stock]
    );

    return {
      id: result.insertId,
      chapter_id,
      name,
      slug,
      description,
      price,
      images,
      sizes,
      stock,
    };
  },

  async update(id, { chapter_id, name, slug, description, price, images, sizes, stock }) {
    const imagesJson = JSON.stringify(images || []);
    const sizesJson = JSON.stringify(sizes || ['S', 'M', 'L', 'XL']);

    return query(
      'UPDATE products SET chapter_id = ?, name = ?, slug = ?, description = ?, price = ?, images = ?, sizes = ?, stock = ? WHERE id = ?',
      [chapter_id || null, name, slug, description, price, imagesJson, sizesJson, stock, id]
    );
  },

  async delete(id) {
    return query('DELETE FROM products WHERE id = ?', [id]);
  },
};

