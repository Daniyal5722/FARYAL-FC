import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trophy, Trash2, Edit2, Save, X, Award, Upload } from 'lucide-react';
import { api } from '../../lib/api';
import { Trophy as TrophyType } from '../../types';
import { useToast } from '../../contexts/ToastContext';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const ManageTrophies: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [trophies, setTrophies] = useState<TrophyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTrophy, setEditingTrophy] = useState<TrophyType | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TrophyType | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<TrophyType>>({
    competition: '',
    season: '2024/25',
    image: '',
    achievement: 'Winner',
    description: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.trophies.getAll();
      setTrophies(data);
    } catch (err: any) {
      toastError(err.message || 'Failed to load trophies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (trophy?: TrophyType) => {
    if (trophy) {
      setEditingTrophy(trophy);
      setFormData(trophy);
    } else {
      setEditingTrophy(null);
      setFormData({
        competition: '',
        season: '2024/25',
        image: '',
        achievement: 'Winner',
        description: '',
      });
    }
    setIsAdding(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.competition?.trim()) return;

    setSaving(true);
    try {
      if (editingTrophy) {
        await api.trophies.update(editingTrophy.id, formData);
        success('Trophy record updated successfully!');
      } else {
        await api.trophies.create(formData);
        success('New trophy added to Hall of Fame!');
      }
      setIsAdding(false);
      setEditingTrophy(null);
      fetchData();
    } catch (err: any) {
      toastError(err.message || 'Failed to save trophy');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.trophies.delete(deleteTarget.id);
      success('Trophy removed from Hall of Fame');
      setDeleteTarget(null);
      fetchData();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete trophy');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 mb-2 inline-block">
            Hall of Fame
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-tight uppercase">
            Trophies & <span className="text-amber-400">Honours</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Showcase championship victories, tournament cups, runner-up medals, and club achievements.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-600/30"
        >
          <Plus size={16} />
          <span>Add Trophy</span>
        </button>
      </div>

      {/* Trophies Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Loading trophies...</p>
          </div>
        ) : trophies.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Trophy size={40} className="mx-auto mb-3 opacity-40 text-amber-500" />
            <p className="text-xs font-bold uppercase tracking-wider">No trophies recorded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trophies.map((trophy) => (
              <motion.div
                key={trophy.id}
                layout
                className="bg-slate-950 border border-slate-800/80 hover:border-amber-500/40 rounded-3xl p-6 transition-all relative overflow-hidden flex flex-col justify-between shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <Trophy size={24} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenModal(trophy)}
                        className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(trophy)}
                        className="p-2 bg-slate-900 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-black text-white uppercase italic tracking-tight mb-1">
                    {trophy.competition}
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded inline-block mb-3">
                    {trophy.achievement} • {trophy.season}
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">{trophy.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Trophy Modal */}
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
                  {editingTrophy ? 'Edit Trophy Honour' : 'Add Trophy Honour'}
                </h2>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setEditingTrophy(null);
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                    Tournament / Competition Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.competition}
                    onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
                    placeholder="e.g. Karachi Premier Cup"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Season / Year
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.season}
                      onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                      placeholder="2024/25"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Achievement
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.achievement}
                      onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
                      placeholder="Winner / Champions"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                    Honour Description / Summary
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the triumph..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-medium outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setEditingTrophy(null);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 font-bold text-xs uppercase hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingTrophy ? 'Save Changes' : 'Record Trophy'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Trophy Record?"
        message={`Are you sure you want to remove "${deleteTarget?.competition}" from the honours list?`}
        confirmText="Delete Trophy"
        isDangerous={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
