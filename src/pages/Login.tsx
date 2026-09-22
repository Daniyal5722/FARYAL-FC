import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Shield, ArrowRight, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useFirebase } from '../contexts/FirebaseContext';

export const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useFirebase();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
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
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 pt-20">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 border-2 border-blue-600">
            <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">
            WELCOME, {user.displayName?.split(' ')[0]}
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-8">
            YOU ARE CURRENTLY LOGGED IN
          </p>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-5 rounded-xl font-black text-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            LOGOUT FROM PORTAL
          </button>
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
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-950 px-8 py-5 rounded-xl font-black text-sm transition-all shadow-xl shadow-white/5"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              CONTINUE WITH GOOGLE
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

