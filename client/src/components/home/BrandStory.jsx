import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from '../common/SectionLabel';
import Button from '../common/Button';

gsap.registerPlugin(ScrollTrigger);

export default function BrandStory() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);

  const [imgSrc, setImgSrc] = useState('/assets/photos/chapter-02.webp');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        opacity: 0,
        y: 35,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });

      gsap.from(imageRef.current, {
        opacity: 0,
        scale: 0.96,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="py-20 md:py-32 bg-[#0c0c0c] text-brand-cream relative overflow-hidden hairline-border-t"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Numbered Section Header */}
        <div className="mb-12 md:mb-20 flex items-center justify-between">
          <SectionLabel number="01" title="THE PHILOSOPHY" />
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest hidden sm:block font-medium">
            UNSEEN BATTLES WE CARRY
          </span>
        </div>

        {/* 2-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Poetic Narrative */}
          <div ref={textRef} className="lg:col-span-6 space-y-7">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light leading-[1.15] text-brand-cream">
              The world celebrates the loud victories. We dress the silent endurance.
            </h2>

            <div className="space-y-4 text-zinc-300 font-light text-sm sm:text-base leading-relaxed">
              <p>
                Every day, millions step outside carrying wars no one will ever see.
                Anxiety disguised as composure. Grief concealed beneath quiet posture.
                A quiet determination that asks for neither applause nor pity.
              </p>
              <p>
                Quiet Battles™ exists as an editorial sanctuary. We reject disposable hype and
                screaming branding. Instead, we architect garments out of heavyweight organic
                cotton with a garment-washed finish and concealed seams—materials that hold
                their structure when you feel like coming undone.
              </p>
              <blockquote className="border-l-2 border-brand-brass pl-5 py-2 text-brand-cream font-serif text-xl italic font-light">
                "Your clothes should never be a performance for others. They are the gentle armor you put on to face yourself."
              </blockquote>
            </div>

            <div className="pt-2 flex items-center gap-6">
              <Button to="/archive" variant="outline" size="md" className="min-h-[44px]">
                Explore The Chronicles
              </Button>
            </div>
          </div>

          {/* Right Column: Editorial Visual Card */}
          <div ref={imageRef} className="lg:col-span-6 relative">
            <div className="relative group overflow-hidden border border-zinc-800 bg-brand-charcoal p-3">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-brass" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-brand-brass" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-brand-brass" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-brass" />

              <div className="overflow-hidden aspect-[4/5] bg-zinc-950 relative">
                <img
                  src={imgSrc}
                  onError={() => setImgSrc('/assets/brand-story.svg')}
                  alt="Quiet Battles Atelier Craft and Cutting Table"
                  width="600"
                  height="750"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end text-brand-cream">
                  <div>
                    <span className="font-mono text-xs tracking-super text-brand-brass uppercase block font-medium">
                      ATELIER ARCHIVE
                    </span>
                    <span className="font-serif text-lg font-light text-brand-cream">
                      Study 01 // The Architecture of Silence
                    </span>
                  </div>
                  <span className="font-mono text-xs text-zinc-300 font-medium">
                    ORGANIC COTTON
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
