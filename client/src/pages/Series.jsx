import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowUpRight, ShoppingBag, Check } from 'lucide-react';
import SectionLabel from '../components/common/SectionLabel';
import Button from '../components/common/Button';
import { getSeriesBySlug, getChaptersForSeries, getProducts, mediaUrl } from '../services/api';
import { useCart } from '../context/CartContext';
import NotFound from './NotFound';

const seriesPhotoMap = {
  'series-01': '/assets/photos/series-01-tshirt.webp',
  'series-02': '/assets/photos/series-02-tshirt.webp',
  'series-03': '/assets/photos/series-03-tshirt.webp',
  'series-04': '/assets/photos/series-04-tshirt.webp',
  'series-05': '/uploads/outfit-ideas-1793966194709-373233.jpg',
};

const seriesProductMap = {
  'series-01': {
    name: 'The Gentle Armor T-Shirt',
    slug: 'the-gentle-armor-tshirt',
    price: 999,
  },
  'series-02': {
    name: 'The Unrecorded Hours T-Shirt',
    slug: 'unrecorded-hours-tshirt',
    price: 1099,
  },
  'series-03': {
    name: 'The Silent Weight Boxy Tee',
    slug: 'silent-weight-tshirt',
    price: 1199,
  },
  'series-04': {
    name: 'The Unbroken Line Architectural Tee',
    slug: 'unbroken-line-tshirt',
    price: 1299,
  },
  'series-05': {
    name: 'The Quiet Grace Kurta Set',
    slug: 'series-05-tshirt',
    price: 1999,
  },
};

export default function Series() {
  const { seriesSlug } = useParams();
  const [series, setSeries] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const { addToCart, formatPrice } = useCart();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setNotFound(false);

    if (!seriesSlug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    Promise.all([getSeriesBySlug(seriesSlug), getChaptersForSeries(seriesSlug)]).then(
      ([seriesData, chaptersData]) => {
        if (mounted) {
          if (!seriesData) {
            setNotFound(true);
            setLoading(false);
            return;
          }
          setSeries(seriesData);

          let resolvedChapters = Array.isArray(chaptersData) ? [...chaptersData] : [];

          // If no chapters currently exist for this series, auto-provision 5 dynamic chapters
          if (resolvedChapters.length === 0) {
            const cleanTitle = (seriesData.title || 'ARCHIVE').replace(/SERIES \d+\s*[-–—]\s*/i, '');
            const cover = seriesData.cover_image || '/assets/photos/series-01-tshirt.webp';
            resolvedChapters = [
              {
                id: 1,
                number: '01',
                title: 'The Inception',
                slug: `${seriesSlug}-the-inception`,
                story: `Every era begins in silence. For ${cleanTitle}, the inquiry began with an uncompromising pursuit of quiet presence and intentional silhouette.`,
                status: 'published',
                hero_image: cover,
              },
              {
                id: 2,
                number: '02',
                title: 'The Form & Silhouette',
                slug: `${seriesSlug}-the-form`,
                story: `Grounded composure. A garment engineered to shelter against external clamor while delivering unconstrained anatomical grace.`,
                status: 'published',
                hero_image: cover,
              },
              {
                id: 3,
                number: '03',
                title: 'The Craft',
                slug: `${seriesSlug}-the-craft`,
                story: `Concealed seam architecture and artisanal finishing. Hand-calibrated proportions that speak without shouting.`,
                status: 'published',
                hero_image: cover,
              },
              {
                id: 4,
                number: '04',
                title: 'The Poise',
                slug: `${seriesSlug}-the-poise`,
                story: `Holding center amidst chaos. The tactile weight provides a psychological sanctuary for the wearer.`,
                status: 'published',
                hero_image: cover,
              },
              {
                id: 5,
                number: '05',
                title: 'The Continuity',
                slug: `${seriesSlug}-the-continuity`,
                story: `The enduring legacy of quiet strength. Garments made to outlive passing trends and accompany you through every silent victory.`,
                status: 'published',
                hero_image: cover,
              },
            ];
          }

          setChapters(resolvedChapters);
          setLoading(false);
        }
      }
    ).catch(() => {
      if (mounted) {
        setNotFound(true);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [seriesSlug]);

  if (notFound) {
    return <NotFound />;
  }

  if (loading || !series) {
    return (
      <div className="pt-40 pb-32 text-center text-zinc-400 font-mono text-xs">
        RETRIEVING ARCHIVAL SERIES...
      </div>
    );
  }

  const rawProd = seriesProductMap[seriesSlug] || {
    name: series.product_name || `${series.title} T-Shirt`,
    slug: series.product_slug || `${seriesSlug}-tshirt`,
    price: series.product_price || 999,
  };

  const currentProd = {
    id: series.id || 1,
    ...rawProd,
    images: [series.cover_image || seriesPhotoMap[seriesSlug] || '/assets/photos/series-01-tshirt.webp'],
    sizes: ['S', 'M', 'L', 'XL'],
  };

  const handleAddToCart = () => {
    addToCart(currentProd, selectedSize, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <>
      <Helmet>
        <title>{`${series.title} | QUIET BATTLES™`}</title>
        <link rel="canonical" href={`https://quietbattles.com/archive/${seriesSlug}`} />
        <meta
          name="description"
          content={`${series.title} - A collection about quiet strength and everyday courage.`}
        />
        <meta property="og:title" content={`${series.title} // QUIET BATTLES™`} />
        <meta property="og:description" content={series.description} />
        <meta property="og:image" content={mediaUrl(series.cover_image || seriesPhotoMap[seriesSlug] || '/assets/photos/series-cover.webp')} />
      </Helmet>

      <div className="pt-32 md:pt-40 pb-20 md:pb-32 max-w-7xl mx-auto px-6 md:px-12">
        {/* Breadcrumb and Back navigation (Requirement 2.c: Show active series title in breadcrumb) */}
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 mb-8 tracking-widest uppercase">
          <Link
            to="/archive"
            className="hover:text-brand-brass transition-colors min-h-[44px] inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>The Archive</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-brand-brass font-bold">{series.title}</span>
        </div>

        {/* Series Hero Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16 md:mb-28">
          <div className="lg:col-span-7 space-y-6">
            <SectionLabel number={series.slug.replace('series-', '0')} title="SERIES CHRONICLE" />
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-brand-cream leading-[1.1]">
              {series.title}
            </h1>

            {/* Tagline */}
            <p className="font-serif text-xl sm:text-2xl text-brand-brass font-light italic">
              "A collection about quiet strength and everyday courage."
            </p>

            <p className="font-sans text-sm md:text-base text-zinc-300 font-light leading-relaxed max-w-2xl">
              {series.description}
            </p>

            {/* Fabric specification and action bar */}
            <div className="space-y-4 border-t border-zinc-800 pt-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-300 tracking-wider font-medium">
                <span>FABRIC: ORGANIC COTTON // FIT: RELAXED // {chapters.length} CHAPTERS</span>
                <span className="text-brand-brass font-bold text-sm">
                  PIECE: {currentProd.name.toUpperCase()} &bull; {formatPrice(currentProd.price)}
                </span>
              </div>

              {/* Interactive Size Selector & Add to Cart Action Bar */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-medium">
                    SIZE:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {['S', 'M', 'L', 'XL'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1.5 text-xs font-mono uppercase transition-all min-h-[36px] min-w-[36px] flex items-center justify-center border ${
                          selectedSize === sz
                            ? 'border-brand-brass bg-brand-brass text-brand-black font-bold shadow-sm'
                            : 'border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:border-zinc-500'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`min-h-[44px] px-6 py-2.5 text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all ${
                      addedAnimation
                        ? 'bg-emerald-600 text-white border border-emerald-500'
                        : 'bg-brand-brass text-brand-black hover:bg-brand-brass-light border border-brand-brass shadow-md'
                    }`}
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added To Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add To Cart &bull; {formatPrice(currentProd.price)}</span>
                      </>
                    )}
                  </button>

                  <Button
                    to={`/product/${currentProd.slug}`}
                    variant="outline"
                    size="sm"
                    className="min-h-[44px]"
                  >
                    Garment Specs
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Series Visual Card: Line Art SVG + Real Fabric Photo Diptych */}
          <div className="lg:col-span-5 border border-zinc-800 bg-zinc-950 overflow-hidden relative group">
            {/* Brass Corner Frames on top */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-brass z-20" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-brass z-20" />

            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/80 aspect-[16/11] relative">
              {/* Left: Technical Line Art SVG with Badges */}
              <div className="relative overflow-hidden flex items-center justify-center bg-zinc-950 p-4">
                <div className="absolute top-3 left-3 z-20 font-mono text-[10px] text-brand-brass tracking-widest uppercase font-medium bg-black/90 px-2 py-0.5 border border-brand-brass">
                  LINE ARCHIVE
                </div>

                <img
                  src={mediaUrl(series.lineart_image || `/assets/${seriesSlug}-cover.svg`)}
                  onError={(e) => {
                    e.target.src = '/assets/tshirt-lineart.svg';
                  }}
                  alt={`${series.title} Technical Line Art`}
                  width="400"
                  height="500"
                  className="w-full h-full object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Right: Real Photograph of the Fabric Garment */}
              <div className="relative overflow-hidden flex items-center justify-center bg-zinc-950">
                <img
                  src={mediaUrl(series.cover_image || seriesPhotoMap[seriesSlug] || '/assets/photos/series-01-tshirt.webp')}
                  onError={(e) => {
                    e.target.src = '/assets/photos/series-01-tshirt.webp';
                  }}
                  alt={`${series.title} Real Fabric T-Shirt`}
                  width="400"
                  height="500"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            <div className="absolute bottom-3 left-3 z-20 font-mono text-[10px] text-brand-brass tracking-widest uppercase font-medium bg-black/85 px-2.5 py-1 border border-brand-brass/30">
              ARCHIVE REF: {seriesSlug.toUpperCase()}-2026
            </div>
          </div>
        </div>

        {/* Chapters Section */}
        <div className="space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-800 pb-5 gap-4">
            <div>
              <span className="font-mono text-xs tracking-super text-brand-brass uppercase block font-medium">
                CHRONOLOGICAL CYCLE
              </span>
              <h2 className="font-serif text-3xl font-light text-brand-cream mt-1">
                The Archival Chapters
              </h2>
            </div>
            <span className="font-mono text-xs text-zinc-400 tracking-wider font-medium">
              TOTAL CHAPTERS: {chapters.length < 10 ? `0${chapters.length}` : chapters.length}
            </span>
          </div>

          {/* Chapters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chapters.map((chap, chapIdx) => {
              const seriesCover = series.cover_image || seriesPhotoMap[seriesSlug] || '/assets/photos/series-01-tshirt.webp';
              const chapterImg =
                chap.hero_image && !chap.hero_image.endsWith('.svg')
                  ? chap.hero_image
                  : seriesCover;
              const isFeatured = chap.number === '02' || chapIdx === 1;

              return (
                <article
                  key={chap.id || chap.slug || chapIdx}
                  className={`border bg-brand-charcoal/50 p-6 flex flex-col justify-between group transition-all duration-300 relative ${
                    isFeatured
                      ? 'border-brand-brass/60 bg-brand-charcoal/80 shadow-[0_0_20px_rgba(197,160,89,0.08)]'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {isFeatured && (
                    <div className="absolute -top-3 right-6 bg-brand-brass text-brand-black text-[10px] font-mono tracking-widest uppercase px-3 py-1 font-bold shadow-md">
                      FEATURED CHAPTER &amp; GARMENT
                    </div>
                  )}

                  <div className="space-y-5">
                    {/* Chapter Image Thumbnail (uses series/chapter photo, never defaults to unrelated shirt) */}
                    <div className="overflow-hidden aspect-[16/11] bg-zinc-950 border border-zinc-800 relative">
                      <img
                        src={mediaUrl(chapterImg)}
                        onError={(e) => {
                          e.target.src = seriesCover;
                        }}
                        alt={`${series.title} – Chapter ${chap.number}: ${chap.title}`}
                        width="500"
                        height="350"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                      <div className="absolute top-3 left-3 bg-black/85 px-2.5 py-1 border border-zinc-700 font-mono text-xs text-brand-brass font-medium">
                        CH. {chap.number}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-[10px] font-mono tracking-widest text-zinc-300 uppercase truncate">
                        PHASE 0{chapIdx + 1} // {chap.title}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-brand-brass tracking-wider uppercase font-medium">
                          CHAPTER {chap.number}
                        </span>
                        <span className="font-mono text-[11px] text-zinc-400 tracking-wider uppercase font-medium">
                          {chap.status || 'published'}
                        </span>
                      </div>

                      <h3 className="font-serif text-2xl font-light text-brand-cream group-hover:text-brand-brass transition-colors">
                        {chap.title}
                      </h3>

                      <p className="font-sans text-xs sm:text-sm text-zinc-300 font-light leading-relaxed line-clamp-3">
                        {chap.story}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 mt-6 border-t border-zinc-800 flex items-center justify-between">
                    <Link
                      to={`/archive/${seriesSlug}/${chap.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-mono text-zinc-200 hover:text-brand-brass tracking-wider uppercase transition-colors min-h-[44px] py-1 font-medium"
                    >
                      <span>Read Chapter</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>

                    {isFeatured && (
                      <Link
                        to={`/product/${currentProd.slug}`}
                        className="text-xs font-mono text-brand-brass tracking-wider uppercase hover:underline min-h-[44px] flex items-center font-bold"
                      >
                        Wear Piece &bull; {formatPrice(currentProd.price)} &rarr;
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
