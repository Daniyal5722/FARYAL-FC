import React from 'react';
import { motion } from 'framer-motion';
import { GROUND } from '../data/mockData';
import { MapPin, Users, Zap, Wind, Navigation, ExternalLink, Loader2 } from 'lucide-react';
import { useClubSettings } from '../hooks/useClubSettings';

export const Ground: React.FC = () => {
  const { settings, loading } = useClubSettings();

  const openDirections = () => {
    if (!settings) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${settings.ground.latitude},${settings.ground.longitude}`;
    window.open(url, '_blank');
  };

  if (loading || !settings) {
    return (
      <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
      </div>
    );
  }

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${settings.ground.latitude},${settings.ground.longitude}&zoom=16`;

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Info Side */}
          <div className="lg:w-1/2">
            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Our Fortress</span>
            <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none mb-8">
              FARYAL <span className="text-slate-800">GROUND</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed mb-12">
              {GROUND.description}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-12">
              {[
                { label: 'Capacity', value: GROUND.capacity, icon: Users },
                { label: 'Surface', value: GROUND.surface, icon: Wind },
                { label: 'Floodlights', value: 'Pro Series', icon: Zap },
                { label: 'Location', value: 'Karachi', icon: MapPin },
              ].map((item) => (
                <div key={item.label} className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-3 mb-4 text-blue-500">
                    <item.icon size={20} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</p>
                  </div>
                  <p className="text-2xl font-black text-white italic tracking-tighter uppercase">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-black uppercase tracking-widest text-sm mb-6">Facilities</h3>
              <div className="flex flex-wrap gap-2">
                {GROUND.facilities.map((f: string) => (
                  <span key={f} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {f}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-12">
              <button
                onClick={openDirections}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-blue-600/25 group active:scale-95"
              >
                GET DIRECTIONS
                <Navigation className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>

          {/* Map Side */}
          <div className="lg:w-1/2 space-y-8">
            <div className="aspect-square w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 relative">
              <iframe
                title="Faryal FC Ground Map"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={mapUrl}
                allowFullScreen
              />

              {/* Decorative Map UI Overlay */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                <div className="bg-slate-950/80 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center gap-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">OFFICIAL HOME GROUND</span>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-600/30">
                  <MapPin className="text-blue-500" />
                </div>
                <div>
                  <h4 className="text-white font-black uppercase italic tracking-tighter">OFFICIAL ADDRESS</h4>
                  <p className="text-slate-500 text-sm font-medium">{settings.ground.address}</p>
                </div>
              </div>
              <a
                href={settings.ground.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-blue-500 font-black uppercase tracking-[0.2em] text-[10px] hover:underline"
              >
                OPEN PIN IN GOOGLE MAPS <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
