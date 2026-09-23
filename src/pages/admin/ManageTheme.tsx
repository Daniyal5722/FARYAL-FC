import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Palette,
  Save,
  RotateCcw,
  Sparkles,
  Type,
  Maximize2,
  Sliders,
  Moon,
  Sun,
  Laptop,
  Check,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useThemeSettings } from '../../contexts/ThemeSettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { ThemeConfig } from '../../types';
import { DEFAULT_THEME, THEME_PRESETS } from '../../data/defaultConfig';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const ManageTheme: React.FC = () => {
  const { theme, updateTheme, saveTheme, resetTheme, applyPreset } = useThemeSettings();
  const { success, error: toastError } = useToast();

  const [localTheme, setLocalTheme] = useState<ThemeConfig>(theme);
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'presets' | 'ui' | 'animations' | 'preview'>('colors');
  const [saving, setSaving] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalTheme(theme);
    setIsDirty(false);
  }, [theme]);

  const handleColorChange = (key: keyof ThemeConfig, val: string) => {
    const updated = { ...localTheme, [key]: val };
    setLocalTheme(updated);
    setIsDirty(true);
    updateTheme({ [key]: val }, true); // preview immediately
  };

  const handleTypographyChange = (field: string, val: string) => {
    const updated = {
      ...localTheme,
      typography: {
        ...localTheme.typography,
        [field]: val,
      },
    };
    setLocalTheme(updated);
    setIsDirty(true);
    updateTheme(updated, true);
  };

  const handleAnimationChange = (field: string, val: any) => {
    const updated = {
      ...localTheme,
      animations: {
        ...localTheme.animations,
        [field]: val,
      },
    };
    setLocalTheme(updated);
    setIsDirty(true);
    updateTheme(updated, true);
  };

  const handlePresetSelect = (presetKey: string) => {
    const preset = THEME_PRESETS[presetKey];
    if (preset) {
      const merged: ThemeConfig = { ...localTheme, ...preset };
      setLocalTheme(merged);
      setIsDirty(true);
      applyPreset(presetKey);
      success(`Applied ${presetKey.replace('_', ' ').toUpperCase()} preset. Click Save to persist.`);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveTheme(localTheme);
      setIsDirty(false);
      success('Website theme & tokens saved successfully!');
    } catch (err: any) {
      toastError(err.message || 'Failed to save theme settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    try {
      await resetTheme();
      setLocalTheme(DEFAULT_THEME);
      setIsDirty(false);
      setResetModalOpen(false);
      success('Restored default Faryal FC theme!');
    } catch (err: any) {
      toastError(err.message || 'Failed to reset theme');
    } finally {
      setSaving(false);
    }
  };

  const colorFields: { label: string; key: keyof ThemeConfig; desc: string }[] = [
    { label: 'Primary Brand Color', key: 'primaryColor', desc: 'Main navigation, prominent accents, and brand headers' },
    { label: 'Secondary Dark Color', key: 'secondaryColor', desc: 'Background for deep contrast sections and headers' },
    { label: 'Accent Color', key: 'accentColor', desc: 'Badges, score highlights, links, and action markers' },
    { label: 'Website Background', key: 'backgroundColor', desc: 'Global body background canvas color' },
    { label: 'Surface & Card Color', key: 'surfaceColor', desc: 'Player cards, match boxes, tables, and modal backgrounds' },
    { label: 'Primary Text Color', key: 'textColor', desc: 'Main text headings, titles, and body content' },
    { label: 'Muted Text Color', key: 'mutedTextColor', desc: 'Labels, secondary descriptions, and timestamps' },
    { label: 'Border & Divider Color', key: 'borderColor', desc: 'Outlines, table borders, and card edges' },
    { label: 'Button Color', key: 'buttonColor', desc: 'Primary CTA and action buttons' },
    { label: 'Button Hover Color', key: 'buttonHoverColor', desc: 'Interactive state for buttons' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              Visual Design System
            </span>
            {isDirty && (
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 flex items-center gap-1">
                <AlertCircle size={12} />
                Unsaved Changes
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-tight uppercase">
            Theme <span className="text-blue-500">Customizer</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Control the global visual appearance, brand tokens, colors, typography, borders, and animations across the entire public Faryal FC website.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
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
            <span>Save Theme</span>
          </button>
        </div>
      </div>

      {/* Theme Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {[
          { id: 'colors', label: 'Colors & Palette', icon: <Palette size={15} /> },
          { id: 'presets', label: 'Style Presets', icon: <Sparkles size={15} /> },
          { id: 'typography', label: 'Typography', icon: <Type size={15} /> },
          { id: 'ui', label: 'Border Radius & Mode', icon: <Maximize2 size={15} /> },
          { id: 'animations', label: 'Animations', icon: <Sliders size={15} /> },
          { id: 'preview', label: 'Live Preview', icon: <Eye size={15} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab: Colors */}
      {activeTab === 'colors' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {colorFields.map((field) => {
            const currentColor = (localTheme[field.key] as string) || '#000000';
            return (
              <div
                key={field.key}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-black text-white uppercase tracking-wider">
                      {field.label}
                    </label>
                    <span className="font-mono text-xs text-slate-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {currentColor}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{field.desc}</p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <div className="relative w-12 h-10 rounded-xl overflow-hidden border border-slate-700 shrink-0 shadow-inner">
                    <input
                      type="color"
                      value={currentColor}
                      onChange={(e) => handleColorChange(field.key, e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer scale-150"
                    />
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: currentColor }}
                    />
                  </div>
                  <input
                    type="text"
                    value={currentColor}
                    onChange={(e) => handleColorChange(field.key, e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-white uppercase focus:border-blue-500 outline-none transition-all"
                    placeholder="#000000"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Presets */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              id: 'modern_sports',
              name: 'Modern Sports (Default)',
              desc: 'High contrast royal navy and electric blue with clean sports telemetry aesthetics.',
              primary: '#002d62',
              accent: '#3b82f6',
              bg: '#020617',
              radius: 'md',
            },
            {
              id: 'professional',
              name: 'Professional Slate',
              desc: 'Subtle slate gray tones, sharp corners, and deep sky blue accents.',
              primary: '#0f172a',
              accent: '#0284c7',
              bg: '#030712',
              radius: 'sm',
            },
            {
              id: 'minimal',
              name: 'Minimal Monochrome',
              desc: 'Pure dark aesthetic with high contrast zinc and zero roundness.',
              primary: '#18181b',
              accent: '#e4e4e7',
              bg: '#09090b',
              radius: 'sharp',
            },
            {
              id: 'premium',
              name: 'Midnight Prestige',
              desc: 'Deep midnight navy tones with rounded luxury cards and glowing blue markers.',
              primary: '#001a3d',
              accent: '#60a5fa',
              bg: '#010409',
              radius: 'lg',
            },
            {
              id: 'classic',
              name: 'Classic Club Heritage',
              desc: 'Traditional deep royal football blue with prominent contrast and bold curvature.',
              primary: '#1e3a8a',
              accent: '#38bdf8',
              bg: '#0b0f19',
              radius: 'xl',
            },
          ].map((preset) => {
            const isCurrent = localTheme.stylePreset === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handlePresetSelect(preset.id)}
                className={`cursor-pointer bg-slate-900 border rounded-3xl p-6 transition-all hover:-translate-y-1 ${
                  isCurrent
                    ? 'border-blue-500 shadow-xl shadow-blue-500/20 ring-2 ring-blue-500/30'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-sm text-white uppercase tracking-tight">
                    {preset.name}
                  </h3>
                  {isCurrent && (
                    <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      <Check size={14} />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">{preset.desc}</p>

                {/* Color swatches preview */}
                <div className="flex items-center gap-2 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <div
                    className="w-8 h-8 rounded-lg shadow"
                    style={{ backgroundColor: preset.primary }}
                    title="Primary"
                  />
                  <div
                    className="w-8 h-8 rounded-lg shadow"
                    style={{ backgroundColor: preset.accent }}
                    title="Accent"
                  />
                  <div
                    className="w-8 h-8 rounded-lg shadow border border-slate-800"
                    style={{ backgroundColor: preset.bg }}
                    title="Background"
                  />
                  <span className="text-[10px] font-black uppercase text-slate-400 ml-auto tracking-wider">
                    {preset.radius.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Typography */}
      {activeTab === 'typography' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-base font-black text-white uppercase tracking-tight mb-4 flex items-center gap-2">
            <Type className="text-blue-500" size={18} />
            Typography Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Heading Font Family
              </label>
              <select
                value={localTheme.typography.headingFont}
                onChange={(e) => handleTypographyChange('headingFont', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
              >
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Sports Modern)</option>
                <option value="Inter">Inter (Clean Neutral)</option>
                <option value="Montserrat">Montserrat (Bold Classic)</option>
                <option value="Oswald">Oswald (Athletic Condensed)</option>
                <option value="Teko">Teko (High Impact Athletic)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Body Font Family
              </label>
              <select
                value={localTheme.typography.bodyFont}
                onChange={(e) => handleTypographyChange('bodyFont', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
              >
                <option value="Inter">Inter (Recommended)</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Heading Weight
              </label>
              <select
                value={localTheme.typography.headingWeight}
                onChange={(e) => handleTypographyChange('headingWeight', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
              >
                <option value="700">Bold (700)</option>
                <option value="800">Extra Bold (800)</option>
                <option value="900">Black / Heavy (900)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Font Scaling
              </label>
              <select
                value={localTheme.typography.fontScale}
                onChange={(e) => handleTypographyChange('fontScale', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
              >
                <option value="compact">Compact (Dense Data)</option>
                <option value="normal">Standard / Balanced</option>
                <option value="large">Spacious / Expressive</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab: UI & Radius */}
      {activeTab === 'ui' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-8">
          {/* Border Radius */}
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-tight mb-2">
              Global Component Curvature (Border Radius)
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Adjusts the corner radius on cards, buttons, modals, and tables across the site.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { id: 'sharp', label: 'Sharp (0px)', r: '0px' },
                { id: 'sm', label: 'Small (6px)', r: '6px' },
                { id: 'md', label: 'Medium (12px)', r: '12px' },
                { id: 'lg', label: 'Large (18px)', r: '18px' },
                { id: 'xl', label: 'Extra (26px)', r: '26px' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    const updated = { ...localTheme, borderRadius: opt.id as any };
                    setLocalTheme(updated);
                    setIsDirty(true);
                    updateTheme(updated, true);
                  }}
                  className={`p-4 border text-center transition-all flex flex-col items-center gap-2 ${
                    localTheme.borderRadius === opt.id
                      ? 'border-blue-500 bg-blue-600/10 text-white ring-2 ring-blue-500/20'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                  style={{ borderRadius: opt.r }}
                >
                  <div
                    className="w-10 h-6 bg-blue-600 border border-blue-400/30"
                    style={{ borderRadius: opt.r }}
                  />
                  <span className="text-[11px] font-black uppercase tracking-wider">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Mode */}
          <div className="pt-6 border-t border-slate-800">
            <h2 className="text-base font-black text-white uppercase tracking-tight mb-2">
              Color Mode Default
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'dark', label: 'Dark Mode (Official)', icon: <Moon size={16} /> },
                { id: 'light', label: 'Light Mode', icon: <Sun size={16} /> },
                { id: 'system', label: 'System Mode', icon: <Laptop size={16} /> },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    const updated = { ...localTheme, mode: m.id as any };
                    setLocalTheme(updated);
                    setIsDirty(true);
                    updateTheme(updated, true);
                  }}
                  className={`flex items-center justify-center gap-2.5 p-4 rounded-2xl border font-bold text-xs uppercase tracking-wider transition-all ${
                    localTheme.mode === m.id
                      ? 'border-blue-500 bg-blue-600 text-white shadow-lg'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Animations */}
      {activeTab === 'animations' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-base font-black text-white uppercase tracking-tight mb-2">
            Animation & Performance Controls
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Fine-tune framer-motion transitions, pitch animations, and hover reactivity.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'enabled', label: 'Animations Master Toggle', desc: 'Enable or disable all subtle UI animations globally' },
              { id: 'pageTransitions', label: 'Page Transitions', desc: 'Smooth fade and slide transitions between pages' },
              { id: 'hoverAnimations', label: 'Card & Button Hover Effects', desc: 'Scale and elevation effects on interactable cards' },
              { id: 'backgroundAnimation', label: 'Football Pitch Animation', desc: 'Subtle motion on hero stadium background and grass pattern' },
              { id: 'motionEffects', label: 'Numbers & Telemetry Counters', desc: 'Animated numeric counts on player stats and goals' },
            ].map((anim) => {
              const isChecked = (localTheme.animations as any)[anim.id];
              return (
                <div
                  key={anim.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">{anim.label}</h3>
                    <p className="text-[11px] text-slate-400 mt-1">{anim.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAnimationChange(anim.id, !isChecked)}
                    className={`w-12 h-7 rounded-full transition-colors relative shrink-0 p-1 ${
                      isChecked ? 'bg-blue-600' : 'bg-slate-800'
                    }`}
                  >
                    <motion.div
                      animate={{ x: isChecked ? 20 : 0 }}
                      className="w-5 h-5 rounded-full bg-white shadow-md"
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Live Interactive Preview */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
            <h2 className="text-base font-black text-white uppercase tracking-tight mb-4 flex items-center gap-2">
              <Eye className="text-blue-500" size={18} />
              Interactive Component Live Preview
            </h2>
            <p className="text-xs text-slate-400 mb-8">
              This preview dynamically reflects your active CSS variables and design tokens in real time.
            </p>

            {/* Mock website components box */}
            <div
              className="p-6 md:p-8 rounded-3xl border transition-all space-y-6"
              style={{
                backgroundColor: localTheme.backgroundColor,
                borderColor: localTheme.borderColor,
                color: localTheme.textColor,
              }}
            >
              {/* Mock Header */}
              <div
                className="p-4 rounded-2xl flex items-center justify-between border"
                style={{
                  backgroundColor: localTheme.primaryColor,
                  borderColor: localTheme.borderColor,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-black text-xs text-white">
                    FFC
                  </div>
                  <span className="font-black text-sm uppercase tracking-wider text-white">
                    FARYAL FC OFFICIAL
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase text-white"
                    style={{ backgroundColor: localTheme.buttonColor }}
                  >
                    Match Center
                  </button>
                </div>
              </div>

              {/* Mock Hero Card */}
              <div
                className="p-6 rounded-2xl border"
                style={{
                  backgroundColor: localTheme.surfaceColor,
                  borderColor: localTheme.borderColor,
                }}
              >
                <span
                  className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded"
                  style={{
                    backgroundColor: `${localTheme.accentColor}20`,
                    color: localTheme.accentColor,
                  }}
                >
                  NEXT FIXTURE
                </span>
                <h3 className="text-xl font-black italic uppercase tracking-tight mt-3 mb-2">
                  FARYAL FC <span style={{ color: localTheme.accentColor }}>VS</span> KARACHI UNITED
                </h3>
                <p
                  className="text-xs leading-relaxed mb-4"
                  style={{ color: localTheme.mutedTextColor }}
                >
                  Model Colony Arena • Kickoff 16:00 PKT
                </p>
                <div className="flex gap-3">
                  <button
                    className="px-4 py-2 rounded-xl text-xs font-black uppercase text-white shadow"
                    style={{ backgroundColor: localTheme.buttonColor }}
                  >
                    View Match Details
                  </button>
                  <button
                    className="px-4 py-2 rounded-xl text-xs font-bold uppercase border text-white"
                    style={{ borderColor: localTheme.borderColor }}
                  >
                    Squad Lineup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={resetModalOpen}
        title="Restore Default Theme?"
        message="This will reset all colors, typography, border radius, and animation tokens back to the original official Faryal FC modern sports identity."
        confirmText="Restore Defaults"
        isDangerous={false}
        isLoading={saving}
        onConfirm={handleReset}
        onCancel={() => setResetModalOpen(false)}
      />
    </div>
  );
};
