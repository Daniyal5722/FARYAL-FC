import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, AlertTriangle, Clock, ShieldCheck, FileText, Globe } from 'lucide-react';
import { useThemeSettings } from '../../contexts/ThemeSettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { MaintenanceConfig } from '../../types';

export const ManageSettings: React.FC = () => {
  const { settings, maintenance, updateSettings } = useThemeSettings();
  const { success, error: toastError } = useToast();

  const [maintForm, setMaintForm] = useState<MaintenanceConfig>(maintenance);
  const [history, setHistory] = useState(settings.history || '');
  const [vision, setVision] = useState(settings.vision || '');
  const [mission, setMission] = useState(settings.mission || '');
  const [founded, setFounded] = useState(settings.founded || '2024');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({
        maintenance: maintForm,
        history,
        vision,
        mission,
        founded,
      });
      success('Website settings & maintenance status saved!');
    } catch (err: any) {
      toastError(err.message || 'Failed to update settings');
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
            System Operations
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-tight uppercase">
            Website <span className="text-blue-500">Settings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure club foundation history, vision, mission, and manage maintenance mode.
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
          <span>Save Settings</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Maintenance Mode Box */}
        <div className={`border rounded-3xl p-6 md:p-8 transition-all ${
          maintForm.enabled
            ? 'bg-amber-950/20 border-amber-500/40'
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                maintForm.enabled ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
              }`}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <h2 className="text-base font-black text-white uppercase tracking-tight">
                  Maintenance Mode
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  When enabled, non-admin visitors see a branded maintenance page.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMaintForm({ ...maintForm, enabled: !maintForm.enabled })}
              className={`w-14 h-8 rounded-full transition-colors relative shrink-0 p-1 ${
                maintForm.enabled ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            >
              <motion.div
                animate={{ x: maintForm.enabled ? 24 : 0 }}
                className="w-6 h-6 rounded-full bg-white shadow-md"
              />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80">
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Public Maintenance Message
              </label>
              <textarea
                rows={2}
                value={maintForm.message}
                onChange={(e) => setMaintForm({ ...maintForm, message: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-medium outline-none focus:border-amber-500"
                placeholder="We are upgrading our portal..."
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Estimated Back Online Time
              </label>
              <input
                type="text"
                value={maintForm.expectedBackTime || ''}
                onChange={(e) => setMaintForm({ ...maintForm, expectedBackTime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-amber-500"
                placeholder="e.g. Today at 18:00 PKT"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintForm.allowAdminBypass}
                  onChange={(e) => setMaintForm({ ...maintForm, allowAdminBypass: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800"
                />
                <span className="text-xs font-bold text-slate-300">
                  Allow logged-in Admins to view live site
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Club Heritage & Mission */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
            <FileText className="text-blue-500" size={18} />
            Club Heritage & Mission
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Year Founded
              </label>
              <input
                type="text"
                value={founded}
                onChange={(e) => setFounded(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
                placeholder="2024"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Club History & Background
              </label>
              <textarea
                rows={4}
                value={history}
                onChange={(e) => setHistory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-medium outline-none focus:border-blue-500"
                placeholder="Faryal FC was established with a vision to build..."
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Club Vision
              </label>
              <textarea
                rows={3}
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-medium outline-none focus:border-blue-500"
                placeholder="To become the premier destination for footballing talent..."
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Club Mission
              </label>
              <textarea
                rows={3}
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-medium outline-none focus:border-blue-500"
                placeholder="To develop technically gifted players who play with passion..."
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
