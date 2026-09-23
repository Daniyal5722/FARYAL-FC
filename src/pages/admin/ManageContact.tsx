import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Globe, Save, MessageSquare, Instagram, Facebook, Youtube, Share2 } from 'lucide-react';
import { useThemeSettings } from '../../contexts/ThemeSettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { ClubSettings } from '../../types';

export const ManageContact: React.FC = () => {
  const { settings, updateSettings } = useThemeSettings();
  const { success, error: toastError } = useToast();

  const [contact, setContact] = useState<ClubSettings['contact']>(settings.contact || {
    email: 'info@faryalfc.com',
    phone: '+92 300 000 0000',
    address: '20-A Main Rd, Model Colony, Karachi, Pakistan'
  });
  const [socials, setSocials] = useState<ClubSettings['socials']>(settings.socials || {
    instagram: 'https://instagram.com/faryalfc',
    facebook: 'https://facebook.com/faryalfc',
    whatsapp: 'https://wa.me/923000000000'
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({
        contact,
        socials,
      });
      success('Social channels & contact details updated successfully!');
    } catch (err: any) {
      toastError(err.message || 'Failed to update contact info');
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
            Communications
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-tight uppercase">
            Social & <span className="text-blue-500">Contact</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage public club contact lines, WhatsApp links, and official social media profiles.
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
          <span>Save Channels</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Contact Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Mail className="text-blue-500" size={18} />
            Direct Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Official Email Address
              </label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
                placeholder="info@faryalfc.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Official Phone / WhatsApp Number
              </label>
              <input
                type="text"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
                placeholder="+92 300 000 0000"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Postal / Secretarial Address
              </label>
              <input
                type="text"
                value={contact.address}
                onChange={(e) => setContact({ ...contact, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-medium outline-none focus:border-blue-500"
                placeholder="20-A Main Rd, Model Colony, Karachi, Pakistan"
              />
            </div>
          </div>
        </div>

        {/* Social Networks */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Share2 className="text-blue-500" size={18} />
            Official Social Media Links
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Instagram size={14} className="text-pink-400" />
                Instagram Profile URL
              </label>
              <input
                type="text"
                value={socials.instagram || ''}
                onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-blue-500"
                placeholder="https://instagram.com/faryalfc"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Facebook size={14} className="text-blue-400" />
                Facebook Page URL
              </label>
              <input
                type="text"
                value={socials.facebook || ''}
                onChange={(e) => setSocials({ ...socials, facebook: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-blue-500"
                placeholder="https://facebook.com/faryalfc"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MessageSquare size={14} className="text-emerald-400" />
                WhatsApp Community / Channel URL
              </label>
              <input
                type="text"
                value={socials.whatsapp || ''}
                onChange={(e) => setSocials({ ...socials, whatsapp: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-blue-500"
                placeholder="https://wa.me/923000000000"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Youtube size={14} className="text-red-500" />
                YouTube Channel URL
              </label>
              <input
                type="text"
                value={socials.youtube || ''}
                onChange={(e) => setSocials({ ...socials, youtube: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-blue-500"
                placeholder="https://youtube.com/@faryalfc"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
