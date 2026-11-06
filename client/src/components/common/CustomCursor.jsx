import React, { useEffect, useState, useRef } from 'react';

/**
 * CustomCursor
 * Luxury custom cursor with smooth interpolation, magnetic hover states,
 * and automatic fallback / deactivation on touch devices, modals, drawers, or reduced-motion preferences.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isOverModalOrDrawer, setIsOverModalOrDrawer] = useState(false);

  useEffect(() => {
    // Check for touch device or reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (prefersReducedMotion || isTouch) {
      setIsDisabled(true);
      return;
    }

    document.body.classList.add('custom-cursor-active');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let animId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Requirement 9: Check if cursor is over modal, drawer, or element with data-cursor-hide
      const target = e.target;
      const overModal = target.closest('[data-cursor-hide="true"], [role="dialog"], .cart-drawer, .modal');
      setIsOverModalOrDrawer(!!overModal);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Event delegation to detect hover on interactive elements
    const handleElementHover = (e) => {
      const target = e.target;
      const interactive = target.closest('a, button, [role="button"], input, select, textarea, .cursor-pointer, .interactive-hover');
      setIsHovered(!!interactive);
    };

    // Smooth lerp for outer ring
    const render = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      animId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', handleElementHover, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);

    animId = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', handleElementHover);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (isDisabled) return null;

  // Requirement 9: Hide cursor over modals, drawers, or when not visible
  const shouldShow = isVisible && !isOverModalOrDrawer;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[999999] transition-opacity duration-200 ${
        shouldShow ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Precision Center Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -ml-[3px] -mt-[3px] w-[6px] h-[6px] rounded-full transition-transform duration-75 ease-out ${
          isHovered ? 'bg-brand-brass scale-150' : 'bg-brand-cream'
        }`}
      />

      {/* Trailing Outer Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border border-brand-brass/60 transition-[width,height,margin,border-color,background-color] duration-300 ease-out ${
          isHovered
            ? '-ml-6 -mt-6 w-12 h-12 border-brand-brass bg-brand-brass/10 scale-110 backdrop-blur-[1px]'
            : isClicking
            ? '-ml-3 -mt-3 w-6 h-6 border-brand-brass/80 bg-brand-brass/20'
            : '-ml-4 -mt-4 w-8 h-8 border-brand-cream/30'
        }`}
      />
    </div>
  );
}
