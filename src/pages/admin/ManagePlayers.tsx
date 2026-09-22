import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';
import { Player } from '../../types';
import { Plus, Edit2, Trash2, X, User, Save, Shield, Star, Award } from 'lucide-react';

export const ManagePlayers: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Player>>({
    name: '',
    number: 0,
    position: 'Forward',
    image: '',
    nationality: '',
    birthDate: '',
    height: '',
    weight: '',
    bio: '',
    stats: {
      appearances: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0
    }
  });

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setError(null);
    try {
      const data = await api.players.getAll();
      setPlayers(data);
    } catch (err: any) {
      console.error('Error fetching players:', err);
      setError(err.message || 'Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (player?: Player) => {
    if (player) {
      setEditingPlayer(player);
      setFormData(player);
    } else {
      setEditingPlayer(null);
      setFormData({
        name: '',
        number: 10,
        position: 'Forward',
        image: '',
        nationality: '',
        birthDate: '',
        height: '',
        weight: '',
        bio: '',
        stats: {
          appearances: 0,
          goals: 0,
          assists: 0,
          cleanSheets: 0
        }
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingPlayer) {
        await api.players.update(editingPlayer.id, formData);
      } else {
        await api.players.create(formData);
      }
      setIsModalOpen(false);
      fetchPlayers();
    } catch (err: any) {
      console.error('Error saving player:', err);
      setError(err.message || 'Failed to save player');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this player?')) {
      setError(null);
      try {
        await api.players.delete(id);
        fetchPlayers();
      } catch (err: any) {
        console.error('Error deleting player:', err);
        setError(err.message || 'Failed to delete player');
      }
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div>
            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Roster Management</span>
            <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
              MANAGE <span className="text-slate-800">SQUAD</span>
            </h1>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20"
          >
            <Plus size={20} /> Add New Player
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

        {/* Players List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <motion.div
              key={player.id}
              layout
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-blue-500/30 transition-all group"
            >
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                  {player.image ? (
                    <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="text-slate-700" size={32} />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{player.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded italic">#{player.number}</span>
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{player.position}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleOpenModal(player)}
                    className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(player.id)}
                    className="p-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 overflow-y-auto max-h-[90vh]"
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-8">
                  {editingPlayer ? 'Edit Player' : 'Register Player'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Full Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Squad Number</label>
                      <input
                        required
                        type="number"
                        value={formData.number}
                        onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Position</label>
                      <select
                        required
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-bold uppercase tracking-widest text-xs outline-none focus:border-blue-500 transition-all"
                      >
                        <option value="Goalkeeper">Goalkeeper</option>
                        <option value="Defender">Defender</option>
                        <option value="Midfielder">Midfielder</option>
                        <option value="Forward">Forward</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Image URL</label>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Bio / History</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all h-32 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20"
                  >
                    <Save size={20} /> {editingPlayer ? 'Save Changes' : 'Register Player'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
