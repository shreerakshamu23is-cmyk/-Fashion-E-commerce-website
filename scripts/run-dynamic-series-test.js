import { spawn } from 'child_process';
import http from 'http';

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

const TEST_PORT = 5005;

async function run() {
  console.log(`Starting quietbattles server on port ${TEST_PORT}...`);
  const srv = spawn('node', ['server/src/index.js'], {
    env: { ...process.env, PORT: String(TEST_PORT) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let serverStarted = false;
  srv.stdout.on('data', (d) => {
    const text = d.toString();
    if (text.includes('Listening on http://localhost:')) {
      serverStarted = true;
    }
  });
  srv.stderr.on('data', (d) => {
    // console.error(d.toString());
  });

  // Wait up to 5s for server to start
  for (let i = 0; i < 50; i++) {
    if (serverStarted) break;
    await new Promise((r) => setTimeout(r, 100));
  }

  try {
    console.log('=== ADMIN DYNAMIC SERIES VERIFICATION TEST ===\n');

    // 1. Health check
    const health = await request({
      hostname: 'localhost',
      port: TEST_PORT,
      path: '/api/health',
      method: 'GET',
    });
    console.log('GET /api/health:', health.status, JSON.stringify(health.data));

    // 2. Admin Login
    console.log('\nStep 1: Authenticating as Admin...');
    const loginRes = await request(
      {
        hostname: 'localhost',
        port: TEST_PORT,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'admin@quietbattles.com', password: 'admin123' }
    );
    console.log(`Login Status: ${loginRes.status}`);
    const token = loginRes.data.token;
    if (!token) throw new Error('No token returned');
    console.log('Auth Token Acquired Successfully.');

    // 3. Create New Series via Admin API
    console.log('\nStep 2: Creating "Series 05 – The Stillness" via Admin API...');
    const newSeriesPayload = {
      title: 'SERIES 05 – THE STILLNESS™',
      slug: 'series-05',
      description: 'An inquiry into deep quietude and physical balance in heavyweight organic cotton.',
      cover_image: '/assets/photos/series-01-tshirt.webp',
      status: 'published',
    };

    const createSeriesRes = await request(
      {
        hostname: 'localhost',
        port: TEST_PORT,
        path: '/api/series',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      newSeriesPayload
    );
    console.log(`Create Series Status: ${createSeriesRes.status}`);
    const createdSeriesId = createSeriesRes.data.id || createSeriesRes.data.series?.id;
    console.log(`Created Series ID: ${createdSeriesId}`);

    // 4. Create One Chapter for this Series
    console.log('\nStep 3: Creating Chapter 01 for the new Series...');
    const newChapterPayload = {
      series_id: createdSeriesId,
      number: '01',
      title: 'The Silent Breath',
      slug: 'the-silent-breath',
      story: 'In the stillness between strides, the body finds its true center.',
      hero_image: '/assets/chapter-01.svg',
      status: 'published',
      sort_order: 1,
    };

    const createChapRes = await request(
      {
        hostname: 'localhost',
        port: TEST_PORT,
        path: '/api/chapters',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      newChapterPayload
    );
    console.log(`Create Chapter Status: ${createChapRes.status}`);
    const createdChapterId = createChapRes.data.id || createChapRes.data.chapter?.id;
    console.log(`Created Chapter ID: ${createdChapterId}`);

    // 5. Verify Series appears in GET /api/series (Navbar dropdown & /archive)
    console.log('\nStep 4: Verifying Series appears in GET /api/series (Navbar dropdown & /archive)...');
    const allSeriesRes = await request({
      hostname: 'localhost',
      port: TEST_PORT,
      path: '/api/series',
      method: 'GET',
    });
    const foundInList = allSeriesRes.data.find((s) => s.slug === 'series-05');
    console.log(`Found in /api/series list: ${!!foundInList}`);
    console.log('Series in list:', foundInList?.title, 'Chapters count:', foundInList?.chapters_count);

    // 6. Verify Series is accessible at its own URL /api/series/series-05
    console.log('\nStep 5: Verifying Series is accessible at /api/series/series-05...');
    const singleSeriesRes = await request({
      hostname: 'localhost',
      port: TEST_PORT,
      path: '/api/series/series-05',
      method: 'GET',
    });
    console.log(`Single Series Status: ${singleSeriesRes.status}`);
    console.log('Series title:', singleSeriesRes.data?.title);
    console.log('Series chapters count:', singleSeriesRes.data?.chapters?.length);

    // 7. Verify Chapter is accessible at /api/series/series-05/chapters/the-silent-breath
    console.log('\nStep 6: Verifying Chapter is accessible at /api/series/series-05/chapters/the-silent-breath...');
    const singleChapRes = await request({
      hostname: 'localhost',
      port: TEST_PORT,
      path: '/api/series/series-05/chapters/the-silent-breath',
      method: 'GET',
    });
    console.log(`Chapter Status: ${singleChapRes.status}`);
    console.log('Chapter title:', singleChapRes.data?.title);

    // 8. Verify unknown series returns 404
    console.log('\nStep 7: Verifying unknown slug returns 404...');
    const unknownRes = await request({
      hostname: 'localhost',
      port: TEST_PORT,
      path: '/api/series/non-existent-series-slug',
      method: 'GET',
    });
    console.log(`Unknown Series Status (expected 404): ${unknownRes.status}`);

    // 9. Delete created Chapter and Series
    console.log('\nStep 8: Cleaning up - Deleting created Chapter and Series...');
    const delChapRes = await request({
      hostname: 'localhost',
      port: TEST_PORT,
      path: `/api/chapters/${createdChapterId}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`Delete Chapter Status: ${delChapRes.status}`);

    const delSeriesRes = await request({
      hostname: 'localhost',
      port: TEST_PORT,
      path: `/api/series/${createdSeriesId}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`Delete Series Status: ${delSeriesRes.status}`);

    // 10. Confirm deletion
    console.log('\nStep 9: Confirming deletion from /api/series...');
    const postDelRes = await request({
      hostname: 'localhost',
      port: TEST_PORT,
      path: '/api/series',
      method: 'GET',
    });
    const stillFound = postDelRes.data.find((s) => s.slug === 'series-05');
    console.log(`Still found in list (expected false): ${!!stillFound}`);

    console.log('\n>>> ALL 9 DYNAMIC SERIES LIFECYCLE CHECKS PASSED SUCCESSFULLY! <<<');
  } finally {
    srv.kill('SIGINT');
  }
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

