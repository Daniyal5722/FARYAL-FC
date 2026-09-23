import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag, Loader2, Share2 } from 'lucide-react';
import { api } from '../lib/api';
import { News } from '../types';
import { formatDate } from '../lib/utils';
import { SEO } from '../components/SEO';

export const NewsArticle: React.FC = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchArticle = async () => {
      try {
        const news = await api.news.getAll();
        const found = news.find(n => n.id === id);
        setArticle(found || null);
      } catch (err) {
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen text-center">
        <SEO title="Article Not Found | Faryal FC News" noIndex={true} />
        <h1 className="text-white text-4xl font-black italic tracking-tighter uppercase mb-4">ARTICLE NOT FOUND</h1>
        <Link to="/news" className="text-blue-500 font-bold uppercase tracking-widest text-xs hover:underline">
          BACK TO NEWS
        </Link>
      </div>
    );
  }

  const newsArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: [article.image],
    datePublished: article.date,
    dateModified: article.date,
    author: [{
      '@type': 'Person',
      name: article.author || 'Faryal FC Media',
    }],
    publisher: {
      '@type': 'Organization',
      name: 'Faryal FC',
      logo: {
        '@type': 'ImageObject',
        url: 'https://faryal-fc.vercel.app/logo.png',
      },
    },
    description: article.summary || article.content?.slice(0, 160),
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen">
      <SEO
        title={`${article.title} | Faryal FC News`}
        description={article.summary || article.content?.slice(0, 155)}
        ogImage={article.image}
        ogType="article"
        structuredData={newsArticleSchema}
      />
      <div className="max-w-4xl mx-auto">
        <Link to="/news" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors font-bold uppercase tracking-widest text-xs mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK TO NEWS
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="bg-blue-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest inline-block mb-6 shadow-lg shadow-blue-600/20">
            {article.category}
          </span>

          <h1 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-tight mb-8">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-slate-500 text-xs font-black uppercase tracking-widest mb-12 pb-8 border-b border-slate-800">
            <span className="flex items-center gap-2"><Calendar size={14} className="text-blue-500" /> {formatDate(article.date)}</span>
            {article.author && <span className="flex items-center gap-2"><User size={14} className="text-blue-500" /> {article.author}</span>}
          </div>

          <div className="aspect-[16/9] rounded-3xl overflow-hidden border border-slate-800 mb-12 shadow-2xl">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop';
              }}
            />
          </div>

          <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed space-y-6 font-medium">
            <p>{article.content}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
