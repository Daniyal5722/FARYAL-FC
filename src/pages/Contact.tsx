import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, Loader2 } from 'lucide-react';
import { useClubSettings } from '../hooks/useClubSettings';

export const Contact: React.FC = () => {
  const { settings, loading } = useClubSettings();

  if (loading || !settings) {
    return (
      <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Info Side */}
          <div className="lg:w-1/2">
            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Get In Touch</span>
            <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none mb-8">
              CONTACT <span className="text-slate-800">US</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed mb-12 max-w-md">
              Have questions about joining Faryal FC, match schedules, or partnership opportunities? Reach out to us.
            </p>

            <div className="space-y-8">
              {[
                { label: 'General Inquiry', value: settings.contact.email, icon: Mail },
                { label: 'Official Phone', value: settings.contact.phone, icon: Phone },
                { label: 'Home Ground', value: settings.ground.address, icon: MapPin },
                { label: 'WhatsApp', value: settings.socials.whatsapp || 'Contact Support', icon: MessageCircle },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-xl font-black text-white italic tracking-tighter uppercase">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-1/2">
            <div className="p-8 md:p-12 rounded-[2rem] bg-slate-900 border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Trophy size={120} className="text-white" />
              </div>
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-8 relative z-10">SEND A MESSAGE</h3>
              
              <form className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Full Name</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Email Address</label>
                    <input
                      type="email"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Subject</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all appearance-none">
                    <option>General Inquiry</option>
                    <option>Player Trials</option>
                    <option>Membership</option>
                    <option>Sponsorship</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Message</label>
                  <textarea
                    rows={5}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-xl font-black text-lg transition-all shadow-xl shadow-blue-600/25 group"
                >
                  SEND MESSAGE
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Import for Form Side Icon
import { Trophy } from 'lucide-react';
