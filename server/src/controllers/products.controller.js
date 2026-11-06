import { query } from '../config/db.js';

/**
 * Products Controller
 */

export async function getAllProducts(req, res) {
  try {
    const rows = await query(`
      SELECT p.*, c.title AS chapter_title, c.slug AS chapter_slug, c.number AS chapter_number
      FROM products p
      LEFT JOIN chapters c ON p.chapter_id = c.id
      ORDER BY p.id ASC
    `);

    // Ensure images and sizes are parsed JSON arrays
    const formatted = rows.map((p) => ({
      ...p,
      images: Array.isArray(p.images)
        ? p.images
        : typeof p.images === 'string' && p.images.startsWith('[')
        ? JSON.parse(p.images)
        : [p.images || '/assets/product-01-main.svg'],
      sizes: Array.isArray(p.sizes)
        ? p.sizes
        : typeof p.sizes === 'string' && p.sizes.startsWith('[')
        ? JSON.parse(p.sizes)
        : ['S', 'M', 'L', 'XL'],
    }));

    return res.json(formatted);
  } catch (err) {
    console.error('[Products getAll Error]', err);
    return res.status(500).json({ error: 'Failed to retrieve products.' });
  }
}

export async function getProductBySlug(req, res) {
  try {
    const { slug } = req.params;
    const rows = await query(
      `
      SELECT p.*, c.title AS chapter_title, c.slug AS chapter_slug, c.number AS chapter_number
      FROM products p
      LEFT JOIN chapters c ON p.chapter_id = c.id
      WHERE p.slug = ?
    `,
      [slug]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Garment not found in archive.' });
    }

    const p = rows[0];
    const formatted = {
      ...p,
      images: Array.isArray(p.images)
        ? p.images
        : typeof p.images === 'string' && p.images.startsWith('[')
        ? JSON.parse(p.images)
        : [p.images || '/assets/product-01-main.svg'],
      sizes: Array.isArray(p.sizes)
        ? p.sizes
        : typeof p.sizes === 'string' && p.sizes.startsWith('[')
        ? JSON.parse(p.sizes)
        : ['S', 'M', 'L', 'XL'],
    };

    return res.json(formatted);
  } catch (err) {
    console.error('[Product getBySlug Error]', err);
    return res.status(500).json({ error: 'Failed to retrieve garment details.' });
  }
}

export async function createProduct(req, res) {
  try {
    const {
      chapter_id,
      name,
      slug,
      description,
      price,
      images = [],
      sizes = ['S', 'M', 'L', 'XL'],
      stock = 10,
    } = req.body;

    if (!name || !slug || !price) {
      return res.status(400).json({ error: 'Name, slug, and price are required.' });
    }

    const imagesJson = JSON.stringify(images);
    const sizesJson = JSON.stringify(sizes);

    const result = await query(
      'INSERT INTO products (chapter_id, name, slug, description, price, images, sizes, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [chapter_id || null, name, slug, description || '', price, imagesJson, sizesJson, stock]
    );

    return res.status(201).json({
      message: 'Product archived successfully.',
      id: result.insertId,
      product: {
        id: result.insertId,
        chapter_id,
        name,
        slug,
        description,
        price,
        images,
        sizes,
        stock,
      },
    });
  } catch (err) {
    console.error('[Product Create Error]', err);
    return res.status(500).json({ error: 'Failed to archive product.' });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { chapter_id, name, slug, description, price, images, sizes, stock } = req.body;

    const imagesJson = JSON.stringify(images || []);
    const sizesJson = JSON.stringify(sizes || ['S', 'M', 'L', 'XL']);

    await query(
      'UPDATE products SET chapter_id = ?, name = ?, slug = ?, description = ?, price = ?, images = ?, sizes = ?, stock = ? WHERE id = ?',
      [chapter_id || null, name, slug, description, price, imagesJson, sizesJson, stock, id]
    );

    return res.json({ message: 'Garment updated successfully.' });
  } catch (err) {
    console.error('[Product Update Error]', err);
    return res.status(500).json({ error: 'Failed to update garment.' });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    await query('DELETE FROM products WHERE id = ?', [id]);
    return res.json({ message: 'Garment removed from archive.' });
  } catch (err) {
    console.error('[Product Delete Error]', err);
    return res.status(500).json({ error: 'Failed to delete garment.' });
  }
}

