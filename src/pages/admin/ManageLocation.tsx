import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Save, ExternalLink, Navigation, CheckCircle2 } from 'lucide-react';
import { useThemeSettings } from '../../contexts/ThemeSettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { ClubSettings } from '../../types';

export const ManageLocation: React.FC = () => {
  const { settings, updateSettings } = useThemeSettings();
  const { success, error: toastError } = useToast();

  const [ground, setGround] = useState<ClubSettings['ground']>(settings.ground || {
    name: 'Faryal FC Ground',
    address: '20-A Main Rd, Model Colony Block 24 Model Colony, Karachi, 75080, Pakistan',
    latitude: 24.903822,
    longitude: 67.194202,
    mapsUrl: 'https://share.google/WntzBRDQxKW4EUPPI'
  });
  const [stadium, setStadium] = useState(settings.stadium || 'Faryal Ground');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({
        ground,
        stadium,
      });
      success('Ground and stadium location details saved successfully!');
    } catch (err: any) {
      toastError(err.message || 'Failed to save location');
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
            Facilities & Pitch
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-tight uppercase">
            Ground & <span className="text-blue-500">Location</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage official home venue, GPS coordinates, Google Maps links, and directions for visiting teams.
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
          <span>Save Ground Info</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
            <MapPin className="text-blue-500" size={18} />
            Venue Coordinates & Addresses
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Home Ground Name
              </label>
              <input
                type="text"
                value={ground.name}
                onChange={(e) => setGround({ ...ground, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
                placeholder="Faryal FC Ground"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Short Stadium Name
              </label>
              <input
                type="text"
                value={stadium}
                onChange={(e) => setStadium(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
                placeholder="Faryal Ground"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Official Physical Street Address
              </label>
              <textarea
                rows={2}
                value={ground.address}
                onChange={(e) => setGround({ ...ground, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-medium outline-none focus:border-blue-500"
                placeholder="20-A Main Rd, Model Colony Block 24 Model Colony, Karachi, 75080, Pakistan"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Google Maps Direct Share URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ground.mapsUrl}
                  onChange={(e) => setGround({ ...ground, mapsUrl: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-blue-500"
                  placeholder="https://maps.google.com/..."
                />
                {ground.mapsUrl && (
                  <a
                    href={ground.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl flex items-center justify-center transition-colors"
                    title="Test Link"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                GPS Latitude Coordinate
              </label>
              <input
                type="number"
                step="any"
                value={ground.latitude || ''}
                onChange={(e) => setGround({ ...ground, latitude: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-blue-500"
                placeholder="24.903822"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                GPS Longitude Coordinate
              </label>
              <input
                type="number"
                step="any"
                value={ground.longitude || ''}
                onChange={(e) => setGround({ ...ground, longitude: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-blue-500"
                placeholder="67.194202"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
