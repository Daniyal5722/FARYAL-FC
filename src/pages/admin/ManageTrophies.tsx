import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trophy, Trash2, Edit2, Loader2, Calendar, Save, X, ImageIcon } from 'lucide-react';
import { api } from '../../lib/api';
import { Trophy as TrophyType } from '../../types';

export const ManageTrophies: React.FC = () => {
  const [trophies, setTrophies] = useState<TrophyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<TrophyType>>({
    competition: '',
    season: '2024/25',
    image: '',
    achievement: 'Winner',
    description: ''
  });

  const fetchData = async () => {
    setError(null);
    try {
      const data = await api.trophies.getAll();
      setTrophies(data);
    } catch (err: any) {
      console.error('Error fetching trophies:', err);
      setError(err.message || 'Failed to load trophies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await api.trophies.update(editingId, formData);
      } else {
        await api.trophies.create(formData);
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({ competition: '', season: '2024/25', image: '', achievement: 'Winner', description: '' });
      fetchData();
    } catch (err: any) {
      console.error('Error saving trophy:', err);
      setError(err.message || 'Failed to save trophy');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this trophy record?')) return;
    setError(null);
    try {
      await api.trophies.delete(id);
      fetchData();
    } catch (err: any) {
      console.error('Error deleting trophy:', err);
      setError(err.message || 'Failed to delete trophy');
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Hall of Fame</span>
            <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
              MANAGE <span className="text-slate-800">TROPHIES</span>
            </h1>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
          >
            <Plus size={16} /> Add Trophy
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
              <X size={16} />
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trophies.map((trophy) => (
            <motion.div
              key={trophy.id}
              layout
              className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 hover:border-blue-500/50 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600 opacity-5 blur-3xl -mr-16 -mt-16" />
              <div className="flex items-center justify-between mb-8">
                <div className="w-16 h-16 rounded-2xl bg-amber-600/10 flex items-center justify-center text-amber-500 border border-amber-600/20">
                  <Trophy size={32} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingId(trophy.id); setFormData(trophy); }}
                    className="p-3 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(trophy.id)}
                    className="p-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">{trophy.competition}</h3>
              <p className="text-amber-500 font-black text-xs uppercase tracking-[0.2em] mb-6">{trophy.achievement} — {trophy.season}</p>
              <p className="text-slate-500 text-xs font-bold leading-relaxed">{trophy.description}</p>
            </motion.div>
          ))}
          {trophies.length === 0 && (
            <div className="col-span-full py-24 text-center bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl">
              <p className="text-slate-500 font-bold uppercase tracking-widest">No trophies recorded yet.</p>
            </div>
          )}
        </div>

        <AnimatePresence>
          {(isAdding || editingId) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 w-full max-w-xl shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                    {editingId ? 'Edit' : 'Add'} Trophy Record
                  </h2>
                  <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-slate-500 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Competition Name</label>
                    <input
                      type="text"
                      required
                      value={formData.competition}
                      onChange={e => setFormData({ ...formData, competition: e.target.value })}
                      placeholder="e.g. Karachi Premier League"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Season</label>
                      <input
                        type="text"
                        required
                        value={formData.season}
                        onChange={e => setFormData({ ...formData, season: e.target.value })}
                        placeholder="2024/25"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Achievement</label>
                      <input
                        type="text"
                        required
                        value={formData.achievement}
                        onChange={e => setFormData({ ...formData, achievement: e.target.value })}
                        placeholder="Winner / Runner-up"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Details about the victory..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium min-h-[100px]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all mt-4 flex items-center justify-center gap-2 shadow-xl shadow-amber-600/20"
                  >
                    <Save size={20} /> Save Trophy Record
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
