import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchCard } from '../components/MatchCard';
import { Match, Team } from '../types';
import { Calendar, History, Loader2, Search, Filter, X, ChevronDown } from 'lucide-react';
import { api } from '../lib/api';
import { cn } from '../lib/utils';

export const Matches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'completed' | 'live'>('all');
  const [filterVenue, setFilterVenue] = useState<'all' | 'home' | 'away'>('all');
  const [filterComp, setFilterComp] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchesData, teamsData] = await Promise.all([
          api.matches.getAll(),
          api.teams.getAll()
        ]);
        setMatches(matchesData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setTeams(teamsData);
      } catch (err) {
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTeam = (id: string) => teams.find(t => t.id === id);

  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.awayTeamName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         match.homeTeamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.competition.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' ? true : 
                       filterType === 'upcoming' ? (match.status === 'upcoming' || match.status === 'postponed') :
                       match.status === filterType;
    
    const matchesVenue = filterVenue === 'all' ? true :
                        filterVenue === 'home' ? match.homeTeamId === 'team-1' :
                        match.awayTeamId === 'team-1';
    
    const matchesComp = filterComp === 'all' ? true : match.competition === filterComp;

    return matchesSearch && matchesType && matchesVenue && matchesComp;
  });

  const competitions = Array.from(new Set(matches.map(m => m.competition)));

  if (loading) {
    return (
      <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Match Center</span>
          <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none mb-12">
            FIXTURES <span className="text-slate-800">& RESULTS</span>
          </h1>

          {/* Filters Bar */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-6 mb-12 flex flex-col gap-6">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search opponent or competition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-16 pr-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all"
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest outline-none focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                </select>

                <select 
                  value={filterVenue}
                  onChange={(e) => setFilterVenue(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest outline-none focus:border-blue-500"
                >
                  <option value="all">All Venues</option>
                  <option value="home">Home</option>
                  <option value="away">Away</option>
                </select>

                <select 
                  value={filterComp}
                  onChange={(e) => setFilterComp(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest outline-none focus:border-blue-500"
                >
                  <option value="all">All Competitions</option>
                  {competitions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                {(searchTerm || filterType !== 'all' || filterVenue !== 'all' || filterComp !== 'all') && (
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setFilterType('all');
                      setFilterVenue('all');
                      setFilterComp('all');
                    }}
                    className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase tracking-widest hover:underline px-4"
                  >
                    <X size={14} /> Clear Filters
                  </button>
                )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {filteredMatches.map((match, i) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <MatchCard 
                  match={match} 
                  homeTeam={getTeam(match.homeTeamId)} 
                  awayTeam={getTeam(match.awayTeamId)} 
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredMatches.length === 0 && (
            <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-[2rem] py-24 text-center">
                <p className="text-slate-500 font-black uppercase tracking-widest italic">No matches match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
