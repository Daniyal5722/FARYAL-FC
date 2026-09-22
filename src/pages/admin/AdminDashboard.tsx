import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, Trophy, Calendar, BarChart3, Settings, Database, 
  ArrowRight, Loader2, Download, Upload, Newspaper, Image as ImageIcon,
  Medal, LayoutDashboard
} from 'lucide-react';
import { api } from '../../lib/api';
import { Player, Team, Match, News, Competition, Trophy as TrophyType } from '../../types';
import { exportToExcel } from '../../lib/excel';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<{
    players: Player[];
    teams: Team[];
    matches: Match[];
    news: News[];
    competitions: Competition[];
    trophies: TrophyType[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [players, teams, matches, news, competitions, trophies] = await Promise.all([
          api.players.getAll(),
          api.teams.getAll(),
          api.matches.getAll(),
          api.news.getAll(),
          api.competitions.getAll(),
          api.trophies.getAll(),
        ]);
        setData({ players, teams, matches, news, competitions, trophies });
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
      </div>
    );
  }

  const modules = [
    { title: 'Teams', icon: Trophy, count: data.teams.length, link: '/admin/teams', color: 'bg-blue-600' },
    { title: 'Players', icon: Users, count: data.players.length, link: '/admin/players', color: 'bg-emerald-600' },
    { title: 'Matches', icon: Calendar, count: data.matches.length, link: '/admin/matches', color: 'bg-orange-600' },
    { title: 'Competitions', icon: Medal, count: data.competitions.length, link: '/admin/competitions', color: 'bg-purple-600' },
    { title: 'News', icon: Newspaper, count: data.news.length, link: '/admin/news', color: 'bg-pink-600' },
    { title: 'Gallery', icon: ImageIcon, count: 'Manage', link: '/admin/gallery', color: 'bg-cyan-600' },
    { title: 'Trophies', icon: Award, count: data.trophies.length, link: '/admin/trophies', color: 'bg-amber-600' },
    { title: 'Settings', icon: Settings, count: 'Edit', link: '/admin/settings', color: 'bg-slate-600' },
  ];

  const handleExcelExport = () => {
    exportToExcel(data.players, 'FaryalFC_Players');
    exportToExcel(data.matches, 'FaryalFC_Matches');
    exportToExcel(data.teams, 'FaryalFC_Teams');
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Control Center</span>
            <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
              ADMIN <span className="text-slate-800">DASHBOARD</span>
            </h1>
          </div>
          <div className="flex gap-4">
             <button onClick={handleExcelExport} className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">
                <Download size={16} /> Export Excel
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {modules.map((module, i) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={module.link} className="group block bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-blue-500/50 transition-all relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-24 h-24 ${module.color} opacity-5 blur-3xl -mr-8 -mt-8 group-hover:opacity-10 transition-opacity`} />
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-xl ${module.color}/10 text-white group-hover:scale-110 transition-transform`}>
                    <module.icon className="text-white" size={24} />
                  </div>
                  <span className="text-3xl font-black text-white/20 italic tracking-tighter">{module.count}</span>
                </div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1">{module.title}</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:text-blue-500 transition-colors">
                  Management <ArrowRight size={10} />
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                        <BarChart3 className="text-blue-500" /> Season Overview
                    </h2>
                    <span className="bg-blue-600/10 text-blue-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Active Season</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: 'Played', value: data.matches.filter(m => m.status === 'completed').length },
                        { label: 'Goals', value: data.players.reduce((acc, p) => acc + (p.stats?.goals || 0), 0) },
                        { label: 'Wins', value: data.teams.find(t => t.id === 'team-1')?.wins || 0 },
                        { label: 'Upcoming', value: data.matches.filter(m => m.status === 'upcoming').length },
                    ].map(stat => (
                        <div key={stat.label}>
                            <p className="text-4xl font-black text-white italic tracking-tighter mb-1">{stat.value}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="bg-blue-600 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-32 -mt-32 group-hover:scale-110 transition-transform" />
                <LayoutDashboard className="text-white/20 absolute -bottom-4 -right-4" size={120} />
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4 relative z-10">Production Ready</h2>
                <p className="text-blue-100 text-sm font-bold leading-relaxed mb-8 relative z-10">
                    Your club's digital engine is running. All changes made here reflect instantly across the official site.
                </p>
                <Link to="/" className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all relative z-10">
                    Visit Live Site <ArrowRight size={14} />
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

const Award = ({ size, className }: { size: number, className?: string }) => <Trophy size={size} className={className} />;
