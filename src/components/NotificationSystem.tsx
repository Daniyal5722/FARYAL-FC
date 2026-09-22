import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Info, Zap, Trophy } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'alert';
  time: string;
}

export const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Mock real-time notification after 5 seconds
    const timer = setTimeout(() => {
      const newNotif: Notification = {
        id: Date.now().toString(),
        title: 'GOAL! Faryal FC 1-0',
        message: 'Hamza Malik scores a stunner from outside the box!',
        type: 'success',
        time: 'Just now',
      };
      setNotifications(prev => [newNotif, ...prev]);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-24 right-6 z-[60] space-y-4 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className="pointer-events-auto bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
            <button
              onClick={() => removeNotification(notif.id)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center shrink-0 text-blue-500">
                {notif.type === 'success' ? <Trophy size={20} /> : <Zap size={20} />}
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase italic tracking-tighter mb-1">{notif.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-2">{notif.message}</p>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{notif.time}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
