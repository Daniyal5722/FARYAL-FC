import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, Trophy, Calendar, BarChart3, Settings, Database, 
  ArrowRight, Download, Newspaper, Image as ImageIcon,
  Palette, Shield, Sparkles, Activity, Clock, Plus, Loader2, Globe
} from 'lucide-react';
import { api } from '../../lib/api';
import { Player, Team, Match, News, ActivityLog } from '../../types';
import { exportToExcel } from '../../lib/excel';
import { useThemeSettings } from '../../contexts/ThemeSettingsContext';
import { useFirebase } from '../../contexts/FirebaseContext';
import { SEO } from '../../components/SEO';

export const AdminDashboard: React.FC = () => {
  const { branding, maintenance } = useThemeSettings();
  const { user, loading: authLoading, isAdmin } = useFirebase();
  const navigate = useNavigate();

  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Authentication check & automatic redirect
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/login', { replace: true });
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (!user || !isAdmin) return;

    const fetchData = async () => {
      try {
        const [p, t, m, n, a] = await Promise.all([
          api.players.getAll(),
          api.teams.getAll(),
          api.matches.getAll(),
          api.news.getAll(),
          api.activity.getAll(),
        ]);
        setPlayers(p);
        setTeams(t);
        setMatches(m);
        setNews(n);
        setActivities(a);
      } catch (err) {
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, isAdmin]);

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-white">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/20">
            <Shield className="w-8 h-8 text-white animate-pulse" />
          </div>
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin absolute -bottom-2 -right-2" />
        </div>
        <h2 className="text-sm font-black tracking-widest text-white uppercase mb-2">
          Verifying Administrator Access
        </h2>
        <p className="text-xs text-slate-400 tracking-wider">
          Securing connection to Faryal FC Management Dashboard...
        </p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const handleExcelExport = () => {
    exportToExcel(players, 'FaryalFC_Players');
    exportToExcel(matches, 'FaryalFC_Matches');
    exportToExcel(teams, 'FaryalFC_Teams');
  };

  const completedMatches = matches.filter((m) => m.status === 'completed');
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming');
  const totalGoals = players.reduce((acc, p) => acc + (p.stats?.goals || 0), 0);

  const quickModules = [
    { title: 'SEO & Metadata', icon: Globe, count: 'Rank', link: '/admin/seo', color: 'bg-blue-600', desc: 'Google search tags, sitemap & OG cards' },
    { title: 'Players Squad', icon: Users, count: players.length, link: '/admin/players', color: 'bg-emerald-600', desc: 'Squad roster & statistics' },
    { title: 'Teams & Clubs', icon: Trophy, count: teams.length, link: '/admin/teams', color: 'bg-indigo-600', desc: 'Opponent clubs & logos' },
    { title: 'Matches & Fixtures', icon: Calendar, count: matches.length, link: '/admin/matches', color: 'bg-orange-600', desc: 'Scores, lineups & fixtures' },
    { title: 'Theme Customizer', icon: Palette, count: 'Live', link: '/admin/theme', color: 'bg-purple-600', desc: 'Colors, typography & UI' },
    { title: 'News & Updates', icon: Newspaper, count: news.length, link: '/admin/news', color: 'bg-pink-600', desc: 'Club announcements & press' },
  ];

  return (
    <div className="space-y-8">
      <SEO title="Admin Control Center | Faryal FC" noIndex={true} />
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 mb-3 inline-block">
            {branding.clubName || 'FARYAL FC'} CONTROL CENTER
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white italic tracking-tight uppercase">
            Overview & <span className="text-blue-500">Live Management</span>
          </h1>
          <p className="text-xs text-slate-300 mt-2 max-w-xl leading-relaxed">
            Centralized administrator console. Any changes made to teams, players, matches, themes, or news will instantly sync across the public website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={handleExcelExport}
            className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Download size={14} />
            <span>Export Roster (Excel)</span>
          </button>
          <Link
            to="/admin/theme"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30"
          >
            <Palette size={14} />
            <span>Customize Theme</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Real Squad Members', value: players.length, sub: 'Registered Players' },
          { label: 'Completed Matches', value: completedMatches.length, sub: 'Results Recorded' },
          { label: 'Upcoming Fixtures', value: upcomingMatches.length, sub: 'Scheduled' },
          { label: 'Total Goals Logged', value: totalGoals, sub: 'Season Tally' },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
          >
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{kpi.label}</p>
            <p className="text-3xl md:text-4xl font-black text-white italic tracking-tight my-2">
              {loading ? '-' : kpi.value}
            </p>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {quickModules.map((mod, i) => (
          <motion.div
            key={mod.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Link
              to={mod.link}
              className="group block bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-3xl p-6 transition-all shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${mod.color}/10 text-white`}>
                  <mod.icon className="text-blue-400" size={22} />
                </div>
                <span className="text-2xl font-black text-white/30 italic tracking-tighter">
                  {mod.count}
                </span>
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-tight mb-1 group-hover:text-blue-400 transition-colors">
                {mod.title}
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">{mod.desc}</p>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                Open Manager <ArrowRight size={12} />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Audit */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Activity size={16} />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                Recent Admin Activity
              </h2>
              <p className="text-[10px] text-slate-400">Live feed of actions executed across the system</p>
            </div>
          </div>
          <Link
            to="/admin/activity"
            className="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider"
          >
            View All Logs →
          </Link>
        </div>

        {activities.length === 0 ? (
          <p className="text-xs text-slate-500 font-bold py-6 text-center">
            No administrative activity recorded yet.
          </p>
        ) : (
          <div className="space-y-2">
            {activities.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-black text-white uppercase">{act.action}</span>
                  <span className="text-slate-500 truncate">{act.details}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 shrink-0 font-mono">
                  <Clock size={11} />
                  <span>{act.timestamp ? new Date(act.timestamp).toLocaleTimeString() : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
