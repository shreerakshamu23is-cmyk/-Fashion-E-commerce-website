import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomCursor from '../common/CustomCursor';
import FilmGrain from '../common/FilmGrain';
import SmoothScroll from '../common/SmoothScroll';
import CartDrawer from '../cart/CartDrawer';

/**
 * Layout
 * Master layout shell orchestrating cinematic motion, film grain,
 * custom cursor, navigation, responsive drawer, and footer.
 */
export default function Layout({ children }) {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-brand-black text-brand-cream selection:bg-brand-brass selection:text-brand-black">
        {/* Procedural Film Grain Overlay */}
        <FilmGrain />

        {/* Desktop Custom Follower Cursor */}
        <CustomCursor />

        {/* Global Navigation Header */}
        <Navbar />

        {/* Slide-in Shopping Cart Drawer */}
        <CartDrawer />

        {/* Main Content Area */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Global Editorial Footer */}
        <Footer />
      </div>
    </SmoothScroll>
  );
}

