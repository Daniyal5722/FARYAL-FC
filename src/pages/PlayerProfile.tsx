import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Player } from '../types';
import { ArrowLeft, Trophy, Target, Zap, Clock, Shield, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { SEO } from '../components/SEO';

export const PlayerProfile: React.FC = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPlayer = async () => {
      try {
        const data = await api.players.getOne(id);
        setPlayer(data);
      } catch (err) {
        console.error('Error fetching player:', err);
        setPlayer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="pt-32 text-center bg-slate-950 min-h-screen">
        <SEO title="Player Not Found | Faryal FC Squad" noIndex={true} />
        <h1 className="text-white text-4xl font-black italic tracking-tighter uppercase mb-4">PLAYER NOT FOUND</h1>
        <Link to="/team" className="text-blue-500 font-bold uppercase tracking-widest text-xs hover:underline">
          BACK TO SQUAD
        </Link>
      </div>
    );
  }

  const playerSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: player.name,
    jobTitle: `Football Player (${player.position})`,
    image: player.image,
    nationality: player.nationality || 'Pakistani',
    description: player.bio || `${player.name} plays as a ${player.position} for Faryal FC.`,
    memberOf: {
      '@type': 'SportsTeam',
      name: 'Faryal FC',
    },
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen overflow-hidden">
      <SEO
        title={`${player.name} ${player.number ? `#${player.number}` : ''} | Faryal FC Player Profile`}
        description={`${player.name} (${player.position}) - Official Faryal FC squad member. ${player.stats?.goals || 0} Goals, ${player.stats?.appearances || 0} Appearances. ${player.bio || ''}`}
        ogImage={player.image}
        structuredData={playerSchema}
      />
      <div className="max-w-7xl mx-auto relative">
        {/* Background Jersey Number */}
        <div className="absolute -top-20 -right-20 text-[20rem] font-black text-white/5 italic select-none pointer-events-none">
          {player.number ? `#${player.number}` : '—'}
        </div>

        <Link to="/team" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors font-bold uppercase tracking-widest text-xs mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK TO SQUAD
        </Link>

        <div className="flex flex-col lg:flex-row gap-16 relative z-10">
          {/* Image Side */}
          <div className="lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative group"
            >
              <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative bg-slate-900 flex items-center justify-center">
                {player.image ? (
                  <img
                    src={player.image}
                    alt={player.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-700">
                    <Shield size={80} className="mb-3 opacity-30" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-600">No Photo Available</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                
                {/* Position Overlay */}
                {player.position && (
                  <div className="absolute bottom-8 left-8">
                    <span className="bg-blue-600 text-white text-xs font-black px-4 py-2 rounded-lg uppercase tracking-[0.2em] shadow-xl">
                      {player.position}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Floating Stat */}
              <div className="absolute -bottom-6 -right-6 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Season Goals</p>
                <p className="text-4xl font-black text-white italic tracking-tighter">{player.stats?.goals || 0}</p>
              </div>
            </motion.div>
          </div>

          {/* Info Side */}
          <div className="lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-blue-500 font-black uppercase tracking-[0.4em] text-sm mb-4 block">Faryal FC Player Profile</span>
              <h1 className="text-6xl md:text-9xl font-black text-white italic tracking-tighter uppercase leading-none mb-8">
                {player.name}
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {[
                  { label: 'Jersey', value: player.number ? `#${player.number}` : 'No. —', icon: Shield },
                  { label: 'Nation', value: player.nationality || 'Pakistan', icon: Target },
                  { label: 'Height', value: player.height || '—', icon: Clock },
                  { label: 'Played', value: player.stats?.appearances || 0, icon: Trophy },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                      <item.icon size={12} className="text-blue-500" /> {item.label}
                    </p>
                    <p className="text-xl font-black text-white italic tracking-tighter uppercase">{item.value}</p>
                  </div>
                ))}
              </div>

              {player.bio ? (
                <div className="mb-12">
                  <h3 className="text-white font-black uppercase tracking-widest text-sm mb-4">Biography</h3>
                  <p className="text-slate-500 text-lg font-medium leading-relaxed">
                    {player.bio}
                  </p>
                </div>
              ) : (
                <div className="mb-12 p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Biography coming soon</p>
                </div>
              )}

              {/* Detailed Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-xl shadow-blue-600/20">
                  <p className="text-xs font-black text-blue-100 uppercase tracking-widest mb-2">Goals</p>
                  <p className="text-5xl font-black text-white italic tracking-tighter leading-none">{player.stats?.goals || 0}</p>
                </div>
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Assists</p>
                  <p className="text-5xl font-black text-white italic tracking-tighter leading-none">{player.stats?.assists || 0}</p>
                </div>
                <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Appearances</p>
                  <p className="text-5xl font-black text-white italic tracking-tighter leading-none">{player.stats?.appearances || 0}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
