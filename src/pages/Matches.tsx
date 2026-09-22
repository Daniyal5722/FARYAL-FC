import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MatchCard } from '../components/MatchCard';
import { Match, Team } from '../types';
import { Calendar, History, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

export const Matches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

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

  const upcomingMatches = matches.filter(m => m.status === 'upcoming' || m.status === 'live');
  const completedMatches = matches.filter(m => m.status === 'completed');

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
        {/* Upcoming Section */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20 text-blue-500">
              <Calendar size={24} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
              UPCOMING <span className="text-slate-800">FIXTURES</span>
            </h2>
          </div>

          <div className="space-y-8">
            {upcomingMatches.map((match, i) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <MatchCard 
                  match={match} 
                  homeTeam={getTeam(match.homeTeamId)} 
                  awayTeam={getTeam(match.awayTeamId)} 
                />
              </motion.div>
            ))}
            {upcomingMatches.length === 0 && (
              <p className="text-slate-500 font-bold uppercase tracking-widest text-center py-10">No upcoming matches scheduled.</p>
            )}
          </div>
        </div>

        {/* Completed Section */}
        <div>
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 text-slate-500">
              <History size={24} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
              PAST <span className="text-slate-800">RESULTS</span>
            </h2>
          </div>

          <div className="space-y-8">
            {completedMatches.map((match, i) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <MatchCard 
                  match={match} 
                  homeTeam={getTeam(match.homeTeamId)} 
                  awayTeam={getTeam(match.awayTeamId)} 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
