import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Loader2, Image as ImageIcon, Save, X, ExternalLink } from 'lucide-react';
import { api } from '../../lib/api';

interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  category: string;
}

export const ManageGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<GalleryItem>>({
    url: '',
    caption: '',
    category: 'Match'
  });

  const fetchData = async () => {
    try {
      // Using generic collection 'gallery'
      const data = await (api as any).gallery?.getAll() || [];
      setItems(data);
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await (api as any).gallery.create(formData);
      setIsAdding(false);
      setFormData({ url: '', caption: '', category: 'Match' });
      fetchData();
    } catch (err) {
      console.error('Error saving gallery item:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await (api as any).gallery.delete(id);
      fetchData();
    } catch (err) {
      console.error('Error deleting gallery item:', err);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">Visual Assets</span>
            <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
              MANAGE <span className="text-slate-800">GALLERY</span>
            </h1>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
          >
            <Plus size={16} /> Add Image
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden group"
            >
              <div className="aspect-square relative overflow-hidden">
                <img src={item.url} alt={item.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-3 bg-red-600 text-white rounded-full hover:scale-110 transition-transform"
                  >
                    <Trash2 size={20} />
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white text-slate-950 rounded-full hover:scale-110 transition-transform"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
              <div className="p-4">
                <p className="text-white font-bold uppercase italic tracking-tighter truncate">{item.caption}</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{item.category}</p>
              </div>
            </motion.div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full py-24 text-center bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl">
              <ImageIcon className="mx-auto text-slate-800 mb-4" size={48} />
              <p className="text-slate-500 font-bold uppercase tracking-widest">No images in gallery yet.</p>
            </div>
          )}
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 w-full max-w-xl shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Add to Gallery</h2>
                  <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Image URL</label>
                    <input
                      type="text"
                      required
                      value={formData.url}
                      onChange={e => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Caption</label>
                    <input
                      type="text"
                      required
                      value={formData.caption}
                      onChange={e => setFormData({ ...formData, caption: e.target.value })}
                      placeholder="e.g. Training Session - Monday"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all font-medium"
                    >
                      <option value="Match">Match Day</option>
                      <option value="Training">Training</option>
                      <option value="Club">Club Life</option>
                      <option value="Fans">Fans & Community</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all mt-4 flex items-center justify-center gap-2"
                  >
                    <Save size={20} /> Save Image
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
