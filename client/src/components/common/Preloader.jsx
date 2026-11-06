import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

/**
 * Preloader
 * Cinematic 0–100% numerical counter with monogram reveal,
 * hairline progress bar, and elegant upward split curtain exit.
 * Respects prefers-reduced-motion.
 */
export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const logoRef = useRef(null);
  const barRef = useRef(null);
  const isCompleteRef = useRef(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (onComplete) onComplete();
      return;
    }

    // Disable body scroll while preloader is running
    document.body.style.overflow = 'hidden';

    const obj = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        isCompleteRef.current = true;
        // Exit animation
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 1.1,
          ease: 'power4.inOut',
          onComplete: () => {
            document.body.style.overflow = '';
            if (onComplete) onComplete();
          },
        });
      },
    });

    // Animate counter from 0 to 100 with editorial easing
    tl.to(obj, {
      val: 100,
      duration: 2.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        const current = Math.floor(obj.val);
        setProgress(current);
      },
    });

    // Fade logo and bar elements gracefully
    tl.to(
      logoRef.current,
      {
        opacity: 0.9,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
      },
      0
    );

    return () => {
      document.body.style.overflow = '';
      tl.kill();
    };
  }, [onComplete]);

  return (
    <aside
      ref={containerRef}
      className="fixed inset-0 z-[9999999] flex flex-col items-center justify-between bg-[#0a0a0a] text-brand-cream px-8 py-12 select-none"
      role="status"
      aria-live="polite"
      aria-label="Loading Quiet Battles"
    >
      {/* Top subtle edition note */}
      <div className="w-full max-w-6xl flex justify-between items-center text-[10px] font-mono tracking-ultra text-zinc-500 uppercase">
        <span>QUIET BATTLES™</span>
        <span className="text-brand-brass">INITIALIZING ARCHIVE</span>
      </div>

      {/* Center Brand Monogram and Emblem */}
      <div ref={logoRef} className="flex flex-col items-center text-center space-y-5">
        <div className="w-14 h-14 relative flex items-center justify-center">
          <svg viewBox="0 0 64 64" className="w-full h-full stroke-brand-brass" fill="none">
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3" />
            <path d="M22 20 L42 20 L42 34 L22 34 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <line x1="22" y1="44" x2="42" y2="44" stroke="#f4f0e8" strokeWidth="1.2" strokeOpacity="0.8" />
            <line x1="32" y1="34" x2="32" y2="44" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>

        <div className="space-y-1">
          <h2 className="font-serif text-2xl md:text-3xl tracking-[0.3em] font-light text-brand-cream uppercase">
            QUIET BATTLES
          </h2>
          <p className="font-mono text-[9px] tracking-super text-brand-brass uppercase">
            WEAR YOUR BATTLES.
          </p>
        </div>
      </div>

      {/* Bottom Counter & Hairline Progress Bar */}
      <div className="w-full max-w-sm space-y-4">
        <div className="flex justify-between items-baseline font-mono text-xs">
          <span className="text-[10px] tracking-super text-zinc-500 uppercase">
            LOADING EXPERIENCE
          </span>
          <span
            ref={counterRef}
            className="text-brand-cream tracking-wider font-medium font-mono tabular-nums text-sm"
          >
            {String(progress).padStart(3, '0')}%
          </span>
        </div>

        {/* Hairline Progress Bar */}
        <div className="w-full h-[1px] bg-zinc-800/80 relative overflow-hidden">
          <div
            ref={barRef}
            className="absolute top-0 left-0 h-full bg-brand-brass transition-all duration-75 ease-out shadow-[0_0_8px_rgba(197,160,89,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </aside>
  );
}

