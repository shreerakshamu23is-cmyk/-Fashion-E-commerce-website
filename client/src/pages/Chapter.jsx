import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, ArrowUpRight, ShoppingBag, Check } from 'lucide-react';
import SectionLabel from '../components/common/SectionLabel';
import Button from '../components/common/Button';
import {
  getChapterBySlug,
  getChaptersForSeries,
  getSeriesBySlug,
  fallbackProducts,
} from '../services/api';
import { useCart } from '../context/CartContext';
import NotFound from './NotFound';

const seriesPhotoMap = {
  'series-01': '/assets/photos/series-01-tshirt.webp',
  'series-02': '/assets/photos/series-02-tshirt.webp',
  'series-03': '/assets/photos/series-03-tshirt.webp',
  'series-04': '/assets/photos/series-04-tshirt.webp',
  'series-05': '/uploads/outfit-ideas-1793966194709-373233.jpg',
};

export default function Chapter() {
  const { seriesSlug, chapterSlug } = useParams();
  const [chapter, setChapter] = useState(null);
  const [series, setSeries] = useState(null);
  const [allChapters, setAllChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const { formatPrice, addToCart } = useCart();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setNotFound(false);

    if (!seriesSlug || !chapterSlug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    Promise.all([
      getChapterBySlug(seriesSlug, chapterSlug),
      getChaptersForSeries(seriesSlug),
      getSeriesBySlug(seriesSlug),
    ]).then(([chapData, listData, seriesData]) => {
      if (mounted) {
        if (!seriesData) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        let resolvedChapter = chapData;
        if (!resolvedChapter || resolvedChapter.slug !== chapterSlug) {
          // Check if chapter slug exists in the series chapter list
          const match = Array.isArray(listData) ? listData.find((c) => c.slug === chapterSlug) : null;
          if (!match) {
            setNotFound(true);
            setLoading(false);
            return;
          }
          resolvedChapter = match;
        }

        setChapter(resolvedChapter);
        setSeries(seriesData);
        setAllChapters(Array.isArray(listData) ? listData : []);
        setLoading(false);
      }
    }).catch(() => {
      if (mounted) {
        setNotFound(true);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [seriesSlug, chapterSlug]);

  if (notFound) {
    return <NotFound />;
  }

  if (loading || !chapter) {
    return (
      <div className="pt-44 pb-32 text-center text-zinc-400 font-mono text-xs">
        RETRIEVING ARCHIVAL CHAPTER...
      </div>
    );
  }

  // Find previous and next chapter indices
  const currentIndex = allChapters.findIndex((c) => c.slug === chapterSlug);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex > -1 && currentIndex < allChapters.length - 1
      ? allChapters[currentIndex + 1]
      : null;

  const heroPhoto = `/assets/photos/chapter-${chapter.number || '02'}.webp`;
  const heroFallback = `/assets/chapter-${chapter.number || '02'}.svg`;
  const seriesTitle = series?.title || 'QUIET BATTLES™';

  return (
    <>
      <Helmet>
        <title>{`Chapter ${chapter.number}: ${chapter.title} | ${seriesTitle}`}</title>
        <link rel="canonical" href={`https://quietbattles.com/archive/${seriesSlug}/${chapterSlug}`} />
        <meta
          name="description"
          content={`Chapter ${chapter.number} // ${chapter.title} of ${seriesTitle}. ${chapter.story.slice(0, 150)}...`}
        />
        <meta property="og:title" content={`Chapter ${chapter.number}: ${chapter.title} // ${seriesTitle}`} />
        <meta property="og:description" content={chapter.story} />
        <meta property="og:image" content={heroPhoto} />
      </Helmet>

      {/* 1. Full-Bleed Atmospheric Hero */}
      <section className="relative min-h-[85vh] flex items-end justify-start bg-brand-black overflow-hidden pt-32 pb-20">
        <img
          src={heroPhoto}
          onError={(e) => {
            e.target.src = heroFallback;
          }}
          alt={chapter.title}
          width="1920"
          height="1080"
          className="absolute inset-0 w-full h-full object-cover opacity-35 filter contrast-125 select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black/80 via-transparent to-brand-black/40 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          {/* Breadcrumb navigation (Requirement 2.c: Show active series title in breadcrumb) */}
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 mb-6 tracking-widest uppercase flex-wrap">
            <Link
              to="/archive"
              className="hover:text-brand-brass transition-colors min-h-[44px] inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>The Archive</span>
            </Link>
            <span className="text-zinc-600">/</span>
            <Link to={`/archive/${seriesSlug}`} className="hover:text-brand-brass transition-colors font-medium">
              {seriesTitle}
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-brand-brass font-bold">Ch. {chapter.number} : {chapter.title}</span>
          </div>

          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-brand-brass font-medium">
                CHAPTER {chapter.number}
              </span>
              <span className="text-zinc-600">//</span>
              <span className="font-mono text-xs text-zinc-400 uppercase tracking-super font-medium">
                {seriesTitle}
              </span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-brand-cream leading-none tracking-tight">
              {chapter.title}
            </h1>

            <p className="font-serif text-xl sm:text-2xl text-brand-brass-light font-extralight italic pt-1">
              "The weight without sound."
            </p>
          </div>
        </div>
      </section>

      {/* 2. Storytelling Narrative Text Blocks */}
      <section className="py-20 md:py-32 bg-brand-black text-brand-cream relative">
        <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-12">
          {/* Main Chapter Intro Story */}
          <div className="space-y-6">
            <SectionLabel number={chapter.number} title="THE NARRATIVE INQUIRY" />
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-light leading-relaxed text-zinc-200">
              {chapter.story}
            </p>
          </div>

          {chapter.extended_story?.length > 0 && (
            <div className="space-y-6 text-zinc-300 font-light text-base sm:text-lg leading-relaxed pt-8 border-t border-zinc-800">
              {chapter.extended_story.map((para, i) => <p key={i}>{para}</p>)}
            </div>
          )}
        </div>
      </section>

      {/* 3. Poignant Editorial Pull Quote */}
      <section className="py-20 md:py-32 bg-brand-black text-brand-cream text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-5">
          <div className="w-12 h-[1px] bg-brand-brass mx-auto mb-6" />
          <blockquote className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-brand-cream italic leading-tight">
            "{chapter.pull_quote || 'Silence is not the absence of war; it is the mastery of your own noise.'}"
          </blockquote>
          <div className="w-12 h-[1px] bg-brand-brass mx-auto mt-6" />
          <span className="font-mono text-xs tracking-super text-zinc-400 uppercase block pt-2 font-medium">
            CHAPTER {chapter.number} MEDITATION
          </span>
        </div>
      </section>

      {/* 4. "Wear this chapter" block */}
      {(() => {
        const currentProd = chapter.product || fallbackProducts.find((p) => p.series_slug === seriesSlug || p.slug === chapter.product_slug) || {
          name: `${seriesTitle} Artifact`,
          slug: `${seriesSlug}-tshirt`,
          price: 999,
          description: series?.description || 'Crafted with intentional quiet composure and luxury tailoring.',
        };
        const currentPhoto = series?.cover_image || seriesPhotoMap[seriesSlug] || currentProd.images?.[0] || '/assets/photos/series-01-tshirt.webp';
        const lineArtSvg = seriesSlug === 'series-01' ? '/assets/tshirt-lineart.svg' : `/assets/${seriesSlug}-cover.svg`;

        const handleAdd = () => {
          addToCart(currentProd, selectedSize, 1);
          setAddedAnimation(true);
          setTimeout(() => setAddedAnimation(false), 2000);
        };

        return (
          <section className="py-16 md:py-24 bg-[#121212] text-brand-cream border-t border-zinc-800">
            <div className="max-w-5xl mx-auto px-6 md:px-12">
              <div className="bg-brand-charcoal border border-brand-brass/40 p-6 md:p-10 relative overflow-hidden shadow-[0_0_30px_rgba(197,160,89,0.08)]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Product Diptych: Technical Line Art + Real Fabric Photo */}
                  <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 overflow-hidden relative group">
                    <div className="grid grid-cols-2 divide-x divide-zinc-800/80 aspect-[16/10] relative">
                      {/* Left: Line Art */}
                      <div className="relative p-2 flex items-center justify-center bg-zinc-950">
                        <div className="absolute top-2.5 left-2.5 bg-black/85 px-2 py-0.5 text-[10px] font-mono text-brand-brass uppercase tracking-widest border border-brand-brass/40 font-medium z-10">
                          CAD FLAT
                        </div>
                        <img
                          src={lineArtSvg}
                          onError={(e) => {
                            e.target.src = '/assets/tshirt-lineart.svg';
                          }}
                          alt={`${currentProd.name} Line Art`}
                          width="300"
                          height="350"
                          className="w-full h-full object-contain p-1"
                        />
                      </div>

                      {/* Right: Real Photo */}
                      <div className="relative flex items-center justify-center bg-zinc-950 overflow-hidden">
                        <img
                          src={currentPhoto}
                          onError={(e) => {
                            e.target.src = '/assets/photos/series-01-tshirt.webp';
                          }}
                          alt={`${currentProd.name} Real Fabric Garment`}
                          width="300"
                          height="350"
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Product Info & CTA */}
                  <div className="lg:col-span-7 space-y-5">
                    <div>
                      <span className="font-mono text-xs tracking-super text-brand-brass uppercase block font-medium">
                        MATERIAL EMBODIMENT
                      </span>
                      <h2 className="font-serif text-3xl sm:text-4xl font-light text-brand-cream mt-1">
                        Wear This Chapter: {currentProd.name}
                      </h2>
                      <div className="font-mono text-lg text-brand-brass font-bold mt-2">
                        {formatPrice(currentProd.price)}
                      </div>
                    </div>

                    <p className="font-sans text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                      {currentProd.description}
                    </p>

                    {/* Interactive Size Selection */}
                    <div className="flex items-center gap-3 pt-1">
                      <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-medium">
                        SIZE:
                      </span>
                      <div className="flex items-center gap-1.5">
                        {['S', 'M', 'L', 'XL'].map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setSelectedSize(sz)}
                            className={`px-3 py-1 text-xs font-mono uppercase transition-all min-h-[32px] min-w-[32px] flex items-center justify-center border ${
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

                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                      <button
                        type="button"
                        onClick={handleAdd}
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
                        size="md"
                        className="min-h-[44px]"
                        icon={ArrowUpRight}
                      >
                        Garment Specs
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* 5. Chapter Cycle Navigation (Prev / Next) (Requirement 13) */}
      <section className="py-12 bg-brand-black border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {prevChapter ? (
            <Link
              to={`/archive/${seriesSlug}/${prevChapter.slug}`}
              className="group flex items-center gap-3 text-zinc-300 hover:text-brand-brass transition-colors min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <div>
                <span className="block font-mono text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
                  PREVIOUS CHAPTER
                </span>
                <span className="font-serif text-lg font-light text-brand-cream group-hover:text-brand-brass">
                  Ch. {prevChapter.number} : {prevChapter.title}
                </span>
              </div>
            </Link>
          ) : (
            <div className="font-mono text-xs text-zinc-600 uppercase tracking-widest">
              FIRST CHAPTER
            </div>
          )}

          {nextChapter ? (
            <Link
              to={`/archive/${seriesSlug}/${nextChapter.slug}`}
              className="group flex items-center gap-3 text-right text-zinc-300 hover:text-brand-brass transition-colors min-h-[44px]"
            >
              <div>
                <span className="block font-mono text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
                  NEXT CHAPTER
                </span>
                <span className="font-serif text-lg font-light text-brand-cream group-hover:text-brand-brass">
                  Ch. {nextChapter.number} : {nextChapter.title}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <Link
              to={`/archive/${seriesSlug}`}
              className="font-mono text-xs text-brand-brass uppercase tracking-widest min-h-[44px] flex items-center font-medium"
            >
              Back to {seriesTitle} &rarr;
            </Link>
          )}
        </div>
      </section>
    </>
  );
}
