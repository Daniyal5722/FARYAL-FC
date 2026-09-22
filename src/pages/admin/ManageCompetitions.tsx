import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trophy, Trash2, Edit2, Loader2, Calendar, Layout, Save, X } from 'lucide-react';
import { api } from '../../lib/api';
import { Competition } from '../../types';

export const ManageCompetitions: React.FC = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Competition>>({
    name: '',
    type: 'league',
    season: '2024/25',
    status: 'active',
    active: true,
    startDate: '',
    endDate: ''
  });

  const fetchData = async () => {
    setError(null);
    try {
      const data = await api.competitions.getAll();
      setCompetitions(data);
    } catch (err: any) {
      console.error('Error fetching competitions:', err);
      setError(err.message || 'Failed to load competitions');
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
        await api.competitions.update(editingId, formData);
      } else {
        await api.competitions.create(formData);
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({ name: '', type: 'league', season: '2024/25', status: 'active', active: true, startDate: '', endDate: '' });
      fetchData();
    } catch (err: any) {
      console.error('Error saving competition:', err);
      setError(err.message || 'Failed to save competition');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure? This will remove the competition record.')) return;
    setError(null);
    try {
      await api.competitions.delete(id);
      fetchData();
    } catch (err: any) {
      console.error('Error deleting competition:', err);
      setError(err.message || 'Failed to delete competition');
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
            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Tournament Control</span>
            <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
              MANAGE <span className="text-slate-800">COMPETITIONS</span>
            </h1>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
          >
            <Plus size={16} /> Add Competition
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

        {/* Modal/Form */}
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 w-full max-w-xl shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                  {editingId ? 'Edit' : 'Add'} Competition
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
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Champions League 2024"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Format Type</label>
                    <select
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                    >
                      <option value="league">League Table</option>
                      <option value="knockout">Knockout / Cup</option>
                      <option value="friendly">Friendly Series</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Season</label>
                    <input
                      type="text"
                      required
                      value={formData.season}
                      onChange={e => setFormData({ ...formData, season: e.target.value })}
                      placeholder="e.g. 2024/25"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Current Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                  >
                    <option value="active">Currently Playing</option>
                    <option value="completed">Finished</option>
                    <option value="upcoming">Future Event</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all mt-4 flex items-center justify-center gap-2"
                >
                  <Save size={16} /> {editingId ? 'Update' : 'Create'} Competition
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Competitions List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {competitions.length > 0 ? competitions.map((comp) => (
            <motion.div
              key={comp.id}
              layout
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-blue-500/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                  <Trophy size={24} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingId(comp.id); setFormData(comp); }}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(comp.id)}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">{comp.name}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <Layout size={14} className="text-blue-500" /> {comp.type}
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <Calendar size={14} className="text-blue-500" /> Season {comp.season}
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  comp.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' :
                  comp.status === 'completed' ? 'bg-slate-800 text-slate-500' :
                  'bg-orange-500/10 text-orange-500'
                }`}>
                  {comp.status}
                </span>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-24 text-center bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl">
              <p className="text-slate-500 font-bold uppercase tracking-widest">No competitions recorded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
