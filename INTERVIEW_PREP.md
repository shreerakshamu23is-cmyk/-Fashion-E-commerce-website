# QUIET BATTLES™ // FULL-STACK DEVELOPER INTERVIEW GUIDE

> **Role Assessment**: Full-Stack Web Developer  
> **Brand**: QUIET BATTLES™ ("WEAR YOUR BATTLES.")  
> **Purpose**: A comprehensive guide designed to help you confidently explain the architecture, design choices, data flow, and code line by line in technical interview rounds.

---

## 1. The 60-Second Elevator Pitch

> *"Quiet Battles is an editorial luxury streetwear platform inspired by the concept of unseen emotional endurance. Rather than a generic e-commerce template, I engineered an editorial storytelling experience that bridges high-fashion journalism with e-commerce.*
>
> *Technically, the frontend is built on React 18, Vite, Tailwind CSS, Lenis inertial smooth scrolling, and GSAP ScrollTrigger for cinematic narrative pacing. The backend is a decoupled Node.js and Express REST API structured in clean layers—routes, controllers, models, and middleware. For persistence, it uses a relational MySQL schema with connection pooling, and features a zero-setup in-memory fallback adapter so evaluators can run and test the complete system out-of-the-box in any environment.*
>
> *Authentication uses salted bcrypt hashing and stateless JWT bearer tokens. The site is optimized for SEO with dynamic Schema.org Product JSON-LD, Open Graph meta tags, and respects OS-level prefers-reduced-motion."*

---

## 2. Core Architecture & Line-by-Line Code Walkthrough

### A. Frontend Architecture

#### 1. Cinematic Momentum Scrolling & Motion (`client/src/components/common/SmoothScroll.jsx`)
- **How it works**: Uses `@studio-freight/lenis` initialized in a `useEffect` hook.
- **Why Lenis**: Native browser scrolling causes harsh jumps that break editorial immersion. Lenis provides smooth inertial momentum while maintaining native accessibility and keyboard controls.
- **Integration with GSAP**:
  ```javascript
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  ```
  *Explanation for interviewer*: "Instead of having two competing `requestAnimationFrame` loops, we synchronize Lenis's ticker directly to GSAP's internal ticker, guaranteeing zero scroll jank or frame tearing."
- **Reduced Motion Support**:
  ```javascript
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;
  ```
  *Explanation*: "Respecting accessibility (`prefers-reduced-motion`) is critical in luxury web design. If the user prefers reduced motion, GSAP animations and smooth scrolling are automatically bypassed."

#### 2. Cart State Management (`client/src/context/CartContext.jsx`)
- **How it works**: Built with React's Context API and synced with `localStorage`.
- **Key Lines**:
  - Initializes state lazily: `useState(() => { try { return JSON.parse(localStorage.getItem('qb_cart')) || []; } catch { return []; } })`.
  - Auto-synchronization: A `useEffect` hook writes to `localStorage` on any state transition: `localStorage.setItem('qb_cart', JSON.stringify(items));`.
  - Item uniqueness: Uniqueness is defined as composite `id + size` (e.g. `product-1-L`), so different sizes of the same piece do not collide.

#### 3. Dynamic Meta Tags & SEO (`react-helmet-async`)
- Every page declares its canonical URL, Open Graph title, description, and preview image.
- Product page (`client/src/pages/Product.jsx`) embeds Schema.org JSON-LD structured data with INR currency (`offers.priceCurrency: 'INR'`), enabling rich snippets on Google Search.

---

### B. Backend Architecture

#### 1. Layered Separation of Concerns
```
server/src/
├── routes/       -> HTTP URI declarations & middleware binding
├── middleware/   -> requireAuth (JWT verification) & upload (Multer disk storage)
├── controllers/  -> Request validation, status codes, and JSON response formatting
├── models/       -> SQL queries and business logic abstractions
└── config/db.js  -> MySQL connection pool + zero-setup fallback adapter
```

#### 2. Universal Evaluability & Dual-Mode DB (`server/src/config/db.js`)
- **Interviewer Question**: *"What happens if the reviewer doesn't have MySQL installed?"*
- **Answer**:
  ```javascript
  // Server tries to connect to MySQL on startup:
  try {
    await pool.query('SELECT 1');
    console.log('[DB] Mode: mysql');
  } catch (err) {
    console.log('[DB NOTICE] MySQL not reachable. Falling back to in-memory adapter.');
    console.log('[DB] Mode: fallback');
  }
  ```
  "The application gracefully degrades to an embedded in-memory database seeded with identical records (`Series 01`, 5 chapters, `The Gentle Armor T-Shirt`, and admin credentials). Reviewers can run `npm run dev` and immediately test every CRUD endpoint, JWT auth, and the CMS without setting up MySQL."

#### 3. Authentication & Security (`server/src/controllers/auth.controller.js`)
- **Password Hashing**: `bcrypt.hash(password, 10)` generates a salted hash. Plaintext passwords never touch the database.
- **JWT Signature**: Tokens are signed with HMAC SHA-256 using `JWT_SECRET` with a 7-day expiration.
- **Protection**: `requireAuth` middleware verifies `Authorization: Bearer <token>`, rejects invalid tokens with 401 Unauthorized, and attaches `req.user` to downstream controllers.

---

## 3. High-Frequency Interview Questions & Model Answers

### Q1: "Why did you build an in-house CMS instead of using Shopify or Strapi?"
> *"For a hiring assessment, building an in-house CMS allows me to demonstrate complete full-stack proficiency: schema design, SQL queries with prepared statements, JWT authentication, file upload pipelines with Multer, and responsive administrative dashboards with real-time optimistic UI updates."*

### Q2: "How do you handle touch targets and mobile responsiveness?"
> *"All buttons, links, quantity toggles, and form inputs are engineered with a minimum touch target of 44×44px, conforming to WCAG 2.1 Success Criterion 2.5.5. On mobile, complex desktop grids collapse into single-column flows, and the navigation transforms into a full-screen blurred backdrop overlay."*

### Q3: "How do you prevent SQL injection?"
> *"All queries in `server/src/models/` use parameterized prepared statements with `?` placeholders via `mysql2/promise`. User inputs are never concatenated directly into SQL strings."*

### Q4: "How does the custom cursor behave on touch devices?"
> *"In `client/src/index.css`, custom cursor styles are wrapped in `@media (hover: hover) and (pointer: fine)`. On mobile, tablets, or touchscreens, the custom follower cursor is disabled and the browser renders native touch interactions."*

### Q5: "How does image crossfade on hover work on the Archive and Series cards?"
> *"Instead of heavy JavaScript listeners, we stack two `<img>` elements within a `relative overflow-hidden` wrapper. The base image has `transition-opacity duration-700 ease-out group-hover:opacity-0`, while the craft detail image has `opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105 pointer-events-none`. This achieves 60fps hardware-accelerated transitions with zero JavaScript overhead."*

---

## 4. Quick Verification Cheat Sheet

| Feature | Where to Test | What to Look For |
|---|---|---|
| **Health API** | `GET /api/health` | Returns `{"status": "online", "db": "mysql" \| "fallback"}` |
| **Public Catalog** | `GET /api/products` | Returns The Gentle Armor T-Shirt at ₹999 |
| **Admin Login** | `/admin` | `admin@quietbattles.com` / `admin123` |
| **Cart Validation** | `/product/the-gentle-armor-tshirt` | Clicking "Add to Cart" without selecting a size triggers an inline error |
| **Cart Persistence** | Cart Drawer | Add item, refresh page $\to$ items persist in `localStorage` |
| **Reduced Motion** | System Settings $\to$ Reduce Motion | Animations and smooth scrolling instantly disable |

---

&copy; 2026 QUIET BATTLES™ ATELIER. All rights reserved.

