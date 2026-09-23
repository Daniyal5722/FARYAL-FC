import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, Loader2, Trophy, CheckCircle2 } from 'lucide-react';
import { useClubSettings } from '../hooks/useClubSettings';
import { SEO } from '../components/SEO';

export const Contact: React.FC = () => {
  const { settings, loading } = useClubSettings();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (loading || !settings) {
    return (
      <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen">
      <SEO pageKey="contact" />
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
              <a href={`mailto:${settings.contact.email}`} className="flex items-center gap-6 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">General Inquiry</p>
                  <p className="text-xl font-black text-white italic tracking-tighter uppercase group-hover:text-blue-400 transition-colors">{settings.contact.email}</p>
                </div>
              </a>

              <a href={`tel:${settings.contact.phone.replace(/\s+/g, '')}`} className="flex items-center gap-6 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Official Phone</p>
                  <p className="text-xl font-black text-white italic tracking-tighter uppercase group-hover:text-blue-400 transition-colors">{settings.contact.phone}</p>
                </div>
              </a>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Home Ground</p>
                  <p className="text-xl font-black text-white italic tracking-tighter uppercase">{settings.ground.address}</p>
                </div>
              </div>

              <a href={settings.socials.whatsapp || 'https://wa.me/923000000000'} target="_blank" rel="noreferrer" className="flex items-center gap-6 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-500 transition-all">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">WhatsApp</p>
                  <p className="text-xl font-black text-white italic tracking-tighter uppercase group-hover:text-emerald-400 transition-colors">Chat on WhatsApp</p>
                </div>
              </a>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-1/2">
            <div className="p-8 md:p-12 rounded-[2rem] bg-slate-900 border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Trophy size={120} className="text-white" />
              </div>

              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 relative z-10">
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">MESSAGE SENT!</h3>
                  <p className="text-slate-400 font-medium mb-8 leading-relaxed max-w-sm mx-auto">
                    Thank you for contacting Faryal FC. Our team will get back to you shortly.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' }); }}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-all"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-8 relative z-10">SEND A MESSAGE</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Email Address</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Subject</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all appearance-none"
                      >
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
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-xl font-black text-lg transition-all shadow-xl shadow-blue-600/25 group active:scale-[0.99]"
                    >
                      SEND MESSAGE
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
