import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Palette,
  Shield,
  Layout,
  Navigation as NavIcon,
  Users,
  Trophy,
  Calendar,
  Newspaper,
  Image as ImageIcon,
  MapPin,
  Globe,
  Settings,
  Database,
  Activity,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Search,
  ChevronRight,
  Sparkles,
  Award,
  Layers
} from 'lucide-react';
import { useFirebase } from '../../contexts/FirebaseContext';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { AdminSearchModal } from './AdminSearchModal';
import { useThemeSettings } from '../../contexts/ThemeSettingsContext';

interface NavGroup {
  title: string;
  items: {
    label: string;
    path: string;
    icon: React.ReactNode;
    badge?: string;
  }[];
}

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin } = useFirebase();
  const { branding, maintenance } = useThemeSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navGroups: NavGroup[] = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
        { label: 'Activity Log', path: '/admin/activity', icon: <Activity size={18} /> },
      ],
    },
    {
      title: 'APPEARANCE & THEME',
      items: [
        { label: 'Theme Customizer', path: '/admin/theme', icon: <Palette size={18} />, badge: 'Core' },
        { label: 'Branding & Logo', path: '/admin/branding', icon: <Shield size={18} /> },
        { label: 'Homepage Sections', path: '/admin/homepage', icon: <Layout size={18} /> },
        { label: 'Navigation Menu', path: '/admin/navigation', icon: <NavIcon size={18} /> },
      ],
    },
    {
      title: 'FOOTBALL OPERATIONS',
      items: [
        { label: 'Players Squad', path: '/admin/players', icon: <Users size={18} /> },
        { label: 'Teams & Clubs', path: '/admin/teams', icon: <Shield size={18} /> },
        { label: 'Matches & Scores', path: '/admin/matches', icon: <Calendar size={18} /> },
        { label: 'Match Formation', path: '/admin/formation', icon: <Layers size={18} /> },
        { label: 'League Standings', path: '/admin/standings', icon: <Trophy size={18} /> },
      ],
    },
    {
      title: 'CONTENT & MEDIA',
      items: [
        { label: 'News & Updates', path: '/admin/news', icon: <Newspaper size={18} /> },
        { label: 'Media Library', path: '/admin/media', icon: <ImageIcon size={18} /> },
        { label: 'Gallery', path: '/admin/gallery', icon: <ImageIcon size={18} /> },
        { label: 'Trophies & Honors', path: '/admin/trophies', icon: <Award size={18} /> },
      ],
    },
    {
      title: 'SYSTEM & SETTINGS',
      items: [
        { label: 'Ground & Location', path: '/admin/location', icon: <MapPin size={18} /> },
        { label: 'Social & Contact', path: '/admin/contact', icon: <Globe size={18} /> },
        { label: 'SEO & Metadata', path: '/admin/seo', icon: <Globe size={18} /> },
        { label: 'Website Settings', path: '/admin/settings', icon: <Settings size={18} /> },
        { label: 'Backup & Restore', path: '/admin/backup', icon: <Database size={18} /> },
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const currentItem = navGroups
    .flatMap((g) => g.items)
    .find((item) => item.path === location.pathname);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Search Modal */}
      <AdminSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-900 border-r border-slate-800/80 sticky top-0 h-screen shrink-0 z-30">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-white tracking-wider uppercase">
                  {branding.shortName || 'FARYAL FC'}
                </span>
                <span className="text-[10px] font-black bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded tracking-widest uppercase">
                  CMS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Control Center
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {navGroups.map((group) => (
            <div key={group.title}>
              <span className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase px-3 mb-2 block">
                {group.title}
              </span>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={isActive ? 'text-white' : 'text-slate-400'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-800 text-blue-400 border border-blue-500/20'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <ExternalLink size={14} />
            <span>View Public Website</span>
          </Link>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xs shrink-0">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.email}</p>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  Admin Verified
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 max-w-[85vw] bg-slate-900 border-r border-slate-800 h-full flex flex-col z-10"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-wider">
                      Faryal FC CMS
                    </h2>
                    <p className="text-[10px] text-slate-400">Admin Control Center</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {navGroups.map((group) => (
                  <div key={group.title}>
                    <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase px-3 mb-2 block">
                      {group.title}
                    </span>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                              isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {item.icon}
                              <span>{item.label}</span>
                            </div>
                            {item.badge && (
                              <span className="text-[9px] bg-slate-800 text-blue-400 px-1.5 py-0.5 rounded">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-800 space-y-3">
                <Link
                  to="/"
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs uppercase"
                >
                  <ExternalLink size={14} />
                  <span>Public Site</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold text-xs uppercase"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 min-w-0 text-xs font-bold">
              <span className="text-slate-500 hidden sm:inline">Admin</span>
              <ChevronRight size={14} className="text-slate-600 hidden sm:inline" />
              <span className="text-white truncate font-black uppercase tracking-wider">
                {currentItem?.label || 'Control Center'}
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {maintenance.enabled && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                Maintenance Mode Active
              </span>
            )}

            {/* Quick Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-medium transition-colors"
            >
              <Search size={14} className="text-slate-400" />
              <span className="hidden sm:inline">Search CMS</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 bg-slate-900 rounded text-[10px] text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* View Live Site */}
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-xs font-bold uppercase tracking-wider transition-colors border border-blue-500/20"
            >
              <ExternalLink size={13} />
              <span>Live Site</span>
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
