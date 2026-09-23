import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';
import { Player } from '../../types';
import { 
  Plus, Edit2, Trash2, X, User, Save, Shield, Star, Award, 
  Upload, Image as ImageIcon, Search, Filter, CheckCircle2 
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const ManagePlayers: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<Player | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Player>>({
    name: '',
    number: 10,
    position: 'Forward',
    image: '',
    nationality: 'Pakistan',
    birthDate: '',
    height: '',
    weight: '',
    bio: '',
    status: 'active',
    isCaptain: false,
    stats: {
      appearances: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      cleanSheets: 0,
    },
  });

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const data = await api.players.getAll();
      setPlayers(data);
    } catch (err: any) {
      toastError(err.message || 'Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (player?: Player) => {
    if (player) {
      setEditingPlayer(player);
      setFormData({
        ...player,
        stats: player.stats || { appearances: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, cleanSheets: 0 },
      });
    } else {
      setEditingPlayer(null);
      setFormData({
        name: '',
        number: 7,
        position: 'Forward',
        image: '',
        nationality: 'Pakistan',
        birthDate: '',
        height: '',
        weight: '',
        bio: '',
        status: 'active',
        isCaptain: false,
        stats: {
          appearances: 0,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
          cleanSheets: 0,
        },
      });
    }
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      try {
        const uploadedUrl = await api.upload.image(base64Data, formData.name || 'player');
        setFormData((prev) => ({ ...prev, image: uploadedUrl }));
        success('Player photo uploaded successfully!');
      } catch {
        setFormData((prev) => ({ ...prev, image: base64Data }));
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    setSaving(true);
    try {
      if (editingPlayer) {
        await api.players.update(editingPlayer.id, formData);
        success(`Updated player ${formData.name}`);
      } else {
        await api.players.create(formData);
        success(`Registered ${formData.name} to squad`);
      }
      setIsModalOpen(false);
      fetchPlayers();
    } catch (err: any) {
      toastError(err.message || 'Failed to save player');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.players.delete(deleteTarget.id);
      success(`Removed ${deleteTarget.name} from roster`);
      setDeleteTarget(null);
      fetchPlayers();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete player');
    }
  };

  const filteredPlayers = players.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.number?.toString().includes(searchQuery);
    const matchesPos = filterPosition === 'all' || p.position === filterPosition;
    return matchesSearch && matchesPos;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 mb-2 inline-block">
            Squad Operations
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-tight uppercase">
            Players & <span className="text-blue-500">Squad Roster</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Register squad members, update jersey numbers, statistics, bios, and upload player photos.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30"
        >
          <Plus size={16} />
          <span>Add New Player</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Position Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {['all', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'].map((pos) => (
            <button
              key={pos}
              onClick={() => setFilterPosition(pos)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                filterPosition === pos
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {pos === 'all' ? 'All Squad' : pos}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Player Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Loading squad roster...</p>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <User size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-xs font-bold uppercase tracking-wider">No players found matching query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPlayers.map((player) => (
              <motion.div
                key={player.id}
                layout
                className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between shadow-md group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                    {player.image ? (
                      <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-black text-slate-700 text-xl">#{player.number ?? '-'}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono font-black text-blue-400 text-xs bg-blue-500/10 px-1.5 py-0.5 rounded">
                        #{player.number ?? '-'}
                      </span>
                      {player.isCaptain && (
                        <span className="text-[9px] font-black uppercase bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
                          Captain
                        </span>
                      )}
                    </div>
                    <h3 className="font-black text-sm text-white uppercase truncate mt-1">
                      {player.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">{player.position || 'Player'}</p>
                  </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-900/80 rounded-xl border border-slate-800/60 text-center mb-4">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-black block">Apps</span>
                    <span className="text-xs font-black text-white">{player.stats?.appearances || 0}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-black block">Goals</span>
                    <span className="text-xs font-black text-emerald-400">{player.stats?.goals || 0}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-black block">Assists</span>
                    <span className="text-xs font-black text-blue-400">{player.stats?.assists || 0}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
                  <button
                    onClick={() => handleOpenModal(player)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
                  >
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(player)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    title="Delete Player"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <h2 className="text-lg font-black text-white uppercase tracking-tight">
                  {editingPlayer ? 'Edit Squad Player' : 'Register New Player'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Player Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none focus:border-blue-500"
                      placeholder="e.g. Daniyal Hayyat"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Squad Jersey Number
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.number ?? 0}
                      onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Field Position
                    </label>
                    <select
                      value={formData.position || 'Forward'}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none focus:border-blue-500"
                    >
                      <option value="Goalkeeper">Goalkeeper (GK)</option>
                      <option value="Defender">Defender (DF)</option>
                      <option value="Midfielder">Midfielder (MF)</option>
                      <option value="Forward">Forward (FW)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Squad Status
                    </label>
                    <select
                      value={formData.status || 'active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none focus:border-blue-500"
                    >
                      <option value="active">Active Squad</option>
                      <option value="injured">Injured</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <input
                        type="checkbox"
                        checked={!!formData.isCaptain}
                        onChange={(e) => setFormData({ ...formData, isCaptain: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                      />
                      <span className="text-xs font-bold text-white uppercase">Designated Team Captain</span>
                    </label>
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                    Player Portrait Photo
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Photo URL or upload below"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                    />
                    <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0">
                      <Upload size={14} />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Player Stats */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-xs font-black text-white uppercase tracking-wider block">
                    Player Season Statistics
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-black block mb-1">Apps</label>
                      <input
                        type="number"
                        value={formData.stats?.appearances ?? 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stats: { ...formData.stats!, appearances: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-center text-xs font-bold text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-black block mb-1">Goals</label>
                      <input
                        type="number"
                        value={formData.stats?.goals ?? 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stats: { ...formData.stats!, goals: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-center text-xs font-bold text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-black block mb-1">Assists</label>
                      <input
                        type="number"
                        value={formData.stats?.assists ?? 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stats: { ...formData.stats!, assists: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-center text-xs font-bold text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-black block mb-1">Clean Sheets</label>
                      <input
                        type="number"
                        value={formData.stats?.cleanSheets ?? 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stats: { ...formData.stats!, cleanSheets: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-center text-xs font-bold text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-black block mb-1">Yellows</label>
                      <input
                        type="number"
                        value={formData.stats?.yellowCards ?? 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stats: { ...formData.stats!, yellowCards: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-center text-xs font-bold text-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-black block mb-1">Reds</label>
                      <input
                        type="number"
                        value={formData.stats?.redCards ?? 0}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stats: { ...formData.stats!, redCards: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-center text-xs font-bold text-rose-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                    Player Bio / Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bio || ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-medium outline-none focus:border-blue-500"
                    placeholder="Player background, preferred foot, play style..."
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 font-bold text-xs uppercase hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingPlayer ? 'Save Changes' : 'Register Player'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Remove Player from Squad?"
        message={`Are you sure you want to permanently remove "${deleteTarget?.name}" from the official Faryal FC squad roster?`}
        confirmText="Remove Player"
        isDangerous={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
