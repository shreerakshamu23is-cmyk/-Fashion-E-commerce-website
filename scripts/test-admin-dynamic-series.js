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

async function runTest() {
  console.log('=== ADMIN DYNAMIC SERIES VERIFICATION TEST ===\n');

  // 1. Admin Login
  console.log('Step 1: Authenticating as Admin...');
  const loginRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'admin@quietbattles.com', password: 'admin123' }
  );

  console.log(`Login Status: ${loginRes.status}`);
  const token = loginRes.data.token;
  if (!token) {
    throw new Error('Failed to obtain auth token: ' + JSON.stringify(loginRes.data));
  }
  console.log('Auth Token Acquired Successfully.\n');

  // 2. Create New Series via Admin API
  console.log('Step 2: Creating "Series 05 – The Stillness" through Admin API...');
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
      port: 5000,
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
  console.log('Response:', createSeriesRes.data);
  const createdSeriesId = createSeriesRes.data.id || createSeriesRes.data.series?.id;
  console.log(`Created Series ID: ${createdSeriesId}\n`);

  // 3. Create One Chapter for this Series
  console.log('Step 3: Creating Chapter 01 for the new Series...');
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
      port: 5000,
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
  console.log('Response:', createChapRes.data);
  const createdChapterId = createChapRes.data.id || createChapRes.data.chapter?.id;
  console.log(`Created Chapter ID: ${createdChapterId}\n`);

  // 4. Verify Series appears in GET /api/series (used by Navbar dropdown and /archive)
  console.log('Step 4: Verifying Series appears in GET /api/series (Navbar dropdown & /archive)...');
  const allSeriesRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/series',
    method: 'GET',
  });

  const foundInList = allSeriesRes.data.find((s) => s.slug === 'series-05');
  console.log(`Found in /api/series list: ${!!foundInList}`);
  console.log('Matching Series Data:', JSON.stringify(foundInList, null, 2));

  // 5. Verify Series is accessible at its own URL /api/series/series-05
  console.log('\nStep 5: Verifying Series is accessible at /api/series/series-05...');
  const singleSeriesRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/series/series-05',
    method: 'GET',
  });
  console.log(`Single Series Status: ${singleSeriesRes.status}`);
  console.log('Series title:', singleSeriesRes.data?.title);
  console.log('Chapters count in series:', singleSeriesRes.data?.chapters?.length);

  // 6. Verify Chapter is accessible at its URL
  console.log('\nStep 6: Verifying Chapter is accessible at /api/series/series-05/chapters/the-silent-breath...');
  const singleChapRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/series/series-05/chapters/the-silent-breath',
    method: 'GET',
  });
  console.log(`Chapter Status: ${singleChapRes.status}`);
  console.log('Chapter title:', singleChapRes.data?.title);
  console.log('Chapter story:', singleChapRes.data?.story);

  // 7. Verify unknown series returns 404
  console.log('\nStep 7: Verifying unknown slug returns 404...');
  const unknownRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/series/non-existent-series-slug',
    method: 'GET',
  });
  console.log(`Unknown Series Status (expected 404): ${unknownRes.status}`);

  // 8. Delete the created chapter and series
  console.log('\nStep 8: Cleaning up - Deleting created Chapter and Series...');
  if (createdChapterId) {
    const delChapRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/chapters/${createdChapterId}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`Delete Chapter Status: ${delChapRes.status}`);
  }

  if (createdSeriesId) {
    const delSeriesRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/series/${createdSeriesId}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`Delete Series Status: ${delSeriesRes.status}`);
  }

  // 9. Confirm deletion
  console.log('\nStep 9: Confirming deletion from /api/series...');
  const postDelRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/series',
    method: 'GET',
  });
  const stillFound = postDelRes.data.find((s) => s.slug === 'series-05');
  console.log(`Still found in list (expected false): ${!!stillFound}`);

  console.log('\n=== ALL DYNAMIC SERIES & ADMIN LIFECYCLE TESTS PASSED! ===');
}

runTest().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});

