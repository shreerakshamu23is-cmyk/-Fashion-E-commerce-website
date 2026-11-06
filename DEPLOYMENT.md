# QUIET BATTLES™ // PRODUCTION DEPLOYMENT GUIDE

> Comprehensive production deployment manual for **QUIET BATTLES™**.  
> Architecture: Client on **Vercel / Netlify**, Backend API on **Render / Railway**, and MySQL Database on **Railway / Aiven**.

---

## 1. Production Architecture Overview

```mermaid
flowchart LR
    Browser["User Browser / Client"] -->|HTTPS CDN| Vercel["Vercel / Netlify\n(React 18 SPA)"]
    Vercel -->|REST API Requests\n/api/*| Render["Render / Railway\n(Node.js Express Server)"]
    Render -->|Encrypted TLS (Port 3306)| MySQL["Railway / Aiven\n(MySQL 8.0 Database)"]
    Render -->|Static Multipart Files| PersistentVol["Persistent Volume / S3\n(/uploads)"]
```

---

## 2. Frontend Client Deployment

### Option A: Vercel (Recommended)

1. **Connect Repository**:
   - Log into [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
   - Import the `quietbattles` repository.

2. **Build & Development Settings**:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Client Single-Page Application (SPA) Routing**:
   Create a `client/vercel.json` file for client-side React Router rewrites:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

4. **Environment Variables on Vercel**:
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `VITE_API_URL` | `https://api.quietbattles.com/api` | Production Express API Gateway |

---

### Option B: Netlify

1. **Connect Repository**:
   - Log into [Netlify](https://netlify.com) and import repository.
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`

2. **Redirects Configuration**:
   Create `client/public/_redirects`:
   ```text
   /*    /index.html   200
   ```

---

## 3. Backend API Deployment

### Option A: Render

1. **Create Web Service**:
   - Log into [Render](https://render.com) and select **"New Web Service"**.
   - Connect the repository.

2. **Service Configuration**:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`
   - **Plan**: Starter / Free

3. **Render Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=5000
   DB_HOST=<YOUR_MYSQL_HOST>
   DB_PORT=<YOUR_MYSQL_PORT>
   DB_USER=<YOUR_MYSQL_USER>
   DB_PASSWORD=<YOUR_MYSQL_PASSWORD>
   DB_NAME=quietbattles
   JWT_SECRET=production_ultra_secret_jwt_key_replace_with_32_byte_string
   JWT_EXPIRES_IN=7d
   CLIENT_URL=https://quietbattles.vercel.app
   ```

---

### Option B: Railway

1. **Create Project**:
   - Log into [Railway](https://railway.app).
   - Click **"New Project"** -> **"Deploy from GitHub repo"**.
2. **Settings**:
   - Root Directory: `server`
   - Watch Paths: `server/**`
   - Start Command: `node src/index.js`
3. Add a persistent storage volume mounted at `/app/server/public/uploads` so uploaded lookbook photos are retained between deployments.

---

## 4. Production MySQL Database

### Option A: Railway MySQL Database

1. In Railway project dashboard, click **"New"** -> **"Database"** -> **"Add MySQL"**.
2. Railway provisions a MySQL 8 instance with a connection string:
   ```text
   mysql://root:<PASSWORD>@<HOST>:<PORT>/railway
   ```
3. Initialize the schema and seed data from your local machine:
   ```bash
   mysql -h <RAILWAY_HOST> -P <RAILWAY_PORT> -u root -p railway < server/schema.sql
   mysql -h <RAILWAY_HOST> -P <RAILWAY_PORT> -u root -p railway < server/seed.sql
   ```
4. Copy the host, port, user, password, and database name into the Render or Railway server environment variables.

---

### Option B: Aiven for MySQL

1. Create a managed MySQL service on [Aiven](https://aiven.io).
2. Download the SSL certificate (`ca.pem`).
3. Set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` in the server environment.

---

## 5. Production Environment Variables Reference

### Server Environment (`server/.env`)

```env
# Server Runtime
PORT=5000
NODE_ENV=production

# MySQL Relational Database
DB_HOST=mysql.railway.internal
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_PROD_PASSWORD
DB_NAME=quietbattles

# Authentication Secrets
JWT_SECRET=super_strong_random_sha256_key_at_least_32_characters
JWT_EXPIRES_IN=7d

# CORS Allowed Origin
CLIENT_URL=https://quietbattles.com
```

### Client Environment (`client/.env`)

```env
VITE_API_URL=https://api.quietbattles.com/api
```

---

## 6. Pre-Launch Quality & Verification Checklist

- [x] Run `npm --prefix client run build` to verify production assets bundle without errors.
- [x] Run `node scripts/test-server.js` to verify database health and API authentication.
- [x] Ensure `/api/health` returns `{"status":"online","db":"mysql"}` on production.
- [x] Verify default Admin credentials are changed from `admin123` to a secure production secret.
- [x] Ensure SSL/TLS is active with HTTPS redirection.

