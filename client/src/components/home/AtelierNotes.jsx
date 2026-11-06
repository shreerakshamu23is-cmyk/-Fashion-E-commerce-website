import React from 'react';
import SectionLabel from '../common/SectionLabel';

const disciplines = [
  {
    num: '01',
    title: 'Heavyweight Organic Cotton',
    origin: 'Kyoto Atelier & Mills',
    desc: 'Dense, premium long-staple organic cotton knit with a specialized garment-washed finish. Delivers tactile softness against the skin while maintaining architectural structure through every wash.',
  },
  {
    num: '02',
    title: 'Concealed Seamlines',
    origin: 'Atelier Master Tailors',
    desc: 'Internal seams are double-stitched and bound with soft single-needle tape. Eliminates friction against the collarbone and shoulders, ensuring quiet comfort throughout long days.',
  },
  {
    num: '03',
    title: 'Relaxed Fit Structure',
    origin: 'Pattern Laboratory',
    desc: 'Engineered with dropped shoulders and a balanced silhouette that does not cling. Creates a dignified personal boundary that moves naturally with your posture.',
  },
];

export default function AtelierNotes() {
  return (
    <section className="py-20 md:py-32 bg-brand-charcoal text-brand-cream relative overflow-hidden hairline-border-t">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-12 md:mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <SectionLabel number="04" title="MATERIAL DISCIPLINE" />
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-brand-cream mt-3">
              The Architecture of Restraint
            </h2>
          </div>
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest hidden sm:block font-medium">
            TACTILE LONGEVITY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {disciplines.map((item) => (
            <div
              key={item.num}
              className="p-8 bg-brand-black/80 border border-zinc-800 hover:border-brand-brass transition-colors duration-500 space-y-5 group"
            >
              <div className="flex justify-between items-baseline border-b border-zinc-800 pb-4">
                <span className="font-mono text-xs text-brand-brass font-medium">
                  SPEC // {item.num}
                </span>
                <span className="font-mono text-xs text-zinc-400 tracking-wider font-medium">
                  {item.origin}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-light text-brand-cream group-hover:text-brand-brass transition-colors">
                  {item.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2 text-[11px] font-mono tracking-super text-brand-brass uppercase font-medium">
                DISCIPLINE VERIFIED
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
