import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Lock, ChevronDown, ChevronRight, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import useSeriesList from '../../hooks/useSeriesList';
import AdminLoginModal from '../admin/AdminLoginModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [seriesDropdownOpen, setSeriesDropdownOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const seriesList = useSeriesList().filter((s) => s.status === 'published' || !s.status);
  const dropdownRef = useRef(null);
  const { cartCount, setIsCartOpen } = useCart();
  const { isAuthenticated } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSeriesDropdownOpen(false);
  }, [location.pathname]);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSeriesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Determine active series slug from current route
  const activeSeriesSlug = location.pathname.startsWith('/archive/')
    ? location.pathname.split('/')[2]
    : null;

  const isSeriesActive = !!activeSeriesSlug;

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-brand-black/95 backdrop-blur-md hairline-border-b py-3.5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent py-5 md:py-7'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo & Monogram */}
          <Link
            to="/"
            className="flex flex-col group transition-transform duration-300 py-1 min-h-[44px] justify-center"
            aria-label="QUIET BATTLES™ Home"
          >
            <span className="font-serif text-lg md:text-xl tracking-[0.25em] text-brand-cream font-light uppercase group-hover:text-brand-brass transition-colors">
              QUIET BATTLES<span className="text-[10px] align-super text-brand-brass font-sans">™</span>
            </span>
            <span className="font-sans text-[10px] tracking-super text-zinc-400 uppercase font-medium mt-0.5 group-hover:text-zinc-200 transition-colors">
              Wear Your Battles.
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-10" aria-label="Main Navigation">
            {/* 1. Archive */}
            <Link
              to="/archive"
              className={`font-sans text-xs tracking-widest uppercase transition-colors duration-300 relative py-2 min-h-[44px] flex items-center font-medium ${
                location.pathname === '/archive'
                  ? 'text-brand-brass font-bold'
                  : 'text-zinc-300 hover:text-brand-cream'
              }`}
            >
              ARCHIVE
            </Link>

            {/* 2. Series Dropdown (Requirement 2.c: dynamic list from /api/series, highlight active) */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setSeriesDropdownOpen(!seriesDropdownOpen)}
                onMouseEnter={() => setSeriesDropdownOpen(true)}
                className={`font-sans text-xs tracking-widest uppercase transition-colors duration-300 relative py-2 min-h-[44px] flex items-center gap-1.5 font-medium ${
                  isSeriesActive || seriesDropdownOpen
                    ? 'text-brand-brass font-bold'
                    : 'text-zinc-300 hover:text-brand-cream'
                }`}
                aria-expanded={seriesDropdownOpen}
                aria-haspopup="true"
              >
                <span>SERIES</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    seriesDropdownOpen ? 'rotate-180 text-brand-brass' : 'text-zinc-400'
                  }`}
                />
              </button>

              {/* Desktop Dropdown Menu */}
              {seriesDropdownOpen && (
                <div
                  onMouseLeave={() => setSeriesDropdownOpen(false)}
                  className="absolute top-full left-0 mt-1 w-80 bg-brand-charcoal border border-zinc-800 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl z-50 p-3 space-y-1.5"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800 px-2">
                    <span className="font-mono text-[10px] text-brand-brass uppercase tracking-widest font-medium">
                      ARCHIVAL COLLECTIONS
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">
                      {seriesList.length} SERIES
                    </span>
                  </div>

                  <div className="space-y-1 pt-1 max-h-[380px] overflow-y-auto">
                    {seriesList.map((s, idx) => {
                      const isCurrent = activeSeriesSlug === s.slug;
                      return (
                        <Link
                          key={s.id || s.slug}
                          to={`/archive/${s.slug}`}
                          onClick={() => setSeriesDropdownOpen(false)}
                          className={`flex items-start justify-between p-2.5 transition-all text-left group min-h-[44px] ${
                            isCurrent
                              ? 'bg-black/90 border-l-2 border-brand-brass text-brand-brass shadow-sm'
                              : 'hover:bg-zinc-900/80 text-zinc-300 hover:text-brand-cream border-l-2 border-transparent'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-brand-brass font-bold">
                                0{idx + 1}
                              </span>
                              <span
                                className={`font-serif text-sm font-light ${
                                  isCurrent ? 'text-brand-brass font-medium' : 'text-brand-cream'
                                }`}
                              >
                                {s.title.replace(/SERIES \d+\s*–\s*/i, '')}
                              </span>
                            </div>
                            <p className="font-sans text-[11px] text-zinc-400 line-clamp-1 font-light">
                              {s.description}
                            </p>
                          </div>

                          {isCurrent && (
                            <span className="font-mono text-[9px] uppercase tracking-wider text-brand-brass bg-black px-1.5 py-0.5 border border-brand-brass/40 ml-2 flex-shrink-0">
                              ACTIVE
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 px-2 flex justify-between items-center text-[10px] font-mono text-zinc-400">
                    <Link
                      to="/archive"
                      onClick={() => setSeriesDropdownOpen(false)}
                      className="hover:text-brand-brass transition-colors"
                    >
                      View All in Archive &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Manifesto */}
            <Link
              to="/#manifesto"
              className="font-sans text-xs tracking-widest uppercase transition-colors duration-300 relative py-2 min-h-[44px] flex items-center font-medium text-zinc-300 hover:text-brand-cream"
            >
              MANIFESTO
            </Link>

            {/* 4. Atelier */}
            <Link
              to="/#story"
              className="font-sans text-xs tracking-widest uppercase transition-colors duration-300 relative py-2 min-h-[44px] flex items-center font-medium text-zinc-300 hover:text-brand-cream"
            >
              ATELIER
            </Link>
          </nav>

          {/* Right utility buttons: Admin Portal, Cart & Mobile Menu Toggle */}
          <div className="flex items-center space-x-3 md:space-x-6">
            {/* Admin Portal Quick Icon (Opens login modal if unauthenticated, or goes directly to admin dashboard) */}
            <button
              type="button"
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/admin');
                } else {
                  setAdminModalOpen(true);
                }
              }}
              className="p-2.5 min-w-[44px] min-h-[44px] text-zinc-400 hover:text-brand-brass transition-colors flex items-center justify-center group"
              aria-label="Admin Atelier Portal"
              title="Admin Portal (Atelier CMS)"
            >
              <Lock className="w-4 h-4 stroke-[1.6] transition-transform group-hover:scale-110 text-zinc-400 group-hover:text-brand-brass" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 min-w-[44px] min-h-[44px] text-zinc-200 hover:text-brand-brass transition-colors flex items-center justify-center group"
              aria-label={`Open shopping cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5] transition-transform group-hover:scale-105" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-brand-brass text-brand-black text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 min-w-[44px] min-h-[44px] text-zinc-200 hover:text-brand-cream focus:outline-none flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 stroke-[1.4]" /> : <Menu className="w-6 h-6 stroke-[1.4]" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Overlay Menu (Requirement 2.c: full-screen list of all published series) */}
      <div
        className={`fixed inset-0 bg-[#0e0e0e]/98 backdrop-blur-xl z-40 md:hidden flex flex-col justify-between p-6 sm:p-8 pt-24 overflow-y-auto transition-all duration-500 ease-in-out ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="space-y-6 mt-2">
          <div className="font-mono text-xs tracking-super text-brand-brass uppercase font-medium">
            NAVIGATION INDEX
          </div>

          <nav className="flex flex-col space-y-3">
            {/* Archive Link */}
            <Link
              to="/archive"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 border-b border-zinc-800 min-h-[44px]"
            >
              <span className="font-serif text-2xl font-light text-brand-cream">
                ARCHIVE
              </span>
              <span className="font-mono text-xs text-brand-brass">&rarr;</span>
            </Link>

            {/* Mobile Series Full-Screen List */}
            <div className="py-2 border-b border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-brand-brass uppercase tracking-widest font-medium">
                  PUBLISHED SERIES ({seriesList.length})
                </span>
                <Link
                  to="/archive"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-mono text-[10px] text-zinc-400 hover:text-brand-brass uppercase tracking-wider"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-1.5 pl-2">
                {seriesList.map((s, idx) => {
                  const isCurrent = activeSeriesSlug === s.slug;
                  return (
                    <Link
                      key={s.id || s.slug}
                      to={`/archive/${s.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-2 rounded transition-colors min-h-[44px] ${
                        isCurrent
                          ? 'bg-brand-charcoal text-brand-brass border-l-2 border-brand-brass font-bold'
                          : 'text-zinc-300 hover:text-brand-cream hover:bg-zinc-900/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-brand-brass">0{idx + 1}</span>
                        <span className="font-serif text-lg font-light">
                          {s.title.replace(/SERIES \d+\s*–\s*/i, '')}
                        </span>
                      </div>
                      {isCurrent ? (
                        <span className="font-mono text-[9px] uppercase tracking-wider text-brand-brass bg-black px-1.5 py-0.5 border border-brand-brass">
                          ACTIVE
                        </span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-zinc-500" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Manifesto Link */}
            <Link
              to="/#manifesto"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 border-b border-zinc-800 min-h-[44px]"
            >
              <span className="font-serif text-2xl font-light text-brand-cream">
                MANIFESTO
              </span>
              <span className="font-mono text-xs text-brand-brass">&rarr;</span>
            </Link>

            {/* Atelier Link */}
            <Link
              to="/#story"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 border-b border-zinc-800 min-h-[44px]"
            >
              <span className="font-serif text-2xl font-light text-brand-cream">
                ATELIER
              </span>
              <span className="font-mono text-xs text-brand-brass">&rarr;</span>
            </Link>

            {/* Admin Portal Link */}
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 border-b border-zinc-800 min-h-[44px] text-zinc-400 hover:text-brand-brass transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-brand-brass/80" />
                <span className="font-serif text-xl font-light text-zinc-300">
                  Admin Portal
                </span>
              </div>
              <span className="font-mono text-xs text-brand-brass">&rarr;</span>
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-zinc-800 space-y-1">
          <p className="font-serif text-sm italic text-zinc-300 font-light">
            "We do not wear clothes to hide. We wear them to carry."
          </p>
          <div className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-medium">
            QUIET BATTLES™ // ARCHIVAL EDITION
          </div>
        </div>
      </div>

      {/* Admin Login Modal (Triggered by Lock icon in navbar) */}
      <AdminLoginModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />
    </>
  );
}
