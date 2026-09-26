import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormationType, Player } from '../types';
import { api } from '../lib/api';
import { Loader2, ArrowUp } from 'lucide-react';
import { FORMATIONS, ALL_FORMATION_TYPES, getFormationLineup } from '../data/formationData';
import { useThemeSettings } from '../contexts/ThemeSettingsContext';

export interface FormationPitchProps {
  currentFormation?: FormationType;
  onFormationChange?: (f: FormationType) => void;
  allowedFormations?: FormationType[];
  customLineup?: Record<string, string>; // `${formation}-${index}` -> playerId
  onPositionClick?: (posIndex: number, posLabel: string, currentAssignedPlayer?: Player) => void;
  selectedPosIndex?: number | null;
  interactive?: boolean;
  showSelector?: boolean;
  showDirectionIndicator?: boolean;
}

export const FormationPitch: React.FC<FormationPitchProps> = ({
  currentFormation: controlledFormation,
  onFormationChange,
  allowedFormations: propAllowedFormations,
  customLineup: propCustomLineup,
  onPositionClick,
  selectedPosIndex,
  interactive = false,
  showSelector = true,
  showDirectionIndicator = true,
}) => {
  const { formation: contextFormation } = useThemeSettings();
  const [internalFormation, setInternalFormation] = useState<FormationType>(
    contextFormation?.defaultFormation || '4-3-3'
  );
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  // Synchronize internal formation with context or props
  useEffect(() => {
    if (controlledFormation) {
      setInternalFormation(controlledFormation);
    } else if (contextFormation?.defaultFormation) {
      setInternalFormation(contextFormation.defaultFormation);
    }
  }, [controlledFormation, contextFormation?.defaultFormation]);

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

  const activeFormation: FormationType = controlledFormation || internalFormation;

  const handleSelectFormation = (f: FormationType) => {
    if (onFormationChange) {
      onFormationChange(f);
    } else {
      setInternalFormation(f);
    }
  };

  const allowedFormations = 
    propAllowedFormations && propAllowedFormations.length > 0
      ? propAllowedFormations
      : contextFormation?.enabledFormations && contextFormation.enabledFormations.length > 0
      ? contextFormation.enabledFormations
      : ALL_FORMATION_TYPES;

  const lineup = propCustomLineup ?? (contextFormation?.lineup || {});

  if (loading) {
    return (
      <div className="w-full max-w-xl mx-auto aspect-[68/100] flex items-center justify-center bg-emerald-950/20 rounded-3xl border border-slate-800">
        <Loader2 className="text-blue-500 animate-spin" size={32} />
      </div>
    );
  }

  // Resolve all 11 Starting XI positions matching players uniquely by position and manual lineup
  const resolvedSlots = getFormationLineup(activeFormation, players, lineup);

  return (
    <div className="w-full max-w-2xl mx-auto py-4 px-2 sm:px-4">
      {/* Formation Selector Pills */}
      {showSelector && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {allowedFormations.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => handleSelectFormation(f)}
              className={`px-4 sm:px-5 py-2 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider transition-all border ${
                activeFormation === f
                  ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30 scale-105'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Attacking Direction Header */}
      {showDirectionIndicator && (
        <div className="flex items-center justify-center gap-2 mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
          <ArrowUp size={12} className="animate-bounce" />
          <span>Attacking Direction</span>
          <ArrowUp size={12} className="animate-bounce" />
        </div>
      )}

      {/* Realistic Football Ground (Proportional Vertical Aspect Ratio: 68m width / 100m length) */}
      <div className="relative w-full max-w-lg sm:max-w-xl mx-auto aspect-[68/100] bg-emerald-950 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border-[6px] sm:border-8 border-slate-900 shadow-2xl">
        
        {/* Alternating Horizontal Turf Mower Bands */}
        <div className="absolute inset-0 flex flex-col pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 w-full ${
                i % 2 === 0 ? 'bg-emerald-900/60' : 'bg-emerald-800/40'
              }`}
            />
          ))}
        </div>

        {/* Stadium Floodlight Ambient Glow & Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.15)_0%,rgba(2,44,34,0.6)_75%,rgba(2,6,23,0.85)_100%)] pointer-events-none" />

        {/* Outer Turf Runoff Margin with Pitch Boundary Lines */}
        <div className="absolute inset-3 sm:inset-5 border-2 border-white/50 rounded-sm pointer-events-none">
          
          {/* Halfway Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/40 -translate-y-1/2" />
          
          {/* Center Circle (FIFA Regulation 9.15m radius, ~28% pitch width) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28%] aspect-square border-2 border-white/40 rounded-full" />
          
          {/* Center Kickoff Spot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/80 rounded-full shadow-sm" />

          {/* TOP GOAL (Opponent Goal) */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[22%] h-3 border-2 border-b-0 border-white/60 bg-white/10 rounded-t-sm" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[58%] h-[16%] border-2 border-t-0 border-white/40" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[28%] h-[6%] border-2 border-t-0 border-white/40" />
          <div className="absolute top-[11.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/80 rounded-full shadow-sm" />
          <div className="absolute top-[16%] left-1/2 -translate-x-1/2 w-[20%] h-[5%] border-2 border-t-0 border-white/40 rounded-b-full" />

          {/* BOTTOM GOAL (Home Goal defended by GK) */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[22%] h-3 border-2 border-t-0 border-white/60 bg-white/10 rounded-b-sm" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[58%] h-[16%] border-2 border-b-0 border-white/40" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[28%] h-[6%] border-2 border-b-0 border-white/40" />
          <div className="absolute bottom-[11.5%] left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-white/80 rounded-full shadow-sm" />
          <div className="absolute bottom-[16%] left-1/2 -translate-x-1/2 w-[20%] h-[5%] border-2 border-b-0 border-white/40 rounded-t-full" />

          {/* 4 Corner Kick Arcs */}
          <div className="absolute top-0 left-0 w-3 sm:w-4 h-3 sm:h-4 border-r-2 border-b-2 border-white/40 rounded-br-full" />
          <div className="absolute top-0 right-0 w-3 sm:w-4 h-3 sm:h-4 border-l-2 border-b-2 border-white/40 rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-3 sm:w-4 h-3 sm:h-4 border-r-2 border-t-2 border-white/40 rounded-tr-full" />
          <div className="absolute bottom-0 right-0 w-3 sm:w-4 h-3 sm:h-4 border-l-2 border-t-2 border-white/40 rounded-tl-full" />
        </div>

        {/* Players Overlay */}
        <AnimatePresence mode="popLayout">
          {resolvedSlots.map(({ position: pos, player, index }) => {
            if (!player) return null;

            const isSelected = selectedPosIndex === index;

            return (
              <motion.div
                key={`${activeFormation}-${index}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: 'spring', damping: 22, stiffness: 120 }}
                onClick={() => {
                  if (onPositionClick) {
                    onPositionClick(index, pos.label, player);
                  }
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group z-20 ${
                  onPositionClick || interactive ? 'cursor-pointer' : ''
                }`}
              >
                {/* Player Disc & Squad Number Badge */}
                <div className="relative">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-blue-600 border-2 sm:border-3 transition-all shadow-xl group-hover:scale-110 flex items-center justify-center text-white font-black overflow-hidden ${
                      isSelected
                        ? 'border-amber-400 ring-4 ring-amber-400/50 scale-110'
                        : 'border-white group-hover:border-blue-400'
                    }`}
                  >
                    <img
                      src={player.image || '/logo.png'}
                      alt={player.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/logo.png';
                      }}
                    />
                  </div>

                  <div className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 bg-slate-900 text-white text-[8px] sm:text-[10px] font-black w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border border-blue-500 shadow-md">
                    {player.number ?? '-'}
                  </div>
                </div>

                {/* Player Tag (Position + Surname) */}
                <div className="bg-slate-950/90 backdrop-blur-sm px-1.5 sm:px-2.5 py-0.5 rounded-full border border-white/15 shadow-md text-center max-w-[75px] sm:max-w-[95px]">
                  <p className="text-[7px] sm:text-[9px] text-blue-400 font-black uppercase leading-tight">
                    {pos.label}
                  </p>
                  <p className="text-[8px] sm:text-[10px] text-white font-bold whitespace-nowrap uppercase tracking-tighter truncate leading-tight">
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

export { FORMATIONS };
