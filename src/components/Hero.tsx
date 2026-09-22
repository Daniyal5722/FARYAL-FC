import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Users, Calendar, MapPin, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { ClubSettings, Player } from '../types';

export const Hero: React.FC = () => {
  const [settings, setSettings] = useState<ClubSettings | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsData, playersData] = await Promise.all([
          api.settings.get(),
          api.players.getAll()
        ]);
        setSettings(settingsData);
        setPlayers(playersData);
      } catch (err) {
        console.error('Error fetching hero data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !settings) {
    return (
      <div className="h-screen w-full bg-slate-950 flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
      </div>
    );
  }

  const totalGoals = players.reduce((acc, p) => acc + (p.stats?.goals || 0), 0);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Stadium Atmosphere */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop"
          alt="Stadium Background"
          className="w-full h-full object-cover opacity-20 scale-110 grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/40 to-slate-950" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="flex justify-center mb-12">
            <motion.div
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-20" />
              <img src={settings.logo || "/logo.png"} alt="Faryal FC Logo" className="w-48 h-48 md:w-64 md:h-64 object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(59,130,246,0.3)]" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="inline-block bg-blue-600/10 text-blue-500 px-6 py-2 rounded-full text-xs font-black tracking-[0.4em] uppercase mb-8 border border-blue-600/20">
              ESTABLISHED {settings.founded} — KARACHI
            </span>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black text-white tracking-tighter leading-[0.8] mb-8 uppercase italic">
              FARYAL <span className="text-slate-800">FC</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-bold tracking-[0.2em] mb-12 max-w-3xl mx-auto uppercase">
              UNITY. <span className="text-white">PASSION.</span> VICTORY.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link
                to="/team"
                className="button-premium"
              >
                VIEW SQUAD
              </Link>
              <Link
                to="/matches"
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all backdrop-blur-md border border-white/10"
              >
                MATCH CENTER
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Pitch Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-1/4 -left-1/4 w-full h-full border-[1px] border-white/5 rounded-full" />
        <div className="absolute -top-1/4 -right-1/4 w-full h-full border-[1px] border-white/5 rounded-full" />
      </div>
    </section>
  );
};
