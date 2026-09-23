import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';
import { Shield, Loader2 } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user, loading, isAdmin } = useFirebase();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/20">
            <Shield className="w-8 h-8 text-white animate-pulse" />
          </div>
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin absolute -bottom-2 -right-2" />
        </div>
        <h2 className="text-sm font-black tracking-widest text-white uppercase mb-2">
          Verifying Admin Credentials
        </h2>
        <p className="text-xs text-slate-400 tracking-wider">
          Securing access to Faryal FC Management System...
        </p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};
