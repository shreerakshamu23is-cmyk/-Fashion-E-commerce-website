import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Button from '../common/Button';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
    formatPrice,
  } = useCart();

  const [checkoutComplete, setCheckoutComplete] = useState(false);

  if (!isCartOpen) return null;

  const handleDemoCheckout = () => {
    setCheckoutComplete(true);
    setTimeout(() => {
      clearCart();
      setCheckoutComplete(false);
      setIsCartOpen(false);
    }, 3200);
  };

  return (
    <div
      className="fixed inset-0 z-[99990] flex justify-end"
      data-cursor-hide="true"
    >
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-brand-charcoal text-brand-cream border-l border-zinc-800 shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <span className="font-mono text-xs tracking-super text-brand-brass uppercase block font-medium">
              ACQUISITIONS ({cartCount})
            </span>
            <h2 className="font-serif text-2xl font-light tracking-wide text-brand-cream">
              Your Archive
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2.5 min-h-[44px] min-w-[44px] text-zinc-300 hover:text-brand-cream hover:bg-zinc-800/80 rounded-full transition-colors flex items-center justify-center"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {checkoutComplete ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-brand-brass animate-pulse-subtle" />
              <h3 className="font-serif text-2xl font-light text-brand-cream">
                Acquisition Confirmed
              </h3>
              <p className="text-xs text-zinc-300 font-light leading-relaxed max-w-xs">
                Your archival reservation has been logged. In this hiring assessment demo, no payment is processed.
              </p>
              <div className="text-xs uppercase font-mono tracking-super text-brand-brass pt-2 font-medium">
                ORDER REF: QB-DEMO-{(Math.random() * 100000).toFixed(0)}
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-500">
                <ShoppingBag className="w-6 h-6 stroke-[1.4]" />
              </div>
              <p className="font-serif text-xl text-zinc-300 font-light">
                Your archive is currently empty.
              </p>
              <p className="text-xs text-zinc-400 font-light max-w-xs">
                Explore the silent garments crafted for emotional endurance.
              </p>
              <Button
                variant="brass"
                size="sm"
                to="/archive"
                onClick={() => setIsCartOpen(false)}
                className="mt-4 min-h-[44px]"
              >
                Explore Archive
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex gap-4 p-4 bg-brand-dark/70 border border-zinc-800 rounded-sm relative group"
              >
                <div className="w-20 h-24 bg-zinc-950 border border-zinc-800 overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    onError={(e) => {
                      e.target.src = '/assets/product-01-main.svg';
                    }}
                    alt={item.name}
                    width="80"
                    height="96"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif text-base font-light text-brand-cream line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-zinc-400 hover:text-zinc-200 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 -mt-2 transition-colors"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs font-mono text-brand-brass mt-0.5 tracking-wider font-medium">
                      SIZE: {item.size}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-800">
                    {/* Quantity controls (Min 44px touch targets) */}
                    <div className="flex items-center border border-zinc-700 bg-brand-black min-h-[44px]">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, -1)}
                        className="p-2.5 min-w-[44px] min-h-[44px] hover:text-brand-brass text-zinc-300 transition-colors flex items-center justify-center"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-mono text-brand-cream font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, 1)}
                        className="p-2.5 min-w-[44px] min-h-[44px] hover:text-brand-brass text-zinc-300 transition-colors flex items-center justify-center"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="font-mono text-xs text-brand-cream font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Total & Checkout */}
        {items.length > 0 && !checkoutComplete && (
          <div className="p-6 border-t border-zinc-800 bg-brand-black/60 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-zinc-300">
                <span className="tracking-widest uppercase font-medium">Archival Dispatch</span>
                <span className="text-brand-brass font-mono font-bold">COMPLIMENTARY</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-zinc-800">
                <span className="font-serif text-lg text-brand-cream font-light">Total</span>
                <span className="font-mono text-xl text-brand-brass font-bold">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <div className="text-xs text-zinc-400 font-light tracking-wide">
                All duties, organic cotton care packaging included.
              </div>
            </div>

            <Button
              variant="brass"
              size="lg"
              className="w-full flex justify-center py-4 text-xs font-medium tracking-super min-h-[44px]"
              onClick={handleDemoCheckout}
            >
              Acquire Archive (Demo)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
