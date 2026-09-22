import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';
import { Team } from '../../types';
import { Plus, Edit2, Trash2, X, Trophy, Save, AlertCircle } from 'lucide-react';

export const ManageTeams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState<Partial<Team>>({
    name: '',
    shortName: '',
    logo: '',
    image: '',
    color: '#1e3a8a',
    captainId: '',
    coach: '',
    status: 'active',
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const data = await api.teams.getAll();
      setTeams(data);
    } catch (err) {
      console.error('Error fetching teams:', err);
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
        image: '',
        color: '#1e3a8a',
        captainId: '',
        coach: '',
        status: 'active',
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTeam) {
        await api.teams.update(editingTeam.id, formData);
      } else {
        await api.teams.create(formData);
      }
      setIsModalOpen(false);
      fetchTeams();
    } catch (err) {
      console.error('Error saving team:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this team? All associated records may be affected.')) {
      try {
        await api.teams.delete(id);
        fetchTeams();
      } catch (err) {
        console.error('Error deleting team:', err);
      }
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div>
            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Portal</span>
            <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
              MANAGE <span className="text-slate-800">TEAMS</span>
            </h1>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20"
          >
            <Plus size={20} /> Add New Team
          </button>
        </div>

        {/* Teams List */}
        <div className="grid grid-cols-1 gap-4">
          {teams.map((team) => (
            <div key={team.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between group hover:border-slate-700 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-xl bg-slate-950 p-2 border border-slate-800">
                  <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{team.name}</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{team.shortName} — {team.coach}</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-12">
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Played</p>
                  <p className="text-lg font-black text-white">{team.played}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Points</p>
                  <p className="text-lg font-black text-blue-500">{team.points}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(team)}
                  className="p-3 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(team.id)}
                  className="p-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
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
                className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 overflow-y-auto max-h-[90vh] shadow-2xl"
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-8">
                  {editingTeam ? 'Edit Team' : 'Add New Team'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Team Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all"
                        placeholder="e.g. Faryal FC"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Short Name</label>
                      <input
                        required
                        type="text"
                        value={formData.shortName}
                        onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all"
                        placeholder="e.g. FFC"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Logo URL</label>
                      <input
                        type="text"
                        value={formData.logo}
                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Team Color</label>
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-full h-[58px] bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 cursor-pointer focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Coach</label>
                      <input
                        type="text"
                        value={formData.coach}
                        onChange={(e) => setFormData({ ...formData, coach: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Captain</label>
                      <input
                        type="text"
                        value={formData.captainId}
                        onChange={(e) => setFormData({ ...formData, captainId: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="pt-6 border-t border-slate-800">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Trophy size={14} /> Season Statistics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Played', key: 'played' },
                        { label: 'Wins', key: 'wins' },
                        { label: 'Draws', key: 'draws' },
                        { label: 'Losses', key: 'losses' },
                        { label: 'GF', key: 'goalsFor' },
                        { label: 'GA', key: 'goalsAgainst' },
                        { label: 'Points', key: 'points' },
                      ].map((stat) => (
                        <div key={stat.key} className="space-y-2">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">{stat.label}</label>
                          <input
                            type="number"
                            value={(formData as any)[stat.key]}
                            onChange={(e) => setFormData({ ...formData, [stat.key]: parseInt(e.target.value) || 0 })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold focus:border-blue-500 outline-none transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20"
                  >
                    <Save size={20} /> {editingTeam ? 'Update Team Record' : 'Create Team Record'}
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
