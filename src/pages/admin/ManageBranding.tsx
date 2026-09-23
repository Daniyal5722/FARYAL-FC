import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Upload, Save, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { useThemeSettings } from '../../contexts/ThemeSettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { BrandingConfig } from '../../types';
import { api } from '../../lib/api';

export const ManageBranding: React.FC = () => {
  const { branding, updateSettings } = useThemeSettings();
  const { success, error: toastError } = useToast();

  const [form, setForm] = useState<BrandingConfig>(branding);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const handleFileUpload = (field: keyof BrandingConfig, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toastError('Please select a valid image file (PNG, JPG, SVG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toastError('Image size exceeds 5MB limit');
      return;
    }

    setUploading(field);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const url = await api.upload.image(base64, file.name);
        setForm((prev) => ({ ...prev, [field]: url }));
        success(`Uploaded ${field} successfully!`);
      } catch (err: any) {
        toastError(err.message || 'Upload failed');
      } finally {
        setUploading(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({
        branding: form,
        name: form.clubName,
        shortName: form.shortName,
        logo: form.logo,
        tagline: form.tagline,
      });
      success('Branding and logo settings updated successfully!');
    } catch (err: any) {
      toastError(err.message || 'Failed to update branding');
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
            Brand Identity
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-tight uppercase">
            Logo & <span className="text-blue-500">Branding</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage club name, crests, header logos, footer emblems, and official taglines.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={15} />
          )}
          <span>Save Branding</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Name and Tagline */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Shield className="text-blue-500" size={18} />
            Club Names & Slogans
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Official Club Full Name
              </label>
              <input
                type="text"
                value={form.clubName}
                onChange={(e) => setForm({ ...form, clubName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
                placeholder="Faryal FC"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Short Name / Initials
              </label>
              <input
                type="text"
                value={form.shortName}
                onChange={(e) => setForm({ ...form, shortName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
                placeholder="FFC"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Club Official Tagline / Motto
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
                placeholder="Built For The Game"
              />
            </div>
          </div>
        </div>

        {/* Logos & Assets */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
            <ImageIcon className="text-blue-500" size={18} />
            Official Logo Assets
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Club Crest */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-4">
              <div>
                <span className="text-xs font-black text-white uppercase tracking-wider block mb-1">
                  Primary Club Crest
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                  Used across navbar, team cards, match reports, and favicon.
                </p>

                <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-slate-800 p-2 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {form.logo ? (
                    <img src={form.logo} alt="Club Crest" className="w-full h-full object-contain" />
                  ) : (
                    <Shield size={32} className="text-slate-600" />
                  )}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={form.logo}
                  onChange={(e) => setForm({ ...form, logo: e.target.value })}
                  placeholder="Image URL or upload below"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mb-2 font-mono outline-none"
                />
                <label className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                  <Upload size={14} />
                  <span>{uploading === 'logo' ? 'Uploading...' : 'Upload Image File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('logo', e)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Header Logo */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-4">
              <div>
                <span className="text-xs font-black text-white uppercase tracking-wider block mb-1">
                  Header Navigation Logo
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                  Displayed in the top navigation bar of public pages.
                </p>

                <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-slate-800 p-2 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {form.headerLogo || form.logo ? (
                    <img
                      src={form.headerLogo || form.logo}
                      alt="Header Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Shield size={32} className="text-slate-600" />
                  )}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={form.headerLogo || ''}
                  onChange={(e) => setForm({ ...form, headerLogo: e.target.value })}
                  placeholder="Header logo URL (optional)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mb-2 font-mono outline-none"
                />
                <label className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                  <Upload size={14} />
                  <span>{uploading === 'headerLogo' ? 'Uploading...' : 'Upload Image File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('headerLogo', e)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Footer Logo */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-4">
              <div>
                <span className="text-xs font-black text-white uppercase tracking-wider block mb-1">
                  Footer Brand Logo
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                  Displayed in the public footer section.
                </p>

                <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-slate-800 p-2 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {form.footerLogo || form.logo ? (
                    <img
                      src={form.footerLogo || form.logo}
                      alt="Footer Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Shield size={32} className="text-slate-600" />
                  )}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={form.footerLogo || ''}
                  onChange={(e) => setForm({ ...form, footerLogo: e.target.value })}
                  placeholder="Footer logo URL"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mb-2 font-mono outline-none"
                />
                <label className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                  <Upload size={14} />
                  <span>{uploading === 'footerLogo' ? 'Uploading...' : 'Upload Image File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('footerLogo', e)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Favicon */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-4">
              <div>
                <span className="text-xs font-black text-white uppercase tracking-wider block mb-1">
                  Browser Favicon (.ico / .png)
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                  Browser tab icon.
                </p>

                <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-slate-800 p-2 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {form.favicon ? (
                    <img src={form.favicon} alt="Favicon" className="w-12 h-12 object-contain" />
                  ) : (
                    <Shield size={32} className="text-slate-600" />
                  )}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={form.favicon || ''}
                  onChange={(e) => setForm({ ...form, favicon: e.target.value })}
                  placeholder="Favicon URL"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mb-2 font-mono outline-none"
                />
                <label className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                  <Upload size={14} />
                  <span>{uploading === 'favicon' ? 'Uploading...' : 'Upload File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('favicon', e)}
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
