import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '../common/SectionLabel';

gsap.registerPlugin(ScrollTrigger);

export default function Manifesto() {
  const containerRef = useRef(null);
  const quoteRef = useRef(null);
  const accentRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Gentle opacity illumination as user scrolls through the manifesto
      gsap.fromTo(
        quoteRef.current,
        { color: '#3f3f46', y: 30 },
        {
          color: '#f4f0e8',
          y: 0,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            end: 'center 40%',
            scrub: 1,
          },
        }
      );

      gsap.from(accentRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="manifesto"
      ref={containerRef}
      className="py-32 md:py-48 bg-[#090909] text-brand-cream relative overflow-hidden hairline-border-t"
    >
      {/* Editorial backdrop typography */}
      <div
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-[0.025] overflow-hidden"
        aria-hidden="true"
      >
        <span className="font-serif text-[18vw] uppercase font-bold tracking-tight text-white whitespace-nowrap">
          QUIET BATTLES
        </span>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10 text-center space-y-12">
        <div className="flex justify-center">
          <SectionLabel number="03" title="THE MANIFESTO" />
        </div>

        <div className="space-y-6">
          <p
            ref={quoteRef}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-[1.25] tracking-tight text-zinc-400 max-w-4xl mx-auto italic"
          >
            "We do not wear clothes to be seen by the crowd. We wear them as sanctuaries for the battles we fight in silence."
          </p>

          <div
            ref={accentRef}
            className="w-24 h-[1px] bg-brand-brass mx-auto my-8 opacity-80"
          />

          <p className="font-sans text-xs sm:text-sm text-zinc-300 font-light max-w-xl mx-auto leading-relaxed">
            Quiet strength is not the absence of vulnerability. It is the conscious decision
            to carry it with elegance. Every stitch in our archive honors the weight you bear
            without asking for external validation.
          </p>
        </div>

        <div className="pt-8 flex flex-col items-center space-y-2">
          <span className="font-mono text-[10px] tracking-super text-brand-brass uppercase">
            ATELIER THOUGHT // 01
          </span>
          <span className="font-serif text-xs text-zinc-400 italic">
            Quiet Battles™ Foundation, Kyoto / Paris
          </span>
        </div>
      </div>
    </section>
  );
}

