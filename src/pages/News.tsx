import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, User, ArrowRight, Loader2, Tag } from 'lucide-react';
import { api } from '../lib/api';
import { News } from '../types';
import { formatDate } from '../lib/utils';
import { SEO } from '../components/SEO';

export const NewsPage: React.FC = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await api.news.getAll();
        setNewsList(data);
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const categories = ['ALL', ...Array.from(new Set(newsList.map(n => n.category)))];

  const filteredNews = newsList.filter(article => 
    activeCategory === 'ALL' || article.category.toUpperCase() === activeCategory.toUpperCase()
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
      <SEO pageKey="news" />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="text-center md:text-left">
            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Inside Faryal FC</span>
            <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">
              CLUB <span className="text-slate-800">NEWS</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all border ${
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

        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredNews.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden hover:border-blue-500 transition-all duration-500 flex flex-col"
              >
                <div className="aspect-[16/10] relative overflow-hidden bg-slate-950">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">
                      <span className="flex items-center gap-1.5"><Calendar size={12} className="text-blue-500" /> {formatDate(article.date)}</span>
                      {article.author && <span className="flex items-center gap-1.5"><User size={12} className="text-blue-500" /> {article.author}</span>}
                    </div>

                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4 leading-tight group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h2>

                    <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 line-clamp-3">
                      {article.content}
                    </p>
                  </div>

                  <Link 
                    to={`/news/${article.id}`} 
                    className="inline-flex items-center gap-3 text-white font-black text-xs uppercase tracking-[0.2em] group/btn hover:text-blue-400 transition-colors pt-4 border-t border-slate-800/80"
                  >
                    READ FULL ARTICLE <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform text-blue-500" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center">
            <Newspaper className="mx-auto text-slate-700 mb-4" size={48} />
            <p className="text-slate-500 font-bold uppercase tracking-widest">No articles found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
