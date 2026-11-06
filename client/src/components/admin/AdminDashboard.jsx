import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  BookOpen,
  ShoppingBag,
  Image as ImageIcon,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Check,
  X,
  Upload,
  RefreshCw,
  Copy,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { apiUrl, mediaUrl } from '../../services/api';
import Button from '../common/Button';

export default function AdminDashboard() {
  const { admin, logout, authFetch } = useAdminAuth();

  const [activeTab, setActiveTab] = useState('series');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [selectedChapterSeriesId, setSelectedChapterSeriesId] = useState(1);

  // Data states
  const [seriesList, setSeriesList] = useState([]);
  const [chaptersList, setChaptersList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [mediaList, setMediaList] = useState([]);

  // Modals / Editing states
  const [editingSeries, setEditingSeries] = useState(null);
  const [editingChapter, setEditingChapter] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const showFeedback = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  // Load all initial data
  const loadAll = async () => {
    setLoading(true);
    try {
      const [sRes, pRes] = await Promise.all([
        fetch(apiUrl('/series')).then((r) => r.json()),
        fetch(apiUrl('/products')).then((r) => r.json()),
      ]);
      setSeriesList(Array.isArray(sRes) ? sRes : []);
      setProductsList(Array.isArray(pRes) ? pRes : []);

      // If series exists, load chapters for series 01 or all
      if (sRes && sRes.length > 0) {
        const chapRes = await fetch(apiUrl(`/series/${sRes[0].slug}/chapters`)).then((r) =>
          r.json()
        );
        setChaptersList(Array.isArray(chapRes) ? chapRes : []);
      }

      // Load media list
      const mediaRes = await authFetch('/api/upload').then((r) => r.json());
      setMediaList(Array.isArray(mediaRes) ? mediaRes : []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Handle Image Upload
  const handleFileUpload = async (e, onComplete) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await authFetch('/api/upload/single', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback('Image uploaded to /uploads');
        loadAll();
        if (onComplete) onComplete(data.url);
      } else {
        showFeedback(data.error || 'Upload failed', 'error');
      }
    } catch (err) {
      showFeedback('Upload error', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Series CRUD
  const saveSeries = async (e) => {
    e.preventDefault();
    const isEdit = !!editingSeries.id;
    const url = isEdit ? `/api/series/${editingSeries.id}` : '/api/series';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSeries),
      });
      if (res.ok) {
        // If creating a new series, automatically create its linked buyable garment product!
        if (!isEdit) {
          try {
            await authFetch('/api/products', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name:
                  editingSeries.product_name ||
                  `${editingSeries.title.replace(/SERIES \d+\s*–\s*/i, '')} T-Shirt`,
                slug: editingSeries.product_slug || `${editingSeries.slug}-tshirt`,
                price: Number(editingSeries.product_price) || 999,
                description: `Artisanal release for ${editingSeries.title}. Crafted from fine organic material with fluid, tailored lines.`,
                images: [editingSeries.cover_image || '/assets/photos/series-01-tshirt.webp'],
                sizes: ['S', 'M', 'L', 'XL'],
                stock: Number(editingSeries.stock) || 24,
              }),
            });
          } catch (pErr) {
            console.warn('Garment auto-link note:', pErr);
          }
        }
        showFeedback(isEdit ? 'Series updated.' : 'Series & buyable garment created.');
        setEditingSeries(null);
        loadAll();
      }
    } catch (err) {
      showFeedback('Failed to save series', 'error');
    }
  };

  const deleteSeries = async (id) => {
    if (!window.confirm('Delete this series and all associated chapters?')) return;
    try {
      const res = await authFetch(`/api/series/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showFeedback('Series deleted.');
        loadAll();
      }
    } catch (err) {
      showFeedback('Failed to delete series', 'error');
    }
  };

  // Chapter CRUD
  const saveChapter = async (e) => {
    e.preventDefault();
    const isEdit = !!editingChapter.id;
    const url = isEdit ? `/api/chapters/${editingChapter.id}` : '/api/chapters';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingChapter),
      });
      if (res.ok) {
        showFeedback(isEdit ? 'Chapter updated.' : 'Chapter created.');
        setEditingChapter(null);
        loadAll();
      }
    } catch (err) {
      showFeedback('Failed to save chapter', 'error');
    }
  };

  const deleteChapter = async (id) => {
    if (!window.confirm('Delete this chapter?')) return;
    try {
      const res = await authFetch(`/api/chapters/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showFeedback('Chapter deleted.');
        loadAll();
      }
    } catch (err) {
      showFeedback('Failed to delete chapter', 'error');
    }
  };

  // Product CRUD
  const saveProduct = async (e) => {
    e.preventDefault();
    const isEdit = !!editingProduct.id;
    const url = isEdit ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });
      if (res.ok) {
        showFeedback(isEdit ? 'Garment updated.' : 'Garment created.');
        setEditingProduct(null);
        loadAll();
      }
    } catch (err) {
      showFeedback('Failed to save garment', 'error');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this garment product?')) return;
    try {
      const res = await authFetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showFeedback('Garment deleted.');
        loadAll();
      }
    } catch (err) {
      showFeedback('Failed to delete garment', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-brand-cream pt-24 pb-20">
      {/* Top Admin Header Bar */}
      <div className="border-b border-zinc-800 bg-brand-charcoal/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-serif text-xl tracking-wider text-brand-cream uppercase font-light">
              QUIET BATTLES<span className="text-brand-brass text-xs">™</span>
            </span>
            <span className="text-zinc-600">//</span>
            <span className="font-mono text-xs text-brand-brass uppercase tracking-widest">
              ATELIER CMS DASHBOARD
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="font-mono text-xs text-zinc-400 hidden sm:block">
              LOGGED IN AS: <span className="text-brand-cream">{admin?.email}</span>
            </span>

            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400 hover:text-brand-cream transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 font-mono text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Atelier</span>
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex space-x-8 border-t border-zinc-800/60 overflow-x-auto">
          {[
            { id: 'series', label: '01 // SERIES', icon: Layers, count: seriesList.length },
            { id: 'chapters', label: '02 // CHAPTERS', icon: BookOpen, count: chaptersList.length },
            { id: 'products', label: '03 // PRODUCTS', icon: ShoppingBag, count: productsList.length },
            { id: 'media', label: '04 // MEDIA ASSETS', icon: ImageIcon, count: mediaList.length },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3.5 font-mono text-xs tracking-wider uppercase transition-colors border-b-2 -mb-[1px] whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-brand-brass text-brand-brass font-medium'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-zinc-800 rounded-full text-zinc-400">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Admin Workspace */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-8">
        {/* Feedback message banner */}
        {feedback && (
          <div
            className={`p-4 border text-xs font-mono tracking-wider flex items-center justify-between ${
              feedback.type === 'error'
                ? 'bg-red-950/40 border-red-800 text-red-300'
                : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
            }`}
          >
            <span>{feedback.msg}</span>
            <button onClick={() => setFeedback(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TAB 1: SERIES */}
        {activeTab === 'series' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-light text-brand-cream">
                  Series Management
                </h2>
                <p className="font-mono text-xs text-zinc-400">
                  Archival collections grouping 5-chapter cycles.
                </p>
              </div>

              <Button
                variant="brass"
                size="sm"
                onClick={() =>
                  setEditingSeries({
                    title: '',
                    slug: '',
                    description: '',
                    cover_image: '',
                    product_name: '',
                    product_price: 999,
                    product_slug: '',
                    stock: 24,
                    status: 'published',
                  })
                }
                icon={Plus}
              >
                New Series
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {seriesList.map((s, idx) => {
                const linkedProduct =
                  productsList.find(
                    (p) => p.series_slug === s.slug || p.slug === s.product_slug
                  ) || productsList[idx] || productsList[0];

                return (
                  <div
                    key={s.id}
                    className="bg-brand-charcoal border border-zinc-800 p-6 flex flex-col justify-between space-y-4"
                  >
                    <div className="flex gap-4 items-start">
                      <img
                        src={mediaUrl(s.cover_image || `/assets/photos/series-0${idx + 1}-tshirt.webp`)}
                        onError={(e) => {
                          e.target.src = '/assets/photos/series-01-tshirt.webp';
                        }}
                        alt={s.title}
                        className="w-20 h-24 object-cover border border-zinc-800 bg-zinc-950 flex-shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider ${
                              s.status === 'published'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                            }`}
                          >
                            {s.status}
                          </span>
                          <span className="font-mono text-[10px] text-zinc-500">
                            SLUG: /{s.slug}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl font-light text-brand-cream">
                          {s.title}
                        </h3>
                        <p className="text-xs text-zinc-400 font-light line-clamp-2">
                          {s.description}
                        </p>
                        {linkedProduct && (
                          <div className="pt-2 flex items-center gap-2 text-[10px] font-mono text-brand-brass">
                            <ShoppingBag className="w-3 h-3" />
                            <span className="font-medium">
                              GARMENT: {linkedProduct.name} &bull; ₹{linkedProduct.price}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                      <span className="font-mono text-xs text-brand-brass">
                        {s.chapters_count || 5} CHAPTERS
                      </span>
                      <div className="flex items-center gap-3">
                        {linkedProduct && (
                          <Link
                            to={`/product/${linkedProduct.slug}`}
                            target="_blank"
                            className="p-1.5 text-zinc-400 hover:text-brand-brass transition-colors"
                            title="View Buyable Garment"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <button
                          onClick={() => setEditingSeries(s)}
                          className="p-1.5 text-zinc-400 hover:text-brand-brass transition-colors"
                          title="Edit Series"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteSeries(s.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors"
                          title="Delete Series"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CHAPTERS */}
        {activeTab === 'chapters' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-light text-brand-cream">
                  Chapters Management
                </h2>
                <p className="font-mono text-xs text-zinc-400">
                  Manage the 5 chapters, storytelling narratives, and cover visuals.
                </p>
              </div>

              <Button
                variant="brass"
                size="sm"
                onClick={() => {
                  const targetSeries = seriesList.find((s) => s.id === selectedChapterSeriesId) || seriesList[0];
                  setEditingChapter({
                    series_id: targetSeries?.id || 1,
                    number: String(chaptersList.length + 1).padStart(2, '0'),
                    title: '',
                    slug: '',
                    story: '',
                    hero_image: targetSeries?.cover_image || '/assets/photos/series-01-tshirt.webp',
                    status: 'published',
                    sort_order: chaptersList.length + 1,
                  });
                }}
                icon={Plus}
              >
                New Chapter
              </Button>
            </div>

            {/* Series Filter Selector for Chapters */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-brand-charcoal border border-zinc-800">
              <span className="font-mono text-xs text-brand-brass uppercase tracking-widest mr-2">
                COLLECTION:
              </span>
              {seriesList.map((s) => (
                <button
                  key={s.id || s.slug}
                  type="button"
                  onClick={async () => {
                    setSelectedChapterSeriesId(s.id);
                    try {
                      const chapRes = await fetch(`/api/series/${s.slug}/chapters`).then((r) => r.json());
                      setChaptersList(Array.isArray(chapRes) ? chapRes : []);
                    } catch (e) {
                      console.error('Failed to load chapters for series:', e);
                    }
                  }}
                  className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all min-h-[36px] flex items-center gap-1.5 border ${
                    selectedChapterSeriesId === s.id
                      ? 'border-brand-brass bg-brand-brass text-brand-black font-bold shadow-sm'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-brand-cream hover:border-zinc-700'
                  }`}
                >
                  <span>{s.title.replace(/SERIES \d+\s*[-–—]\s*/i, '')}</span>
                </button>
              ))}
            </div>

            <div className="overflow-x-auto border border-zinc-800 bg-brand-charcoal">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-800 bg-black/40 text-zinc-400">
                    <th className="p-4">CH #</th>
                    <th className="p-4">TITLE</th>
                    <th className="p-4">SLUG</th>
                    <th className="p-4">HERO IMAGE</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {chaptersList.map((c) => (
                    <tr key={c.id || c.slug} className="hover:bg-brand-black/40 transition-colors">
                      <td className="p-4 text-brand-brass font-bold">{c.number}</td>
                      <td className="p-4 font-serif text-base text-brand-cream font-light">
                        {c.title}
                      </td>
                      <td className="p-4 text-zinc-400">/{c.slug}</td>
                      <td className="p-4">
                        <img
                          src={mediaUrl(c.hero_image)}
                          alt={c.title}
                          className="w-10 h-10 object-cover border border-zinc-800"
                        />
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 text-[9px] uppercase tracking-wider ${
                            c.status === 'published'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setEditingChapter(c)}
                          className="p-1 text-zinc-400 hover:text-brand-brass transition-colors"
                          title="Edit Chapter"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteChapter(c.id)}
                          className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
                          title="Delete Chapter"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-light text-brand-cream">
                  Garments &amp; Products
                </h2>
                <p className="font-mono text-xs text-zinc-400">
                  Archival pieces linked to chapters with pricing in ₹ INR and sizing.
                </p>
              </div>

              <Button
                variant="brass"
                size="sm"
                onClick={() =>
                  setEditingProduct({
                    chapter_id: chaptersList[1]?.id || 2,
                    name: 'The Gentle Armor T-Shirt',
                    slug: 'the-gentle-armor-tshirt',
                    description:
                      'Crafted from heavyweight organic cotton with a garment-washed finish, concealed seams, and a relaxed fit.',
                    price: 999,
                    images: ['/assets/photos/tshirt-front.webp'],
                    sizes: ['S', 'M', 'L', 'XL'],
                    stock: 24,
                  })
                }
                icon={Plus}
                className="min-h-[44px]"
              >
                New Product
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {productsList.map((p) => {
                const img = Array.isArray(p.images) ? p.images[0] : p.images;
                return (
                  <div
                    key={p.id}
                    className="bg-brand-charcoal border border-zinc-800 p-6 flex flex-col justify-between space-y-4"
                  >
                    <div className="flex gap-4 items-start">
                      <img
                        src={mediaUrl(img || '/assets/product-01-main.svg')}
                        alt={p.name}
                        className="w-20 h-24 object-cover border border-zinc-800 bg-zinc-950 flex-shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-brand-brass font-bold">
                            ₹{Number(p.price).toLocaleString('en-IN')}
                          </span>
                          <span className="text-zinc-600">//</span>
                          <span className="font-mono text-[10px] text-zinc-400 uppercase">
                            STOCK: {p.stock}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl font-light text-brand-cream">
                          {p.name}
                        </h3>
                        <p className="text-xs text-zinc-400 font-light line-clamp-2">
                          {p.description}
                        </p>
                        <div className="text-[10px] font-mono text-zinc-500 pt-1">
                          LINKED CHAPTER: {p.chapter_title || 'Chapter 02 : The Silence'}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {(Array.isArray(p.sizes) ? p.sizes : ['S', 'M', 'L', 'XL']).map((sz) => (
                          <span
                            key={sz}
                            className="px-1.5 py-0.5 border border-zinc-800 text-[9px] font-mono text-zinc-400"
                          >
                            {sz}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          to={`/product/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-zinc-400 hover:text-brand-cream transition-colors"
                          title="View Product Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="p-1.5 text-zinc-400 hover:text-brand-brass transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: MEDIA ASSETS */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-light text-brand-cream">
                  Archival Media Manager
                </h2>
                <p className="font-mono text-xs text-zinc-400">
                  Upload images stored locally in /uploads. Click any image to copy its URL.
                </p>
              </div>

              <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-brand-brass text-brand-black text-xs font-mono uppercase tracking-widest font-medium hover:bg-brand-brass-light transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New Media</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e)}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mediaList.map((m) => (
                <div
                  key={m.filename}
                  className="bg-brand-charcoal border border-zinc-800 p-2 space-y-2 group relative"
                >
                  <div className="overflow-hidden aspect-square bg-zinc-950 relative">
                    <img
                      src={mediaUrl(m.url)}
                      alt={m.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-zinc-400 truncate max-w-[120px]">
                      {m.filename}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(m.url);
                        showFeedback(`Copied ${m.url} to clipboard!`);
                      }}
                      className="p-1 text-zinc-500 hover:text-brand-brass transition-colors"
                      title="Copy URL"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SERIES EDIT MODAL */}
      {editingSeries && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" data-cursor-hide="true">
          <form
            onSubmit={saveSeries}
            className="bg-brand-charcoal border border-zinc-700 max-w-lg w-full p-8 space-y-5 relative"
          >
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-2xl font-light text-brand-cream">
                {editingSeries.id ? 'Edit Series' : 'Archive New Series'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingSeries(null)}
                className="text-zinc-400 hover:text-brand-cream"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-zinc-400 uppercase">TITLE</label>
              <input
                type="text"
                value={editingSeries.title}
                onChange={(e) => setEditingSeries({ ...editingSeries, title: e.target.value })}
                required
                className="w-full bg-brand-black border border-zinc-700 p-2.5 text-xs text-brand-cream"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-zinc-400 uppercase">SLUG</label>
              <input
                type="text"
                value={editingSeries.slug}
                onChange={(e) => setEditingSeries({ ...editingSeries, slug: e.target.value })}
                required
                className="w-full bg-brand-black border border-zinc-700 p-2.5 text-xs text-brand-cream"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-zinc-400 uppercase">DESCRIPTION</label>
              <textarea
                rows={3}
                value={editingSeries.description}
                onChange={(e) =>
                  setEditingSeries({ ...editingSeries, description: e.target.value })
                }
                className="w-full bg-brand-black border border-zinc-700 p-2.5 text-xs text-brand-cream"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-zinc-400 uppercase">
                COVER IMAGE URL / UPLOAD
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingSeries.cover_image}
                  onChange={(e) =>
                    setEditingSeries({ ...editingSeries, cover_image: e.target.value })
                  }
                  className="flex-1 bg-brand-black border border-zinc-700 p-2.5 text-xs text-brand-cream"
                />
                <label className="cursor-pointer px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-mono flex items-center">
                  <Upload className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUpload(e, (url) =>
                        setEditingSeries({ ...editingSeries, cover_image: url })
                      )
                    }
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {!editingSeries.id && (
              <div className="p-4 border border-brand-brass/40 bg-zinc-900/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-brand-brass uppercase tracking-wider font-bold">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Linked Buyable Garment (Storefront Product)</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-zinc-400 uppercase">
                      GARMENT NAME
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. The Quiet Horizon T-Shirt"
                      value={editingSeries.product_name || ''}
                      onChange={(e) =>
                        setEditingSeries({ ...editingSeries, product_name: e.target.value })
                      }
                      className="w-full bg-brand-black border border-zinc-700 p-2 text-xs text-brand-cream"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[9px] text-zinc-400 uppercase">
                      PRICE (₹ INR)
                    </label>
                    <input
                      type="number"
                      placeholder="999"
                      value={editingSeries.product_price || 999}
                      onChange={(e) =>
                        setEditingSeries({ ...editingSeries, product_price: e.target.value })
                      }
                      className="w-full bg-brand-black border border-zinc-700 p-2 text-xs text-brand-cream"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-zinc-400 uppercase">STATUS TOGGLE</label>
              <select
                value={editingSeries.status}
                onChange={(e) => setEditingSeries({ ...editingSeries, status: e.target.value })}
                className="w-full bg-brand-black border border-zinc-700 p-2.5 text-xs text-brand-cream"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
              <Button variant="outline" size="sm" onClick={() => setEditingSeries(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="brass" size="sm">
                Save Series
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* CHAPTER EDIT MODAL */}
      {editingChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" data-cursor-hide="true">
          <form
            onSubmit={saveChapter}
            className="bg-brand-charcoal border border-zinc-700 max-w-xl w-full p-8 space-y-4 relative max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-2xl font-light text-brand-cream">
                {editingChapter.id ? 'Edit Chapter' : 'Archive New Chapter'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingChapter(null)}
                className="text-zinc-400 hover:text-brand-cream"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-zinc-400 uppercase">CHAPTER NUMBER</label>
                <input
                  type="text"
                  value={editingChapter.number}
                  onChange={(e) =>
                    setEditingChapter({ ...editingChapter, number: e.target.value })
                  }
                  required
                  placeholder="01, 02, etc."
                  className="w-full bg-brand-black border border-zinc-700 p-2.5 text-xs text-brand-cream"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-zinc-400 uppercase">SORT ORDER</label>
                <input
                  type="number"
                  value={editingChapter.sort_order}
                  onChange={(e) =>
                    setEditingChapter({
                      ...editingChapter,
                      sort_order: Number(e.target.value),
                    })
                  }
                  className="w-full bg-brand-black border border-zinc-700 p-2.5 text-xs text-brand-cream"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-zinc-400 uppercase">CHAPTER TITLE</label>
              <input
                type="text"
                value={editingChapter.title}
                onChange={(e) => setEditingChapter({ ...editingChapter, title: e.target.value })}
                required
                className="w-full bg-brand-black border border-zinc-700 p-2.5 text-xs text-brand-cream"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-zinc-400 uppercase">SLUG</label>
              <input
                type="text"
                value={editingChapter.slug}
                onChange={(e) => setEditingChapter({ ...editingChapter, slug: e.target.value })}
                required
                className="w-full bg-brand-black border border-zinc-700 p-2.5 text-xs text-brand-cream"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-zinc-400 uppercase">
                STORY NARRATIVE
              </label>
              <textarea
                rows={4}
                value={editingChapter.story}
                onChange={(e) => setEditingChapter({ ...editingChapter, story: e.target.value })}
                className="w-full bg-brand-black border border-zinc-700 p-2.5 text-xs text-brand-cream"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-zinc-400 uppercase">
                HERO IMAGE URL / UPLOAD
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingChapter.hero_image}
                  onChange={(e) =>
                    setEditingChapter({ ...editingChapter, hero_image: e.target.value })
                  }
                  className="flex-1 bg-brand-black border border-zinc-700 p-2.5 text-xs text-brand-cream"
                />
                <label className="cursor-pointer px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-mono flex items-center">
                  <Upload className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUpload(e, (url) =>
                        setEditingChapter({ ...editingChapter, hero_image: url })
                      )
                    }
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-zinc-400 uppercase">STATUS TOGGLE</label>
              <select
                value={editingChapter.status}
                onChange={(e) =>
                  setEditingChapter({ ...editingChapter, status: e.target.value })
                }
                className="w-full bg-brand-black border border-zinc-700 p-2.5 text-xs text-brand-cream"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
              <Button variant="outline" size="sm" onClick={() => setEditingChapter(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="brass" size="sm">
                Save Chapter
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* PRODUCT EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" data-cursor-hide="true">
          <form
            onSubmit={saveProduct}
            className="bg-brand-charcoal border border-zinc-700 max-w-xl w-full p-8 space-y-4 relative max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-2xl font-light text-brand-cream">
                {editingProduct.id ? 'Edit Garment Product' : 'Archive New Garment'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-zinc-400 hover:text-brand-cream"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-zinc-400 uppercase">PRODUCT NAME</label>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                required
                className="w-full bg-brand-black border border-zinc-700 p-2.5 text-xs text-brand-cream"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-zinc-400 uppercase">SLUG</label>
                <input
                  type="text"
                  value={editingProduct.slug}
                  onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                  required
                  className="w-full bg-brand-black border border-zinc-700 p-2.5 text-xs text-brand-cream"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-zinc-400 uppercase">PRICE (₹ INR)</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                  }
                  required
                  className="w-full bg-brand-black border border-zinc-700 p-2.5 text-xs text-brand-cream"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-zinc-400 uppercase">LINKED CHAPTER</label>
              <select
                value={editingProduct.chapter_id || ''}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    chapter_id: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full bg-brand-black border border-zinc-700 p-2.5 text-xs text-brand-cream"
              >
                {chaptersList.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    Chapter {ch.number} : {ch.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] text-zinc-400 uppercase">DESCRIPTION</label>
              <textarea
                rows={3}
                value={editingProduct.description}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, description: e.target.value })
                }
                className="w-full bg-brand-black border border-zinc-700 p-2.5 text-xs text-brand-cream"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-mono text-[10px] text-zinc-400 uppercase">STOCK</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                  }
                  className="w-full bg-brand-black border border-zinc-700 p-2.5 text-xs text-brand-cream"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] text-zinc-400 uppercase">SIZES</label>
                <div className="flex gap-3 pt-2">
                  {['S', 'M', 'L', 'XL'].map((s) => {
                    const currentSizes = Array.isArray(editingProduct.sizes)
                      ? editingProduct.sizes
                      : ['S', 'M', 'L', 'XL'];
                    const checked = currentSizes.includes(s);
                    return (
                      <label key={s} className="flex items-center gap-1 font-mono text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...currentSizes, s]
                              : currentSizes.filter((sz) => sz !== s);
                            setEditingProduct({ ...editingProduct, sizes: updated });
                          }}
                          className="accent-[#c5a059]"
                        />
                        <span>{s}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
              <Button variant="outline" size="sm" onClick={() => setEditingProduct(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="brass" size="sm">
                Save Product
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
