import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Download, Upload, RefreshCw, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../contexts/ToastContext';
import { ConfirmModal } from '../../components/admin/ConfirmModal';

export const ManageBackup: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [exporting, setExporting] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [restoreData, setRestoreData] = useState<any>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const handleExportBackup = async () => {
    setExporting(true);
    try {
      const data = await api.backup.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `faryal-fc-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      success('Database backup exported and downloaded successfully!');
    } catch (err: any) {
      toastError(err.message || 'Failed to export backup');
    } finally {
      setExporting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (!parsed.data && !parsed.club) {
          throw new Error('Invalid backup file format');
        }
        setRestoreData(parsed.data || parsed);
        setConfirmModalOpen(true);
      } catch (err) {
        toastError('Failed to parse backup JSON file. Ensure it is a valid Faryal FC backup.');
      }
    };
    reader.readAsText(file);
  };

  const executeRestore = async () => {
    if (!restoreData) return;
    setRestoring(true);
    try {
      await api.backup.restoreData(restoreData);
      setConfirmModalOpen(false);
      setRestoreData(null);
      success('Club database and settings successfully restored!');
    } catch (err: any) {
      toastError(err.message || 'Failed to restore backup');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 mb-2 inline-block">
          Data Integrity
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-tight uppercase">
          Backup & <span className="text-blue-500">Restore</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Export full club dataset as JSON, archive matches and rosters, or restore system state from a verified backup file.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
              <Download size={24} />
            </div>
            <h2 className="text-base font-black text-white uppercase tracking-tight mb-2">
              Export Club Dataset
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Download a single JSON file containing all real players, teams, matches, scores, news articles, gallery items, trophies, and global theme/settings configuration.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportBackup}
            disabled={exporting}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
          >
            {exporting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download size={16} />
            )}
            <span>Generate & Download JSON Backup</span>
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
              <Upload size={24} />
            </div>
            <h2 className="text-base font-black text-white uppercase tracking-tight mb-2">
              Restore from Backup
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Upload a previously exported JSON backup file to restore database collections and site configuration. Existing records with matching IDs will be safely synchronized.
            </p>
          </div>

          <label className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border border-slate-700">
            <Upload size={16} />
            <span>Select Backup JSON File</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModalOpen}
        title="Confirm Database Restore?"
        message="Restoring from a backup will overwrite or merge collections with the selected backup data. Are you sure you want to proceed?"
        confirmText="Execute Restore"
        isDangerous={true}
        isLoading={restoring}
        onConfirm={executeRestore}
        onCancel={() => {
          setConfirmModalOpen(false);
          setRestoreData(null);
        }}
      />
    </div>
  );
};
