import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Calendar, MapPin, Shield, Play, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { ClubSettings, Match } from '../types';
import { useThemeSettings } from '../contexts/ThemeSettingsContext';
import { DEFAULT_HERO } from '../data/defaultConfig';

export const Hero: React.FC = () => {
  const { hero: contextHero } = useThemeSettings();
  const [settings, setSettings] = useState<ClubSettings | null>(null);
  const [nextMatch, setNextMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsData, matchesData] = await Promise.all([
          api.settings.get(),
          api.matches.getAll()
        ]);
        setSettings(settingsData);
        
        // Find upcoming match
        const upcoming = matchesData.find(m => m.status === 'upcoming');
        setNextMatch(upcoming || matchesData[0] || null);
      } catch (err) {
        console.error('Error fetching hero data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const hero = contextHero || settings?.hero || DEFAULT_HERO;

  if (hero.visible === false) {
    return null;
  }

  if (loading || !settings) {
    return (
      <div className="h-screen w-full bg-slate-950 flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
      </div>
    );
  }

  return (
    <section className="relative min-h-[92vh] w-full flex items-center justify-center pt-28 pb-16 px-4 md:px-8 bg-slate-950 overflow-hidden">
      {/* 21st.dev Style Ambient Stadium Backdrop & Mesh Lines */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={hero.backgroundImage || "/faryal_stadium_hero.jpg"}
          alt="Faryal FC Stadium"
          className="w-full h-full object-cover opacity-25 scale-105 filter brightness-75 contrast-125"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop";
          }}
        />
        {/* Tactical Pitch Lines & Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/90" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Hero Column */}
        <div className="lg:col-span-7 text-center lg:text-left">
          {/* Metadata Kicker without pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-black uppercase tracking-[0.25em] text-blue-400 mb-6"
          >
            <span>{hero.subtitle || 'BUILT FOR THE GAME'}</span>
            <span aria-hidden="true" className="text-slate-700">•</span>
            <span>EST. {settings.founded || '2024'}</span>
            <span aria-hidden="true" className="text-slate-700">•</span>
            <span>MODEL COLONY</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl sm:text-8xl lg:text-[7.5rem] font-black text-white tracking-tighter uppercase italic leading-[0.85] mb-6 drop-shadow-2xl"
          >
            {hero.title || 'FARYAL FC'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-slate-400 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-10"
          >
            {hero.description || 'Developing elite football talent with tactical discipline, uncompromising spirit, and professional standards in Karachi, Pakistan.'}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-12"
          >
            <Link
              to={hero.ctaLink || '/team'}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl shadow-blue-600/30 flex items-center gap-3 group"
            >
              {hero.ctaText || 'VIEW SQUAD'}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to={hero.secondaryCtaLink || '/matches'}
              className="px-8 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-black text-xs uppercase tracking-[0.2em] rounded-xl transition-all border border-slate-800 hover:border-slate-700 flex items-center gap-2"
            >
              <Shield size={16} className="text-blue-500" />
              {hero.secondaryCtaText || 'LATEST FIXTURES'}
            </Link>
          </motion.div>

          {/* Stat Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-900 max-w-lg mx-auto lg:mx-0 text-left"
          >
            <div>
              <p className="text-3xl font-black text-white italic tracking-tighter tabular-nums">16</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">LEAGUE POINTS</p>
            </div>
            <div>
              <p className="text-3xl font-black text-blue-400 italic tracking-tighter tabular-nums">+10</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">GOAL DIFF</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white italic tracking-tighter tabular-nums">1ST</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">TABLE RANK</p>
            </div>
          </motion.div>
        </div>

        {/* Right Hero Column - Next Match Showcase / Crest Spotlight */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group hover:border-blue-500/50 transition-all"
          >
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-blue-600/20 blur-3xl rounded-full" />
            
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
                <Calendar size={14} />
                {nextMatch?.status === 'completed' ? 'LATEST RESULT' : 'NEXT FIXTURE'}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                {nextMatch?.competition || 'KARACHI ELITE LEAGUE'}
              </span>
            </div>

            {/* Match Teams Row */}
            {nextMatch ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-center flex-1">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-slate-950 p-2.5 border border-slate-800 flex items-center justify-center">
                      <img src={settings.logo || "/logo.png"} alt={nextMatch.homeTeamName} className="w-full h-full object-contain" />
                    </div>
                    <p className="text-sm font-black text-white italic uppercase tracking-tight">{nextMatch.homeTeamName}</p>
                  </div>

                  <div className="text-center shrink-0">
                    {nextMatch.status === 'completed' ? (
                      <div className="text-2xl font-black text-white italic tracking-tighter tabular-nums px-3 py-1 bg-slate-950 rounded-xl border border-slate-800">
                        {nextMatch.homeScore} - {nextMatch.awayScore}
                      </div>
                    ) : (
                      <div className="text-xl font-black text-blue-500 italic uppercase px-3 py-1 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        VS
                      </div>
                    )}
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-2 block">
                      {nextMatch.time || '18:00 PKT'}
                    </span>
                  </div>

                  <div className="text-center flex-1">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-slate-950 p-2.5 border border-slate-800 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-sm font-black text-white italic uppercase tracking-tight">{nextMatch.awayTeamName}</p>
                  </div>
                </div>

                {/* Venue details */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-blue-500" /> {nextMatch.venue}</span>
                  <span className="text-slate-500 font-mono text-[10px] uppercase">{nextMatch.date}</span>
                </div>

                <Link
                  to="/matches"
                  className="w-full py-3 bg-slate-950 hover:bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all text-center block border border-slate-800 hover:border-blue-500"
                >
                  FULL MATCH DETAILS
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="mx-auto text-blue-500 mb-3" size={36} />
                <p className="text-sm font-black text-white uppercase italic">NO UPCOMING FIXTURES SCHEDULED</p>
                <p className="text-xs text-slate-500 mt-1">Check back soon for upcoming derby dates</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
