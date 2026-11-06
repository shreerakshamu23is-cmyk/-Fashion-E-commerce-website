import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import SectionLabel from '../components/common/SectionLabel';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 // Not Found | QUIET BATTLES™</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-[80vh] flex items-center justify-center pt-32 pb-24 px-6 md:px-12 text-center bg-brand-black text-brand-cream">
        <div className="max-w-xl mx-auto space-y-6">
          <SectionLabel number="404" title="PAGE NOT FOUND" className="justify-center" />

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light leading-none">
            The Unseen Path
          </h1>

          <p className="font-sans text-sm text-zinc-300 font-light leading-relaxed max-w-md mx-auto">
            This destination exists only in silence. The page or archive you are seeking is either unreleased or does not exist in our current collection.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button to="/" variant="brass" size="md" className="min-h-[44px] min-w-[160px]">
              Return Home
            </Button>
            <Button to="/archive" variant="outline" size="md" className="min-h-[44px] min-w-[160px]">
              Explore Archive
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

