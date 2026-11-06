# QUIET BATTLES™

> **"WEAR YOUR BATTLES."**  
> Luxury streetwear forged in silence.

---

## Brand & Aesthetic Direction

- **Brand Concept**: Emotional luxury streetwear honoring the *"unseen battles we carry."* Minimalist, poetic, and slow.
- **Palette**: Near-black (`#0e0e0e`), warm off-white (`#f4f0e8`), muted stone and ash greys, with antique brass / dusty bronze accents (`#c5a059`). Zero bright or aggressive colors.
- **Typography**: Cormorant Garamond / Playfair Display (editorial serif headlines) with Inter (clean sans body) and wide small-caps tracking (`01 // THE ARCHIVE`).
- **Motion & Texture**: Procedural film-grain overlay, desktop magnetic follower cursor, Lenis inertial smooth momentum scrolling synchronized with GSAP ScrollTrigger, full-screen hero, and 0–100% preloader. Respects `prefers-reduced-motion`.

---

## Tech Stack Overview

- **Frontend**: React 18, Vite, Tailwind CSS, GSAP 3, Lenis, React Router v6, Lucide React, `react-helmet-async`.
- **Backend**: Node.js, Express REST API, CORS, Dotenv.
- **Database**: MySQL 8.0+ via `mysql2/promise` with structured [`schema.sql`](server/schema.sql) and [`seed.sql`](server/seed.sql). Includes a zero-setup in-memory fallback adapter so the app runs out-of-the-box in any reviewer environment.
- **Authentication**: JWT admin session tokens, passwords salted & hashed with `bcryptjs`.
- **Media Uploads**: Multer file storage in [`server/public/uploads`](server/public/uploads).
- **SEO & Performance**: Open Graph metadata, Product JSON-LD (Schema.org INR), canonical URLs, dynamic document titles, `sitemap.xml`, `robots.txt`, and lazy-loaded WebP/SVG imagery.

---

## Directory Structure

```
quietbattles/
├── client/                     # Frontend React (Vite) Application
│   ├── public/
│   │   ├── assets/             # Archival editorial SVG/WebP assets & photos
│   │   ├── favicon.svg         # Geometric brand monogram
│   │   ├── robots.txt          # SEO crawler directives
│   │   └── sitemap.xml         # XML Sitemap
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # AdminLogin & AdminDashboard CMS
│   │   │   ├── cart/           # CartDrawer slide-in drawer
│   │   │   ├── common/         # CustomCursor, SmoothScroll, FilmGrain, Button, SectionLabel, Preloader
│   │   │   ├── home/           # Hero, BrandStory, FeaturedSeries, FeaturedProductStrip, Manifesto, AtelierNotes
│   │   │   └── layout/         # Navbar, Footer, Layout wrapper
│   │   ├── context/            # CartContext (localStorage) & AdminAuthContext (JWT)
│   │   ├── pages/              # Home, Archive, Series, Chapter, Product, Admin, NotFound
│   │   ├── services/           # api.js client service with resilient fallback
│   │   ├── utils/              # assets.js photo resolver
│   │   ├── App.jsx             # React Router route registry with React.lazy
│   │   ├── index.css           # Tailwind directives, film grain, Lenis styles
│   │   └── main.jsx            # React root with HelmetProvider & BrowserRouter
│   ├── index.html              # HTML shell with Google Fonts preconnected
│   ├── tailwind.config.js      # Custom luxury brand color tokens and typography
│   └── vite.config.js          # Vite configuration with /api and /uploads proxy
│
├── server/                     # Backend Node.js / Express REST API
│   ├── public/
│   │   └── uploads/            # Multer uploaded image storage
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # MySQL connection pool + zero-setup memory fallback
│   │   ├── controllers/        # auth, series, chapters, products, upload controllers
│   │   ├── models/             # series, chapter, product, admin model abstractions
│   │   ├── middleware/         # auth (JWT verification), upload (Multer fileFilter)
│   │   ├── routes/             # auth, series, chapters, products, upload route definitions
│   │   └── index.js            # Express entrypoint, static hosting, error handlers
│   ├── .env.example            # Server environment blueprint
│   ├── schema.sql              # MySQL DDL schema
│   └── seed.sql                # MySQL seed data (Series 01, 5 chapters, product, admin)
│
├── scripts/
│   ├── generate-assets.js      # Procedural luxury SVG asset generator
│   ├── start-dev.js            # Unified full-stack development launcher
│   └── test-server.js          # Automated backend integration test suite
│
├── ARCHITECTURE.md             # Stack rationale, data flow & non-developer guide
├── DEPLOYMENT.md               # Vercel/Netlify, Render/Railway, MySQL deployment guide
├── QUOTATION.md                # Phases, weeks, deliverables, cost table (₹)
├── package.json                # Root package with unified dev scripts
└── README.md                   # Project documentation & code tour
```

---

## Quick Start & Running Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* **MySQL**: v8.0 or higher (If MySQL is not installed or running, the server automatically operates in zero-setup evaluation mode with identical schema & seed data).

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
npm --prefix client install

# Install server dependencies
npm --prefix server install
```

### 2. Start Both Frontend and Backend Concurrently
Run the unified developer orchestrator from the project root:
```bash
npm run dev
```
This starts:
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

---

## Database Configuration (MySQL)

If you have a local MySQL server running:

1. Create the database and import the schema and seed data:
```bash
mysql -u root -p < server/schema.sql
mysql -u root -p < server/seed.sql
```

2. Configure `server/.env`:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=quietbattles

JWT_SECRET=quietbattles_ultra_secure_jwt_secret_key_2026_hiring_assessment
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

> **Reviewer Note**: If MySQL is not running on your machine, the server will detect this, log `[DB] Mode: fallback`, and run seamlessly with its built-in database adapter.

---

## Admin Portal & Default Credentials

Navigate to **`http://localhost:5173/admin`**:


---

## REST API Directory

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Public | System health check, returns `{"status": "online", "db": "mysql" \| "fallback"}` |
| **POST** | `/api/auth/login` | Public | Authenticate admin, returns JWT token |
| **GET** | `/api/auth/me` | Protected | Verify active admin JWT session |
| **GET** | `/api/series` | Public | List all series with chapter counts |
| **GET** | `/api/series/:slug` | Public | Get single series with its 5 chapters |
| **POST** | `/api/series` | Protected | Create a new series |
| **PUT** | `/api/series/:id` | Protected | Update series information or status |
| **DELETE** | `/api/series/:id` | Protected | Delete series (cascading delete) |
| **GET** | `/api/series/:seriesSlug/chapters` | Public | Get chronological chapters for a series |
| **GET** | `/api/series/:seriesSlug/chapters/:chapterSlug`| Public | Get chapter with linked product |
| **POST** | `/api/chapters` | Protected | Create a new chapter |
| **PUT** | `/api/chapters/:id` | Protected | Update chapter story, image, or order |
| **DELETE** | `/api/chapters/:id` | Protected | Remove chapter from archive |
| **GET** | `/api/products` | Public | List all products with chapter relations |
| **GET** | `/api/products/:slug` | Public | Get product details by slug |
| **POST** | `/api/products` | Protected | Create a new garment |
| **PUT** | `/api/products/:id` | Protected | Update product details, sizes, price, stock |
| **DELETE** | `/api/products/:id` | Protected | Delete garment from store |
| **GET** | `/api/upload` | Protected | List all uploaded images |
| **POST** | `/api/upload/single` | Protected | Upload single image via Multer |
| **POST** | `/api/upload/multiple` | Protected | Upload multiple images via Multer |

---

&copy; 2026 QUIET BATTLES™ ATELIER. All rights reserved.
LIVE DEMO LINK : https://fashion-e-commerce-website-three.vercel.app.
