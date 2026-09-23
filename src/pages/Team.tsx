import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PlayerCard } from '../components/PlayerCard';
import { Player } from '../types';
import { Users, Search, Shield, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

export const Team: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await api.players.getAll();
        // Do NOT re-sort. Preserve exact list order from dataset!
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
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const matchesName = p.name.toLowerCase().includes(query);
    const matchesNumber = p.number ? p.number.toString().includes(query) : false;
    const matchesPosition = p.position ? p.position.toLowerCase().includes(query) : false;
    return matchesName || matchesNumber || matchesPosition;
  });

  if (loading) {
    return (
      <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
      </div>
    );
  }

  const playersWithNumber = players.filter(p => p.number !== null && p.number !== undefined && p.number > 0).length;

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="text-center md:text-left">
            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Faryal FC Roster</span>
            <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">
              THE <span className="text-slate-800">SQUAD</span>
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search by name or number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-2xl pl-12 pr-4 py-3.5 text-white font-medium text-sm outline-none transition-all"
            />
          </div>
        </div>

        {/* Dynamic Stats Summary (NO HARDCODED FAKE STATS) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 flex items-center gap-2">
              <Users size={14} className="text-blue-500" /> Total Squad Size
            </p>
            <p className="text-3xl font-black text-white italic tracking-tighter">{players.length} Players</p>
          </div>

          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 flex items-center gap-2">
              <Shield size={14} className="text-blue-500" /> Assigned Numbers
            </p>
            <p className="text-3xl font-black text-white italic tracking-tighter">{playersWithNumber} Assigned</p>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Location</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">Model Colony</p>
          </div>
        </div>

        {/* Player Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredPlayers.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <PlayerCard player={player} />
            </motion.div>
          ))}
        </div>

        {filteredPlayers.length === 0 && (
          <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
            <Users className="mx-auto text-slate-700 mb-4" size={48} />
            <p className="text-slate-500 font-black uppercase tracking-widest">No matching players found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
