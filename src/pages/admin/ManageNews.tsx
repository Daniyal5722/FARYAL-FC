import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';
import { News } from '../../types';
import { Plus, Edit2, Trash2, X, FileText, Save, Image as ImageIcon, Calendar } from 'lucide-react';

export const ManageNews: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);

  const [formData, setFormData] = useState<Partial<News>>({
    title: '',
    content: '',
    image: '',
    category: 'Club News',
    date: new Date().toISOString().split('T')[0],
    author: 'Admin'
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const data = await api.news.getAll();
      setNews(data);
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: News) => {
    if (item) {
      setEditingNews(item);
      setFormData(item);
    } else {
      setEditingNews(null);
      setFormData({
        title: '',
        content: '',
        image: '',
        category: 'Club News',
        date: new Date().toISOString().split('T')[0],
        author: 'Admin'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNews) {
        await api.news.update(editingNews.id, formData);
      } else {
        await api.news.create(formData);
      }
      setIsModalOpen(false);
      fetchNews();
    } catch (err) {
      console.error('Error saving news:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await api.news.delete(id);
        fetchNews();
      } catch (err) {
        console.error('Error deleting news:', err);
      }
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div>
            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Media Center</span>
            <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
              MANAGE <span className="text-slate-800">NEWS</span>
            </h1>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20"
          >
            <Plus size={20} /> Publish Article
          </button>
        </div>

        {/* News List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all group flex"
            >
              <div className="w-40 h-full bg-slate-950 flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-800">
                    <ImageIcon size={32} />
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest">{item.category}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(item)} className="text-slate-500 hover:text-white"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-slate-500 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
                <h3 className="text-lg font-black text-white uppercase italic tracking-tighter mb-2 line-clamp-2">{item.title}</h3>
                <div className="mt-auto flex items-center gap-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {item.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 overflow-y-auto max-h-[90vh]"
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-8">
                  {editingNews ? 'Edit Article' : 'Publish News'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Title</label>
                      <input
                        required
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Category</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-bold uppercase tracking-widest text-xs outline-none focus:border-blue-500 transition-all"
                      >
                        <option value="Club News">Club News</option>
                        <option value="Match Report">Match Report</option>
                        <option value="Transfer">Transfer</option>
                        <option value="Injury Update">Injury Update</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Featured Image URL</label>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Publication Date</label>
                      <input
                        required
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Article Content</label>
                    <textarea
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all h-64 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20"
                  >
                    <Save size={20} /> {editingNews ? 'Update Article' : 'Publish Article'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
