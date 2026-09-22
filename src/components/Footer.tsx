import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { useClubSettings } from '../hooks/useClubSettings';

export const Footer: React.FC = () => {
  const { settings } = useClubSettings();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              {settings?.logo ? (
                <img src={settings.logo} alt={settings.name} className="w-10 h-10 object-contain" />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg transform rotate-3">
                  <Trophy className="text-white w-6 h-6" />
                </div>
              )}
              <span className="text-2xl font-black tracking-tighter text-white">
                FARYAL <span className="text-blue-500">FC</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Faryal Football Club is dedicated to excellence, teamwork, and the passion for the beautiful game. Founded with a vision to nurture local talent and compete at the highest level.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Squad', 'Fixtures', 'Results', 'Goals', 'Gallery', 'Ground'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase()}`} className="text-slate-500 hover:text-blue-500 transition-colors text-sm font-bold uppercase tracking-wider">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8">Support</h4>
            <ul className="space-y-4">
              {['Contact Us', 'Member Portal', 'Membership', 'Donations', 'News', 'FAQs', 'Privacy Policy'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-slate-500 hover:text-blue-500 transition-colors text-sm font-bold uppercase tracking-wider">
                    {link}
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
                <MapPin className="text-blue-500 shrink-0 mt-1" size={20} />
                <p className="text-slate-500 text-sm font-medium">{settings?.contact.address || 'Karachi, Pakistan'}</p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="text-blue-500 shrink-0" size={20} />
                <p className="text-slate-500 text-sm font-medium">{settings?.contact.phone || '+92 300 0000000'}</p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="text-blue-500 shrink-0" size={20} />
                <p className="text-slate-500 text-sm font-medium">{settings?.contact.email || 'info@faryalfc.com'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-900 text-center">
          <p className="text-slate-600 text-xs font-bold uppercase tracking-[0.3em]">
            © 2026 FARYAL FOOTBALL CLUB. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};
