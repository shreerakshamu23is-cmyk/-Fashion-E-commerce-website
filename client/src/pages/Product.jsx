import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  Plus,
  Minus,
  Ruler,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import SectionLabel from '../components/common/SectionLabel';
import Button from '../components/common/Button';
import { getProductBySlug, getSeries, mediaUrl } from '../services/api';
import { useCart } from '../context/CartContext';

export default function Product() {
  const { slug = 'the-gentle-armor-tshirt' } = useParams();
  const [product, setProduct] = useState(null);
  const [seriesCoverImage, setSeriesCoverImage] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null); // Requirement 10: Size required
  const [sizeError, setSizeError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const { addToCart, formatPrice } = useCart();

  useEffect(() => {
    let mounted = true;
    Promise.all([getProductBySlug(slug), getSeries()]).then(([productData, seriesList]) => {
      if (!mounted) return;
      setProduct(productData);
      setSelectedImage(0);
      const relatedSeries = productData?.series_slug
        ? seriesList.find((series) => series.slug === productData.series_slug)
        : seriesList.find((series) => productData?.slug?.startsWith(`${series.slug}-`));
      setSeriesCoverImage(relatedSeries?.cover_image || '');
    });
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (!product) {
    return (
      <div className="pt-44 pb-32 text-center text-zinc-400 font-mono text-xs">
        RETRIEVING GARMENT ARCHIVE...
      </div>
    );
  }

  // Parse images: ONLY use the actual images belonging to this product
  let rawImages = [];
  try {
    if (Array.isArray(product.images)) {
      rawImages = product.images;
    } else if (typeof product.images === 'string' && product.images.startsWith('[')) {
      rawImages = JSON.parse(product.images);
    } else if (product.images) {
      rawImages = [product.images];
    }
  } catch {
    rawImages = [];
  }

  // Filter out any empty/null values and do NOT force hardcoded t-shirt images on other products
  const cleanImages = rawImages.filter(Boolean);
  const fallbackImage = mediaUrl(
    product.cover_image || product.hero_image || seriesCoverImage
  );
  if (cleanImages.length === 0) {
    cleanImages.push(fallbackImage || '/assets/photos/series-01-tshirt.webp');
  }

  const images = cleanImages.map(mediaUrl);
  const handleImageError = (event) => {
    const image = event.currentTarget;
    if (fallbackImage && image.src !== new URL(fallbackImage, window.location.href).href) {
      image.src = fallbackImage;
      return;
    }
    image.style.visibility = 'hidden';
  };

  // Parse sizes
  const sizes = Array.isArray(product.sizes)
    ? product.sizes
    : typeof product.sizes === 'string' && product.sizes.startsWith('[')
    ? JSON.parse(product.sizes)
    : ['S', 'M', 'L', 'XL'];

  // Requirement 10: Size is required before Add to Cart
  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError('Please select a size (S, M, L, XL) before adding to your archive.');
      return;
    }
    setSizeError('');
    addToCart(product, selectedSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2200);
  };

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: `https://quietbattles.com${images[0]}`,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'QUIET BATTLES™',
    },
    offers: {
      '@type': 'Offer',
      url: `https://quietbattles.com/product/${product.slug}`,
      priceCurrency: 'INR',
      price: String(product.price || 999),
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <Helmet>
        <title>{`${product.name} | QUIET BATTLES™`}</title>
        <link rel="canonical" href={`https://quietbattles.com/product/${product.slug}`} />
        <meta name="description" content={product.description.slice(0, 160)} />
        <meta property="og:title" content={`${product.name} // QUIET BATTLES™`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={images[0]} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="pt-32 md:pt-40 pb-20 md:pb-32 max-w-7xl mx-auto px-6 md:px-12">
        {/* Breadcrumbs and back navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <Link
            to={`/archive/${product.series_slug || 'series-01'}/${product.chapter_slug || 'the-silence'}`}
            className="inline-flex items-center gap-2 text-zinc-300 hover:text-brand-brass font-mono text-xs tracking-widest uppercase transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Chapter {product.chapter_number || '02'} : {product.chapter_title || 'The Silence'}</span>
          </Link>

          <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest font-medium">
            ARCHIVAL REF: QB-TSHIRT-01
          </span>
        </div>

        {/* Product Grid: Main Image at least 60% on desktop (lg:col-span-8 = 66.6%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Image Gallery (66.6% width on desktop) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Main Stage Image (Larger than 60% width) */}
            <div className="overflow-hidden aspect-[4/5] bg-zinc-950 border border-zinc-800 relative group p-3">
              <div className="w-full h-full overflow-hidden relative">
                <img
                  src={images[selectedImage] || images[0]}
                  onError={handleImageError}
                  alt={`${product.name} View ${selectedImage + 1}`}
                  width="1000"
                  height="1250"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Tag overlay */}
              <div className="absolute top-6 left-6 bg-black/85 backdrop-blur-sm border border-brand-brass/40 px-3 py-1 font-mono text-xs text-brand-brass uppercase tracking-super font-medium">
                VIEW {selectedImage + 1} OF {images.length}
              </div>
            </div>

            {/* Gallery Thumbnails (Only rendered when multiple authentic images exist) */}
            {images.length > 1 && (
              <div className={`grid gap-3 ${images.length === 2 ? 'grid-cols-2' : images.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`overflow-hidden aspect-square border transition-all duration-300 relative min-h-[44px] ${
                      selectedImage === idx
                        ? 'border-brand-brass ring-1 ring-brand-brass/50 opacity-100'
                        : 'border-zinc-800 opacity-60 hover:opacity-100 hover:border-zinc-600'
                    }`}
                    aria-label={`Select product image ${idx + 1}`}
                  >
                    <img
                      src={img}
                      onError={handleImageError}
                      alt={`Thumbnail ${idx + 1}`}
                      width="200"
                      height="200"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Garment Details & Actions */}
          <div className="lg:col-span-4 space-y-7">
            <div className="space-y-4 border-b border-zinc-800 pb-7">
              <SectionLabel number="05" title="GARMENT SPECIFICATION" />

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-brand-cream leading-tight">
                {product.name}
              </h1>

              {/* Price in ₹ INR */}
              <div className="flex items-baseline gap-4 pt-1">
                <span className="font-mono text-3xl text-brand-brass font-bold tracking-wide">
                  {formatPrice(product.price || 999)}
                </span>
                <span className="text-xs font-mono text-zinc-300 uppercase tracking-widest font-medium">
                  TAXES INCLUDED
                </span>
              </div>

              <p className="font-sans text-xs sm:text-sm text-zinc-300 font-light leading-relaxed pt-1">
                {product.description}
              </p>
            </div>

            {/* Chapter Link Callout */}
            <div className="p-4 bg-brand-charcoal border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-brand-brass uppercase tracking-super block font-medium">
                  ORIGIN CHAPTER
                </span>
                <span className="font-serif text-base font-light text-brand-cream">
                  Chapter {product.chapter_number || '02'} – {product.chapter_title || 'The Silence'}
                </span>
              </div>
              <Link
                to={`/archive/${product.series_slug || 'series-01'}/${product.chapter_slug || 'the-silence'}`}
                className="font-mono text-xs text-brand-brass hover:text-brand-cream tracking-wider uppercase underline underline-offset-4 transition-colors font-medium min-h-[44px] flex items-center"
              >
                Read Story &rarr;
              </Link>
            </div>

            {/* Size Selector (Requirement 10: Size is required before Add to Cart) */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="font-mono text-xs text-zinc-200 uppercase tracking-widest font-medium">
                  SELECT SIZE <span className="text-brand-brass">*</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400 hover:text-brand-brass tracking-wider uppercase transition-colors min-h-[44px]"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSelectedSize(s);
                      setSizeError('');
                    }}
                    className={`py-3 min-h-[44px] text-xs font-mono tracking-widest uppercase transition-all duration-200 border ${
                      selectedSize === s
                        ? 'border-brand-brass bg-brand-brass text-brand-black font-bold shadow-[0_0_15px_rgba(197,160,89,0.3)]'
                        : 'border-zinc-800 bg-brand-charcoal text-zinc-200 hover:border-zinc-600 hover:text-brand-cream'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Requirement 10: Inline size validation error */}
              {sizeError && (
                <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                  <span>{sizeError}</span>
                </div>
              )}
            </div>

            {/* Quantity Selector & Add to Cart (Requirement 8: Min 44px touch targets) */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-zinc-700 bg-brand-charcoal min-h-[44px]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 min-h-[44px] min-w-[44px] text-zinc-300 hover:text-brand-brass transition-colors flex items-center justify-center"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-mono text-brand-cream font-medium">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 min-h-[44px] min-w-[44px] text-zinc-300 hover:text-brand-brass transition-colors flex items-center justify-center"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  variant="brass"
                  size="lg"
                  className="flex-1 py-3.5 min-h-[44px] text-xs font-medium tracking-super"
                >
                  {addedAnimation ? 'Acquired to Archive' : `Add to Cart • ${formatPrice(product.price || 999)}`}
                </Button>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-zinc-300 tracking-wider">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  IN STOCK (ARCHIVE LOT 01)
                </span>
                <span className="font-medium text-brand-brass">COMPLIMENTARY SHIPPING</span>
              </div>
            </div>

            {/* Material & Tailoring Accordion Specs */}
            <div className="border-t border-zinc-800 pt-6 space-y-4">
              <div className="space-y-2">
                <span className="font-mono text-xs text-brand-brass uppercase tracking-widest block font-medium">
                  CRAFT SPECIFICATIONS
                </span>
                <ul className="space-y-2 text-xs text-zinc-300 font-light">
                  {(product.materials && Array.isArray(product.materials) && product.materials.length > 0
                    ? product.materials
                    : [
                        product.fabric || '100% Premium Artisanal Fabric with Garment-Washed Finish',
                        product.construction || 'Concealed Seamlines with Soft Single-Needle Interior Binding',
                        product.collar || `${product.name} Tailored Architecture`,
                        product.silhouette || 'Dropped Architectural Silhouette with Relaxed Editorial Fit',
                      ]
                  ).map((spec, sIdx) => (
                    <li key={sIdx} className="flex items-baseline gap-2">
                      <span className="text-brand-brass font-mono">&bull;</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest block font-medium">
                  CARE &amp; MAINTENANCE
                </span>
                <p className="text-xs text-zinc-300 font-light leading-relaxed">
                  {product.care || 'Machine wash cold with like colors. Hang dry or tumble dry low. Do not bleach.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Size Guide Modal / Drawer */}
        {showSizeGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-brand-charcoal border border-zinc-700 max-w-lg w-full p-8 space-y-6 relative">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <h3 className="font-serif text-2xl font-light text-brand-cream">
                  Archival Sizing Guide (T-Shirt)
                </h3>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="text-zinc-400 hover:text-brand-cream text-xs font-mono min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  [CLOSE]
                </button>
              </div>

              <p className="text-xs text-zinc-300 font-light leading-relaxed">
                The Gentle Armor T-Shirt is cut for a relaxed fit with dropped shoulders. Order your true size for the intended silhouette.
              </p>

              <table className="w-full text-xs font-mono text-zinc-300 border border-zinc-800">
                <thead>
                  <tr className="border-b border-zinc-800 bg-black/40 text-brand-cream">
                    <th className="p-3 text-left">SIZE</th>
                    <th className="p-3 text-left">CHEST (CM)</th>
                    <th className="p-3 text-left">LENGTH (CM)</th>
                    <th className="p-3 text-left">SLEEVE (CM)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  <tr>
                    <td className="p-3 text-brand-brass font-bold">S</td>
                    <td className="p-3">108</td>
                    <td className="p-3">71</td>
                    <td className="p-3">22</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-brand-brass font-bold">M</td>
                    <td className="p-3">114</td>
                    <td className="p-3">73</td>
                    <td className="p-3">23</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-brand-brass font-bold">L</td>
                    <td className="p-3">120</td>
                    <td className="p-3">75</td>
                    <td className="p-3">24</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-brand-brass font-bold">XL</td>
                    <td className="p-3">126</td>
                    <td className="p-3">77</td>
                    <td className="p-3">25</td>
                  </tr>
                </tbody>
              </table>

              <Button
                variant="outline"
                size="sm"
                className="w-full min-h-[44px]"
                onClick={() => setShowSizeGuide(false)}
              >
                Close Guide
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
