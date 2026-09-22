import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormationType, Player } from '../types';
import { api } from '../lib/api';
import { Loader2 } from 'lucide-react';

const FORMATIONS: Record<FormationType, { name: string; positions: { x: number; y: number; label: string }[] }> = {
// ... existing formations
  '4-4-2': {
    name: '4-4-2',
    positions: [
      { x: 50, y: 90, label: 'GK' },
      { x: 20, y: 75, label: 'LB' }, { x: 40, y: 75, label: 'CB' }, { x: 60, y: 75, label: 'CB' }, { x: 80, y: 75, label: 'RB' },
      { x: 20, y: 50, label: 'LM' }, { x: 40, y: 55, label: 'CM' }, { x: 60, y: 55, label: 'CM' }, { x: 80, y: 50, label: 'RM' },
      { x: 40, y: 20, label: 'ST' }, { x: 60, y: 20, label: 'ST' },
    ],
  },
  '4-3-3': {
    name: '4-3-3',
    positions: [
      { x: 50, y: 90, label: 'GK' },
      { x: 20, y: 75, label: 'LB' }, { x: 40, y: 75, label: 'CB' }, { x: 60, y: 75, label: 'CB' }, { x: 80, y: 75, label: 'RB' },
      { x: 30, y: 55, label: 'CM' }, { x: 50, y: 60, label: 'CDM' }, { x: 70, y: 55, label: 'CM' },
      { x: 20, y: 25, label: 'LW' }, { x: 50, y: 20, label: 'ST' }, { x: 80, y: 25, label: 'RW' },
    ],
  },
  '4-2-3-1': {
    name: '4-2-3-1',
    positions: [
      { x: 50, y: 90, label: 'GK' },
      { x: 20, y: 75, label: 'LB' }, { x: 40, y: 75, label: 'CB' }, { x: 60, y: 75, label: 'CB' }, { x: 80, y: 75, label: 'RB' },
      { x: 40, y: 60, label: 'CDM' }, { x: 60, y: 60, label: 'CDM' },
      { x: 20, y: 40, label: 'LM' }, { x: 50, y: 40, label: 'CAM' }, { x: 80, y: 40, label: 'RM' },
      { x: 50, y: 20, label: 'ST' },
    ],
  },
  '3-5-2': {
    name: '3-5-2',
    positions: [
      { x: 50, y: 90, label: 'GK' },
      { x: 30, y: 75, label: 'CB' }, { x: 50, y: 75, label: 'CB' }, { x: 70, y: 75, label: 'CB' },
      { x: 15, y: 50, label: 'LWB' }, { x: 40, y: 55, label: 'CM' }, { x: 50, y: 60, label: 'CDM' }, { x: 60, y: 55, label: 'CM' }, { x: 85, y: 50, label: 'RWB' },
      { x: 40, y: 20, label: 'ST' }, { x: 60, y: 20, label: 'ST' },
    ],
  },
  '3-4-3': {
    name: '3-4-3',
    positions: [
      { x: 50, y: 90, label: 'GK' },
      { x: 30, y: 75, label: 'CB' }, { x: 50, y: 75, label: 'CB' }, { x: 70, y: 75, label: 'CB' },
      { x: 20, y: 55, label: 'LM' }, { x: 40, y: 60, label: 'CM' }, { x: 60, y: 60, label: 'CM' }, { x: 80, y: 55, label: 'RM' },
      { x: 25, y: 25, label: 'LW' }, { x: 50, y: 20, label: 'ST' }, { x: 75, y: 25, label: 'RW' },
    ],
  },
  '5-3-2': {
    name: '5-3-2',
    positions: [
      { x: 50, y: 90, label: 'GK' },
      { x: 15, y: 75, label: 'LWB' }, { x: 35, y: 75, label: 'CB' }, { x: 50, y: 75, label: 'CB' }, { x: 65, y: 75, label: 'CB' }, { x: 85, y: 75, label: 'RWB' },
      { x: 30, y: 50, label: 'CM' }, { x: 50, y: 55, label: 'CDM' }, { x: 70, y: 50, label: 'CM' },
      { x: 40, y: 25, label: 'ST' }, { x: 60, y: 25, label: 'ST' },
    ],
  },
};

export const FormationPitch: React.FC = () => {
  const [formation, setFormation] = useState<FormationType>('4-3-3');
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await api.players.getAll();
        setPlayers(data);
      } catch (err) {
        console.error('Error fetching players for formation:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  if (loading) {
    return (
      <div className="w-full aspect-[3/2] flex items-center justify-center bg-emerald-950/20 rounded-3xl border border-slate-800">
        <Loader2 className="text-blue-500 animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-6">
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {(Object.keys(FORMATIONS) as FormationType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFormation(f)}
            className={`px-6 py-2 rounded-full font-black text-sm transition-all border ${
              formation === f 
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="relative aspect-[4/3] md:aspect-[3/2] w-full bg-emerald-950 rounded-3xl overflow-hidden border-8 border-slate-900 shadow-2xl">
        {/* Pitch Texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
          <div className="h-full w-full flex">
            {[...Array(10)].map((_, i) => (
              <div key={i} className={`flex-1 h-full ${i % 2 === 0 ? 'bg-emerald-900/50' : 'bg-transparent'}`} />
            ))}
          </div>
        </div>

        {/* Pitch Markings */}
        <div className="absolute inset-0 border-4 border-white/20 m-6 rounded-sm">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/20 -translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-4 border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/20 rounded-full" />
          
          {/* Penalty Areas */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 border-4 border-t-0 border-white/20" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-32 border-4 border-b-0 border-white/20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-12 border-4 border-t-0 border-white/20" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/4 h-12 border-4 border-b-0 border-white/20" />
        </div>

        {/* Players */}
        <AnimatePresence mode="popLayout">
          {FORMATIONS[formation].positions.map((pos, index) => {
            // Find a player that matches the position label or fallback to next available
            const filteredByPos = players.filter(p => p.position === pos.label);
            const player = filteredByPos[0] || players[index % players.length];

            if (!player) return null;

            return (
              <motion.div
                key={`${formation}-${index}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  left: `${pos.x}%`, 
                  top: `${pos.y}%`,
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group z-20"
              >
                <div className="relative">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center text-white font-black shadow-xl group-hover:scale-110 transition-transform cursor-pointer overflow-hidden">
                    <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] md:text-xs font-black w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center border-2 border-blue-500">
                    {player.number}
                  </div>
                </div>
                <div className="bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 shadow-lg">
                  <p className="text-[9px] md:text-[10px] text-blue-400 font-black uppercase text-center leading-none">
                    {pos.label}
                  </p>
                  <p className="text-[10px] md:text-xs text-white font-bold whitespace-nowrap text-center uppercase tracking-tighter">
                    {player.name.split(' ')[1] || player.name}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
