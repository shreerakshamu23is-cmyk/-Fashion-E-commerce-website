/**
 * API Service & Archival Data Layer
 * Handles fetching series, chapters, and products from the Express backend,
 * with built-in instant fallback data matching seed.sql so all pages render
 * with high fidelity even during offline or independent client evaluation.
 */

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');
const API_ORIGIN = /^https?:\/\//i.test(API_BASE) ? new URL(API_BASE).origin : '';

export function apiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const baseHasApiPath = /\/api$/i.test(API_BASE);
  const pathHasApiPrefix = /^\/api(?:\/|$)/i.test(normalizedPath);

  return `${API_BASE}${
    baseHasApiPath && pathHasApiPrefix
      ? normalizedPath.slice(4)
      : normalizedPath
  }`;
}

export function mediaUrl(path) {
  if (typeof path !== 'string' || !path || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path)) {
    return path;
  }

  return path.startsWith('/uploads/') ? `${API_ORIGIN}${path}` : path;
}

export const fallbackSeries = [
  {
    id: 1,
    title: 'SERIES 01 – THE GENTLE ARMOR™',
    slug: 'series-01',
    description:
      'A collection about quiet strength and everyday courage. Heavyweight organic cotton, relaxed fit silhouettes, and concealed seamlines engineered to shelter the spirit against external clamor.',
    cover_image: '/assets/photos/series-01-tshirt.webp',
    lineart_image: '/assets/tshirt-lineart.svg',
    product_name: 'The Gentle Armor T-Shirt',
    product_slug: 'the-gentle-armor-tshirt',
    product_price: 999,
    product_photo: '/assets/photos/series-01-tshirt.webp',
    status: 'published',
    created_at: '2026-01-15T00:00:00Z',
    chapters_count: 5,
  },
  {
    id: 2,
    title: 'SERIES 02 – UNRECORDED HOURS™',
    slug: 'series-02',
    description:
      'A chronicle of sleepless dedication and solitary craft. Architected for the quiet late hours when the world sleeps. Garments cut from dense organic cotton with relaxed drop-shoulder silhouettes and concealed interior tape.',
    cover_image: '/assets/photos/series-02-tshirt.webp',
    lineart_image: '/assets/series-02-cover.svg',
    product_name: 'The Unrecorded Hours T-Shirt',
    product_slug: 'unrecorded-hours-tshirt',
    product_price: 1099,
    product_photo: '/assets/photos/series-02-tshirt.webp',
    status: 'published',
    created_at: '2026-02-01T00:00:00Z',
    chapters_count: 5,
  },
  {
    id: 3,
    title: 'SERIES 03 – THE SILENT WEIGHT™',
    slug: 'series-03',
    description:
      'An inquiry into psychological gravity and emotional resilience. Double-knit organic cotton engineered to provide physical grounding and structured composure under pressure.',
    cover_image: '/assets/photos/series-03-tshirt.webp',
    lineart_image: '/assets/series-03-cover.svg',
    product_name: 'The Silent Weight Boxy Tee',
    product_slug: 'silent-weight-tshirt',
    product_price: 1199,
    product_photo: '/assets/photos/series-03-tshirt.webp',
    status: 'published',
    created_at: '2026-02-15T00:00:00Z',
    chapters_count: 5,
  },
  {
    id: 4,
    title: 'SERIES 04 – THE UNBROKEN LINE™',
    slug: 'series-04',
    description:
      'Continuous seam architecture and garment-washed finish designed for sustained daily wear. Minimalist luxury streetwear built for everyday survival and unyielding posture.',
    cover_image: '/assets/photos/series-04-tshirt.webp',
    lineart_image: '/assets/series-04-cover.svg',
    product_name: 'The Unbroken Line Architectural Tee',
    product_slug: 'unbroken-line-tshirt',
    product_price: 1299,
    product_photo: '/assets/photos/series-04-tshirt.webp',
    status: 'published',
    created_at: '2026-03-01T00:00:00Z',
    chapters_count: 5,
  },
  {
    id: 5,
    title: 'SERIES 05 — THE QUIET GRACE™',
    slug: 'series-05',
    description:
      'An archival exploration of delicate composure and quiet power. Crafted in fine-spun ivory & olive floral cotton with fluid tailored lines.',
    cover_image: '/uploads/outfit-ideas-1793966194709-373233.jpg',
    lineart_image: '/uploads/outfit-ideas-1793966194709-373233.jpg',
    product_name: 'The Quiet Grace Kurta Set',
    product_slug: 'series-05-tshirt',
    product_price: 1999,
    product_photo: '/uploads/outfit-ideas-1793966194709-373233.jpg',
    status: 'published',
    created_at: '2026-03-10T00:00:00Z',
    chapters_count: 5,
  },
];

export const fallbackChapters = [
  {
    id: 1,
    series_id: 1,
    series_slug: 'series-01',
    number: '01',
    title: 'The Beginning',
    slug: 'the-beginning',
    story:
      'Before any posture can be taken, there is the room before the mirror. The initial weight of awareness. We do not set out to build barriers; we set out to understand where our edges end and the world begins. The first garment is not an armor against enemies, but a quiet perimeter drawn around the tender self.',
    hero_image: '/assets/chapter-01.svg',
    status: 'published',
    sort_order: 1,
    pull_quote:
      'The first garment is not an armor against enemies, but a quiet perimeter drawn around the tender self.',
    product_slug: 'the-gentle-armor-tshirt',
  },
  {
    id: 2,
    series_id: 1,
    series_slug: 'series-01',
    number: '02',
    title: 'The Silence',
    slug: 'the-silence',
    story:
      'There is a quiet battle that happens when you refuse to scream. When the noise of expectations presses on every collarbone, the only dignified response is stillness. We crafted this chapter out of heavyweight organic cotton that absorbs vibrations rather than reflecting them. The silence is not emptiness; it is the dense composure of water beneath quiet ice.',
    extended_story: [
      'In a culture that constantly demands your reaction, refusal is the ultimate luxury. We calibrated the density of heavyweight organic cotton so that it hangs with architectural gravity without restricting motion.',
      'To put on this T-shirt is to lower the ambient volume of the street. You feel the grounded comfort against your skin, and paradoxically, your breath slows down.',
      'The seams are concealed inside with soft-finished thread. Nobody on the street will notice. But your skin knows. The battle is yours, and so is the sanctuary.',
    ],
    hero_image: '/assets/chapter-02.svg',
    secondary_image_1: '/assets/product-01-detail.svg',
    secondary_image_2: '/assets/product-01-texture.svg',
    status: 'published',
    sort_order: 2,
    pull_quote:
      'Silence is not the absence of war; it is the mastery of your own noise.',
    product_slug: 'the-gentle-armor-tshirt',
    product_name: 'The Gentle Armor T-Shirt',
    product_price: 999,
  },
  {
    id: 3,
    series_id: 1,
    series_slug: 'series-01',
    number: '03',
    title: 'The Struggle',
    slug: 'the-struggle',
    story:
      'Tension gives fabric its memory. To bend without snapping, to take the friction of modern existence and turn it into character. Here, the seams are double-reinforced with concealed single-needle stitching, honoring the invisible internal wars that never appear on a resume or an invoice.',
    hero_image: '/assets/chapter-03.svg',
    status: 'published',
    sort_order: 3,
    pull_quote:
      'To bend without snapping is the quietest form of defiance.',
    product_slug: 'the-gentle-armor-tshirt',
  },
  {
    id: 4,
    series_id: 1,
    series_slug: 'series-01',
    number: '04',
    title: 'The Strength',
    slug: 'the-strength',
    story:
      'True power in clothing does not announce itself with aggressive branding or flamboyant geometry. It is felt in the density of the organic cotton, the precision of the shoulder lines, and the weight resting calmly on the wearer. You do not explain yourself when your presence is grounded in honest material.',
    hero_image: '/assets/chapter-04.svg',
    status: 'published',
    sort_order: 4,
    pull_quote:
      'You do not explain yourself when your presence is grounded in honest material.',
    product_slug: 'the-gentle-armor-tshirt',
  },
  {
    id: 5,
    series_id: 1,
    series_slug: 'series-01',
    number: '05',
    title: 'The Becoming',
    slug: 'the-becoming',
    story:
      'At the end of endurance lies integration. The battles you fought are no longer scars you hide; they are woven into the very structure of who you have become. The armor is gentle because it no longer fears the touch of the world.',
    hero_image: '/assets/chapter-05.svg',
    status: 'published',
    sort_order: 5,
    pull_quote:
      'The armor is gentle because it no longer fears the touch of the world.',
    product_slug: 'the-gentle-armor-tshirt',
  },
  // Series 02 Chapters
  {
    id: 6,
    series_id: 2,
    series_slug: 'series-02',
    number: '01',
    title: 'The Midnight Oil',
    slug: 'the-midnight-oil',
    story:
      'When the city lights dim, the true craft begins. Unrecorded hours spent iterating against the dark. A garment cut to feel like a warm second skin during prolonged concentration.',
    hero_image: '/assets/chapter-01.svg',
    status: 'published',
    sort_order: 1,
    pull_quote: 'Silence is the companion of dedicated craft.',
  },
  {
    id: 7,
    series_id: 2,
    series_slug: 'series-02',
    number: '02',
    title: 'The Solitary Desk',
    slug: 'the-solitary-desk',
    story:
      'No spectators, no validation. Only the steady rhythm of intentional work. Heavyweight organic cotton absorbs the chill of night air.',
    hero_image: '/assets/chapter-02.svg',
    status: 'published',
    sort_order: 2,
    pull_quote: 'Work done in secret shines in character.',
  },
  {
    id: 8,
    series_id: 2,
    series_slug: 'series-02',
    number: '03',
    title: 'The Drift',
    slug: 'the-drift',
    story:
      'Between fatigue and breakthrough lies the drift. Dropped shoulder tailoring allows fluid posture shifts through long hours.',
    hero_image: '/assets/chapter-03.svg',
    status: 'published',
    sort_order: 3,
    pull_quote: 'Surrendering to the rhythm of deep focus.',
  },
  {
    id: 9,
    series_id: 2,
    series_slug: 'series-02',
    number: '04',
    title: 'The Focus',
    slug: 'the-focus',
    story:
      'External noise fades to a murmur. The garment protects against distraction with tactile weight and calm density.',
    hero_image: '/assets/chapter-04.svg',
    status: 'published',
    sort_order: 4,
    pull_quote: 'Focus is a conscious fortress.',
  },
  {
    id: 10,
    series_id: 2,
    series_slug: 'series-02',
    number: '05',
    title: 'The First Light',
    slug: 'the-first-light',
    story:
      'The dawn returns without ceremony. The work is finished; the wearer stands unhurried, grounded in organic cotton comfort.',
    hero_image: '/assets/chapter-05.svg',
    status: 'published',
    sort_order: 5,
    pull_quote: 'Every sunrise confirms your endurance.',
  },
  // Series 03 Chapters
  {
    id: 11,
    series_id: 3,
    series_slug: 'series-03',
    number: '01',
    title: 'The Gravity',
    slug: 'the-gravity',
    story:
      'Weight is not a punishment; it is an anchor. To feel grounded against rapid changes in circumstance.',
    hero_image: '/assets/chapter-01.svg',
    status: 'published',
    sort_order: 1,
    pull_quote: 'Gravity roots the spirit when currents pull.',
  },
  {
    id: 12,
    series_id: 3,
    series_slug: 'series-03',
    number: '02',
    title: 'The Anchor',
    slug: 'the-anchor',
    story:
      'When storms arise, a solid foundation prevents drift. Concealed seamlines hold structural composure without chafing.',
    hero_image: '/assets/chapter-02.svg',
    status: 'published',
    sort_order: 2,
    pull_quote: 'Find your center before answering the wind.',
  },
  {
    id: 13,
    series_id: 3,
    series_slug: 'series-03',
    number: '03',
    title: 'The Undertow',
    slug: 'the-undertow',
    story:
      'Recognizing hidden pressures before they pull you under. Double-knit cotton provides reassuring density.',
    hero_image: '/assets/chapter-03.svg',
    status: 'published',
    sort_order: 3,
    pull_quote: 'Awareness is the first layer of sanctuary.',
  },
  {
    id: 14,
    series_id: 3,
    series_slug: 'series-03',
    number: '04',
    title: 'The Equilibrium',
    slug: 'the-equilibrium',
    story:
      'Balancing external resistance with internal calm. The silhouette remains poised and dignified.',
    hero_image: '/assets/chapter-04.svg',
    status: 'published',
    sort_order: 4,
    pull_quote: 'Equilibrium is active, sustained grace.',
  },
  {
    id: 15,
    series_id: 3,
    series_slug: 'series-03',
    number: '05',
    title: 'The Release',
    slug: 'the-release',
    story:
      'Letting go of weight that was never yours to carry. The garment breathes effortlessly against skin.',
    hero_image: '/assets/chapter-05.svg',
    status: 'published',
    sort_order: 5,
    pull_quote: 'True strength knows when to release.',
  },
  // Series 04 Chapters
  {
    id: 16,
    series_id: 4,
    series_slug: 'series-04',
    number: '01',
    title: 'The Horizon',
    slug: 'the-horizon',
    story:
      'Fixing your gaze beyond immediate friction. Continuous seam architecture engineered for long journeys.',
    hero_image: '/assets/chapter-01.svg',
    status: 'published',
    sort_order: 1,
    pull_quote: 'The horizon demands patient footsteps.',
  },
  {
    id: 17,
    series_id: 4,
    series_slug: 'series-04',
    number: '02',
    title: 'The Stride',
    slug: 'the-stride',
    story:
      'Movement without haste. The garment flexes with anatomical ease, never binding.',
    hero_image: '/assets/chapter-02.svg',
    status: 'published',
    sort_order: 2,
    pull_quote: 'Measure distance by consistency, not speed.',
  },
  {
    id: 18,
    series_id: 4,
    series_slug: 'series-04',
    number: '03',
    title: 'The Repetition',
    slug: 'the-repetition',
    story:
      'Doing the quiet work again and again. Heavyweight cotton weathers every cycle with dignity.',
    hero_image: '/assets/chapter-03.svg',
    status: 'published',
    sort_order: 3,
    pull_quote: 'Repetition transforms intention into truth.',
  },
  {
    id: 19,
    series_id: 4,
    series_slug: 'series-04',
    number: '04',
    title: 'The Posture',
    slug: 'the-posture',
    story:
      'Holding oneself upright through adversity. Dropped shoulders maintain an elegant, composed line.',
    hero_image: '/assets/chapter-04.svg',
    status: 'published',
    sort_order: 4,
    pull_quote: 'Posture is silent declaration.',
  },
  {
    id: 20,
    series_id: 4,
    series_slug: 'series-04',
    number: '05',
    title: 'The Continuity',
    slug: 'the-continuity',
    story:
      'The unbroken line that connects every quiet struggle to who you are today.',
    hero_image: '/assets/chapter-05.svg',
    status: 'published',
    sort_order: 5,
    pull_quote: 'Wear your battles. Carry your continuity.',
  },
  // Series 05 Chapters
  {
    id: 21,
    series_id: 5,
    series_slug: 'series-05',
    number: '01',
    title: 'The Inception',
    slug: 'the-inception',
    story:
      'Every era begins in silence. For The Quiet Grace, the inquiry began with an uncompromising pursuit of quiet presence and intentional silhouette.',
    hero_image: '/uploads/outfit-ideas-1793966194709-373233.jpg',
    status: 'published',
    sort_order: 1,
    pull_quote: 'True grace requires no noise.',
    product_slug: 'series-05-tshirt',
  },
  {
    id: 22,
    series_id: 5,
    series_slug: 'series-05',
    number: '02',
    title: 'The Form & Silhouette',
    slug: 'the-form',
    story:
      'Grounded composure. A garment engineered to shelter against external clamor while delivering unconstrained anatomical grace.',
    hero_image: '/uploads/outfit-ideas-1793966194709-373233.jpg',
    status: 'published',
    sort_order: 2,
    pull_quote: 'Composure is dignity in motion.',
    product_slug: 'series-05-tshirt',
  },
  {
    id: 23,
    series_id: 5,
    series_slug: 'series-05',
    number: '03',
    title: 'The Craft',
    slug: 'the-craft',
    story:
      'Concealed seam architecture and artisanal finishing. Hand-calibrated proportions that speak without shouting.',
    hero_image: '/uploads/outfit-ideas-1793966194709-373233.jpg',
    status: 'published',
    sort_order: 3,
    pull_quote: 'Artisanal precision in every concealed stitch.',
    product_slug: 'series-05-tshirt',
  },
  {
    id: 24,
    series_id: 5,
    series_slug: 'series-05',
    number: '04',
    title: 'The Poise',
    slug: 'the-poise',
    story:
      'Holding center amidst chaos. The tactile weight provides a psychological sanctuary for the wearer.',
    hero_image: '/uploads/outfit-ideas-1793966194709-373233.jpg',
    status: 'published',
    sort_order: 4,
    pull_quote: 'Peace is held at the center of the storm.',
    product_slug: 'series-05-tshirt',
  },
  {
    id: 25,
    series_id: 5,
    series_slug: 'series-05',
    number: '05',
    title: 'The Continuity',
    slug: 'the-continuity',
    story:
      'The enduring legacy of quiet strength. Garments made to outlive passing trends and accompany you through every silent victory.',
    hero_image: '/uploads/outfit-ideas-1793966194709-373233.jpg',
    status: 'published',
    sort_order: 5,
    pull_quote: 'A legacy woven in silent strength.',
    product_slug: 'series-05-tshirt',
  },
];

export const fallbackProducts = [
  {
    id: 1,
    chapter_id: 2,
    chapter_slug: 'the-silence',
    chapter_number: '02',
    chapter_title: 'The Silence',
    series_slug: 'series-01',
    name: 'The Gentle Armor T-Shirt',
    slug: 'the-gentle-armor-tshirt',
    description:
      'Crafted from heavyweight organic cotton with a garment-washed finish, this relaxed fit T-shirt rests with the resolute quiet of an ancient sanctuary. Features concealed seams, a reinforced ribbed crewneck collar, and dropped shoulder tailoring. Designed to provide a protective sanctuary in motion.',
    price: 999,
    images: [
      '/assets/photos/series-01-tshirt.webp',
      '/assets/tshirt-lineart.svg',
      '/assets/photos/tshirt-detail.webp',
      '/assets/photos/tshirt-fabric.webp',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 24,
    materials: [
      '100% Heavyweight Organic Cotton (Garment-Washed Finish)',
      'Concealed Seams with Single-Needle Interior Binding',
      'Reinforced 1x1 Ribbed Crewneck Collar',
      'Relaxed Fit Silhouette with Dropped Shoulder Tailoring',
    ],
    fit_notes:
      'Cut for an intentional relaxed fit. We recommend taking your usual size for the editorial silhouette shown, or sizing down for a closer structured fit.',
  },
  {
    id: 2,
    chapter_id: 7,
    chapter_slug: 'the-solitary-desk',
    chapter_number: '02',
    chapter_title: 'The Solitary Desk',
    series_slug: 'series-02',
    name: 'The Unrecorded Hours T-Shirt',
    slug: 'unrecorded-hours-tshirt',
    description:
      'Cut from dense 100% organic cotton in washed ash charcoal with an oversized drop-shoulder silhouette, this garment is tailored for long nights of solitary dedication. Features reinforced collar construction and concealed hem tape.',
    price: 1099,
    images: [
      '/assets/photos/series-02-tshirt.webp',
      '/assets/series-02-cover.svg',
      '/assets/photos/tshirt-detail.webp',
      '/assets/photos/tshirt-fabric.webp',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 30,
    materials: [
      '100% Dense Washed Ash Organic Cotton',
      'Oversized Drop-Shoulder Architectural Cut',
      'Concealed Hem Tape & Interior Reinforcement',
    ],
    fit_notes: 'Oversized boxy streetwear silhouette. Take your regular size.',
  },
  {
    id: 3,
    chapter_id: 12,
    chapter_slug: 'the-anchor',
    chapter_number: '02',
    chapter_title: 'The Anchor',
    series_slug: 'series-03',
    name: 'The Silent Weight Boxy Tee',
    slug: 'silent-weight-tshirt',
    description:
      'Engineered from structured double-knit organic cotton jersey in deep matte obsidian. Built with an architectural boxy silhouette, high ribbed collar, and center spine reinforcement to provide physical grounding.',
    price: 1199,
    images: [
      '/assets/photos/series-03-tshirt.webp',
      '/assets/series-03-cover.svg',
      '/assets/photos/tshirt-detail.webp',
      '/assets/photos/tshirt-fabric.webp',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 18,
    materials: [
      'Double-Knit Dense Organic Cotton Jersey',
      'High Thick Ribbed Collar',
      'Center Spine Architectural Seam',
    ],
    fit_notes: 'Heavyweight structured fit that holds shape off the body.',
  },
  {
    id: 4,
    chapter_id: 17,
    chapter_slug: 'the-stride',
    chapter_number: '02',
    chapter_title: 'The Stride',
    series_slug: 'series-04',
    name: 'The Unbroken Line Architectural Tee',
    slug: 'unbroken-line-tshirt',
    description:
      'Anatomical seam architecture cut in garment-washed faded black organic cotton. Flatlock concealed stitching curves fluidly with body motion, delivering effortless daily resilience.',
    price: 1299,
    images: [
      '/assets/photos/series-04-tshirt.webp',
      '/assets/series-04-cover.svg',
      '/assets/photos/tshirt-detail.webp',
      '/assets/photos/tshirt-fabric.webp',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 22,
    materials: [
      'Anatomical Curved Seamlines with Flatlock Stitching',
      'Faded Pitch-Black Pigment Wash',
      'Organic Cotton Breathable Knit',
    ],
    fit_notes: 'True to size with ergonomic freedom of movement.',
  },
  {
    id: 5,
    chapter_id: 22,
    chapter_slug: 'the-form',
    chapter_number: '02',
    chapter_title: 'The Form & Silhouette',
    series_slug: 'series-05',
    name: 'The Quiet Grace Kurta Set',
    slug: 'series-05-tshirt',
    description:
      'Crafted from premium fine-spun cotton in an ivory & olive floral palette with fluid, relaxed tailoring. The physical embodiment of SERIES 05— THE QUIET GRACE™.',
    price: 1999,
    images: [
      '/uploads/outfit-ideas-1793966194709-373233.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 24,
    materials: [
      'Artisanal Fine-Spun Cotton in Ivory & Olive Floral Motif',
      'Concealed Seamlines with Hand-Calibrated Soft Interior Binding',
      'Fluid Dropped Silhouette with Tonal Botanical Dupatta Accents',
      'Relaxed Contoured Hem Tailoring',
    ],
    fit_notes: 'Designed for fluid ease. Select your standard size for the intended editorial silhouette.',
  },
];

export const fallbackProduct = fallbackProducts[0];

/**
 * Fetch all Series
 */
export async function getSeries() {
  try {
    const res = await fetch(apiUrl('/series'), { cache: 'no-store' });
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    return data && data.length > 0 ? data : fallbackSeries;
  } catch (err) {
    console.warn('[API] Using archival fallback series data:', err.message);
    return fallbackSeries;
  }
}

/**
 * Fetch a single Series by slug
 */
export async function getSeriesBySlug(slug) {
  try {
    const res = await fetch(apiUrl(`/series/${slug}`), { cache: 'no-store' });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`[API] Using archival fallback for series ${slug}:`, err.message);
    const match = fallbackSeries.find((s) => s.slug === slug);
    return match || null;
  }
}

/**
 * Fetch Chapters for a Series
 */
export async function getChaptersForSeries(seriesSlug) {
  try {
    const res = await fetch(apiUrl(`/series/${seriesSlug}/chapters`), { cache: 'no-store' });
    if (res.status === 404) return [];
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn(`[API] Using archival fallback chapters for ${seriesSlug}:`, err.message);
    return fallbackChapters.filter((c) => c.series_slug === seriesSlug);
  }
}

/**
 * Fetch Chapter by slug
 */
export async function getChapterBySlug(seriesSlug, chapterSlug) {
  try {
    const res = await fetch(apiUrl(`/series/${seriesSlug}/chapters/${chapterSlug}`), {
      cache: 'no-store',
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`[API] Using archival fallback chapter ${chapterSlug}:`, err.message);
    const match = fallbackChapters.find(
      (c) => (c.series_slug === seriesSlug || !c.series_slug) && c.slug === chapterSlug
    );
    return match || null;
  }
}

/**
 * Fetch Product by slug
 */
export async function getProductBySlug(slug) {
  try {
    const res = await fetch(apiUrl(`/products/${slug}`), { cache: 'no-store' });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`[API] Using archival fallback for product ${slug}:`, err.message);
    const match = fallbackProducts.find((p) => p.slug === slug);
    return match || null;
  }
}

/**
 * Fetch all Products
 */
export async function getProducts() {
  try {
    const res = await fetch(apiUrl('/products'), { cache: 'no-store' });
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    return data && data.length > 0 ? data : fallbackProducts;
  } catch (err) {
    console.warn('[API] Using archival fallback products:', err.message);
    return fallbackProducts;
  }
}
