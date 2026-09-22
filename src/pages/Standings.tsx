import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { Team } from '../types';
import { Loader2, Trophy, ArrowUp, ArrowDown, Minus } from 'lucide-react';

export const Standings: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const data = await api.standings.get();
        setTeams(data);
      } catch (err) {
        console.error('Error fetching standings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center md:text-left">
          <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Elite League 2026</span>
          <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">
            LEAGUE <span className="text-slate-800">TABLE</span>
          </h1>
        </div>

        <div className="bg-slate-900/50 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Pos</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Team</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">P</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">W</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">D</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">L</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">GF</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">GA</th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">GD</th>
                  <th className="px-8 py-6 text-[10px] font-black text-blue-500 uppercase tracking-widest text-center">Pts</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, i) => (
                  <motion.tr
                    key={team.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center font-black italic",
                          i === 0 ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : 
                          i < 3 ? "bg-slate-800 text-slate-300" : "text-slate-500"
                        )}>
                          {i + 1}
                        </span>
                        {i === 0 && <Trophy size={14} className="text-amber-500" />}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img src={team.logo} alt={team.name} className="w-8 h-8 object-contain" />
                        <span className="text-lg font-black text-white uppercase italic tracking-tighter group-hover:text-blue-500 transition-colors">
                          {team.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center font-bold text-slate-300">{team.played}</td>
                    <td className="px-6 py-6 text-center font-bold text-slate-300">{team.wins}</td>
                    <td className="px-6 py-6 text-center font-bold text-slate-300">{team.draws}</td>
                    <td className="px-6 py-6 text-center font-bold text-slate-300">{team.losses}</td>
                    <td className="px-6 py-6 text-center font-bold text-slate-500">{team.goalsFor}</td>
                    <td className="px-6 py-6 text-center font-bold text-slate-500">{team.goalsAgainst}</td>
                    <td className="px-6 py-6 text-center font-bold">
                      <span className={team.goalDifference > 0 ? "text-emerald-500" : team.goalDifference < 0 ? "text-red-500" : "text-slate-500"}>
                        {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-xl font-black text-white italic tracking-tighter">{team.points}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap gap-8 px-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Champion / Qualification</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-800" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Top 3</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
