import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, X, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import Button from '../common/Button';

export default function AdminLoginModal({ isOpen, onClose }) {
  const { login, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      onClose();
      navigate('/admin');
    } else {
      setError(res.error || 'Access denied. Please check your credentials.');
    }
  };

  const fillDemo = () => {
    setEmail('admin@quietbattles.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-brand-charcoal border border-zinc-800 p-8 md:p-10 relative space-y-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Brass Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-brass" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-brand-brass" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-brand-brass" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-brass" />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-brand-cream transition-colors"
          aria-label="Close Admin Login Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto border border-brand-brass/40 flex items-center justify-center text-brand-brass bg-black/40">
            <Lock className="w-5 h-5 stroke-[1.6]" />
          </div>

          <div className="space-y-1">
            <span className="font-mono text-xs tracking-super text-brand-brass uppercase block font-medium">
              ATELIER ARCHIVE ACCESS
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-light text-brand-cream">
              Admin Portal
            </h2>
          </div>
          <p className="text-xs text-zinc-300 font-light max-w-xs mx-auto">
            Administrative credentials required to manage series, chapters, products, and media.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="font-mono text-xs text-zinc-300 uppercase tracking-widest block font-medium">
              ARCHIVE EMAIL
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@quietbattles.com"
                required
                autoFocus
                className="w-full bg-brand-black border border-zinc-700 pl-9 pr-3 py-3 text-xs text-brand-cream focus:outline-none focus:border-brand-brass placeholder:text-zinc-500 min-h-[44px]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-xs text-zinc-300 uppercase tracking-widest block font-medium">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-brand-black border border-zinc-700 pl-9 pr-3 py-3 text-xs text-brand-cream focus:outline-none focus:border-brand-brass placeholder:text-zinc-500 min-h-[44px]"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center !min-h-[44px]"
            disabled={loading}
          >
            {loading ? 'AUTHENTICATING...' : 'ENTER ATELIER'}
          </Button>

          {import.meta.env.DEV && (
            <div className="pt-2 text-center border-t border-zinc-800/80">
              <button
                type="button"
                onClick={fillDemo}
                className="text-[11px] font-mono text-zinc-400 hover:text-brand-brass underline underline-offset-4 py-1"
              >
                Auto-fill Demo Credentials
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
