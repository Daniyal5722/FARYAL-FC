import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Save, Search, Upload, CheckCircle2 } from 'lucide-react';
import { useThemeSettings } from '../../contexts/ThemeSettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { SEOConfig } from '../../types';
import { api } from '../../lib/api';

export const ManageSEO: React.FC = () => {
  const { seo, updateSettings } = useThemeSettings();
  const { success, error: toastError } = useToast();

  const [form, setForm] = useState<SEOConfig>(seo);
  const [saving, setSaving] = useState(false);
  const [uploadingOg, setUploadingOg] = useState(false);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({ seo: form });
      success('SEO and social graph metadata updated successfully!');
    } catch (err: any) {
      toastError(err.message || 'Failed to update SEO');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 mb-2 inline-block">
            Search Visibility
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-tight uppercase">
            SEO & <span className="text-blue-500">Metadata</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure titles, meta descriptions, OpenGraph social sharing preview cards, and indexing.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={15} />
          )}
          <span>Save Metadata</span>
        </button>
      </div>

      {/* Google SERP Snippet Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Search size={14} className="text-blue-500" />
          Google Search Results Preview
        </h2>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 max-w-2xl">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[8px] font-black text-white">
              F
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {form.canonicalUrl || 'https://faryal-fc.vercel.app'}
            </span>
          </div>
          <h3 className="text-blue-400 font-semibold text-base hover:underline cursor-pointer">
            {form.title || 'Faryal FC | Official Football Club'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {form.description || 'Official website of Faryal FC. Latest news, fixtures, squad, standings, and match reports.'}
          </p>
        </div>
      </div>

      {/* Primary SEO Settings */}
      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Globe className="text-blue-500" size={18} />
            Search Engine Tags
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Meta Page Title (Recommended: 50-60 characters)
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
                placeholder="Faryal FC | Official Football Club"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Meta Description (Recommended: 150-160 characters)
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-medium outline-none focus:border-blue-500"
                placeholder="Official website of Faryal FC. Latest news, squad roster, fixtures, and match results."
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Meta Keywords (Comma-separated)
              </label>
              <input
                type="text"
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-medium outline-none focus:border-blue-500"
                placeholder="faryal fc, football club, karachi football, squad"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Canonical URL
              </label>
              <input
                type="text"
                value={form.canonicalUrl}
                onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-blue-500"
                placeholder="https://faryal-fc.vercel.app"
              />
            </div>
          </div>
        </div>

        {/* Open Graph & Social Cards */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Globe className="text-blue-500" size={18} />
            Social Graph (WhatsApp, Twitter, Facebook Card)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Open Graph Social Title
              </label>
              <input
                type="text"
                value={form.ogTitle}
                onChange={(e) => setForm({ ...form, ogTitle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
                placeholder="Faryal FC Official Football Club"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
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

            <div className="md:col-span-2 space-y-3">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">
                Social Share Image (1200 x 630 px)
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={form.ogImage}
                  onChange={(e) => setForm({ ...form, ogImage: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-blue-500"
                  placeholder="https://..."
                />
                <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0">
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
          </div>
        </div>
      </form>
    </div>
  );
};
