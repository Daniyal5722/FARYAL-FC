import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-black text-white shadow-lg hover:bg-blue-700 transition uppercase tracking-widest"
      >
        <Download className="w-4 h-4" />
        Install App
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-black text-slate-300 hover:bg-slate-800 transition uppercase tracking-widest"
        >
          <Smartphone size={14} />
          Install on iOS
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
            <div className="w-full max-w-sm rounded-3xl bg-slate-900 p-8 shadow-2xl border border-slate-800 relative">
              <button 
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white"
              >
                <X size={24} />
              </button>
              <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-6">Install on iOS</h3>
              <div className="space-y-6 text-slate-400 font-medium">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0 text-blue-500 font-black">1</div>
                  <p className="text-sm">Tap the <strong className="text-white">Share</strong> button in the Safari toolbar.</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0 text-blue-500 font-black">2</div>
                  <p className="text-sm">Scroll down and tap <strong className="text-white">Add to Home Screen</strong>.</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-10 w-full rounded-xl bg-slate-800 py-4 text-sm font-black text-white hover:bg-slate-700 transition uppercase tracking-widest"
              >
                GOT IT
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
