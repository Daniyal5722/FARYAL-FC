import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation as NavIcon, Plus, Save, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Edit2, Check, X } from 'lucide-react';
import { useThemeSettings } from '../../contexts/ThemeSettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { NavigationItem } from '../../types';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const ManageNavigation: React.FC = () => {
  const { navigation, updateSettings } = useThemeSettings();
  const { success, error: toastError } = useToast();

  const [items, setItems] = useState<NavigationItem[]>(
    [...navigation].sort((a, b) => a.order - b.order)
  );
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ label: string; url: string }>({ label: '', url: '' });

  // Add Item Modal/Form
  const [newItem, setNewItem] = useState<{ label: string; url: string }>({ label: '', url: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);

    const reordered = newItems.map((item, idx) => ({ ...item, order: idx + 1 }));
    setItems(reordered);
  };

  const toggleVisibility = (id: string) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item))
    );
  };

  const handleStartEdit = (item: NavigationItem) => {
    setEditingId(item.id);
    setEditForm({ label: item.label, url: item.url });
  };

  const handleSaveEdit = (id: string) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, label: editForm.label, url: editForm.url } : item))
    );
    setEditingId(null);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.label.trim() || !newItem.url.trim()) return;

    const id = `nav-${Date.now()}`;
    const item: NavigationItem = {
      id,
      label: newItem.label.trim(),
      url: newItem.url.trim(),
      visible: true,
      order: items.length + 1,
    };

    setItems([...items, item]);
    setNewItem({ label: '', url: '' });
    setIsAdding(false);
    success(`Added "${item.label}" to navigation list`);
  };

  const handleDeleteItem = () => {
    if (!deleteTarget) return;
    setItems(items.filter((i) => i.id !== deleteTarget).map((i, idx) => ({ ...i, order: idx + 1 })));
    setDeleteTarget(null);
    success('Navigation link removed');
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await updateSettings({ navigation: items });
      success('Navigation menu configuration saved!');
    } catch (err: any) {
      toastError(err.message || 'Failed to save navigation');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 mb-2 inline-block">
            Site Architecture
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-tight uppercase">
            Navigation <span className="text-blue-500">Menu</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage public header navigation items, labels, destination URLs, ordering, and visibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Plus size={14} />
            <span>Add Link</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={15} />
            )}
            <span>Save Menu</span>
          </button>
        </div>
      </div>

      {/* Add New Item Form */}
      {isAdding && (
        <form
          onSubmit={handleAddItem}
          className="bg-slate-900 border border-blue-500/30 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-2">
              <Plus size={14} />
              Add Navigation Item
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                Link Label
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Fixtures, Academy"
                value={newItem.label}
                onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                Destination URL
              </label>
              <input
                type="text"
                required
                placeholder="e.g. /matches or https://..."
                value={newItem.url}
                onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider"
            >
              Add to Navigation
            </button>
          </div>
        </form>
      )}

      {/* Navigation List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-3">
        {items.map((item, index) => {
          const isEditing = editingId === item.id;
          return (
            <div
              key={item.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all gap-4 ${
                item.visible
                  ? 'bg-slate-950 border-slate-800'
                  : 'bg-slate-950/40 border-slate-800/40 opacity-60'
              }`}
            >
              {isEditing ? (
                <div className="flex-1 flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={editForm.label}
                    onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold"
                  />
                  <input
                    type="text"
                    value={editForm.url}
                    onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSaveEdit(item.id)}
                      className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 bg-slate-800 text-slate-400 rounded-lg hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-white uppercase tracking-wider block truncate">
                      {item.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 truncate block">
                      {item.url}
                    </span>
                  </div>
                </div>
              )}

              {!isEditing && (
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="p-2 text-slate-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800"
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === items.length - 1}
                    className="p-2 text-slate-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800"
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    title="Edit Item"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleVisibility(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      item.visible
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20'
                        : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {item.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                    <span>{item.visible ? 'Visible' : 'Hidden'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Link"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Navigation Item?"
        message="Are you sure you want to remove this navigation item from the website header?"
        confirmText="Delete Link"
        isDangerous={true}
        onConfirm={handleDeleteItem}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
