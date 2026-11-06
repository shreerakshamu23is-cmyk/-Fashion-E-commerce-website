import React, { useState } from 'react';
import { Shield, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import Button from '../common/Button';

export default function AdminLogin() {
  const { login, loading } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (!res.success) {
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
      className="min-h-screen flex items-center justify-center px-6 py-20 bg-brand-black text-brand-cream relative"
      data-cursor-hide="true"
    >
      <div className="w-full max-w-md bg-brand-charcoal border border-zinc-800 p-8 md:p-10 relative space-y-7 shadow-2xl">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand-brass" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-brand-brass" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-brand-brass" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand-brass" />

        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto border border-brand-brass/40 flex items-center justify-center text-brand-brass bg-black/40">
            <Shield className="w-5 h-5 stroke-[1.4]" />
          </div>

          <div className="space-y-1">
            <span className="font-mono text-xs tracking-super text-brand-brass uppercase block font-medium">
              ATELIER ARCHIVE ACCESS
            </span>
            <h1 className="font-serif text-3xl font-light text-brand-cream">
              Admin Portal
            </h1>
          </div>
          <p className="text-xs text-zinc-300 font-light max-w-xs mx-auto">
            Restricted access for managing Series, Chapters, Products, and Archival Media.
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
            variant="brass"
            size="lg"
            disabled={loading}
            className="w-full flex justify-center py-4 text-xs font-medium tracking-super min-h-[44px]"
          >
            {loading ? 'Validating Token...' : 'Enter Atelier'}
          </Button>
        </form>

        {/* Requirement 14: Hide the "Auto-fill Demo Login" button unless import.meta.env.DEV is true */}
        {import.meta.env.DEV && (
          <div className="pt-4 border-t border-zinc-800 text-center space-y-2">
            <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest block font-medium">
              EVALUATION SEED CREDENTIALS (DEV ONLY)
            </span>
            <button
              type="button"
              onClick={fillDemo}
              className="font-mono text-xs text-brand-brass hover:text-brand-cream tracking-wider underline underline-offset-4 transition-colors min-h-[44px] inline-flex items-center"
            >
              Auto-fill Assessment Demo Login &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
