import React, { useState } from 'react';
import { ArrowUpRight, ShoppingBag, Check } from 'lucide-react';
import SectionLabel from '../common/SectionLabel';
import Button from '../common/Button';
import { useCart } from '../../context/CartContext';
import { fallbackProduct } from '../../services/api';

export default function FeaturedProductStrip() {
  const [selectedSize, setSelectedSize] = useState('M');
  const [added, setAdded] = useState(false);
  const { addToCart, formatPrice } = useCart();

  const handleAdd = () => {
    addToCart(fallbackProduct, selectedSize, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="py-16 md:py-24 bg-brand-charcoal text-brand-cream border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-brand-black border border-zinc-800 p-6 md:p-10 relative overflow-hidden group hover:border-zinc-700 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Visual Diptych: Technical Line Art SVG + Real Fabric Photo */}
            <div className="md:col-span-5 lg:col-span-5 bg-zinc-950 border border-zinc-800 overflow-hidden relative">
              <div className="grid grid-cols-2 divide-x divide-zinc-800/80 aspect-[16/10] relative">
                {/* Left: Line Art */}
                <div className="relative p-2 flex items-center justify-center bg-zinc-950">
                  <div className="absolute top-2.5 left-2.5 bg-black/85 px-2 py-0.5 text-[10px] font-mono text-brand-brass uppercase tracking-widest border border-brand-brass/40 font-medium z-10">
                    CAD FLAT
                  </div>
                  <img
                    src="/assets/tshirt-lineart.svg"
                    onError={(e) => {
                      e.target.src = '/assets/product-01-main.svg';
                    }}
                    alt="The Gentle Armor T-Shirt Line Art"
                    width="300"
                    height="350"
                    loading="lazy"
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
                    height="350"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Information & Details */}
            <div className="md:col-span-7 lg:col-span-5 space-y-4">
              <SectionLabel number="03" title="FEATURED ARTIFACT" />

              <div className="space-y-1">
                <h3 className="font-serif text-3xl sm:text-4xl font-light text-brand-cream">
                  The Gentle Armor T-Shirt
                </h3>
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="font-mono text-2xl text-brand-brass font-bold">
                    ₹999
                  </span>
                  <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest font-medium">
                    TAXES INCLUDED // SIZES S &ndash; XL
                  </span>
                </div>
              </div>

              <p className="font-sans text-xs sm:text-sm text-zinc-300 font-light leading-relaxed max-w-xl">
                Heavyweight organic cotton with a garment-washed finish, concealed seams, and a relaxed fit.
                Engineered for daily resilience and emotional sanctuary.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {['HEAVYWEIGHT ORGANIC COTTON', 'GARMENT-WASHED', 'CONCEALED SEAMS', 'RELAXED FIT'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 border border-zinc-800 text-[11px] font-mono text-zinc-300 bg-brand-charcoal font-medium tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Quick Size Selector */}
              <div className="flex items-center gap-3 pt-2">
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-medium">
                  SELECT SIZE:
                </span>
                <div className="flex items-center gap-1.5">
                  {['S', 'M', 'L', 'XL'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1 text-xs font-mono uppercase transition-all min-h-[32px] min-w-[32px] flex items-center justify-center border ${
                        selectedSize === sz
                          ? 'border-brand-brass bg-brand-brass text-brand-black font-bold shadow-sm'
                          : 'border-zinc-700 bg-zinc-900/60 text-zinc-300 hover:border-zinc-500'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Column: Direct Add to Cart & View Product */}
            <div className="md:col-span-12 lg:col-span-3 flex lg:flex-col justify-end items-stretch lg:items-end gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-zinc-800 lg:pl-8">
              <button
                type="button"
                onClick={handleAdd}
                className={`w-full min-h-[44px] px-5 py-2.5 text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all ${
                  added
                    ? 'bg-emerald-600 text-white border border-emerald-500'
                    : 'bg-brand-brass text-brand-black hover:bg-brand-brass-light border border-brand-brass shadow-md'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added To Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add To Cart &bull; ₹999</span>
                  </>
                )}
              </button>

              <Button
                to="/product/the-gentle-armor-tshirt"
                variant="outline"
                size="lg"
                className="w-full min-h-[44px]"
                icon={ArrowUpRight}
              >
                View Product
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

