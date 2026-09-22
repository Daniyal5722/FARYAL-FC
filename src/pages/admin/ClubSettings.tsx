import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Globe, Mail, Phone, MapPin, History, Target, ShieldCheck, X } from 'lucide-react';
import { api } from '../../lib/api';
import { ClubSettings as ClubSettingsType } from '../../types';

export const ClubSettings: React.FC = () => {
  const [settings, setSettings] = useState<ClubSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setError(null);
      try {
        const data = await api.settings.get();
        setSettings(data);
      } catch (err: any) {
        console.error('Error fetching settings:', err);
        setError(err.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError(null);
    try {
      await api.settings.update(settings);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Identity & Config</span>
            <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
              CLUB <span className="text-slate-800">SETTINGS</span>
            </h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            Save Changes
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-500 text-sm font-bold flex items-center justify-between"
          >
            <span>{error}</span>
            <button onClick={() => setError(null)} className="p-1 hover:bg-red-500/20 rounded-lg transition-colors">
              <X size={16} className="text-red-500" />
            </button>
          </motion.div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* General Information */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8 flex items-center gap-3">
              <ShieldCheck className="text-blue-500" /> Basic Identity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Club Full Name</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={e => setSettings({ ...settings, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Short Name / Initials</label>
                <input
                  type="text"
                  value={settings.shortName}
                  onChange={e => setSettings({ ...settings, shortName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Founded Year</label>
                <input
                  type="text"
                  value={settings.founded}
                  onChange={e => setSettings({ ...settings, founded: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Club Logo URL</label>
                <input
                  type="text"
                  value={settings.logo}
                  onChange={e => setSettings({ ...settings, logo: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Stadium / Ground Name</label>
                <input
                  type="text"
                  value={settings.stadium}
                  onChange={e => setSettings({ ...settings, stadium: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
              <div className="md:col-span-2 space-y-6 pt-4 border-t border-slate-800">
                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Map Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={settings.ground.latitude}
                      onChange={e => setSettings({ ...settings, ground: { ...settings.ground, latitude: parseFloat(e.target.value) } })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={settings.ground.longitude}
                      onChange={e => setSettings({ ...settings, ground: { ...settings.ground, longitude: parseFloat(e.target.value) } })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Google Maps Share URL</label>
                    <input
                      type="text"
                      value={settings.ground.mapsUrl}
                      onChange={e => setSettings({ ...settings, ground: { ...settings.ground, mapsUrl: e.target.value } })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* History & Vision */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8 flex items-center gap-3">
              <History className="text-blue-500" /> Club Story
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Club History</label>
                <textarea
                  value={settings.history}
                  onChange={e => setSettings({ ...settings, history: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium min-h-[150px]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Our Vision</label>
                  <textarea
                    value={settings.vision}
                    onChange={e => setSettings({ ...settings, vision: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium min-h-[100px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Our Mission</label>
                  <textarea
                    value={settings.mission}
                    onChange={e => setSettings({ ...settings, mission: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Socials */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8 flex items-center gap-3">
              <Globe className="text-blue-500" /> Contact & Presence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Official Email</label>
                <input
                  type="email"
                  value={settings.contact.email}
                  onChange={e => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                <input
                  type="text"
                  value={settings.contact.phone}
                  onChange={e => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Club Address</label>
                <input
                  type="text"
                  value={settings.contact.address}
                  onChange={e => setSettings({ ...settings, contact: { ...settings.contact, address: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Instagram Link</label>
                <input
                  type="text"
                  value={settings.socials.instagram || ''}
                  onChange={e => setSettings({ ...settings, socials: { ...settings.socials, instagram: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={settings.socials.whatsapp || ''}
                  onChange={e => setSettings({ ...settings, socials: { ...settings.socials, whatsapp: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
