import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, onIdTokenChanged, User } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Shield, Loader2 } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const location = useLocation();
  const [authState, setAuthState] = useState<{
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    user: User | null;
  }>({
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
    user: null,
  });

  useEffect(() => {
    // Real Firebase Auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          isAdmin: false,
          user: null,
        });
        return;
      }

      try {
        // Validate fresh ID Token
        const token = await currentUser.getIdToken();
        if (!token) {
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            isAdmin: false,
            user: null,
          });
          return;
        }

        // Verify administrator authorization
        const isMasterAdmin = currentUser.email?.toLowerCase() === 'mdaniyalhayyat@gmail.com';
        let isDocAdmin = false;

        try {
          const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
          isDocAdmin = adminDoc.exists();
        } catch {
          // In case rules restrict collection query
        }

        const hasAdminAccess = isMasterAdmin || isDocAdmin;

        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          isAdmin: hasAdminAccess,
          user: currentUser,
        });
      } catch (err) {
        console.error('Firebase Auth Guard check error:', err);
        setAuthState({
          isLoading: false,
          isAuthenticated: !!currentUser,
          isAdmin: currentUser.email?.toLowerCase() === 'mdaniyalhayyat@gmail.com',
          user: currentUser,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  if (authState.isLoading) {
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

  // Proper redirect logic for unauthenticated or non-admin users
  if (!authState.isAuthenticated || !authState.isAdmin) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};
