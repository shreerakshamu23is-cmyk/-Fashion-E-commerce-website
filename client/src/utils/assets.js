/**
 * Archival Asset Utility
 * Resolves photographic WebP assets from /assets/photos/ with automatic fallback
 * to procedural SVG vectors if photographic files are not yet uploaded.
 */

export const ASSET_MAP = {
  hero: {
    photo: '/assets/photos/hero.webp',
    fallback: '/assets/hero-cinematic.svg',
    alt: 'Quiet Battles Atelier Hero',
  },
  seriesCover: {
    photo: '/assets/photos/series-cover.webp',
    fallback: '/assets/series-01-cover.svg',
    alt: 'The Gentle Armor Cover',
  },
  'chapter-01': {
    photo: '/assets/photos/chapter-01.webp',
    fallback: '/assets/chapter-01.svg',
    alt: 'Chapter 01 - The Beginning',
  },
  'chapter-02': {
    photo: '/assets/photos/chapter-02.webp',
    fallback: '/assets/chapter-02.svg',
    alt: 'Chapter 02 - The Silence',
  },
  'chapter-03': {
    photo: '/assets/photos/chapter-03.webp',
    fallback: '/assets/chapter-03.svg',
    alt: 'Chapter 03 - The Struggle',
  },
  'chapter-04': {
    photo: '/assets/photos/chapter-04.webp',
    fallback: '/assets/chapter-04.svg',
    alt: 'Chapter 04 - The Strength',
  },
  'chapter-05': {
    photo: '/assets/photos/chapter-05.webp',
    fallback: '/assets/chapter-05.svg',
    alt: 'Chapter 05 - The Becoming',
  },
  tshirtFront: {
    photo: '/assets/photos/tshirt-front.webp',
    fallback: '/assets/product-01-main.svg',
    alt: 'The Gentle Armor T-Shirt Front View',
  },
  tshirtBack: {
    photo: '/assets/photos/tshirt-back.webp',
    fallback: '/assets/product-01-back.svg',
    alt: 'The Gentle Armor T-Shirt Rear Profile',
  },
  tshirtDetail: {
    photo: '/assets/photos/tshirt-detail.webp',
    fallback: '/assets/product-01-detail.svg',
    alt: 'The Gentle Armor T-Shirt Seam Detail',
  },
  tshirtFabric: {
    photo: '/assets/photos/tshirt-fabric.webp',
    fallback: '/assets/product-01-texture.svg',
    alt: 'Heavyweight Organic Cotton Knit Texture',
  },
};

/**
 * Image component helper that attempts to load the photographic webp,
 * gracefully falling back to the SVG placeholder upon error without any visual breakage.
 */
export function handleImageFallback(e, fallbackSrc) {
  if (e.target.src !== fallbackSrc) {
    e.target.src = fallbackSrc;
  }
}

