import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Player } from '../types';
import { Trophy, Target, Zap, Award, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { SEO } from '../components/SEO';

export const Goals: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await api.players.getAll();
        setPlayers(data);
      } catch (err) {
        console.error('Error fetching players for goals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
      </div>
    );
  }

  const sortedPlayers = [...players].sort((a, b) => (b.stats?.goals || 0) - (a.stats?.goals || 0));
  const totalGoals = players.reduce((acc, p) => acc + (p.stats?.goals || 0), 0);
  const totalAssists = players.reduce((acc, p) => acc + (p.stats?.assists || 0), 0);

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen">
      <SEO pageKey="goals" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Season Stats</span>
          <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">
            GOAL <span className="text-slate-800">STATS</span>
          </h1>
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { label: 'Total Team Goals', value: totalGoals, icon: Target, color: 'bg-blue-600' },
            { label: 'Total Team Assists', value: totalAssists, icon: Zap, color: 'bg-indigo-600' },
            { label: 'Top Scorer', value: sortedPlayers[0]?.name || 'N/A', icon: Trophy, color: 'bg-amber-600' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden group"
            >
              <div className={`absolute -right-8 -bottom-8 w-32 h-32 ${stat.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`} />
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-xl ${stat.color}/20 flex items-center justify-center text-white`}>
                  <stat.icon size={24} />
                </div>
                <p className="text-xs text-slate-500 font-black uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
              <p className="text-4xl font-black text-white italic tracking-tighter">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
          <div className="p-8 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">PLAYER LEADERBOARD</h2>
            <Award className="text-blue-500" size={24} />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/50">
                  <th className="px-8 py-4 text-[10px] text-slate-500 font-black uppercase tracking-widest">Rank</th>
                  <th className="px-8 py-4 text-[10px] text-slate-500 font-black uppercase tracking-widest">Player</th>
                  <th className="px-8 py-4 text-[10px] text-slate-500 font-black uppercase tracking-widest text-center">Matches</th>
                  <th className="px-8 py-4 text-[10px] text-slate-500 font-black uppercase tracking-widest text-center">Goals</th>
                  <th className="px-8 py-4 text-[10px] text-slate-500 font-black uppercase tracking-widest text-center">Assists</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.map((player, i) => (
                  <tr key={player.id} className="border-t border-slate-800 hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black italic text-sm ${
                        i === 0 ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 
                        i === 1 ? 'bg-slate-400 text-slate-950' :
                        i === 2 ? 'bg-amber-800 text-white' : 'text-slate-500'
                      }`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center">
                          <img
                            src={player.image || '/logo.png'}
                            alt={player.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/logo.png';
                            }}
                          />
                        </div>
                        <div>
                          <p className="text-white font-black uppercase italic tracking-tighter group-hover:text-blue-400 transition-colors">
                            {player.name}
                          </p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">{player.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center font-black text-slate-400">{player.stats?.appearances || 0}</td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-xl font-black text-white italic">{player.stats?.goals || 0}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-lg font-black text-slate-500 italic">{player.stats?.assists || 0}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {players.length === 0 && (
              <div className="text-center py-20">
                <p className="text-slate-500 font-bold uppercase tracking-widest">No stats available yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
