import React from 'react';
import { motion } from 'framer-motion';
import { Image, Camera } from 'lucide-react';

const CATEGORIES = ['ALL', 'MATCHES', 'TRAINING', 'TEAM', 'STADIUM', 'CELEBRATIONS'];

const GALLERY_IMAGES: { url: string; category: string }[] = [];

export const Gallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState('ALL');

  const filteredImages = GALLERY_IMAGES.filter(img => 
    activeCategory === 'ALL' || img.category === activeCategory
  );

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="text-center md:text-left">
            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Match Moments</span>
            <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">
              PHOTO <span className="text-slate-800">GALLERY</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest transition-all border ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20'
                    : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
            >
              <img
                src={`${img.url}?q=80&w=800&auto=format&fit=crop`}
                alt="Gallery"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <div className="flex items-center gap-2">
                  <Camera className="text-blue-500" size={16} />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{img.category}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <Image className="mx-auto text-slate-700 mb-4" size={48} />
            <p className="text-slate-500 font-bold uppercase tracking-widest">No images found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
