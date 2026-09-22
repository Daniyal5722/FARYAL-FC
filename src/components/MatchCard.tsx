import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Trophy, Clock, X, ChevronRight } from 'lucide-react';
import { Match, Team, MatchEvent } from '../types';
import { cn, formatDate } from '../lib/utils';

interface MatchCardProps {
  match: Match;
  homeTeam?: Team;
  awayTeam?: Team;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, homeTeam, awayTeam }) => {
  const [showEvents, setShowEvents] = useState(false);
  const isCompleted = match.status === 'completed';
  const isLive = match.status === 'live';

  const goals = match.events?.filter(e => e.type === 'goal') || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-slate-900/50 rounded-[2.5rem] p-8 border border-slate-800 hover:border-blue-500/30 transition-all group relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:24px_24px]" />
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
        <div className="flex flex-col items-center justify-center min-w-[180px]">
          <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">
            {match.competition}
          </div>
          
          <div className="flex items-center gap-6">
            {isCompleted || isLive ? (
              <div className="flex items-center gap-6 bg-slate-950 px-8 py-4 rounded-2xl border border-slate-800 shadow-inner">
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
            "mt-4 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all",
            match.status === 'upcoming' ? "bg-blue-600/10 text-blue-500 border-blue-500/20" :
            match.status === 'live' ? "bg-red-600 text-white border-red-500 animate-pulse shadow-lg shadow-red-600/20" :
            match.status === 'postponed' ? "bg-amber-600/10 text-amber-500 border-amber-500/20" :
            match.status === 'cancelled' ? "bg-red-600/10 text-red-500 border-red-500/20" :
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

      {/* Scorers Preview (if any) */}
      {(isCompleted || isLive) && goals.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-t border-slate-800/50 pt-6">
            <div className="text-right pr-4 border-r border-slate-800/50">
                {goals.filter(g => g.playerId && match.homeTeamId === 'team-1').map(g => (
                    <div key={g.id} className="mb-1">{g.minute}' Scorer</div>
                ))}
            </div>
            <div className="pl-4">
                {goals.filter(g => g.playerId && match.awayTeamId === 'team-1').map(g => (
                    <div key={g.id} className="mb-1">{g.minute}' Scorer</div>
                ))}
            </div>
        </div>
      )}

      {/* Info Bar */}
      <div className="mt-8 pt-6 border-t border-slate-800/50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <div className="flex items-center gap-2">
                <Calendar size={12} className="text-blue-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formatDate(match.date)}</span>
            </div>
            <div className="flex items-center gap-2">
                <Clock size={12} className="text-blue-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{match.time}</span>
            </div>
            <div className="flex items-center gap-2">
                <MapPin size={12} className="text-blue-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{match.venue}</span>
            </div>
        </div>

        {(isCompleted || isLive) && (
            <button 
                onClick={() => setShowEvents(!showEvents)}
                className="flex items-center gap-2 text-blue-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors group/btn"
            >
                {showEvents ? 'Hide Timeline' : 'View Timeline'} <ChevronRight size={12} className={cn("transition-transform", showEvents && "rotate-90")} />
            </button>
        )}
      </div>

      <AnimatePresence>
        {showEvents && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
            >
                <div className="mt-8 pt-8 border-t border-slate-800/50 space-y-4">
                    {match.events?.length > 0 ? match.events.sort((a, b) => a.minute - b.minute).map((event) => (
                        <div key={event.id} className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
                            <span className="w-8 text-blue-500 font-black">{event.minute}'</span>
                            <div className="flex-1 flex items-center gap-3">
                                <span className={cn(
                                    "w-2 h-2 rounded-full",
                                    event.type === 'goal' ? "bg-emerald-500" :
                                    event.type === 'yellow_card' ? "bg-amber-500" :
                                    event.type === 'red_card' ? "bg-red-500" : "bg-blue-500"
                                )} />
                                <span className="text-white">{event.type.replace('_', ' ')}</span>
                                <span className="text-slate-500 ml-auto">Event ID: {event.playerId}</span>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-slate-500 text-[10px] font-black uppercase tracking-widest py-4 italic">No match events recorded</p>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
