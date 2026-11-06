import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initDb, getDbMode } from './config/db.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import seriesRoutes from './routes/series.routes.js';
import chaptersRoutes from './routes/chapters.routes.js';
import productsRoutes from './routes/products.routes.js';
import uploadRoutes from './routes/upload.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file hosting for uploaded media and shared assets
const uploadsDir = path.resolve(__dirname, '../public/uploads');
const clientAssetsDir = path.resolve(__dirname, '../../client/public/assets');

app.use('/uploads', express.static(uploadsDir));
app.use('/assets', express.static(clientAssetsDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/chapters', chaptersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/upload', uploadRoutes);

// Health Check Endpoint (Requirement 15: returns {"db": "mysql" | "fallback"})
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    db: getDbMode(),
    brand: 'QUIET BATTLES™',
    edition: '2026.01',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The archival endpoint ${req.originalUrl} does not exist.`,
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('[Atelier Server Error]', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred in the archival engine.',
  });
});

// Start Server & Database Initialization
async function startServer() {
  await initDb();

  app.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`  QUIET BATTLES™ REST API ATELIER`);
    console.log(`  Listening on http://localhost:${PORT}`);
    console.log(`  Database Engine: ${getDbMode()}`);
    console.log(`  Static uploads: http://localhost:${PORT}/uploads`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=================================================\n`);
  });
}

startServer();
