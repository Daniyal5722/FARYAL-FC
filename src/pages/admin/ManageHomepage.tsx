import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout, Save, ArrowUp, ArrowDown, Eye, EyeOff, Image as ImageIcon, Video, Sparkles, Link as LinkIcon, Upload, RotateCcw, Palette } from 'lucide-react';
import { useThemeSettings } from '../../contexts/ThemeSettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { HeroConfig, HomepageSection } from '../../types';
import { DEFAULT_HERO } from '../../data/defaultConfig';
import { api } from '../../lib/api';

export const ManageHomepage: React.FC = () => {
  const { hero, homepageSections, updateSettings } = useThemeSettings();
  const { success, error: toastError } = useToast();

  const [heroForm, setHeroForm] = useState<HeroConfig>(hero);
  const [sections, setSections] = useState<HomepageSection[]>(
    [...homepageSections].sort((a, b) => a.order - b.order)
  );
  const [saving, setSaving] = useState(false);
  const [resettingHero, setResettingHero] = useState(false);
  const [uploadingHeroBg, setUploadingHeroBg] = useState(false);

  useEffect(() => {
    if (hero) {
      setHeroForm(hero);
    }
  }, [hero]);

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    const reordered = newSections.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSections(reordered);
  };

  const toggleVisibility = (id: string) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );
  };

  const handleHeroBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHeroBg(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const url = await api.upload.image(reader.result as string, file.name);
        setHeroForm((prev) => ({ ...prev, backgroundImage: url }));
        success('Hero background updated!');
      } catch (err: any) {
        toastError(err.message || 'Upload failed');
      } finally {
        setUploadingHeroBg(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await updateSettings({
        hero: heroForm,
        homepageSections: sections,
      });
      success('Homepage layout and Hero section saved successfully!');
    } catch (err: any) {
      toastError(err.message || 'Failed to save homepage settings');
    } finally {
      setSaving(false);
    }
  };

  const handleResetHeroToDefaults = async () => {
    setResettingHero(true);
    try {
      setHeroForm(DEFAULT_HERO);
      await updateSettings({ hero: DEFAULT_HERO });
      success('Hero configuration reverted to initial default settings!');
    } catch (err: any) {
      toastError(err.message || 'Failed to reset hero settings');
    } finally {
      setResettingHero(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 mb-2 inline-block">
            Page Architect
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-tight uppercase">
            Homepage & <span className="text-blue-500">Hero Section</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure Hero headlines, background imagery, calls-to-action, and reorder public homepage blocks.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving || resettingHero}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={15} />
          )}
          <span>Save Changes</span>
        </button>
      </div>

      {/* Hero Section Config */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
          <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Sparkles className="text-blue-500" size={18} />
            Hero Banner Configuration
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={heroForm.visible}
                onChange={(e) => setHeroForm({ ...heroForm, visible: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800"
              />
              <span className="text-xs font-bold text-slate-300 uppercase">Visible</span>
            </label>

            <button
              type="button"
              onClick={handleResetHeroToDefaults}
              disabled={resettingHero || saving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700/80 hover:border-slate-600 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all disabled:opacity-50"
              title="Revert all hero form fields to the site's initial default configuration"
            >
              <RotateCcw size={13} className={resettingHero ? 'animate-spin' : ''} />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
              Main Headline (Title)
            </label>
            <input
              type="text"
              value={heroForm.title}
              onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
              placeholder="FARYAL FC"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
              Subtitle / Kicker
            </label>
            <input
              type="text"
              value={heroForm.subtitle}
              onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
              placeholder="BUILT FOR THE GAME"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
              Hero Description Paragraph
            </label>
            <textarea
              rows={3}
              value={heroForm.description}
              onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-medium outline-none focus:border-blue-500"
              placeholder="Describe the club ethos..."
            />
          </div>

          {/* Primary CTA */}
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
              Primary Button Text
            </label>
            <input
              type="text"
              value={heroForm.ctaText}
              onChange={(e) => setHeroForm({ ...heroForm, ctaText: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
              placeholder="VIEW SQUAD"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
              Primary Button Link URL
            </label>
            <input
              type="text"
              value={heroForm.ctaLink}
              onChange={(e) => setHeroForm({ ...heroForm, ctaLink: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-blue-500"
              placeholder="/team"
            />
          </div>

          {/* Secondary CTA */}
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
              Secondary Button Text
            </label>
            <input
              type="text"
              value={heroForm.secondaryCtaText}
              onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaText: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
              placeholder="LATEST FIXTURES"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
              Secondary Button Link URL
            </label>
            <input
              type="text"
              value={heroForm.secondaryCtaLink}
              onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaLink: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-blue-500"
              placeholder="/matches"
            />
          </div>

          {/* Background Source Type Selector & URL Inputs */}
          <div className="md:col-span-2 space-y-4 pt-2 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider">
                  Hero Background Media Source
                </label>
                <p className="text-[11px] text-slate-500 font-medium">
                  Choose whether to display a cinematic video backdrop or high-resolution stadium photography.
                </p>
              </div>

              {/* Source Toggle Pill */}
              <div className="inline-flex p-1 bg-slate-950 border border-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setHeroForm({ ...heroForm, backgroundType: 'image' })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                    (heroForm.backgroundType || 'image') === 'image'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon size={14} />
                  <span>Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHeroForm({ ...heroForm, backgroundType: 'video' })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                    heroForm.backgroundType === 'video'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Video size={14} />
                  <span>Video</span>
                </button>
              </div>
            </div>

            {/* If Video Source Selected */}
            {heroForm.backgroundType === 'video' ? (
              <div className="space-y-4 p-4 rounded-2xl bg-slate-950/60 border border-blue-500/20">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                    Background Video URL (.mp4 / .webm)
                  </label>
                  <input
                    type="url"
                    value={heroForm.backgroundVideo || ''}
                    onChange={(e) => setHeroForm({ ...heroForm, backgroundVideo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-blue-500"
                    placeholder="https://assets.mixkit.co/videos/preview/mixkit-football-player-running-with-the-ball-34371-large.mp4"
                  />
                  <p className="text-[10px] text-slate-500 font-mono mt-1.5">
                    Direct MP4 or WebM video link. Will autoplay muted in a smooth continuous loop behind the hero elements.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                    Fallback Poster / Cover Image URL
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={heroForm.videoPoster || heroForm.backgroundImage || ''}
                      onChange={(e) => setHeroForm({ ...heroForm, videoPoster: e.target.value })}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-blue-500"
                      placeholder="https://..."
                    />
                    <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0">
                      <Upload size={14} />
                      <span>{uploadingHeroBg ? 'Uploading...' : 'Upload Poster'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroBgUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-1.5">
                    Displays while the video loads or on power-saver mobile devices.
                  </p>
                </div>

                {/* Video Overlay Tint & Opacity Controls */}
                <div className="pt-3 border-t border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Palette size={14} className="text-blue-400" />
                      Video Overlay Tint
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          type="color"
                          value={heroForm.videoOverlayTint || '#020617'}
                          onChange={(e) => setHeroForm({ ...heroForm, videoOverlayTint: e.target.value })}
                          className="w-10 h-10 rounded-xl cursor-pointer bg-slate-900 border border-slate-700 p-0.5 overflow-hidden"
                        />
                      </div>
                      <input
                        type="text"
                        value={heroForm.videoOverlayTint || '#020617'}
                        onChange={(e) => setHeroForm({ ...heroForm, videoOverlayTint: e.target.value })}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono uppercase outline-none focus:border-blue-500"
                        placeholder="#020617"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mt-1.5">
                      Tint color layered over the video to maximize typography contrast.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-black text-slate-300 uppercase tracking-wider">
                        Overlay Opacity
                      </label>
                      <span className="text-xs font-mono font-bold text-blue-400">
                        {Math.round(((heroForm.videoOverlayOpacity ?? 0.75)) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.95"
                      step="0.05"
                      value={heroForm.videoOverlayOpacity ?? 0.75}
                      onChange={(e) => setHeroForm({ ...heroForm, videoOverlayOpacity: parseFloat(e.target.value) })}
                      className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer mt-3"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                      <span>Light (10%)</span>
                      <span>Balanced (75%)</span>
                      <span>Dark (95%)</span>
                    </div>
                  </div>
                </div>

                {/* Video Live Preview */}
                {heroForm.backgroundVideo && (
                  <div className="h-44 rounded-2xl overflow-hidden border border-slate-800 relative bg-black">
                    <video
                      src={heroForm.backgroundVideo}
                      poster={heroForm.videoPoster || heroForm.backgroundImage}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {/* Live Tint Overlay in preview */}
                    <div
                      className="absolute inset-0 transition-colors"
                      style={{
                        backgroundColor: heroForm.videoOverlayTint || '#020617',
                        opacity: heroForm.videoOverlayOpacity ?? 0.75,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end justify-between p-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 backdrop-blur-md">
                        Live Video Background Active
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700/60 backdrop-blur-md">
                        Tint: {heroForm.videoOverlayTint || '#020617'} ({Math.round(((heroForm.videoOverlayOpacity ?? 0.75)) * 100)}%)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* If Image Source Selected */
              <div className="space-y-3">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">
                  Hero Stadium Background Image URL
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={heroForm.backgroundImage}
                    onChange={(e) => setHeroForm({ ...heroForm, backgroundImage: e.target.value })}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-blue-500"
                    placeholder="https://..."
                  />
                  <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0">
                    <Upload size={14} />
                    <span>{uploadingHeroBg ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroBgUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {heroForm.backgroundImage && (
                  <div className="h-36 rounded-2xl overflow-hidden border border-slate-800 relative">
                    <img
                      src={heroForm.backgroundImage}
                      alt="Hero Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex items-end p-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                        Live Image Background Preview
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Homepage Sections Ordering & Visibility */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Layout className="text-blue-500" size={18} />
            Homepage Section Flow & Visibility
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Toggle visibility and reorder how sections stack on the public homepage.
          </p>
        </div>

        <div className="space-y-2">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                section.visible
                  ? 'bg-slate-950 border-slate-800'
                  : 'bg-slate-950/40 border-slate-800/40 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 font-bold text-xs flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-xs font-black text-white uppercase tracking-wider">
                  {section.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveSection(index, 'up')}
                  disabled={index === 0}
                  className="p-2 text-slate-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Move Up"
                >
                  <ArrowUp size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(index, 'down')}
                  disabled={index === sections.length - 1}
                  className="p-2 text-slate-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Move Down"
                >
                  <ArrowDown size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => toggleVisibility(section.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    section.visible
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20'
                      : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {section.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                  <span>{section.visible ? 'Visible' : 'Hidden'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
