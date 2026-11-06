import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowUpRight } from 'lucide-react';
import SectionLabel from '../components/common/SectionLabel';
import Button from '../components/common/Button';
import { mediaUrl } from '../services/api';
import useSeriesList from '../hooks/useSeriesList';

const seriesPhotoMap = {
  'series-01': '/assets/photos/series-01-tshirt.webp',
  'series-02': '/assets/photos/series-02-tshirt.webp',
  'series-03': '/assets/photos/series-03-tshirt.webp',
  'series-04': '/assets/photos/series-04-tshirt.webp',
};

export default function Archive() {
  const seriesList = useSeriesList();

  return (
    <>
      <Helmet>
        <title>The Archive // Collections | QUIET BATTLES™</title>
        <link rel="canonical" href="https://quietbattles.com/archive" />
        <meta
          name="description"
          content="Explore the archival chronicles of Quiet Battles™. Slow luxury streetwear series engineered around emotional vulnerability, endurance, and quiet armor."
        />
        <meta property="og:title" content="The Archive // QUIET BATTLES™" />
        <meta
          property="og:description"
          content="Explore the archival chronicles of Quiet Battles™. Slow luxury streetwear series engineered around emotional vulnerability."
        />
        <meta property="og:image" content="/assets/photos/series-cover.webp" />
      </Helmet>

      {/* Editorial Header with generous top padding (>64px clearance below navbar) */}
      <div className="pt-44 sm:pt-48 md:pt-56 pb-20 md:pb-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="space-y-4 max-w-3xl mb-14 md:mb-20 mt-4 md:mt-8">
          <SectionLabel number="01" title="THE ARCHIVE" />
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-brand-cream leading-tight">
            Chronicles of Quiet Strength
          </h1>
          <p className="font-sans text-xs sm:text-sm text-zinc-300 font-light leading-relaxed max-w-xl">
            Each Series represents an emotional era—a sustained inquiry into the unseen weights we carry.
            Garments are archived as chapters, released in limited physical increments.
          </p>
        </div>

        {/* Series Cards Grid */}
        <div className="space-y-16 md:space-y-24">
          {seriesList.map((series, idx) => (
            <article
              key={series.id || series.slug}
              className="border border-zinc-800 bg-brand-charcoal/40 p-6 md:p-10 group hover:border-zinc-700 transition-colors duration-500 relative"
            >
              {/* Brass Corner Frames on top */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-brass z-20" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-brass z-20" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Visual Diptych: Technical Line Art SVG + Real Fabric Photo Side-by-Side */}
                <div className="lg:col-span-7 border border-zinc-800 bg-zinc-950 overflow-hidden relative">
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/80 aspect-[16/10] relative">
                    {/* Left: Technical Line Art SVG with Badges */}
                    <div className="relative overflow-hidden flex items-center justify-center bg-zinc-950 p-4">
                      {/* Badges on top */}
                      <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
                        <span className="font-mono text-[10px] md:text-xs uppercase tracking-ultra px-2.5 py-1 bg-black/90 border border-brand-brass text-brand-brass font-medium shadow-sm">
                          SERIES 0{idx + 1}
                        </span>
                        <span className="font-mono text-[10px] md:text-xs uppercase tracking-wider px-2.5 py-1 bg-black/90 border border-zinc-700 text-zinc-300 font-medium">
                          {series.status === 'published' ? 'AVAILABLE ARCHIVE' : 'COMING ATELIER'}
                        </span>
                      </div>

                      <img
                        src={mediaUrl(
                          series.lineart_image ||
                            series.cover_image ||
                            seriesPhotoMap[series.slug]
                        )}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.style.visibility = 'hidden';
                        }}
                        alt={`${series.title} Fabric Image`}
                        width="400"
                        height="500"
                        className="w-full h-full object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>

                    {/* Right: Real Photograph of the Fabric Garment */}
                    <div className="relative overflow-hidden flex items-center justify-center bg-zinc-950">
                      <img
                        src={mediaUrl(series.cover_image || seriesPhotoMap[series.slug] || '/assets/photos/series-01-tshirt.webp')}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.style.visibility = 'hidden';
                        }}
                        alt={`${series.title} Fabric Image`}
                        width="400"
                        height="500"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Narrative Details */}
                <div className="lg:col-span-5 space-y-6 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-brand-brass font-medium">
                        0{idx + 1} // CHRONICLE
                      </span>
                      <span className="text-zinc-600 text-xs">/</span>
                      <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest font-medium">
                        {series.chapters_count || 5} CHAPTERS
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-brand-cream">
                      {series.title}
                    </h2>

                    <p className="font-sans text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                      {series.description}
                    </p>
                  </div>

                  {/* Clean Editorial Action Row (Exact to screenshot) */}
                  <div className="flex flex-wrap items-center gap-6 pt-4">
                    <Button
                      to={`/archive/${series.slug}`}
                      variant="primary"
                      icon={ArrowUpRight}
                      className="!min-w-[170px] whitespace-nowrap"
                    >
                      ENTER SERIES
                    </Button>
                    <span className="font-mono text-xs text-brand-brass uppercase tracking-widest font-medium">
                      HEAVYWEIGHT ORGANIC COTTON
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
