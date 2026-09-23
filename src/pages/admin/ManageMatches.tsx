import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';
import { Match, Team, Player, MatchEvent } from '../../types';
import { 
  Plus, Edit2, Trash2, X, Calendar, Save, Trophy, 
  Timer, Users, Zap, Shield, Award, AlertCircle, Search, Filter 
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { useThemeSettings } from '../../contexts/ThemeSettingsContext';

export const ManageMatches: React.FC = () => {
  const { settings } = useThemeSettings();
  const { success, error: toastError } = useToast();

  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Match | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Match>>({
    homeTeamId: '',
    awayTeamId: '',
    homeTeamName: 'Faryal FC',
    awayTeamName: '',
    date: new Date().toISOString().split('T')[0],
    time: '18:00',
    venue: '',
    competition: 'Elite League',
    status: 'upcoming',
    homeScore: 0,
    awayScore: 0,
    events: [],
  });

  const [newEvent, setNewEvent] = useState<Partial<MatchEvent>>({
    type: 'goal',
    minute: 0,
    playerId: '',
    assistId: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [matchesData, teamsData, playersData] = await Promise.all([
        api.matches.getAll(),
        api.teams.getAll(),
        api.players.getAll(),
      ]);
      setMatches(matchesData);
      setTeams(teamsData);
      setPlayers(playersData);
    } catch (err: any) {
      toastError(err.message || 'Failed to load match data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (match?: Match) => {
    if (match) {
      setEditingMatch(match);
      setFormData(match);
    } else {
      setEditingMatch(null);
      const faryalTeam = teams.find((t) => t.isClubTeam) || teams[0];
      setFormData({
        homeTeamId: faryalTeam?.id || 'team-1',
        awayTeamId: '',
        homeTeamName: faryalTeam?.name || 'Faryal FC',
        awayTeamName: '',
        date: new Date().toISOString().split('T')[0],
        time: '18:00',
        venue: settings.ground?.name || 'Faryal FC Ground',
        competition: 'Karachi Premier League',
        status: 'upcoming',
        homeScore: 0,
        awayScore: 0,
        events: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleHomeTeamChange = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    setFormData((prev) => ({
      ...prev,
      homeTeamId: teamId,
      homeTeamName: team?.name || prev.homeTeamName,
    }));
  };

  const handleAwayTeamChange = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    setFormData((prev) => ({
      ...prev,
      awayTeamId: teamId,
      awayTeamName: team?.name || prev.awayTeamName,
    }));
  };

  const addEvent = () => {
    if (!newEvent.playerId || newEvent.minute === undefined) return;
    const player = players.find((p) => p.id === newEvent.playerId);
    const eventItem: MatchEvent = {
      id: `evt-${Date.now()}`,
      type: newEvent.type as any,
      minute: Number(newEvent.minute),
      playerId: newEvent.playerId,
      playerName: player?.name,
      assistId: newEvent.assistId || undefined,
    };

    const currentEvents = [...(formData.events || []), eventItem];
    
    // Calculate score automatically if goals
    let homeScore = formData.homeScore || 0;
    if (newEvent.type === 'goal') {
      homeScore += 1;
    }

    setFormData({
      ...formData,
      events: currentEvents,
      homeScore,
    });

    setNewEvent({ type: 'goal', minute: 0, playerId: '', assistId: '' });
  };

  const removeEvent = (id: string) => {
    setFormData({
      ...formData,
      events: formData.events?.filter((e) => e.id !== id),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingMatch) {
        await api.matches.update(editingMatch.id, formData);
        success('Match fixture updated successfully!');
      } else {
        await api.matches.create(formData);
        success('New fixture scheduled successfully!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      toastError(err.message || 'Failed to save match');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.matches.delete(deleteTarget.id);
      success('Fixture deleted successfully');
      setDeleteTarget(null);
      fetchData();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete fixture');
    }
  };

  const filteredMatches = matches.filter((m) => {
    const matchesFilter = statusFilter === 'all' || m.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      m.homeTeamName.toLowerCase().includes(query) ||
      m.awayTeamName.toLowerCase().includes(query) ||
      m.competition?.toLowerCase().includes(query) ||
      m.venue?.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 mb-2 inline-block">
            Competition Calendar
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-tight uppercase">
            Matches & <span className="text-blue-500">Fixtures</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Schedule fixtures, log matchday goals, assign cards, and record live or finished scores.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30"
        >
          <Plus size={16} />
          <span>Create New Fixture</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Matches' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'live', label: 'Live Now' },
            { id: 'completed', label: 'Completed' },
            { id: 'postponed', label: 'Postponed' },
          ].map((status) => (
            <button
              key={status.id}
              onClick={() => setStatusFilter(status.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                statusFilter === status.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search fixtures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Match Cards List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Loading fixtures...</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Calendar size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-xs font-bold uppercase tracking-wider">No fixtures found</p>
          </div>
        ) : (
          filteredMatches.map((match) => (
            <div
              key={match.id}
              className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-md"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {match.date} {match.time ? `@ ${match.time}` : ''}
                  </span>
                  <span className="text-[10px] font-black uppercase text-slate-400">
                    {match.competition || 'Friendly'}
                  </span>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      match.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : match.status === 'live'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}
                  >
                    {match.status}
                  </span>
                </div>

                <h3 className="text-base font-black text-white uppercase italic tracking-tight">
                  {match.homeTeamName}{' '}
                  <span className="text-slate-600 font-normal not-italic mx-1">vs</span>{' '}
                  {match.awayTeamName}
                </h3>

                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Shield size={12} className="text-slate-500" />
                  <span>{match.venue || 'Home Ground'}</span>
                </p>
              </div>

              {/* Score & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                {match.status === 'completed' || match.status === 'live' ? (
                  <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
                    <span className="text-xl font-black text-white italic">{match.homeScore ?? 0}</span>
                    <span className="text-slate-600 font-black">-</span>
                    <span className="text-xl font-black text-white italic">{match.awayScore ?? 0}</span>
                  </div>
                ) : null}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(match)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
                  >
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(match)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    title="Delete Match"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit / Create Match Modal */}
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
                  {editingMatch ? 'Update Match Fixture' : 'Schedule Match Fixture'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Home Team */}
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Home Team
                    </label>
                    <div className="space-y-1.5">
                      <select
                        value={formData.homeTeamId || ''}
                        onChange={(e) => handleHomeTeamChange(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-blue-500"
                      >
                        <option value="">Select registered team</option>
                        {teams.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={formData.homeTeamName || ''}
                        onChange={(e) => setFormData({ ...formData, homeTeamName: e.target.value })}
                        placeholder="Home Team Name"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Away Team */}
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Away Team / Opponent
                    </label>
                    <div className="space-y-1.5">
                      <select
                        value={formData.awayTeamId || ''}
                        onChange={(e) => handleAwayTeamChange(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-blue-500"
                      >
                        <option value="">Select registered team</option>
                        {teams.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={formData.awayTeamName || ''}
                        onChange={(e) => setFormData({ ...formData, awayTeamName: e.target.value })}
                        placeholder="Away Team Name"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Match Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date || ''}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Kickoff Time
                    </label>
                    <input
                      type="time"
                      value={formData.time || '18:00'}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Venue & Competition */}
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Match Venue / Stadium
                    </label>
                    <input
                      type="text"
                      value={formData.venue || ''}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-medium outline-none focus:border-blue-500"
                      placeholder="e.g. Faryal FC Ground"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Tournament / Competition
                    </label>
                    <input
                      type="text"
                      value={formData.competition || ''}
                      onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-medium outline-none focus:border-blue-500"
                      placeholder="e.g. Karachi Premier League"
                    />
                  </div>

                  {/* Status */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Fixture Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-blue-500"
                    >
                      <option value="upcoming">Upcoming Fixture</option>
                      <option value="live">Live Now (In Progress)</option>
                      <option value="completed">Completed (Final Result)</option>
                      <option value="postponed">Postponed</option>
                    </select>
                  </div>
                </div>

                {/* Score & Events (if live or completed) */}
                {(formData.status === 'completed' || formData.status === 'live') && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
                    <span className="text-xs font-black text-white uppercase tracking-wider block">
                      Scoreboard & Match Events
                    </span>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                          {formData.homeTeamName || 'Home'} Score
                        </label>
                        <input
                          type="number"
                          value={formData.homeScore ?? 0}
                          onChange={(e) => setFormData({ ...formData, homeScore: parseInt(e.target.value) || 0 })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-center text-xl font-black text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">
                          {formData.awayTeamName || 'Away'} Score
                        </label>
                        <input
                          type="number"
                          value={formData.awayScore ?? 0}
                          onChange={(e) => setFormData({ ...formData, awayScore: parseInt(e.target.value) || 0 })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-center text-xl font-black text-white"
                        />
                      </div>
                    </div>

                    {/* Add Event */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Log Match Event</span>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <select
                          value={newEvent.type}
                          onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold"
                        >
                          <option value="goal">Goal</option>
                          <option value="yellow_card">Yellow Card</option>
                          <option value="red_card">Red Card</option>
                          <option value="substitution">Sub</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Min (e.g. 45)"
                          value={newEvent.minute || ''}
                          onChange={(e) => setNewEvent({ ...newEvent, minute: parseInt(e.target.value) || 0 })}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
                        />
                        <select
                          value={newEvent.playerId || ''}
                          onChange={(e) => setNewEvent({ ...newEvent, playerId: e.target.value })}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                        >
                          <option value="">Select Player</option>
                          {players.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={addEvent}
                          className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider py-1.5"
                        >
                          + Event
                        </button>
                      </div>

                      {/* Logged Events */}
                      {formData.events && formData.events.length > 0 && (
                        <div className="space-y-1.5 pt-2">
                          {formData.events.map((evt) => (
                            <div
                              key={evt.id}
                              className="flex items-center justify-between p-2 rounded-lg bg-slate-900 text-xs border border-slate-800"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-blue-400 font-bold">{evt.minute}'</span>
                                <span className="font-bold text-white uppercase">{evt.type}</span>
                                <span className="text-slate-400">
                                  {players.find((p) => p.id === evt.playerId)?.name || evt.playerName}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeEvent(evt.id)}
                                className="text-slate-500 hover:text-red-400"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
                    {saving ? 'Saving...' : editingMatch ? 'Save Match' : 'Create Fixture'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Fixture?"
        message={`Are you sure you want to permanently delete the match between ${deleteTarget?.homeTeamName} and ${deleteTarget?.awayTeamName}?`}
        confirmText="Delete Fixture"
        isDangerous={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
