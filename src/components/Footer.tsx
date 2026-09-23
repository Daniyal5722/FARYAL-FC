import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { useClubSettings } from '../hooks/useClubSettings';
import { DEFAULT_CLUB_SETTINGS } from '../lib/api';

export const Footer: React.FC = () => {
  const { settings: rawSettings } = useClubSettings();
  const settings = rawSettings || DEFAULT_CLUB_SETTINGS;

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Squad', path: '/team' },
    { name: 'Standings', path: '/standings' },
    { name: 'Fixtures & Results', path: '/matches' },
    { name: 'Goals', path: '/goals' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Ground', path: '/ground' },
  ];

  const supportLinks = [
    { name: 'Contact Us', path: '/contact' },
    { name: 'Member Portal', path: '/login' },
    { name: 'Registration', path: '/registration' },
    { name: 'Club News', path: '/news' },
    { name: 'About Club', path: '/about' },
    { name: 'Tactical Setup', path: '/formation' },
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <img src={settings.logo || "/logo.png"} alt={settings.name} className="w-10 h-10 object-contain" />
              <span className="text-2xl font-black tracking-tighter text-white italic uppercase">
                FARYAL <span className="text-blue-500">FC</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
              Faryal Football Club is dedicated to excellence, teamwork, and the passion for the beautiful game. Built with a vision to nurture local talent and compete at the highest level in Karachi.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={settings.socials.facebook || "#"}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href={settings.socials.instagram || "#"}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white hover:border-pink-500 transition-all"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href={settings.socials.whatsapp || "#"}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition-all"
                aria-label="WhatsApp"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-slate-500 hover:text-blue-500 transition-colors text-xs font-black uppercase tracking-wider">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8">Club Links</h4>
            <ul className="space-y-4">
              {supportLinks.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-slate-500 hover:text-blue-500 transition-colors text-xs font-black uppercase tracking-wider">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8">Contact Info</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="text-blue-500 shrink-0 mt-1" size={18} />
                <p className="text-slate-500 text-xs font-bold leading-relaxed">{settings.ground.address}</p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-blue-500 shrink-0" size={18} />
                <a href={`tel:${settings.contact.phone}`} className="text-slate-500 hover:text-white transition-colors text-xs font-bold">{settings.contact.phone}</a>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="text-blue-500 shrink-0" size={18} />
                <a href={`mailto:${settings.contact.email}`} className="text-slate-500 hover:text-white transition-colors text-xs font-bold">{settings.contact.email}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-900 text-center flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
            © 2026 FARYAL FOOTBALL CLUB. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link to="/login" className="hover:text-white transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
