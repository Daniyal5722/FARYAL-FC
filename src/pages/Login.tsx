import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Shield, ArrowRight, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useFirebase } from '../contexts/FirebaseContext';
import { SEO } from '../components/SEO';

export const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();
  const { user } = useFirebase();

  const handleGoogleLogin = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const res = await signInWithPopup(auth, provider);
      if (res.user?.email === 'mdaniyalhayyat@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError(err.message || 'Failed to sign in with Google');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (user) {
    const isAdmin = user.email === 'mdaniyalhayyat@gmail.com';
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 pt-20">
        <SEO title="Member Portal Account | Faryal FC" noIndex={true} />
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 border-2 border-blue-600">
            <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">
            WELCOME, {user.displayName?.split(' ')[0]}
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-8">
            {isAdmin ? 'ADMINISTRATOR AUTHENTICATED' : 'YOU ARE CURRENTLY LOGGED IN'}
          </p>

          <div className="space-y-4">
            {isAdmin && (
              <Link
                to="/admin"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-xl font-black text-lg transition-all shadow-xl shadow-blue-600/30"
              >
                <Shield className="w-5 h-5" />
                ENTER ADMIN PANEL
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-black text-sm transition-all"
            >
              <LogOut className="w-4 h-4" />
              LOGOUT FROM PORTAL
            </button>
          </div>

          <Link to="/" className="inline-block mt-8 text-blue-500 font-bold uppercase tracking-widest text-xs hover:underline">
            RETURN TO HOME
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 pt-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link to="/" className="inline-block mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-6 mx-auto">
              <Shield className="text-white w-8 h-8" />
            </div>
          </Link>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">
            MEMBER <span className="text-blue-500">PORTAL</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
            {isRegister ? 'JOIN THE FARYAL FC COMMUNITY' : 'WELCOME BACK TO THE CLUB'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <div className="bg-slate-900 rounded-[2rem] border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <User size={100} className="text-white" />
          </div>

          <div className="space-y-6 relative z-10">
            <div className="space-y-2 opacity-50 pointer-events-none">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Email Access (Coming Soon)</label>
              <input
                disabled
                type="email"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium outline-none transition-all"
                placeholder="player@faryalfc.com"
              />
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isSigningIn}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-950 px-8 py-5 rounded-xl font-black text-sm transition-all shadow-xl shadow-white/5"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              {isSigningIn ? 'CONNECTING...' : 'CONTINUE WITH GOOGLE'}
            </button>

            <p className="text-[10px] text-slate-500 text-center font-bold uppercase tracking-widest leading-relaxed">
              BY JOINING, YOU AGREE TO OUR TERMS OF SERVICE AND PRIVACY POLICY.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

