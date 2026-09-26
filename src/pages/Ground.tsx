import React from 'react';
import { motion } from 'framer-motion';
import { GROUND } from '../data/mockData';
import { 
  MapPin, Users, Zap, Wind, Navigation, ExternalLink, Loader2, 
  Shield, CheckCircle2, Compass, Layers, Calendar, Award 
} from 'lucide-react';
import { useClubSettings } from '../hooks/useClubSettings';
import { SEO } from '../components/SEO';

export const Ground: React.FC = () => {
  const { settings, loading } = useClubSettings();

  if (loading || !settings) {
    return (
      <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
      </div>
    );
  }

  const ground = settings.ground || GROUND;
  const lat = ground.latitude || 24.903822;
  const lng = ground.longitude || 67.194202;
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const stadiumName = ground.name || 'Faryal FC Ground';
  const groundImage = (ground as any).image || ground.images?.[0] || '/faryal_stadium_hero.jpg';

  const stadiumSchema = {
    '@context': 'https://schema.org',
    '@type': 'CivicStructure',
    name: stadiumName,
    description: ground.description || GROUND.description,
    image: groundImage,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ground.address || '20-A Main Rd, Model Colony Block 24',
      addressLocality: 'Karachi',
      addressRegion: 'Sindh',
      postalCode: '75080',
      addressCountry: 'PK',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: lat,
      longitude: lng,
    },
    maximumAttendeeCapacity: ground.capacity || 1500,
  };

  const facilitiesList = ground.facilities && ground.facilities.length > 0 
    ? ground.facilities 
    : ['Natural Grass Pitch', 'Floodlights', 'Home & Away Changing Rooms', 'Medical Bay', 'Covered Dugouts', 'Spectator Seating', 'Warm-up Zone', 'Secure Parking'];

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 bg-slate-950 min-h-screen">
      <SEO pageKey="ground" structuredData={stadiumSchema} />
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Hero Ground Banner */}
        <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
          <div className="aspect-[21/9] min-h-[360px] relative overflow-hidden">
            <img
              src={groundImage}
              alt={stadiumName}
              className="w-full h-full object-cover filter brightness-75 contrast-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1600&auto=format&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            
            {/* Overlay Content */}
            <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 backdrop-blur-md">
                  Official Home Fortress
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 backdrop-blur-md">
                  Model Colony, Karachi
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none drop-shadow-lg">
                {stadiumName.split(' ')[0]} <span className="text-blue-500">{stadiumName.split(' ').slice(1).join(' ') || 'GROUND'}</span>
              </h1>
              <p className="text-slate-300 font-medium text-xs sm:text-sm md:text-base max-w-2xl mt-3 line-clamp-2">
                {ground.description || GROUND.description}
              </p>
            </div>
          </div>
        </div>

        {/* Ground Quick Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'Capacity', value: ground.capacity || '1,500', icon: Users, sub: 'Spectators' },
            { label: 'Playing Pitch', value: ground.surface || 'Natural Turf', icon: Wind, sub: 'Natural Grass' },
            { label: 'Floodlighting', value: '800 LUX', icon: Zap, sub: 'Night Matches' },
            { label: 'Pitch Dimensions', value: '105m × 68m', icon: Compass, sub: 'FIFA Regulation' },
          ].map((item) => (
            <div key={item.label} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-3 mb-3 text-blue-500">
                <item.icon size={20} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</p>
              </div>
              <p className="text-xl sm:text-2xl font-black text-white italic tracking-tighter uppercase">{item.value}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Main Grid: Details + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Facilities & Blueprint */}
          <div className="lg:col-span-6 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 block mb-1">
                  Ground Infrastructure
                </span>
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">
                  Stadium Facilities & Amenities
                </h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Faryal FC Ground is fully equipped for professional training sessions, academy development, and competitive Karachi Elite League fixtures.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {facilitiesList.map((f: string) => (
                  <div key={f} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wide truncate">
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pitch & Tactical Ground Specifications */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-black text-white uppercase italic tracking-tight flex items-center gap-2">
                <Layers className="text-blue-500" size={18} />
                Pitch Architecture & Ground Shape
              </h3>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Field Shape & Orientation</p>
                    <p className="text-sm font-black text-white uppercase italic">North-South Alignment (105m × 68m)</p>
                  </div>
                  <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 font-bold">
                    Standard
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Turf Quality</p>
                    <p className="text-sm font-black text-white uppercase italic">Precision-Cut Natural Grass Turf</p>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-bold">
                    Pro Grade
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Sub-Surface Drainage</p>
                    <p className="text-sm font-black text-white uppercase italic">Gravity Perforated Pipe Drainage</p>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 font-bold">
                    All-Weather
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Map & Live Navigation */}
          <div className="lg:col-span-6 space-y-6">
            <div className="aspect-[4/3] w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 relative shadow-2xl">
              <iframe
                title="Faryal FC Ground Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                src={mapUrl}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Decorative Map Overlay Badge */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="bg-slate-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">
                    HOME GROUND COORDINATES
                  </span>
                </div>
              </div>
            </div>

            {/* Official Address & Directions CTA */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-600/30">
                  <MapPin size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Official Venue Address
                  </h4>
                  <p className="text-white text-sm sm:text-base font-bold mt-1 leading-snug">
                    {ground.address}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">
                    GPS: {lat.toFixed(6)}, {lng.toFixed(6)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/30 active:scale-95 text-center"
                >
                  <Navigation size={15} />
                  <span>Get Driving Directions</span>
                </a>

                {ground.mapsUrl && (
                  <a
                    href={ground.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors text-center"
                  >
                    <span>Google Maps Pin</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
