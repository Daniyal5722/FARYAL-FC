import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Heart, Target } from 'lucide-react';
import { SEO } from '../components/SEO';

export const About: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen">
      <SEO pageKey="about" />
      <div className="max-w-7xl mx-auto">
        {/* Story Section */}
        <div className="flex flex-col lg:flex-row gap-16 items-center mb-32">
          <div className="lg:w-1/2">
            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Our Story</span>
            <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none mb-8">
              EST. <span className="text-slate-800">2024</span>
            </h1>
            <div className="space-y-6 text-slate-500 text-lg font-medium leading-relaxed">
              <p>
                Faryal FC was born from a simple dream: to create a football club that represents the passion, resilience, and unity of Karachi. What started as a local neighborhood team has grown into one of the most respected amateur clubs in the region.
              </p>
              <p>
                Our philosophy is simple: Play with passion, play as one. We believe that football is more than just a game; it's a vehicle for community development, character building, and excellence.
              </p>
              <p>
                From our state-of-the-art facilities at Faryal FC Ground to our dedicated youth academy programs, we are building a legacy that goes beyond the ninety minutes on the pitch.
              </p>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=1200&auto=format&fit=crop"
                alt="Faryal FC History"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-blue-600 p-8 rounded-2xl shadow-xl shadow-blue-600/20 max-w-xs">
              <p className="text-4xl font-black text-white italic tracking-tighter mb-2">100%</p>
              <p className="text-xs font-black text-blue-100 uppercase tracking-widest leading-tight">DEDICATED TO THE BEAUTIFUL GAME</p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {[
            { title: 'PASSION', desc: 'Every sprint, every tackle, and every goal is fueled by our love for football.', icon: Heart },
            { title: 'UNITY', desc: 'We win together, we lose together. One team, one heartbeat.', icon: Users },
            { title: 'EXCELLENCE', desc: 'Striving for perfection in every training session and match.', icon: Trophy },
            { title: 'DISCIPLINE', desc: 'Commitment to the game and respect for the rules and opponents.', icon: Target },
          ].map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center mx-auto mb-6 text-blue-500">
                <value.icon size={32} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">{value.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Vision Section */}
        <div className="bg-blue-600 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-slate-950 rounded-full blur-[100px]" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-8">
              OUR <span className="text-blue-200">VISION</span>
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 font-bold leading-relaxed mb-12">
              "To become the benchmark for professional football development in Pakistan, fostering a community where talent meets opportunity and dreams become reality."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-white/30" />
              <span className="text-sm font-black text-white uppercase tracking-[0.4em]">FARYAL FC MANAGEMENT</span>
              <div className="h-px w-12 bg-white/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
