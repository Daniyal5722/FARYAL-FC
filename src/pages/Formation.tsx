import React from 'react';
import { FormationPitch } from '../components/FormationPitch';
import { SEO } from '../components/SEO';

export const Formation: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen">
      <SEO pageKey="formation" />
      <div className="max-w-7xl mx-auto text-center">
        <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Tactical Center</span>
        <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none mb-4">
          MATCH <span className="text-slate-800">FORMATION</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto mb-16">
          Explore the tactical setups used by Faryal FC. Switch between different formations to see our strategic lineup.
        </p>

        <FormationPitch />

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { title: 'Attacking Philosophy', desc: 'Faryal FC prioritizes high-pressing and fast transitions through technical wingers.' },
            { title: 'Defensive Solidity', desc: 'A disciplined backline focusing on zonal marking and physical dominance in the air.' },
            { title: 'Midfield Vision', desc: 'The engine room focuses on possession retention and quick vertical passes to find gaps.' },
          ].map((item) => (
            <div key={item.title} className="p-8 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">{item.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
