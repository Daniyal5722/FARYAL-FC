import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Shield } from 'lucide-react';
import { Player } from '../types';

interface PlayerCardProps {
  player: Player;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const [imageError, setImageError] = useState(false);
  const hasRealPhoto = player.image && player.image.trim().length > 0 && !imageError;
  const hasJerseyNumber = player.number !== null && player.number !== undefined && Number(player.number) > 0;
  const hasStats = player.stats && ((player.stats.goals || 0) > 0 || (player.stats.appearances || 0) > 0 || (player.stats.assists || 0) > 0);

  return (
    <Link to={`/player/${player.id}`}>
      <motion.div
        whileHover={{ y: -8 }}
        className="group relative bg-slate-900 rounded-3xl overflow-hidden cursor-pointer border border-slate-800/80 transition-all hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-600/10 flex flex-col h-full"
      >
        <div className="aspect-[3/4] overflow-hidden relative bg-slate-950 flex items-center justify-center">
          {hasRealPhoto ? (
            <img
              src={player.image}
              alt={player.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none" />
              <div className="w-24 h-24 rounded-full bg-slate-800/80 border border-slate-700/80 flex items-center justify-center mb-4 text-slate-500 group-hover:border-blue-500/40 transition-colors shadow-inner">
                <User size={48} className="text-slate-400" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                FARYAL FC
              </p>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />

          {/* Jersey Number Overlay */}
          <div className="absolute top-4 right-4 font-black italic tracking-tighter text-right">
            {hasJerseyNumber ? (
              <span className="text-4xl text-white/20 group-hover:text-blue-500/30 transition-colors">
                #{player.number}
              </span>
            ) : (
              <span className="text-xs font-black text-slate-600 uppercase tracking-widest bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800">
                No. —
              </span>
            )}
          </div>

          {/* Position Badge if present */}
          {player.position && player.position.trim().length > 0 && (
            <div className="absolute bottom-4 left-4">
              <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider shadow-lg">
                {player.position}
              </span>
            </div>
          )}
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between bg-slate-900/90">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em]">
                {player.nationality || 'PAKISTAN'}
              </span>
              {hasJerseyNumber && (
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  NO. {player.number}
                </span>
              )}
            </div>

            <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors uppercase italic tracking-tighter leading-none mb-3">
              {player.name}
            </h3>
          </div>

          {/* Stats section */}
          {hasStats ? (
            <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-slate-800/80">
              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Apps</p>
                <p className="text-xs font-black text-white">{player.stats?.appearances || 0}</p>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Goals</p>
                <p className="text-xs font-black text-white">{player.stats?.goals || 0}</p>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Assists</p>
                <p className="text-xs font-black text-white">{player.stats?.assists || 0}</p>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-800/80 text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                OFFICIAL SQUAD MEMBER
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
};
