import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../../public/uploads');

/**
 * Image Upload & Archival Media Controller
 */

export function uploadSingle(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  return res.json({
    message: 'Image uploaded successfully.',
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
  });
}

export function uploadMultiple(req, res) {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No image files uploaded.' });
  }

  const urls = req.files.map((file) => `/uploads/${file.filename}`);
  return res.json({
    message: 'Images uploaded successfully.',
    urls,
    count: urls.length,
  });
}

export function listImages(req, res) {
  try {
    if (!fs.existsSync(uploadsDir)) {
      return res.json([]);
    }

    const files = fs.readdirSync(uploadsDir);
    const images = files
      .filter((file) => /\.(jpg|jpeg|png|webp|svg|gif|avif)$/i.test(file))
      .map((file) => {
        const stats = fs.statSync(path.join(uploadsDir, file));
        return {
          filename: file,
          url: `/uploads/${file}`,
          size: stats.size,
          created_at: stats.birthtime,
        };
      })
      .sort((a, b) => b.created_at - a.created_at);

    return res.json(images);
  } catch (err) {
    console.error('[Upload List Error]', err);
    return res.status(500).json({ error: 'Failed to list archival images.' });
  }
}

