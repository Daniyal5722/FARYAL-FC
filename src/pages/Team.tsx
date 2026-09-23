import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PlayerCard } from '../components/PlayerCard';
import { Player } from '../types';
import { Users, Filter, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

export const Team: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const positions = ['ALL', 'GK', 'DEF', 'MID', 'ATT'];
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await api.players.getAll();
        setPlayers(data);
      } catch (err) {
        console.error('Error fetching players:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const filteredPlayers = players.filter(p => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'GK') return p.position.includes('Goalkeeper');
    if (activeFilter === 'DEF') return p.position.includes('Defender');
    if (activeFilter === 'MID') return p.position.includes('Midfielder');
    if (activeFilter === 'ATT') return p.position.includes('Forward');
    return true;
  });

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
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="text-center md:text-left">
            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Season 2026/27</span>
            <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">
              THE <span className="text-slate-800">SQUAD</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2">
            {positions.map(pos => (
              <button
                key={pos}
                onClick={() => setActiveFilter(pos)}
                className={`px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest transition-all border ${
                  activeFilter === pos
                    ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20'
                    : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: 'Total Players', value: players.length, icon: Users },
            { label: 'Avg Age', value: '24.2', icon: Filter },
            { label: 'Nationalities', value: '1', icon: Filter },
            { label: 'Active Status', value: '95%', icon: Filter },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-white italic tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Player Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredPlayers.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <PlayerCard player={player} />
            </motion.div>
          ))}
        </div>

        {filteredPlayers.length === 0 && (
          <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
            <Users className="mx-auto text-slate-700 mb-4" size={48} />
            <p className="text-slate-500 font-bold uppercase tracking-widest">No players found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
