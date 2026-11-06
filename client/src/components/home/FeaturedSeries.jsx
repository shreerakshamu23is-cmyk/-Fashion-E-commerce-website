import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronRight, Layers } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '../common/SectionLabel';
import Button from '../common/Button';
import { getSeries, getChaptersForSeries, getProducts, mediaUrl } from '../../services/api';

gsap.registerPlugin(ScrollTrigger);

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

export default function FeaturedSeries() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  const [seriesList, setSeriesList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all published series (Requirement 2.e: list every published series)
  useEffect(() => {
    let mounted = true;
    getSeries().then((data) => {
      if (mounted && Array.isArray(data)) {
        const published = data.filter((s) => s.status === 'published' || !s.status);
        setSeriesList(published);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // When selected series changes, fetch its chapters
  useEffect(() => {
    if (!seriesList.length) return;
    const current = seriesList[selectedIndex] || seriesList[0];
    let mounted = true;
    getChaptersForSeries(current.slug).then((chaps) => {
      if (mounted && Array.isArray(chaps)) {
        setChapters(chaps);
      }
    });
    return () => {
      mounted = false;
    };
  }, [seriesList, selectedIndex]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 45,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [selectedIndex]);

  const currentSeries = seriesList[selectedIndex] || {
    title: 'SERIES 01 – THE GENTLE ARMOR™',
    slug: 'series-01',
    description:
      'A collection about quiet strength and everyday courage. Heavyweight organic cotton, relaxed fit silhouettes, and concealed seamlines.',
    cover_image: '/assets/photos/series-01-tshirt.webp',
  };

  const currentProd = seriesProductMap[currentSeries.slug] || {
    name: currentSeries.product_name || `${currentSeries.title} T-Shirt`,
    slug: currentSeries.product_slug || `${currentSeries.slug}-tshirt`,
    price: currentSeries.product_price || 999,
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 bg-brand-black text-brand-cream relative overflow-hidden hairline-border-t"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-8 md:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <SectionLabel number="02" title="FEATURED COLLECTIONS" />
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-brand-cream mt-3">
              {currentSeries.title}
            </h2>
          </div>
          <Button to="/archive" variant="outline" size="sm" icon={ArrowUpRight} className="min-h-[44px]">
            View All Series
          </Button>
        </div>

        {/* Series Selector Strip: List every published series (Requirement 2.e) */}
        {seriesList.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-zinc-800 pb-4">
            <span className="font-mono text-xs text-brand-brass uppercase tracking-widest mr-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>COLLECTIONS:</span>
            </span>
            {seriesList.map((s, idx) => (
              <button
                key={s.id || s.slug}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-all min-h-[44px] flex items-center gap-2 border ${
                  selectedIndex === idx
                    ? 'border-brand-brass bg-brand-brass text-brand-black font-bold shadow-sm'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-brand-cream hover:border-zinc-700'
                }`}
              >
                <span>0{idx + 1}</span>
                <span className="font-serif normal-case tracking-normal text-sm font-light">
                  {s.title.replace(/SERIES \d+\s*–\s*/i, '')}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Featured Large Cinematic Card with Brass Corners */}
        <div
          ref={cardRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-brand-charcoal/80 border border-zinc-800 p-6 md:p-10 relative group hover:border-zinc-700 transition-colors duration-500"
        >
          {/* Brass Corner Frames on top */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-brass z-20" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-brass z-20" />

          {/* Visual Diptych: Technical Line Art SVG + Real Fabric Photo Side-by-Side */}
          <div className="lg:col-span-7 border border-zinc-800 bg-zinc-950 overflow-hidden relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/80 aspect-[16/10] relative">
              {/* Left: Technical Line Art SVG with Badges */}
              <div className="relative overflow-hidden flex items-center justify-center bg-zinc-950 p-4">
                <div className="absolute top-4 left-4 z-20 font-mono text-[10px] md:text-xs text-brand-brass uppercase tracking-ultra bg-black/90 px-2.5 py-1 border border-brand-brass font-medium shadow-sm">
                  {chapters.length || 5} CHAPTER CHRONICLE
                </div>

                <img
                  src={mediaUrl(currentSeries.lineart_image || `/assets/${currentSeries.slug}-cover.svg`)}
                  onError={(e) => {
                    e.target.src = '/assets/tshirt-lineart.svg';
                  }}
                  alt={`${currentSeries.title} Technical Line Art`}
                  width="400"
                  height="500"
                  className="w-full h-full object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Right: Real Photograph of the Fabric Garment */}
              <div className="relative overflow-hidden flex items-center justify-center bg-zinc-950">
                <img
                  src={mediaUrl(currentSeries.cover_image || seriesPhotoMap[currentSeries.slug] || '/assets/photos/series-01-tshirt.webp')}
                  onError={(e) => {
                    e.target.src = '/assets/photos/series-01-tshirt.webp';
                  }}
                  alt={`${currentSeries.title} Real Fabric Garment`}
                  width="400"
                  height="500"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Chapters and Narrative Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-7">
            <div className="space-y-3">
              <span className="font-mono text-xs tracking-super text-brand-brass uppercase block font-medium">
                EDITORIAL STUDY
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-light text-brand-cream">
                {currentSeries.title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                {currentSeries.description}
              </p>
            </div>

            {/* Chapters list for current active series */}
            <div className="space-y-2 pt-3 border-t border-zinc-800">
              <span className="font-mono text-xs tracking-widest text-zinc-400 uppercase block mb-2 font-medium">
                CHAPTER CHRONOLOGY
              </span>
              {chapters.map((chap) => (
                <Link
                  key={chap.id || chap.slug}
                  to={`/archive/${currentSeries.slug}/${chap.slug}`}
                  className="flex items-center justify-between py-2 border-b border-zinc-800/60 hover:border-brand-brass text-zinc-300 hover:text-brand-cream transition-colors group/item min-h-[44px]"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-brand-brass font-medium">
                      {chap.number}
                    </span>
                    <span className="font-serif text-base font-light text-zinc-200 group-hover/item:text-brand-cream">
                      {chap.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-zinc-400 group-hover/item:text-zinc-200 font-medium">
                      {chap.status}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover/item:text-brand-brass transition-transform group-hover/item:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>

            {/* CTAs */}
            <div className="pt-3 flex flex-col sm:flex-row gap-4">
              <Button
                to={`/archive/${currentSeries.slug}`}
                variant="brass"
                size="md"
                className="w-full sm:w-auto min-h-[44px] min-w-[170px] whitespace-nowrap flex-shrink-0 text-center justify-center font-bold"
              >
                Enter {currentSeries.title.replace(/SERIES \d+\s*–\s*/i, '')}
              </Button>
              <Button
                to={`/product/${currentProd.slug}`}
                variant="outline"
                size="md"
                className="w-full sm:w-auto min-h-[44px]"
              >
                View Garment &bull; ₹{currentProd.price}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
