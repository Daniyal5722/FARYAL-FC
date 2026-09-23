import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trophy, Trash2, Edit2, Calendar, Layout, Save, X, Shield } from 'lucide-react';
import { api } from '../../lib/api';
import { Competition } from '../../types';
import { useToast } from '../../contexts/ToastContext';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const ManageCompetitions: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingComp, setEditingComp] = useState<Competition | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Competition | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Competition>>({
    name: '',
    type: 'league',
    season: '2024/25',
    status: 'active',
    active: true,
    startDate: '',
    endDate: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.competitions.getAll();
      setCompetitions(data);
    } catch (err: any) {
      toastError(err.message || 'Failed to load competitions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (comp?: Competition) => {
    if (comp) {
      setEditingComp(comp);
      setFormData(comp);
    } else {
      setEditingComp(null);
      setFormData({
        name: '',
        type: 'league',
        season: '2024/25',
        status: 'active',
        active: true,
        startDate: '',
        endDate: '',
      });
    }
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    setSaving(true);
    try {
      if (editingComp) {
        await api.competitions.update(editingComp.id, formData);
        success('Competition updated successfully!');
      } else {
        await api.competitions.create(formData);
        success('New competition tournament created!');
      }
      setIsAdding(false);
      setEditingComp(null);
      fetchData();
    } catch (err: any) {
      toastError(err.message || 'Failed to save competition');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.competitions.delete(deleteTarget.id);
      success('Competition removed');
      setDeleteTarget(null);
      fetchData();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete competition');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 mb-2 inline-block">
            Tournaments & Cups
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-tight uppercase">
            Manage <span className="text-blue-500">Competitions</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Setup leagues, knockout tournaments, cups, and friendly fixture series.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30"
        >
          <Plus size={16} />
          <span>Add Competition</span>
        </button>
      </div>

      {/* Competitions List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Loading tournaments...</p>
          </div>
        ) : competitions.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Trophy size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-xs font-bold uppercase tracking-wider">No competitions setup yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map((comp) => (
              <motion.div
                key={comp.id}
                layout
                className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-3xl p-6 flex flex-col justify-between transition-all shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Trophy size={24} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenModal(comp)}
                        className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(comp)}
                        className="p-2 bg-slate-900 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-black text-white uppercase italic tracking-tight mb-2">
                    {comp.name}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Layout size={12} className="text-blue-400" />
                      <span className="capitalize">{comp.type} format</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-blue-400" />
                      <span>Season {comp.season}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      comp.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : comp.status === 'completed'
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {comp.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <h2 className="text-lg font-black text-white uppercase tracking-tight">
                  {editingComp ? 'Edit Competition' : 'Create Tournament Competition'}
                </h2>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setEditingComp(null);
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                    Tournament Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Karachi Premier League"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Tournament Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-blue-500"
                    >
                      <option value="league">League Table</option>
                      <option value="knockout">Knockout / Cup</option>
                      <option value="friendly">Friendly Series</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Season
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.season}
                      onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                      placeholder="2024/25"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                    Current Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-blue-500"
                  >
                    <option value="active">Active (Ongoing)</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setEditingComp(null);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 font-bold text-xs uppercase hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingComp ? 'Save Changes' : 'Create Tournament'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Competition?"
        message={`Are you sure you want to remove "${deleteTarget?.name}"?`}
        confirmText="Delete Competition"
        isDangerous={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
