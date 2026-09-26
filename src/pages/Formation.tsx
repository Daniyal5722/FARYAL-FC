import React from 'react';
import { FormationPitch } from '../components/FormationPitch';
import { SEO } from '../components/SEO';
import { useThemeSettings } from '../contexts/ThemeSettingsContext';
import { DEFAULT_TACTICAL_PILLARS } from '../data/defaultConfig';
import { Shield, Sparkles } from 'lucide-react';

export const Formation: React.FC = () => {
  const { formation } = useThemeSettings();

  const title = formation?.title || 'MATCH FORMATION';
  const subtitle = formation?.subtitle || 'Tactical Center';
  const description = formation?.description || 'Explore the tactical setups used by Faryal FC. Switch between different formations to see our strategic lineup.';
  const pillars = formation?.tacticalPillars && formation.tacticalPillars.length > 0 
    ? formation.tacticalPillars 
    : DEFAULT_TACTICAL_PILLARS;

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen">
      <SEO pageKey="formation" />
      <div className="max-w-7xl mx-auto text-center">
        <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">
          {subtitle}
        </span>
        <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none mb-4">
          {title.includes(' ') ? (
            <>
              {title.split(' ')[0]} <span className="text-slate-800">{title.split(' ').slice(1).join(' ')}</span>
            </>
          ) : (
            title
          )}
        </h1>
        <p className="text-slate-400 font-medium max-w-2xl mx-auto mb-10 text-sm md:text-base leading-relaxed">
          {description}
        </p>

        {formation?.tacticalNotes && (
          <div className="max-w-3xl mx-auto mb-12 p-4 md:p-6 rounded-2xl bg-blue-950/20 border border-blue-500/30 text-left flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Shield size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block mb-1">
                Head Coach Matchday Directive
              </span>
              <p className="text-xs md:text-sm text-slate-300 font-medium italic leading-relaxed">
                "{formation.tacticalNotes}"
              </p>
            </div>
          </div>
        )}

        <FormationPitch />

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {pillars.map((item, idx) => (
            <div key={item.title || idx} className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 text-xs font-black">
                0{idx + 1}
              </div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">{item.title}</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
