import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Player } from '../types';

interface PlayerCardProps {
  player: Player;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  return (
    <Link to={`/player/${player.id}`}>
      <motion.div
        whileHover={{ y: -10 }}
        className="group relative bg-slate-900 rounded-2xl overflow-hidden cursor-pointer border border-slate-800 transition-all hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10"
      >
      <div className="aspect-[3/4] overflow-hidden relative">
        <img
          src={player.image}
          alt={player.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

        {/* Jersey Number Overlay */}
        <div className="absolute top-4 right-4 text-5xl font-black text-white/10 italic">
          #{player.number}
        </div>

        {/* Position Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-sm uppercase tracking-wider">
            {player.position}
          </span>
        </div>
      </div>

      <div className="p-6">
        <p className="text-xs text-blue-500 font-bold uppercase tracking-[0.2em] mb-1">{player.nationality}</p>
        <h3 className="text-xl font-black text-white mb-4 group-hover:text-blue-400 transition-colors uppercase italic tracking-tighter">
          {player.name}
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
            <p className="text-[10px] text-slate-500 font-bold uppercase">Apps</p>
            <p className="text-sm font-black text-white">{player.stats?.appearances || 0}</p>
          </div>
          <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
            <p className="text-[10px] text-slate-500 font-bold uppercase">{player.position.includes('Goalkeeper') ? 'Clean' : 'Goals'}</p>
            <p className="text-sm font-black text-white">{player.position.includes('Goalkeeper') ? (player.stats?.cleanSheets || 0) : (player.stats?.goals || 0)}</p>
          </div>
          <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
            <p className="text-[10px] text-slate-500 font-bold uppercase">Assists</p>
            <p className="text-sm font-black text-white">{player.stats?.assists || 0}</p>
          </div>
        </div>
      </div>
      </motion.div>
    </Link>
  );
};
