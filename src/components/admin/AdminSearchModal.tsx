import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Users, Trophy, Newspaper, Settings, Palette, Calendar, MapPin, Image as ImageIcon, Layout, Navigation as NavIcon, Globe, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Player, Match, News, Team } from '../../types';

interface AdminSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSearchModal: React.FC<AdminSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      api.players.getAll().then(setPlayers).catch(() => {});
      api.matches.getAll().then(setMatches).catch(() => {});
      api.news.getAll().then(setNews).catch(() => {});
      api.teams.getAll().then(setTeams).catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // toggle handled by parent or shortcut
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const adminNavItems = [
    { label: 'Theme Customizer', path: '/admin/theme', icon: <Palette size={16} /> },
    { label: 'Branding & Logo', path: '/admin/branding', icon: <Shield size={16} /> },
    { label: 'Homepage Sections', path: '/admin/homepage', icon: <Layout size={16} /> },
    { label: 'Navigation Menu', path: '/admin/navigation', icon: <NavIcon size={16} /> },
    { label: 'Players Squad', path: '/admin/players', icon: <Users size={16} /> },
    { label: 'Teams & Clubs', path: '/admin/teams', icon: <Trophy size={16} /> },
    { label: 'Matches & Scores', path: '/admin/matches', icon: <Calendar size={16} /> },
    { label: 'League Standings', path: '/admin/standings', icon: <Trophy size={16} /> },
    { label: 'News & Articles', path: '/admin/news', icon: <Newspaper size={16} /> },
    { label: 'Media Library', path: '/admin/media', icon: <ImageIcon size={16} /> },
    { label: 'Ground & Location', path: '/admin/location', icon: <MapPin size={16} /> },
    { label: 'Social & Contact', path: '/admin/contact', icon: <Globe size={16} /> },
    { label: 'SEO & Metadata', path: '/admin/seo', icon: <Globe size={16} /> },
    { label: 'Global Settings & Maintenance', path: '/admin/settings', icon: <Settings size={16} /> },
  ];

  const filteredNav = adminNavItems.filter((i) =>
    i.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.position?.toLowerCase().includes(query.toLowerCase())
  );

  const filteredMatches = matches.filter((m) =>
    m.homeTeamName.toLowerCase().includes(query.toLowerCase()) ||
    m.awayTeamName.toLowerCase().includes(query.toLowerCase()) ||
    m.competition?.toLowerCase().includes(query.toLowerCase())
  );

  const filteredNews = news.filter((n) =>
    n.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        <div className="flex items-center px-6 py-4 border-b border-slate-800 gap-3">
          <Search size={20} className="text-blue-500" />
          <input
            type="text"
            autoFocus
            placeholder="Quick search admin sections, players, matches, news..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-sm font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white p-1">
              <X size={16} />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-1 bg-slate-800 rounded-lg text-[10px] text-slate-400 font-mono">
            ESC
          </kbd>
        </div>

        <div className="overflow-y-auto p-4 space-y-6">
          {/* Admin Sections */}
          <div>
            <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase px-3 mb-2 block">
              Control Center Sections
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredNav.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleSelect(item.path)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/80 text-left transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-blue-600/20 text-blue-400 flex items-center justify-center transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Players */}
          {filteredPlayers.length > 0 && (
            <div>
              <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase px-3 mb-2 block">
                Players ({filteredPlayers.length})
              </span>
              <div className="space-y-1">
                {filteredPlayers.slice(0, 5).map((player) => (
                  <button
                    key={player.id}
                    onClick={() => handleSelect('/admin/players')}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/80 text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 text-blue-400 flex items-center justify-center font-bold text-xs">
                        #{player.number ?? '-'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{player.name}</p>
                        <p className="text-[10px] text-slate-400">{player.position || 'Player'}</p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-blue-400">Edit in Squad</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matches */}
          {filteredMatches.length > 0 && (
            <div>
              <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase px-3 mb-2 block">
                Matches ({filteredMatches.length})
              </span>
              <div className="space-y-1">
                {filteredMatches.slice(0, 4).map((match) => (
                  <button
                    key={match.id}
                    onClick={() => handleSelect('/admin/matches')}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/80 text-left transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">
                        {match.homeTeamName} vs {match.awayTeamName}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {match.competition} • {match.date}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-800 px-2 py-1 rounded-md">
                      {match.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* News */}
          {filteredNews.length > 0 && (
            <div>
              <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase px-3 mb-2 block">
                News Articles ({filteredNews.length})
              </span>
              <div className="space-y-1">
                {filteredNews.slice(0, 4).map((article) => (
                  <button
                    key={article.id}
                    onClick={() => handleSelect('/admin/news')}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/80 text-left transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{article.title}</p>
                      <p className="text-[10px] text-slate-400">{article.date} • {article.category}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-blue-400">Manage</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
