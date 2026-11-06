import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import useSeriesList from '../../hooks/useSeriesList';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const seriesList = useSeriesList().filter((s) => s.status === 'published' || !s.status).slice(0, 3);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 4000);
    }
  };

  return (
    <footer className="bg-brand-black text-brand-cream hairline-border-t relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-12">
        {/* Top Editorial Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 hairline-border-b">
          <div className="lg:col-span-5 space-y-5">
            <span className="font-serif text-2xl md:text-3xl tracking-widest text-brand-cream uppercase font-light block">
              QUIET BATTLES<span className="text-xs text-brand-brass align-super">™</span>
            </span>
            <p className="font-serif text-xl italic font-light text-zinc-300 max-w-md leading-relaxed">
              "We do not design armor for vanity. We craft silent shelters for the battles fought without an audience."
            </p>
            <div className="text-xs font-mono tracking-super text-brand-brass uppercase font-medium">
              WEAR YOUR BATTLES.
            </div>
          </div>

          {/* Nav columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <span className="text-xs font-mono tracking-super text-zinc-400 uppercase block font-medium">
                01 // INDEX
              </span>
              <ul className="space-y-3 text-xs text-zinc-300 font-light tracking-wide">
                <li>
                  <Link to="/archive" className="hover:text-brand-brass transition-colors py-1 inline-block">
                    The Archive
                  </Link>
                </li>
                {seriesList.map((s) => (
                  <li key={s.id || s.slug}>
                    <Link
                      to={`/archive/${s.slug}`}
                      className="hover:text-brand-brass transition-colors py-1 inline-block"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <span className="text-xs font-mono tracking-super text-zinc-400 uppercase block font-medium">
                02 // ATELIER
              </span>
              <ul className="space-y-3 text-xs text-zinc-300 font-light tracking-wide">
                <li>
                  <a href="#story" className="hover:text-brand-brass transition-colors py-1 inline-block">
                    Emotional Storytelling
                  </a>
                </li>
                <li>
                  <span className="text-zinc-400">
                    Heavyweight Organic Cotton
                  </span>
                </li>
                <li>
                  <span className="text-zinc-400">
                    Concealed Seamlines
                  </span>
                </li>
                <li>
                  <span className="text-zinc-400">
                    Garment-Washed Craft
                  </span>
                </li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1 space-y-4">
              <span className="text-xs font-mono tracking-super text-zinc-400 uppercase block font-medium">
                03 // DISPATCHES
              </span>
              <p className="text-xs text-zinc-300 font-light leading-relaxed">
                Quiet correspondence. Never promotional, strictly poetic and archival.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL"
                    required
                    className="w-full bg-brand-charcoal border border-zinc-700 text-xs px-3.5 py-3 text-brand-cream placeholder:text-zinc-400 placeholder:text-xs placeholder:tracking-widest focus:outline-none focus:border-brand-brass min-h-[44px]"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-brand-brass transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Subscribe to dispatches"
                  >
                    {subscribed ? <Check className="w-4 h-4 text-brand-brass" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
                {subscribed && (
                  <span className="text-xs font-mono text-brand-brass block tracking-wider font-medium">
                    DISPATCH TRANSMITTED.
                  </span>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-zinc-400 text-xs font-mono gap-4 font-medium">
          <div>
            &copy; {new Date().getFullYear()} QUIET BATTLES™ ATELIER. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6 tracking-wider">
            <span>RESPECTS PREFERS-REDUCED-MOTION</span>
            <span className="text-zinc-700">/</span>
            <span>EDITION 01.2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
