import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Trophy, Clock } from 'lucide-react';
import { Match, Team } from '../types';
import { cn } from '../lib/utils';

interface MatchCardProps {
  match: Match;
  homeTeam?: Team;
  awayTeam?: Team;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, homeTeam, awayTeam }) => {
  const isCompleted = match.status === 'completed';
  const isLive = match.status === 'live';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-slate-900/50 rounded-[2rem] p-8 border border-slate-800 hover:border-blue-500/30 transition-all group relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:24px:24px]" />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        {/* Home Team */}
        <div className="flex-1 w-full text-center md:text-right">
          <div className="flex flex-col md:flex-row-reverse items-center justify-center md:justify-start gap-6">
            <div className="w-20 h-20 bg-slate-950 rounded-2xl flex items-center justify-center p-3 border border-slate-800 shadow-xl group-hover:scale-110 transition-transform duration-500">
              <img 
                src={homeTeam?.logo || 'https://via.placeholder.com/80?text=HOME'} 
                alt={homeTeam?.name || match.homeTeamName} 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-1">
                {homeTeam?.name || match.homeTeamName}
              </h4>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">{homeTeam?.shortName || 'HOME'}</p>
            </div>
          </div>
        </div>

        {/* Score / VS Area */}
        <div className="flex flex-col items-center justify-center min-w-[150px]">
          <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">
            {match.competition}
          </div>
          
          <div className="flex items-center gap-6">
            {isCompleted ? (
              <div className="flex items-center gap-6 bg-slate-950 px-8 py-4 rounded-2xl border border-slate-800">
                <span className="text-5xl font-black text-white italic tracking-tighter leading-none">{match.homeScore}</span>
                <span className="text-2xl font-black text-slate-800">-</span>
                <span className="text-5xl font-black text-white italic tracking-tighter leading-none">{match.awayScore}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="bg-blue-600 text-white text-xl font-black px-8 py-3 rounded-2xl shadow-lg shadow-blue-600/20 italic tracking-tighter">
                  VS
                </div>
              </div>
            )}
          </div>

          <div className={cn(
            "mt-4 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border",
            match.status === 'upcoming' ? "bg-blue-600/10 text-blue-500 border-blue-500/20" :
            match.status === 'live' ? "bg-red-600 text-white border-red-500 animate-pulse" :
            "bg-slate-950 text-slate-500 border-slate-800"
          )}>
            {match.status === 'completed' ? 'Full Time' : match.status}
          </div>
        </div>

        {/* Away Team */}
        <div className="flex-1 w-full text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-6">
            <div className="w-20 h-20 bg-slate-950 rounded-2xl flex items-center justify-center p-3 border border-slate-800 shadow-xl group-hover:scale-110 transition-transform duration-500">
              <img 
                src={awayTeam?.logo || 'https://via.placeholder.com/80?text=AWAY'} 
                alt={awayTeam?.name || match.awayTeamName} 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-1">
                {awayTeam?.name || match.awayTeamName}
              </h4>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">{awayTeam?.shortName || 'AWAY'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="mt-8 pt-6 border-t border-slate-800/50 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-blue-500" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{match.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-blue-500" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{match.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-blue-500" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{match.venue}</span>
        </div>
      </div>
    </motion.div>
  );
};
