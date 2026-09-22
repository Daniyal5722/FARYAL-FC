import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';
import { Match, Team, Player, MatchEvent } from '../../types';
import { 
  Plus, Edit2, Trash2, X, Calendar, Save, Trophy, 
  Timer, Users, Zap, Shield, Award, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import { useClubSettings } from '../../hooks/useClubSettings';

export const ManageMatches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Match>>({
    homeTeamId: '',
    awayTeamId: '',
    homeTeamName: '',
    awayTeamName: '',
    date: new Date().toISOString().split('T')[0],
    time: '18:00',
    venue: '',
    competition: 'Elite League',
    status: 'upcoming',
    homeScore: 0,
    awayScore: 0,
    events: []
  });

  const { settings } = useClubSettings();

  useEffect(() => {
    if (settings && !formData.venue && !editingMatch) {
      setFormData(prev => ({ ...prev, venue: settings.ground.name }));
    }
  }, [settings, formData.venue, editingMatch]);

  const handleHomeTeamChange = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    const isFaryal = team?.name.toLowerCase().includes('faryal') || teamId === 'team-1';
    
    setFormData(prev => ({
      ...prev,
      homeTeamId: teamId,
      homeTeamName: team?.name || '',
      venue: isFaryal && settings ? settings.ground.name : prev.venue
    }));
  };

  const [newEvent, setNewEvent] = useState<Partial<MatchEvent>>({
    type: 'goal',
    minute: 0,
    playerId: '',
    assistId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setError(null);
    try {
      const [matchesData, teamsData, playersData] = await Promise.all([
        api.matches.getAll(),
        api.teams.getAll(),
        api.players.getAll()
      ]);
      setMatches(matchesData);
      setTeams(teamsData);
      setPlayers(playersData);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load match data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (match?: Match) => {
    if (match) {
      setEditingMatch(match);
      setFormData(match);
    } else {
      setEditingMatch(null);
      setFormData({
        homeTeamId: 'team-1',
        awayTeamId: '',
        homeTeamName: 'Faryal FC',
        awayTeamName: '',
        date: new Date().toISOString().split('T')[0],
        time: '18:00',
        venue: settings?.ground.name || 'Faryal FC Ground',
        competition: 'Elite League',
        status: 'upcoming',
        homeScore: 0,
        awayScore: 0,
        events: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const homeTeam = teams.find(t => t.id === formData.homeTeamId);
      const awayTeam = teams.find(t => t.id === formData.awayTeamId);
      
      const payload = {
        ...formData,
        homeTeamName: homeTeam?.name || formData.homeTeamName,
        awayTeamName: awayTeam?.name || formData.awayTeamName,
      };

      if (editingMatch) {
        await api.matches.update(editingMatch.id, payload);
      } else {
        await api.matches.create(payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error('Error saving match:', err);
      setError(err.message || 'Failed to save match');
    }
  };

  const addEvent = () => {
    if (!newEvent.playerId || !newEvent.minute) return;
    const events = [...(formData.events || [])];
    events.push({
      ...newEvent,
      id: Date.now().toString()
    } as MatchEvent);
    setFormData({ ...formData, events });
    setNewEvent({ type: 'goal', minute: 0, playerId: '', assistId: '' });
  };

  const removeEvent = (id: string) => {
    setFormData({
      ...formData,
      events: formData.events?.filter(e => e.id !== id)
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this fixture?')) {
      setError(null);
      try {
        await api.matches.delete(id);
        fetchData();
      } catch (err: any) {
        console.error('Error deleting match:', err);
        setError(err.message || 'Failed to delete match');
      }
    }
  };

  if (loading) return null;

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div>
            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Portal</span>
            <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
              MANAGE <span className="text-slate-800">FIXTURES</span>
            </h1>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20"
          >
            <Plus size={20} /> Create Fixture
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-500 text-sm font-bold flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="p-1 hover:bg-red-500/20 rounded-lg transition-colors">
              <X size={16} />
            </button>
          </motion.div>
        )}

        {/* Matches List */}
        <div className="grid grid-cols-1 gap-4">
          {matches.map((match) => (
            <div key={match.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between group hover:border-blue-500/30 transition-all">
              <div className="flex flex-col md:flex-row items-center gap-8 mb-6 md:mb-0">
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{new Date(match.date).toLocaleDateString()} @ {match.time}</p>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                    {match.homeTeamName} <span className="text-slate-700 mx-2">VS</span> {match.awayTeamName}
                  </h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">{match.venue} — {match.competition}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  match.status === 'completed' ? 'bg-slate-950 text-slate-500 border-slate-800' : 
                  match.status === 'live' ? 'bg-red-600/10 text-red-500 border-red-500/20 animate-pulse' :
                  'bg-blue-600/10 text-blue-500 border-blue-500/20'
                }`}>
                  {match.status}
                </div>
              </div>

              <div className="flex items-center gap-6">
                {match.status === 'completed' && (
                  <div className="flex items-center gap-4 bg-slate-950 px-8 py-3 rounded-2xl border border-slate-800">
                    <span className="text-3xl font-black text-white italic">{match.homeScore}</span>
                    <span className="text-slate-800 font-black">-</span>
                    <span className="text-3xl font-black text-white italic">{match.awayScore}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(match)}
                    className="p-3 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(match.id)}
                    className="p-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
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
                className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 overflow-y-auto max-h-[90vh] shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                    {editingMatch ? 'Update Match Data' : 'Initialize Fixture'}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-950/50 p-8 rounded-3xl border border-slate-800">
                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">Home Team</label>
                            <select
                                required
                                value={formData.homeTeamId}
                                onChange={(e) => handleHomeTeamChange(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold uppercase tracking-widest text-xs outline-none focus:border-blue-500 transition-all"
                            >
                                <option value="">Select Team</option>
                                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">Away Team / Opponent</label>
                            <div className="flex gap-2">
                                <select
                                    value={formData.awayTeamId}
                                    onChange={(e) => setFormData({ ...formData, awayTeamId: e.target.value })}
                                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold uppercase tracking-widest text-xs outline-none focus:border-blue-500 transition-all"
                                >
                                    <option value="">Select Club</option>
                                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                                <input 
                                    type="text" 
                                    placeholder="Or type name..."
                                    value={formData.awayTeamName}
                                    onChange={e => setFormData({ ...formData, awayTeamName: e.target.value })}
                                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">Match Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold uppercase tracking-widest text-xs outline-none focus:border-blue-500 transition-all"
                            >
                                <option value="upcoming">Upcoming</option>
                                <option value="live">Live</option>
                                <option value="completed">Completed</option>
                                <option value="postponed">Postponed</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">Date</label>
                            <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">Time</label>
                            <input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all" />
                        </div>
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">Venue</label>
                            <input 
                                type="text" 
                                value={formData.venue} 
                                onChange={e => setFormData({ ...formData, venue: e.target.value })} 
                                placeholder="Match Venue"
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all" 
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">Competition</label>
                            <input 
                                type="text" 
                                value={formData.competition} 
                                onChange={e => setFormData({ ...formData, competition: e.target.value })} 
                                placeholder="e.g. Elite League"
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all" 
                            />
                        </div>
                    </div>
                  </div>

                  {/* Events & Scoring */}
                  {(formData.status === 'completed' || formData.status === 'live') && (
                    <div className="bg-slate-950/50 p-8 rounded-3xl border border-slate-800">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
                                <Award className="text-blue-500" /> Match Events & Scoring
                            </h3>
                            <div className="flex items-center gap-4 bg-slate-900 px-6 py-2 rounded-2xl border border-slate-800">
                                <span className="text-2xl font-black text-white italic">{formData.homeScore}</span>
                                <span className="text-slate-800 font-black">-</span>
                                <span className="text-2xl font-black text-white italic">{formData.awayScore}</span>
                            </div>
                        </div>

                        {/* Event Entry */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 bg-slate-900 p-6 rounded-2xl border border-slate-800">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 mb-2 block uppercase">Type</label>
                                <select value={newEvent.type} onChange={e => setNewEvent({ ...newEvent, type: e.target.value as any })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs font-bold uppercase outline-none">
                                    <option value="goal">Goal</option>
                                    <option value="yellow_card">Yellow Card</option>
                                    <option value="red_card">Red Card</option>
                                    <option value="substitution">Sub</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 mb-2 block uppercase">Min</label>
                                <input type="number" value={newEvent.minute} onChange={e => setNewEvent({ ...newEvent, minute: parseInt(e.target.value) || 0 })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs outline-none" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black text-slate-500 mb-2 block uppercase">Player</label>
                                <select value={newEvent.playerId} onChange={e => setNewEvent({ ...newEvent, playerId: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs outline-none">
                                    <option value="">Select Player</option>
                                    {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button type="button" onClick={addEvent} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all">
                                    Add Event
                                </button>
                            </div>
                        </div>

                        {/* Events List */}
                        <div className="space-y-2">
                            {formData.events?.map(event => (
                                <div key={event.id} className="flex items-center justify-between bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <span className="text-blue-500 font-black italic">{event.minute}'</span>
                                        <span className="text-xs font-bold text-white uppercase">{event.type.replace('_', ' ')}</span>
                                        <span className="text-xs text-slate-400 font-medium">{players.find(p => p.id === event.playerId)?.name}</span>
                                    </div>
                                    <button type="button" onClick={() => removeEvent(event.id)} className="text-red-500 hover:text-red-400">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Manual Score Adjust */}
                        <div className="mt-8 grid grid-cols-2 gap-8">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">Manual Home Score</label>
                                <input type="number" value={formData.homeScore} onChange={e => setFormData({ ...formData, homeScore: parseInt(e.target.value) || 0 })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all text-center font-black text-2xl" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 mb-2 block">Manual Away Score</label>
                                <input type="number" value={formData.awayScore} onChange={e => setFormData({ ...formData, awayScore: parseInt(e.target.value) || 0 })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all text-center font-black text-2xl" />
                            </div>
                        </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20"
                  >
                    <Save size={20} /> {editingMatch ? 'Commit Changes' : 'Initialize Match'}
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
