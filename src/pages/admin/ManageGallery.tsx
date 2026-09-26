import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Image as ImageIcon, Save, X, ExternalLink, Upload, Search, Filter } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  category: string;
}

export const ManageGallery: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<GalleryItem>>({
    url: '',
    caption: '',
    category: 'Match',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = (await api.gallery.getAll()) || [];
      setItems(data);
    } catch (err: any) {
      toastError(err.message || 'Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const url = await api.upload.image(reader.result as string, file.name);
        setFormData((prev) => ({ ...prev, url }));
        success('Gallery image uploaded!');
      } catch (err: any) {
        toastError(err.message || 'Upload failed');
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url?.trim()) return;

    setSaving(true);
    try {
      await api.gallery.create(formData);
      setIsAdding(false);
      setFormData({ url: '', caption: '', category: 'Match' });
      success('Image added to gallery!');
      fetchData();
    } catch (err: any) {
      toastError(err.message || 'Failed to save image');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.gallery.delete(deleteTarget.id);
      success('Image removed from gallery');
      setDeleteTarget(null);
      fetchData();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete image');
    }
  };

  const filteredItems = items.filter(
    (item) => categoryFilter === 'all' || item.category === categoryFilter
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 mb-2 inline-block">
            Visual Media
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-tight uppercase">
            Club <span className="text-blue-500">Gallery</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload and organize match day photography, training shots, squad celebrations, and fan moments.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30"
        >
          <Plus size={16} />
          <span>Add Photo</span>
        </button>
      </div>

      {/* Categories Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {['all', 'Match', 'Training', 'Club', 'Fans'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              categoryFilter === cat
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat === 'all' ? 'All Photos' : cat}
          </button>
        ))}
      </div>

      {/* Photos Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Loading gallery photos...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <ImageIcon size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-xs font-bold uppercase tracking-wider">No photos in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden group relative flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
              >
                <div className="aspect-square relative overflow-hidden bg-slate-900">
                  <img
                    src={item.url || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop'}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                      title="View Full Size"
                    >
                      <ExternalLink size={14} />
                    </a>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-colors"
                      title="Delete Photo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <p className="text-xs font-black text-white uppercase italic truncate">
                    {item.caption || 'Faryal FC'}
                  </p>
                  <span className="text-[9px] font-black uppercase tracking-wider text-blue-400">
                    {item.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Photo Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <h2 className="text-lg font-black text-white uppercase tracking-tight">Add Photo to Gallery</h2>
                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                    Image File / URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={formData.url || ''}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="Image URL or upload"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-blue-500"
                    />
                    <label className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                      <Upload size={13} />
                      <span>{uploadingImage ? '...' : 'Upload'}</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                    Caption / Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.caption || ''}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    placeholder="e.g. Squad celebrating victory at home ground"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1.5">
                    Photo Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-blue-500"
                  >
                    <option value="Match">Match Day</option>
                    <option value="Training">Training Session</option>
                    <option value="Club">Club Life & Heritage</option>
                    <option value="Fans">Fans & Community</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 font-bold text-xs uppercase hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Add to Gallery'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Photo?"
        message={`Are you sure you want to remove this photo from the public gallery?`}
        confirmText="Delete Photo"
        isDangerous={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
