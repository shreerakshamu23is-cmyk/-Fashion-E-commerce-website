import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Button from '../common/Button';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const headlineRef = useRef(null);
  const subtextRef = useRef(null);
  const ctaRef = useRef(null);
  const tshirtImgRef = useRef(null);

  const [heroImgSrc, setHeroImgSrc] = useState('/assets/photos/series-01-tshirt.webp');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(headlineRef.current?.children || [], {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.15,
      });

      gsap.from(subtextRef.current, {
        y: 25,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        delay: 0.45,
      });

      gsap.from(ctaRef.current, {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.65,
      });

      if (tshirtImgRef.current) {
        gsap.from(tshirtImgRef.current, {
          scale: 0.94,
          opacity: 0,
          duration: 1.4,
          ease: 'power3.out',
          delay: 0.3,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-black pt-28 pb-16 md:py-24"
    >
      {/* Mobile Background Image with Overlay */}
      <div className="absolute inset-0 z-0 lg:hidden overflow-hidden pointer-events-none">
        <img
          src={heroImgSrc}
          onError={() => setHeroImgSrc('/assets/product-01-main.svg')}
          alt="The Gentle Armor T-Shirt Editorial"
          width="800"
          height="1000"
          className="w-full h-full object-cover opacity-20 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/85 to-brand-black/70" />
      </div>

      {/* Main Grid: Split Layout on Desktop */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center my-auto">
        {/* Left Column: Editorial Headline & Brand Story */}
        <div
          ref={contentRef}
          className="lg:col-span-7 flex flex-col items-start text-left space-y-7"
        >
          {/* Header pill */}
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-brand-brass" />
            <span className="font-mono text-xs tracking-super text-brand-brass uppercase font-medium">
              ARCHIVAL EDITION 01 // 2026
            </span>
          </div>

          {/* Cinematic Headline */}
          <div ref={headlineRef} className="space-y-3">
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-brand-cream tracking-tight uppercase leading-[0.95]">
              QUIET BATTLES<span className="text-brand-brass text-2xl md:text-3xl font-sans align-super">™</span>
            </h1>
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-brand-brass-light font-extralight tracking-wider italic pt-1">
              WEAR YOUR BATTLES.
            </p>
          </div>

          {/* Poetic Subtitle */}
          <div ref={subtextRef} className="max-w-xl">
            <p className="font-sans text-sm md:text-base text-zinc-300 font-light leading-relaxed">
              Restrained luxury streetwear forged in stillness. The Gentle Armor T-Shirt is crafted from
              heavyweight organic cotton with a garment-washed finish and concealed seams to honor the unseen
              battles we carry each day.
            </p>
          </div>

          {/* Action Triggers (44px min touch targets) */}
          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 w-full sm:w-auto"
          >
            <Button
              to="/product/the-gentle-armor-tshirt"
              variant="brass"
              size="lg"
              className="min-h-[44px] min-w-[200px]"
            >
              Acquire T-Shirt &bull; ₹999
            </Button>

            <Button
              to="/archive"
              variant="outline"
              size="lg"
              className="min-h-[44px] min-w-[180px]"
              icon={ArrowUpRight}
            >
              The Archive
            </Button>
          </div>

          {/* Floating Tailoring Details */}
          <div className="pt-6 grid grid-cols-3 gap-6 md:gap-12 border-t border-zinc-800 w-full max-w-lg">
            <div>
              <span className="block font-mono text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
                FABRIC
              </span>
              <span className="font-mono text-xs text-brand-cream font-medium tracking-wider">
                ORGANIC COTTON
              </span>
            </div>
            <div>
              <span className="block font-mono text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
                FIT
              </span>
              <span className="font-mono text-xs text-brand-brass font-medium tracking-wider">
                RELAXED FIT
              </span>
            </div>
            <div>
              <span className="block font-mono text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
                PRICE
              </span>
              <span className="font-mono text-xs text-brand-cream font-medium tracking-wider">
                ₹999
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Diptych Showcase (Technical Line Art SVG + Real Fabric Photo) (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 justify-center relative">
          <div
            ref={tshirtImgRef}
            className="relative w-full max-w-lg bg-brand-charcoal border border-zinc-800 p-2.5 shadow-2xl group"
          >
            {/* Antique brass corner brackets */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-brass z-20" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-brand-brass z-20" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-brand-brass z-20" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-brass z-20" />

            <div className="overflow-hidden w-full bg-zinc-950 border border-zinc-800/80 relative">
              <div className="grid grid-cols-2 divide-x divide-zinc-800 aspect-[16/11]">
                {/* Left: Line Art */}
                <div className="relative p-3 flex items-center justify-center bg-zinc-950">
                  <div className="absolute top-3 left-3 bg-black/85 px-2 py-0.5 text-[10px] font-mono text-brand-brass uppercase tracking-widest border border-brand-brass/40 font-medium z-10">
                    CAD FLAT
                  </div>
                  <img
                    src="/assets/tshirt-lineart.svg"
                    onError={(e) => {
                      e.target.src = '/assets/product-01-main.svg';
                    }}
                    alt="The Gentle Armor Line Art"
                    width="300"
                    height="380"
                    loading="eager"
                    className="w-full h-full object-contain p-1"
                  />
                </div>

                {/* Right: Real Fabric Photo */}
                <div className="relative flex items-center justify-center bg-zinc-950 overflow-hidden">
                  <img
                    src="/assets/photos/series-01-tshirt.webp"
                    onError={(e) => {
                      e.target.src = '/assets/photos/tshirt-front.webp';
                    }}
                    alt="The Gentle Armor T-Shirt Real Fabric"
                    width="300"
                    height="380"
                    loading="eager"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              <div className="p-3 bg-black/80 border-t border-zinc-800 flex justify-between items-center text-brand-cream">
                <div>
                  <span className="font-mono text-[10px] tracking-super text-brand-brass uppercase block font-medium">
                    ARCHIVAL EDITION // PIECE 01
                  </span>
                  <span className="font-serif text-base font-light text-brand-cream">
                    The Gentle Armor T-Shirt
                  </span>
                </div>
                <span className="font-mono text-sm text-brand-brass font-bold">
                  ₹999
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator (Min 44px touch target) */}
      <a
        href="#story"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-zinc-400 hover:text-brand-brass transition-colors space-y-1.5"
        aria-label="Scroll to brand story"
      >
        <span className="font-mono text-[11px] tracking-widest uppercase font-medium">
          DISCOVER
        </span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce stroke-[1.5]" />
      </a>
    </section>
  );
}
