import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Trophy, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { PWAInstallButton } from './PWAInstallButton';
import { GlobalSearch } from './GlobalSearch';
import { useClubSettings } from '../hooks/useClubSettings';

const NAV_ITEMS = [
  { name: 'Home', path: '/' },
  { name: 'Team', path: '/team' },
  { name: 'Standings', path: '/standings' },
  { name: 'Matches', path: '/matches' },
  { name: 'Formation', path: '/formation' },
  { name: 'Goals', path: '/goals' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { settings, loading } = useClubSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  if (loading || !settings) return null;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6',
        isScrolled ? 'py-3' : 'py-6'
      )}
    >
      <div className={cn(
        "max-w-7xl mx-auto rounded-[2rem] px-8 py-4 flex items-center justify-between transition-all duration-500 border",
        isScrolled 
          ? "bg-slate-950/80 backdrop-blur-xl border-slate-800/50 shadow-2xl" 
          : "bg-transparent border-transparent"
      )}>
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
            <img 
              src={settings.logo || "/logo.png"} 
              alt={settings.name} 
              className="w-10 h-10 object-contain relative z-10 transition-transform group-hover:scale-110" 
            />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">
            FARYAL <span className="text-slate-700 group-hover:text-blue-500 transition-colors">FC</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {NAV_ITEMS.slice(0, 5).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-white',
                  location.pathname === item.path ? 'text-blue-500' : 'text-slate-500'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-slate-800" />

          <div className="flex items-center gap-6">
            <GlobalSearch />
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95"
            >
              PORTAL
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-white p-2 hover:bg-white/5 rounded-xl transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-slate-950 lg:hidden flex flex-col items-center justify-center gap-8"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'text-2xl font-black uppercase tracking-widest transition-colors hover:text-blue-500',
                  location.pathname === item.path ? 'text-blue-500' : 'text-slate-300'
                )}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-600/20"
            >
              MEMBER PORTAL
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
