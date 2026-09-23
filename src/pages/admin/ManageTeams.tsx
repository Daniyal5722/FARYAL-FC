import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';
import { Team } from '../../types';
import { Plus, Edit2, Trash2, X, Trophy, Save, Upload, Search, Shield } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const ManageTeams: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Team | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Team>>({
    name: '',
    shortName: '',
    logo: '',
    color: '#1e3a8a',
    coach: '',
    isClubTeam: false,
    status: 'active',
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const data = await api.teams.getAll();
      setTeams(data);
    } catch (err: any) {
      toastError(err.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (team?: Team) => {
    if (team) {
      setEditingTeam(team);
      setFormData(team);
    } else {
      setEditingTeam(null);
      setFormData({
        name: '',
        shortName: '',
        logo: '',
        color: '#1e3a8a',
        coach: '',
        isClubTeam: false,
        status: 'active',
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const url = await api.upload.image(reader.result as string, file.name);
        setFormData((prev) => ({ ...prev, logo: url }));
        success('Team crest uploaded successfully!');
      } catch (err: any) {
        toastError(err.message || 'Logo upload failed');
      } finally {
        setUploadingLogo(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const gd = (formData.goalsFor || 0) - (formData.goalsAgainst || 0);
      const points = (formData.wins || 0) * 3 + (formData.draws || 0);
      const payload = { ...formData, goalDifference: gd, points };

      if (editingTeam) {
        await api.teams.update(editingTeam.id, payload);
        success(`Updated club ${formData.name}`);
      } else {
        await api.teams.create(payload);
        success(`Added new club ${formData.name}`);
      }
      setIsModalOpen(false);
      fetchTeams();
    } catch (err: any) {
      toastError(err.message || 'Failed to save team');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.teams.delete(deleteTarget.id);
      success(`Removed ${deleteTarget.name}`);
      setDeleteTarget(null);
      fetchTeams();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete team');
    }
  };

  const filteredTeams = teams.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.shortName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 mb-2 inline-block">
            Clubs & Opponents
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-tight uppercase">
            Teams & <span className="text-blue-500">Standings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage opponent football clubs, league standings, crests, colors, and records.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30"
        >
          <Plus size={16} />
          <span>Add New Club</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search teams by name or initials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Teams Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-3">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Loading teams...</p>
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Trophy size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-xs font-bold uppercase tracking-wider">No teams registered</p>
          </div>
        ) : (
          filteredTeams.map((team) => (
            <div
              key={team.id}
              className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 p-1.5 flex items-center justify-center shrink-0">
                  {team.logo ? (
                    <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
                  ) : (
                    <Shield size={20} className="text-slate-600" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white uppercase italic">{team.name}</h3>
                    {team.isClubTeam && (
                      <span className="text-[9px] font-black uppercase bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
                        Home Club
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-mono">
                    {team.shortName || 'FFC'} • Coach: {team.coach || 'Head Coach'}
                  </p>
                </div>
              </div>

              {/* Standings Summary */}
              <div className="flex items-center gap-6 sm:gap-8 self-end sm:self-auto text-xs">
                <div className="text-center">
                  <span className="text-[9px] text-slate-500 uppercase font-black block">P</span>
                  <span className="font-bold text-white">{team.played || 0}</span>
                </div>
                <div className="text-center">
                  <span className="text-[9px] text-slate-500 uppercase font-black block">W</span>
                  <span className="font-bold text-emerald-400">{team.wins || 0}</span>
                </div>
                <div className="text-center">
                  <span className="text-[9px] text-slate-500 uppercase font-black block">D</span>
                  <span className="font-bold text-slate-300">{team.draws || 0}</span>
                </div>
                <div className="text-center">
                  <span className="text-[9px] text-slate-500 uppercase font-black block">L</span>
                  <span className="font-bold text-rose-400">{team.losses || 0}</span>
                </div>
                <div className="text-center bg-blue-600/10 px-3 py-1 rounded-xl border border-blue-500/20">
                  <span className="text-[9px] text-blue-400 uppercase font-black block">PTS</span>
                  <span className="font-black text-blue-400 text-sm">{team.points || 0}</span>
                </div>

                <div className="flex items-center gap-2 ml-2">
                  <button
                    onClick={() => handleOpenModal(team)}
                    className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(team)}
                    className="p-2 bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Team Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <h2 className="text-lg font-black text-white uppercase tracking-tight">
                  {editingTeam ? 'Edit Team Details' : 'Register New Club'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Club Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-blue-500"
                      placeholder="e.g. Clifton United"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Short Name / Code
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shortName || ''}
                      onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-blue-500"
                      placeholder="e.g. CUFC"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Head Coach / Manager
                    </label>
                    <input
                      type="text"
                      value={formData.coach || ''}
                      onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-medium outline-none focus:border-blue-500"
                      placeholder="e.g. Coach Name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Club Primary Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.color || '#1e3a8a'}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-10 h-9 rounded-xl bg-transparent cursor-pointer border border-slate-800"
                      />
                      <input
                        type="text"
                        value={formData.color || '#1e3a8a'}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <input
                        type="checkbox"
                        checked={!!formData.isClubTeam}
                        onChange={(e) => setFormData({ ...formData, isClubTeam: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                      />
                      <span className="text-xs font-bold text-white uppercase">
                        This is the Main Faryal FC Club Team
                      </span>
                    </label>
                  </div>
                </div>

                {/* Logo */}
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                    Club Crest Logo
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.logo || ''}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      placeholder="Crest URL"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                    <label className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                      <Upload size={13} />
                      <span>{uploadingLogo ? '...' : 'Upload'}</span>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Standings Stats */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <span className="text-xs font-black text-white uppercase tracking-wider block">
                    League Table Record
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-black block mb-1">Played</label>
                      <input
                        type="number"
                        value={formData.played ?? 0}
                        onChange={(e) => setFormData({ ...formData, played: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-center text-xs font-bold text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-black block mb-1">Wins</label>
                      <input
                        type="number"
                        value={formData.wins ?? 0}
                        onChange={(e) => setFormData({ ...formData, wins: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-center text-xs font-bold text-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-black block mb-1">Draws</label>
                      <input
                        type="number"
                        value={formData.draws ?? 0}
                        onChange={(e) => setFormData({ ...formData, draws: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-center text-xs font-bold text-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-black block mb-1">Losses</label>
                      <input
                        type="number"
                        value={formData.losses ?? 0}
                        onChange={(e) => setFormData({ ...formData, losses: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-center text-xs font-bold text-rose-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-black block mb-1">GF</label>
                      <input
                        type="number"
                        value={formData.goalsFor ?? 0}
                        onChange={(e) => setFormData({ ...formData, goalsFor: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-center text-xs font-bold text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase font-black block mb-1">GA</label>
                      <input
                        type="number"
                        value={formData.goalsAgainst ?? 0}
                        onChange={(e) => setFormData({ ...formData, goalsAgainst: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-center text-xs font-bold text-white"
                      />
                    </div>
                  </div>
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
                    {saving ? 'Saving...' : editingTeam ? 'Save Team' : 'Register Club'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Club Record?"
        message={`Are you sure you want to delete ${deleteTarget?.name}? Matches linked to this team may be affected.`}
        confirmText="Delete Club"
        isDangerous={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
