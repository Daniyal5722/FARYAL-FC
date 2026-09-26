import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Upload, Trash2, Copy, Check, Filter, Search, Plus } from 'lucide-react';
import { api } from '../../lib/api';
import { MediaItem } from '../../types';
import { useToast } from '../../contexts/ToastContext';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const ManageMedia: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const data = await api.media.getAll();
      setMediaList(data);
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toastError('Please select a valid image file');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const uploadedUrl = await api.upload.image(base64, file.name);

        const newItem = await api.media.create({
          name: file.name,
          url: uploadedUrl,
          category: selectedCategory === 'all' ? 'gallery' : (selectedCategory as any),
          size: file.size,
        });

        setMediaList((prev) => [newItem, ...prev]);
        success('Media file uploaded successfully!');
      } catch (err: any) {
        toastError(err.message || 'Failed to upload media');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    success('Image URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.media.delete(deleteTarget.id);
      setMediaList((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setDeleteTarget(null);
      success('Media file removed from library');
    } catch (err: any) {
      toastError(err.message || 'Failed to delete media');
    }
  };

  const filteredMedia = mediaList.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 mb-2 inline-block">
            Asset Repository
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-tight uppercase">
            Media <span className="text-blue-500">Library</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload, store, and manage images, crests, player portraits, match action shots, and banners.
          </p>
        </div>

        <label className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 cursor-pointer">
          {uploading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload size={15} />
          )}
          <span>Upload Image</span>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Files' },
            { id: 'logo', label: 'Logos' },
            { id: 'player', label: 'Players' },
            { id: 'match', label: 'Matches' },
            { id: 'news', label: 'News' },
            { id: 'gallery', label: 'Gallery' },
            { id: 'background', label: 'Backgrounds' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Loading media library...</p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <ImageIcon size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-xs font-bold uppercase tracking-wider">No media items found</p>
            <p className="text-[11px] text-slate-600 mt-1">Upload images to populate the central repository</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className="group relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
              >
                <div className="aspect-square w-full overflow-hidden bg-slate-900 relative">
                  <img
                    src={item.url || '/logo.png'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item)}
                      className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-lg"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-colors shadow-lg"
                      title="Delete Image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <p className="text-[11px] font-bold text-white truncate">{item.name}</p>
                  <div className="flex items-center justify-between text-[9px] text-slate-500 uppercase font-mono mt-1">
                    <span>{item.category}</span>
                    <span>{item.size || 'Image'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Media File?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Any component referencing this URL may display a broken image.`}
        confirmText="Delete File"
        isDangerous={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
