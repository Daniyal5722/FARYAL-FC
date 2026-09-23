import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Camera, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { GalleryItem } from '../types';
import { SEO } from '../components/SEO';

const CATEGORIES = ['ALL', 'MATCHES', 'TRAINING', 'TEAM', 'STADIUM', 'CELEBRATIONS'];

const DEFAULT_GALLERY: { url: string; category: string; caption?: string }[] = [
  {
    url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2",
    category: "MATCHES",
    caption: "Karachi Elite League Derby Victory"
  },
  {
    url: "https://images.unsplash.com/photo-1517466787929-bc90951d0974",
    category: "TRAINING",
    caption: "Tactical sessions under the floodlights"
  },
  {
    url: "https://images.unsplash.com/photo-1556056504-5c7696c4c28d",
    category: "STADIUM",
    caption: "Faryal FC Ground matchday atmosphere"
  },
  {
    url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
    category: "CELEBRATIONS",
    caption: "Team celebrating crucial opening goal"
  },
  {
    url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20",
    category: "TEAM",
    caption: "Official squad pre-match huddle"
  },
  {
    url: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6",
    category: "MATCHES",
    caption: "Dynamic action shot during league clash"
  },
  {
    url: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d",
    category: "STADIUM",
    caption: "Aerial view of Faryal FC home pitch"
  },
  {
    url: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c",
    category: "CELEBRATIONS",
    caption: "Fans cheering at the final whistle"
  }
];

export const Gallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [items, setItems] = useState<{ url: string; category: string; caption?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await api.gallery.getAll();
        if (data && data.length > 0) {
          setItems(data.map(item => ({
            url: item.url,
            category: (item.category || 'MATCHES').toUpperCase(),
            caption: item.caption
          })));
        } else {
          setItems(DEFAULT_GALLERY);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
        setItems(DEFAULT_GALLERY);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filteredImages = items.filter(img => 
    activeCategory === 'ALL' || img.category.toUpperCase() === activeCategory
  );

  if (loading) {
    return (
      <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen">
      <SEO pageKey="gallery" />
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03 }}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-slate-800 bg-slate-900 hover:border-blue-500 transition-all"
            >
              <img
                src={`${img.url}?q=80&w=800&auto=format&fit=crop`}
                alt={img.caption || "Gallery"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Camera className="text-blue-500" size={16} />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{img.category}</span>
                </div>
                {img.caption && (
                  <p className="text-xs font-bold text-slate-300 uppercase italic tracking-tight line-clamp-2">{img.caption}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-3xl">
            <ImageIcon className="mx-auto text-slate-700 mb-4" size={48} />
            <p className="text-slate-500 font-bold uppercase tracking-widest">No images found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
