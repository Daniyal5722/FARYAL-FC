import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, LogIn, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useThemeSettings } from '../contexts/ThemeSettingsContext';

export const MaintenancePage: React.FC = () => {
  const { maintenance, branding, settings } = useThemeSettings();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-600/30">
          <Shield size={40} className="text-white" />
        </div>

        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider mb-4">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          Under Scheduled Maintenance
        </span>

        <h1 className="text-3xl md:text-4xl font-black text-white italic tracking-tight uppercase mb-4">
          {branding.clubName || 'FARYAL FC'}
        </h1>

        <p className="text-sm text-slate-300 font-medium leading-relaxed mb-8">
          {maintenance.message ||
            'Our portal is currently undergoing scheduled performance enhancements and updates. We apologize for the inconvenience and will be back shortly.'}
        </p>

        {maintenance.expectedBackTime && (
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 mb-8 bg-slate-950/60 py-3 px-4 rounded-xl border border-slate-800">
            <Clock size={16} className="text-blue-400" />
            <span>Estimated Return: <strong className="text-white">{maintenance.expectedBackTime}</strong></span>
          </div>
        )}

        <div className="pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
            {settings.contact?.email && (
              <a href={`mailto:${settings.contact.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Mail size={14} className="text-blue-400" />
                <span>{settings.contact.email}</span>
              </a>
            )}
            {settings.contact?.phone && (
              <a href={`tel:${settings.contact.phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone size={14} className="text-blue-400" />
                <span>{settings.contact.phone}</span>
              </a>
            )}
          </div>

          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
            >
              <LogIn size={13} />
              <span>Admin Portal Access</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
