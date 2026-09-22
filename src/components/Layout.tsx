import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { NotificationSystem } from './NotificationSystem';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />
      <NotificationSystem />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};
