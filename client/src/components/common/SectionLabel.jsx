import React from 'react';

/**
 * SectionLabel
 * Renders numbered editorial section headers in the exact requested brand style:
 * "01 // THE ARCHIVE" with wide tracking and subtle antique brass accent.
 *
 * @param {string} number - e.g. "01"
 * @param {string} title - e.g. "THE ARCHIVE"
 * @param {string} className - optional extra tailwind classes
 */
export default function SectionLabel({ number, title, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="font-mono text-xs tracking-super text-brand-brass font-medium">
        {number}
      </span>
      <span className="text-zinc-600 text-xs">//</span>
      <span className="text-xs uppercase tracking-ultra text-zinc-400 font-sans font-medium">
        {title}
      </span>
    </div>
  );
}

