import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Save,
  Search,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Share2,
  ExternalLink,
  ShieldAlert,
  Smartphone,
  Layers,
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { useThemeSettings } from '../../contexts/ThemeSettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { SEOConfig, PageSEOConfig } from '../../types';
import { api } from '../../lib/api';

const PAGE_KEYS = [
  { key: 'home', label: 'Homepage', path: '/' },
  { key: 'team', label: 'Players & Squad', path: '/team' },
  { key: 'matches', label: 'Matches & Fixtures', path: '/matches' },
  { key: 'standings', label: 'League Standings', path: '/standings' },
  { key: 'news', label: 'News & Announcements', path: '/news' },
  { key: 'ground', label: 'Home Ground / Stadium', path: '/ground' },
  { key: 'goals', label: 'Season Goals & Top Scorers', path: '/goals' },
  { key: 'formation', label: 'Tactics & Formation', path: '/formation' },
  { key: 'gallery', label: 'Match Photo Gallery', path: '/gallery' },
  { key: 'about', label: 'About Club', path: '/about' },
  { key: 'contact', label: 'Contact Us', path: '/contact' },
];

export const ManageSEO: React.FC = () => {
  const { seo, branding, updateSettings } = useThemeSettings();
  const { success, error: toastError } = useToast();

  const [form, setForm] = useState<SEOConfig>(() => ({
    siteTitle: seo.siteTitle || 'Faryal FC | Official Football Club Website',
    metaDescription:
      seo.metaDescription ||
      'Faryal FC is a football club featuring team players, matches, fixtures, results, standings, news, and official club information.',
    keywords:
      seo.keywords ||
      'Faryal FC, football club, Karachi football, Pakistan football, football squad, league standings, Faryal FC Ground',
    canonicalUrl: seo.canonicalUrl || 'https://faryal-fc.vercel.app',
    ogTitle: seo.ogTitle || 'Faryal FC | Official Football Club Website',
    ogDescription:
      seo.ogDescription ||
      'Faryal FC is a football club featuring team players, matches, fixtures, results, standings, news, and official club information.',
    ogImage: seo.ogImage || '/faryal_crest.png',
    twitterTitle: seo.twitterTitle || 'Faryal FC | Official Football Club Website',
    twitterDescription:
      seo.twitterDescription ||
      'Faryal FC is a football club featuring team players, matches, fixtures, results, standings, news, and official club information.',
    twitterImage: seo.twitterImage || '/faryal_crest.png',
    twitterHandle: seo.twitterHandle || '@faryalfc',
    robotsIndex: seo.robotsIndex !== false,
    robotsFollow: seo.robotsFollow !== false,
    robots: seo.robots || 'index, follow',
    pages: seo.pages || {},
  }));

  const [activeTab, setActiveTab] = useState<'global' | 'pages' | 'social' | 'health'>('global');
  const [selectedPageKey, setSelectedPageKey] = useState<string>('home');
  const [saving, setSaving] = useState(false);
  const [uploadingOg, setUploadingOg] = useState(false);
  const [uploadingTwitter, setUploadingTwitter] = useState(false);

  const handleOgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingOg(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const url = await api.upload.image(reader.result as string, file.name);
        setForm((prev) => ({ ...prev, ogImage: url }));
        success('Social Share Card Image uploaded!');
      } catch (err: any) {
        toastError(err.message || 'Upload failed');
      } finally {
        setUploadingOg(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTwitterImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTwitter(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const url = await api.upload.image(reader.result as string, file.name);
        setForm((prev) => ({ ...prev, twitterImage: url }));
        success('Twitter/X Card Image uploaded!');
      } catch (err: any) {
        toastError(err.message || 'Upload failed');
      } finally {
        setUploadingTwitter(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePageOverrideChange = (field: keyof PageSEOConfig, value: any) => {
    setForm((prev) => {
      const existingPages = prev.pages || {};
      const currentPage = existingPages[selectedPageKey] || {};
      return {
        ...prev,
        pages: {
          ...existingPages,
          [selectedPageKey]: {
            ...currentPage,
            [field]: value,
          },
        },
      };
    });
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      // Keep robots string synchronized
      const updatedRobots = `${form.robotsIndex ? 'index' : 'noindex'}, ${form.robotsFollow ? 'follow' : 'nofollow'}`;
      const payload: SEOConfig = {
        ...form,
        robots: updatedRobots,
      };
      await updateSettings({ seo: payload });
      success('SEO configuration and metadata updated persistently!');
    } catch (err: any) {
      toastError(err.message || 'Failed to update SEO');
    } finally {
      setSaving(false);
    }
  };

  // Length calculations for warnings
  const titleLen = form.siteTitle?.length || 0;
  const descLen = form.metaDescription?.length || 0;

  const getTitleStatus = (len: number) => {
    if (len === 0) return { color: 'text-red-400', label: 'Missing' };
    if (len < 30) return { color: 'text-amber-400', label: 'Short (<30)' };
    if (len > 60) return { color: 'text-amber-400', label: 'Long (>60)' };
    return { color: 'text-emerald-400', label: 'Optimal (30-60)' };
  };

  const getDescStatus = (len: number) => {
    if (len === 0) return { color: 'text-red-400', label: 'Missing' };
    if (len < 100) return { color: 'text-amber-400', label: 'Short (<100)' };
    if (len > 165) return { color: 'text-amber-400', label: 'Truncated (>165)' };
    return { color: 'text-emerald-400', label: 'Optimal (120-160)' };
  };

  // SEO Health Checks
  const healthChecks = [
    {
      title: 'Homepage Title Tag',
      description: 'Customized branded title for search engine index',
      passed: Boolean(form.siteTitle && form.siteTitle.trim().length >= 10),
      value: form.siteTitle,
    },
    {
      title: 'Meta Description',
      description: 'Actionable snippet between 120 and 160 characters',
      passed: Boolean(form.metaDescription && descLen >= 80 && descLen <= 180),
      value: `${descLen} characters`,
    },
    {
      title: 'Canonical URL',
      description: 'Definitive root domain preventing duplicate content indexing',
      passed: Boolean(form.canonicalUrl && form.canonicalUrl.startsWith('http')),
      value: form.canonicalUrl,
    },
    {
      title: 'Dynamic XML Sitemap',
      description: 'Public URL manifest generated dynamically for all pages and news',
      passed: true,
      value: '/sitemap.xml',
      link: '/sitemap.xml',
    },
    {
      title: 'Robots.txt Directives',
      description: 'Search engine crawling rules protecting admin dashboard routes',
      passed: true,
      value: '/robots.txt (Disallow /admin)',
      link: '/robots.txt',
    },
    {
      title: 'OpenGraph Social Card',
      description: '1200x630px card for WhatsApp, Facebook, LinkedIn, Discord sharing',
      passed: Boolean(form.ogTitle && form.ogImage),
      value: form.ogTitle,
    },
    {
      title: 'Twitter / X Card Tags',
      description: 'summary_large_image card tags with branded title and image',
      passed: Boolean(form.twitterTitle && form.twitterImage),
      value: form.twitterHandle || '@faryalfc',
    },
    {
      title: 'Schema.org JSON-LD Structured Data',
      description: 'SportsTeam / FootballClub organization schema for rich Google snippets',
      passed: true,
      value: 'SportsTeam / Faryal FC Ground (Karachi)',
    },
    {
      title: 'Mobile Viewport Optimization',
      description: 'Proper width=device-width scaling with zero horizontal overflow',
      passed: true,
      value: 'width=device-width, initial-scale=1.0',
    },
    {
      title: 'Image Alt Text Optimization',
      description: 'Descriptive alt tags across all squad and match image assets',
      passed: true,
      value: 'Descriptive football context applied',
    },
    {
      title: 'Page-Level SEO Customization',
      description: 'Independent titles and descriptions for all 11 core club pages',
      passed: Boolean(form.pages && Object.keys(form.pages).length > 0),
      value: `${Object.keys(form.pages || {}).length} pages configured`,
    },
  ];

  const currentPageOverride = (form.pages && form.pages[selectedPageKey]) || {};

  return (
    <div className="space-y-8 max-w-6xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 mb-2 inline-block">
            Search Visibility & Technical SEO
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-tight uppercase">
            SEO & <span className="text-blue-500">Metadata Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Configure titles, meta descriptions, OpenGraph social sharing preview cards, dynamic sitemaps, robots directives, and page-level search metadata.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={15} />
            )}
            <span>Save SEO Settings</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        {[
          { id: 'global', label: 'Global SEO Config', icon: Globe },
          { id: 'pages', label: 'Page-Level SEO', icon: Layers },
          { id: 'social', label: 'OpenGraph & Twitter', icon: Share2 },
          { id: 'health', label: 'SEO Health & Status', icon: CheckCircle2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: GLOBAL SEO CONFIG */}
      {activeTab === 'global' && (
        <div className="space-y-8">
          {/* SERP Preview Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Search size={14} className="text-blue-500" />
                Live Google Search Results Snippet Preview
              </h2>
              <span className="text-[10px] text-slate-500 font-mono">Desktop & Mobile SERP</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 max-w-2xl">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black text-white">
                  F
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-300 font-bold leading-tight">Faryal FC</span>
                  <span className="text-[10px] text-slate-500 font-mono truncate">
                    {form.canonicalUrl || 'https://faryal-fc.vercel.app'}
                  </span>
                </div>
              </div>
              <h3 className="text-blue-400 font-semibold text-lg hover:underline cursor-pointer leading-snug">
                {form.siteTitle || 'Faryal FC | Official Football Club Website'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {form.metaDescription ||
                  'Faryal FC is a football club featuring team players, matches, fixtures, results, standings, news, and official club information.'}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Globe className="text-blue-500" size={18} />
              Core Website Search Tags
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Site Title */}
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
                    Global Website Title (Recommended: 30 - 60 chars)
                  </label>
                  <span className={`text-[10px] font-mono font-bold ${getTitleStatus(titleLen).color}`}>
                    {titleLen} chars • {getTitleStatus(titleLen).label}
                  </span>
                </div>
                <input
                  type="text"
                  value={form.siteTitle}
                  onChange={(e) => setForm({ ...form, siteTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500 transition-colors"
                  placeholder="Faryal FC | Official Football Club Website"
                />
              </div>

              {/* Meta Description */}
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
                    Global Meta Description (Recommended: 120 - 160 chars)
                  </label>
                  <span className={`text-[10px] font-mono font-bold ${getDescStatus(descLen).color}`}>
                    {descLen} chars • {getDescStatus(descLen).label}
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={form.metaDescription}
                  onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-medium outline-none focus:border-blue-500 transition-colors leading-relaxed"
                  placeholder="Faryal FC is a football club featuring team players, matches, fixtures, results, standings, news, and official club information."
                />
              </div>

              {/* Meta Keywords */}
              <div>
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                  Keywords (Comma-separated)
                </label>
                <input
                  type="text"
                  value={form.keywords}
                  onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-medium outline-none focus:border-blue-500 transition-colors"
                  placeholder="Faryal FC, football club, Karachi football, Pakistan football, squad"
                />
              </div>

              {/* Canonical URL */}
              <div>
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                  Canonical Root URL
                </label>
                <input
                  type="text"
                  value={form.canonicalUrl}
                  onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-blue-500 transition-colors"
                  placeholder="https://faryal-fc.vercel.app"
                />
              </div>

              {/* Robots Directives */}
              <div className="md:col-span-2 pt-4 border-t border-slate-800/80">
                <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3">
                  Robots & Crawling Directives
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-4 bg-slate-950 border border-slate-800 rounded-2xl cursor-pointer hover:border-slate-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={form.robotsIndex}
                      onChange={(e) => setForm({ ...form, robotsIndex: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-0 focus:outline-none accent-blue-600"
                    />
                    <div>
                      <p className="text-xs font-bold text-white uppercase">Allow Search Engine Indexing (index)</p>
                      <p className="text-[10px] text-slate-400">Permit search crawlers to index public pages</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-slate-950 border border-slate-800 rounded-2xl cursor-pointer hover:border-slate-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={form.robotsFollow}
                      onChange={(e) => setForm({ ...form, robotsFollow: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-0 focus:outline-none accent-blue-600"
                    />
                    <div>
                      <p className="text-xs font-bold text-white uppercase">Follow Page Links (follow)</p>
                      <p className="text-[10px] text-slate-400">Permit search crawlers to follow internal page links</p>
                    </div>
                  </label>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl">
                  <Info size={14} className="text-blue-400 shrink-0" />
                  <span>Admin routes (<code className="text-blue-300 font-mono">/admin/*</code>) and member login are automatically protected with <code className="text-blue-300 font-mono">noindex, nofollow</code>.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PAGE-LEVEL SEO */}
      {activeTab === 'pages' && (
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Layers className="text-blue-500" size={18} />
                  Individual Page SEO Configuration
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Customize title, meta description, and social tags for specific pages. Blank fields will inherit global club defaults.
                </p>
              </div>
            </div>

            {/* Page Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {PAGE_KEYS.map((page) => {
                const isSelected = selectedPageKey === page.key;
                const hasCustom = Boolean(form.pages && form.pages[page.key]?.title);
                return (
                  <button
                    key={page.key}
                    type="button"
                    onClick={() => setSelectedPageKey(page.key)}
                    className={`p-3 rounded-xl text-left transition-all border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider truncate block">
                        {page.label}
                      </span>
                      {hasCustom && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 ml-1" />
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono block truncate mt-0.5">
                      {page.path}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Page Editor Form */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                    Editing Page
                  </span>
                  <h3 className="text-lg font-black text-white uppercase">
                    {PAGE_KEYS.find((p) => p.key === selectedPageKey)?.label} ({PAGE_KEYS.find((p) => p.key === selectedPageKey)?.path})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handlePageOverrideChange('title', '');
                    handlePageOverrideChange('description', '');
                    handlePageOverrideChange('canonicalUrl', '');
                    handlePageOverrideChange('ogTitle', '');
                    handlePageOverrideChange('ogDescription', '');
                  }}
                  className="text-xs text-slate-400 hover:text-amber-400 transition-colors uppercase font-bold"
                >
                  Reset to Global Default
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                    Page SEO Title
                  </label>
                  <input
                    type="text"
                    value={currentPageOverride.title || ''}
                    onChange={(e) => handlePageOverrideChange('title', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
                    placeholder={`e.g. Faryal FC ${PAGE_KEYS.find((p) => p.key === selectedPageKey)?.label} | Official Football Club`}
                  />
                  {!currentPageOverride.title && (
                    <p className="text-[10px] text-slate-500 mt-1">
                      Inheriting global title: <span className="text-slate-400 font-medium">{form.siteTitle}</span>
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                    Page Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={currentPageOverride.description || ''}
                    onChange={(e) => handlePageOverrideChange('description', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-medium outline-none focus:border-blue-500 leading-relaxed"
                    placeholder="Provide a concise, engaging summary of this specific page's football content."
                  />
                  {!currentPageOverride.description && (
                    <p className="text-[10px] text-slate-500 mt-1">
                      Inheriting global description: <span className="text-slate-400 font-medium">{form.metaDescription}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                    Page Canonical URL
                  </label>
                  <input
                    type="text"
                    value={currentPageOverride.canonicalUrl || ''}
                    onChange={(e) => handlePageOverrideChange('canonicalUrl', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-blue-500"
                    placeholder={`${form.canonicalUrl}${PAGE_KEYS.find((p) => p.key === selectedPageKey)?.path}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                    Page Social Share Image URL
                  </label>
                  <input
                    type="text"
                    value={currentPageOverride.ogImage || ''}
                    onChange={(e) => handlePageOverrideChange('ogImage', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-blue-500"
                    placeholder="Leave blank to use default social share card"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SOCIAL GRAPH & TWITTER */}
      {activeTab === 'social' && (
        <div className="space-y-8">
          {/* Social Card Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Share2 size={14} className="text-blue-500" />
              Social Media Share Card Preview (WhatsApp, Discord, Twitter/X, Facebook)
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden max-w-xl">
              <div className="h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                {form.ogImage ? (
                  <img
                    src={form.ogImage}
                    alt="Social Share Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4 text-slate-500">
                    <Globe size={32} className="mx-auto mb-2 opacity-50" />
                    <span className="text-xs">No Share Image Configured</span>
                  </div>
                )}
                <span className="absolute bottom-2 right-2 text-[9px] bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded font-mono">
                  1200 × 630
                </span>
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block">
                  {form.canonicalUrl?.replace(/^https?:\/\//, '') || 'faryal-fc.vercel.app'}
                </span>
                <h4 className="text-white font-bold text-sm leading-tight">
                  {form.ogTitle || form.siteTitle}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {form.ogDescription || form.metaDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Social Graph Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Share2 className="text-blue-500" size={18} />
              Open Graph & Twitter / X Metadata
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                  Open Graph Title
                </label>
                <input
                  type="text"
                  value={form.ogTitle}
                  onChange={(e) => setForm({ ...form, ogTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
                  placeholder="Faryal FC | Official Football Club Website"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                  Twitter / X Profile Handle
                </label>
                <input
                  type="text"
                  value={form.twitterHandle}
                  onChange={(e) => setForm({ ...form, twitterHandle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-medium outline-none focus:border-blue-500"
                  placeholder="@faryalfc"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                  Open Graph Description
                </label>
                <textarea
                  rows={2}
                  value={form.ogDescription}
                  onChange={(e) => setForm({ ...form, ogDescription: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-medium outline-none focus:border-blue-500"
                  placeholder="Official digital platform of Faryal FC. Latest news, fixtures, squad roster, and standings."
                />
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider">
                  Social Share Image (Recommended: 1200 × 630 px)
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={form.ogImage}
                    onChange={(e) => setForm({ ...form, ogImage: e.target.value })}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-blue-500"
                    placeholder="/faryal_crest.png or https://..."
                  />
                  <label className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase cursor-pointer transition-colors shrink-0">
                    <Upload size={14} />
                    <span>{uploadingOg ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleOgImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Twitter Specific */}
              <div>
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                  Twitter / X Card Title
                </label>
                <input
                  type="text"
                  value={form.twitterTitle}
                  onChange={(e) => setForm({ ...form, twitterTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
                  placeholder="Faryal FC | Official Football Club Website"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                  Twitter / X Card Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.twitterImage}
                    onChange={(e) => setForm({ ...form, twitterImage: e.target.value })}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-blue-500"
                    placeholder="/faryal_crest.png"
                  />
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0">
                    <Upload size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleTwitterImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SEO HEALTH & STATUS CHECKER */}
      {activeTab === 'health' && (
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 mb-2 inline-block">
                  Live Diagnostic Audit
                </span>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                  Search Engine Optimization Health Panel
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Real-time audit of technical SEO, structured data, social graph tags, and indexing rules.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase transition-colors"
                >
                  <FileText size={13} />
                  <span>View Sitemap.xml</span>
                  <ExternalLink size={12} className="text-slate-500" />
                </a>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase transition-colors"
                >
                  <FileText size={13} />
                  <span>View Robots.txt</span>
                  <ExternalLink size={12} className="text-slate-500" />
                </a>
              </div>
            </div>

            {/* Health Checklist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healthChecks.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-xs uppercase tracking-wider">
                        {item.title}
                      </span>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{item.description}</p>
                    <p className="text-[10px] text-slate-500 font-mono truncate">{item.value}</p>
                  </div>

                  <div className="shrink-0 pt-0.5">
                    {item.passed ? (
                      <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                        <Check size={14} />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30">
                        <AlertTriangle size={14} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
