import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Editorial Button & Link Component
 * Supports luxury streetwear aesthetics: wide letter-spacing,
 * thin hairlines, and restrained hover micro-animations.
 */
export default function Button({
  children,
  to,
  href,
  onClick,
  variant = 'outline',
  size = 'md',
  className = '',
  icon: Icon,
  disabled = false,
  type = 'button',
  ...rest
}) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-sans tracking-widest uppercase transition-all duration-300 ease-out select-none overflow-hidden group whitespace-nowrap flex-shrink-0';

  const sizes = {
    sm: 'text-[11px] px-5 py-2.5',
    md: 'text-xs px-7 py-3.5',
    lg: 'text-xs px-9 py-4 tracking-super',
  };

  const variants = {
    brass:
      'bg-brand-brass text-brand-black hover:bg-brand-brass-light border border-brand-brass font-medium shadow-[0_0_20px_rgba(197,160,89,0.15)] hover:shadow-[0_0_25px_rgba(197,160,89,0.3)]',
    outline:
      'border border-zinc-700 hover:border-brand-brass text-brand-cream hover:text-brand-brass bg-transparent hover:bg-brand-brass/5',
    ghost:
      'border-b border-zinc-700 hover:border-brand-brass text-zinc-300 hover:text-brand-cream px-0 py-1 rounded-none bg-transparent',
    dark:
      'bg-brand-charcoal border border-zinc-800 hover:border-zinc-600 text-brand-cream hover:bg-brand-stone',
    danger:
      'border border-red-900/60 text-red-400 hover:bg-red-950/40 hover:border-red-700',
  };

  const combinedClasses = `${baseStyles} ${sizes[size] || sizes.md} ${
    variants[variant] || variants.outline
  } ${disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''} ${className}`;

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2.5">
        {children}
        {Icon && (
          <Icon className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 text-inherit" />
        )}
      </span>
      {variant === 'outline' && (
        <span
          className="absolute inset-0 bg-brand-cream/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClasses} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      {...rest}
    >
      {content}
    </button>
  );
}

