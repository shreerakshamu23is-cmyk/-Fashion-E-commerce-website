import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// React.lazy route code-splitting for performance & sub-chunk loading
const Home = lazy(() => import('./pages/Home'));
const Archive = lazy(() => import('./pages/Archive'));
const Series = lazy(() => import('./pages/Series'));
const Chapter = lazy(() => import('./pages/Chapter'));
const Product = lazy(() => import('./pages/Product'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black text-brand-cream">
      <div className="flex flex-col items-center space-y-4">
        <span className="font-mono text-xs text-brand-brass uppercase tracking-super animate-pulse">
          INITIALIZING VIEW...
        </span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/archive/:seriesSlug" element={<Series />} />
          <Route path="/archive/:seriesSlug/:chapterSlug" element={<Chapter />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/admin" element={<Admin />} />
          {/* Catch-all 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
