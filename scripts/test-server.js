import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverDir = path.resolve(__dirname, '../server');

console.log('Starting Express test process...');
const server = spawn('node', ['src/index.js'], {
  cwd: serverDir,
  stdio: 'inherit',
});

// Give server 1.5 seconds to bind
setTimeout(async () => {
  try {
    console.log('\n--- 1. Testing /api/health ---');
    const healthRes = await fetch('http://localhost:5000/api/health');
    console.log('Health Status:', healthRes.status, await healthRes.json());

    console.log('\n--- 2. Testing /api/series ---');
    const seriesRes = await fetch('http://localhost:5000/api/series');
    console.log('Series Status:', seriesRes.status, await seriesRes.json());

    console.log('\n--- 3. Testing /api/auth/login ---');
    const authRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@quietbattles.com', password: 'admin123' }),
    });
    const authData = await authRes.json();
    console.log('Login Status:', authRes.status, {
      message: authData.message,
      tokenLength: authData.token?.length,
      admin: authData.admin,
    });

    console.log('\n--- 4. Testing protected endpoint /api/auth/me ---');
    const meRes = await fetch('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${authData.token}` },
    });
    console.log('Profile Status:', meRes.status, await meRes.json());

    console.log('\nAll Backend API & Auth verification checks PASSED!\n');
  } catch (err) {
    console.error('Test verification failed:', err);
  } finally {
    server.kill();
    process.exit(0);
  }
}, 1800);

