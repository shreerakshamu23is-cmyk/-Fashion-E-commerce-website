import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Preloader from '../components/common/Preloader';
import Hero from '../components/home/Hero';
import BrandStory from '../components/home/BrandStory';
import FeaturedSeries from '../components/home/FeaturedSeries';
import FeaturedProductStrip from '../components/home/FeaturedProductStrip';
import Manifesto from '../components/home/Manifesto';
import AtelierNotes from '../components/home/AtelierNotes';

export default function Home() {
  const [showPreloader, setShowPreloader] = useState(() => {
    return !sessionStorage.getItem('qb_preloader_seen');
  });

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('qb_preloader_seen', 'true');
    setShowPreloader(false);
  };

  return (
    <>
      <Helmet>
        <title>QUIET BATTLES™ | WEAR YOUR BATTLES.</title>
        <link rel="canonical" href="https://quietbattles.com/" />
        <meta
          name="description"
          content="Quiet strength, emotional storytelling, luxury streetwear. The Gentle Armor T-Shirt crafted from heavyweight organic cotton with a garment-washed finish."
        />
        <meta property="og:title" content="QUIET BATTLES™ | WEAR YOUR BATTLES." />
        <meta
          property="og:description"
          content="Quiet strength, emotional storytelling, luxury streetwear. The Gentle Armor T-Shirt crafted from heavyweight organic cotton."
        />
        <meta property="og:image" content="/assets/photos/hero.webp" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Cinematic 0-100% Preloader on initial arrival */}
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}

      {/* Full-Screen Hero with T-shirt presentation */}
      <Hero />

      {/* 01 // THE PHILOSOPHY Brand Story */}
      <BrandStory />

      {/* 02 // FEATURED SERIES Preview */}
      <FeaturedSeries />

      {/* Featured Product Strip */}
      <FeaturedProductStrip />

      {/* 03 // MANIFESTO Quote with Pinned Reveal */}
      <Manifesto />

      {/* 04 // MATERIAL DISCIPLINE Atelier Specifications */}
      <AtelierNotes />
    </>
  );
}
