import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';
import { GlobalSearch } from './GlobalSearch';
import { useClubSettings } from '../hooks/useClubSettings';
import { DEFAULT_CLUB_SETTINGS } from '../lib/api';

const NAV_ITEMS = [
  { name: 'Home', path: '/' },
  { name: 'Team', path: '/team' },
  { name: 'Standings', path: '/standings' },
  { name: 'Matches', path: '/matches' },
  { name: 'Formation', path: '/formation' },
  { name: 'Goals', path: '/goals' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'News', path: '/news' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { settings: rawSettings } = useClubSettings();
  const settings = rawSettings || DEFAULT_CLUB_SETTINGS;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-6',
        isScrolled ? 'py-2 md:py-3' : 'py-4 md:py-6'
      )}
    >
      <div className={cn(
        "max-w-7xl mx-auto rounded-[2rem] px-6 md:px-8 py-3 md:py-4 flex items-center justify-between transition-all duration-500 border",
        isScrolled 
          ? "bg-slate-950/85 backdrop-blur-xl border-slate-800/80 shadow-2xl shadow-black/50" 
          : "bg-slate-950/40 backdrop-blur-md border-slate-800/30"
      )}>
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
            <img 
              src={settings.logo || "/logo.png"} 
              alt={settings.name} 
              className="w-9 h-9 md:w-10 md:h-10 object-contain relative z-10 transition-transform group-hover:scale-110" 
            />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic leading-none">
            FARYAL <span className="text-slate-600 group-hover:text-blue-500 transition-colors">FC</span>
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <div className="flex items-center gap-4 xl:gap-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'text-[10px] xl:text-[11px] font-black uppercase tracking-[0.15em] transition-all hover:text-white',
                  location.pathname === item.path ? 'text-blue-500' : 'text-slate-400'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-slate-800" />

          <div className="flex items-center gap-4">
            <GlobalSearch />
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95"
            >
              PORTAL
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <GlobalSearch />
          <button
            className="text-white p-2 hover:bg-white/5 rounded-xl transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-2xl lg:hidden flex flex-col p-8 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-12">
              <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                <img src={settings.logo || "/logo.png"} alt={settings.name} className="w-10 h-10 object-contain" />
                <span className="text-2xl font-black text-white uppercase italic tracking-tighter">FARYAL FC</span>
              </Link>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-2">
                <X size={28} />
              </button>
            </div>

            <div className="flex flex-col gap-6 my-auto">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'text-3xl font-black uppercase tracking-tighter italic transition-colors hover:text-blue-500',
                    location.pathname === item.path ? 'text-blue-500' : 'text-slate-300'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col gap-4">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20"
              >
                MEMBER PORTAL
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
