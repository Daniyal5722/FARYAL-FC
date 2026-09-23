import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useFirebase } from '../../contexts/FirebaseContext';
import { ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAdmin } = useFirebase();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2">
            Admin Access Restricted
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            Your account (<span className="text-slate-200 font-bold">{user.email}</span>) does not have administrator privileges for the Faryal FC Control Center.
          </p>
          <div className="space-y-3">
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all"
            >
              <LogIn size={16} />
              Switch Account
            </Link>
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
            >
              <ArrowLeft size={16} />
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
