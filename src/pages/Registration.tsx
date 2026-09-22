import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ShieldCheck, Trophy, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirebase, OperationType, handleFirestoreError } from '../contexts/FirebaseContext';

export const Registration: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useFirebase();

  const handlePayment = async () => {
    if (!user) {
      setError('PLEASE LOGIN TO REGISTER');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // In a real app, payment processing would happen here
      // For now, we simulate a successful payment and save to Firestore
      const registrationData = {
        userId: user.uid,
        tournamentName: 'Faryal FC Elite Cup 2026',
        feePaid: 50,
        currency: 'USD',
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'registrations'), registrationData);
      
      setStep(3);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, 'registrations');
      setError('REGISTRATION FAILED. PLEASE TRY AGAIN.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen flex items-center justify-center">
      <div className="max-w-xl w-full">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-10 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 mb-8 mx-auto">
                <Trophy size={32} />
              </div>
              <h2 className="text-3xl font-black text-white text-center italic tracking-tighter uppercase mb-4">TOURNAMENT REGISTRATION</h2>
              <p className="text-slate-500 text-center font-medium mb-10">Register for the upcoming "Faryal FC Elite Cup 2026".</p>
              
              <div className="space-y-6 mb-10">
                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-4">
                    <Calendar className="text-blue-500" size={20} />
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</p>
                      <p className="text-sm font-bold text-white uppercase">Oct 15 - Oct 20</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-4">
                    <Trophy className="text-blue-500" size={20} />
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Entry Fee</p>
                      <p className="text-sm font-bold text-white uppercase">$50.00 USD</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-600/20 uppercase tracking-widest"
              >
                PROCEED TO PAYMENT
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">SECURE PAYMENT</h2>
                <ShieldCheck className="text-emerald-500" />
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold flex items-center gap-3">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div className="space-y-6 mb-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Card Holder Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all"
                      placeholder="XXXX XXXX XXXX XXXX"
                    />
                    <CreditCard className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700" size={20} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Expiry Date</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">CVV</label>
                    <input
                      type="password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-white font-medium focus:border-blue-500 outline-none transition-all"
                      placeholder="***"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-emerald-600/20 uppercase tracking-widest flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      PROCESSING...
                    </>
                  ) : (
                    'PAY $50.00'
                  )}
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-4 rounded-xl font-black text-sm transition-all uppercase tracking-widest"
                >
                  CANCEL
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-12 shadow-2xl text-center"
            >
              <div className="w-24 h-24 rounded-full bg-emerald-600/20 flex items-center justify-center text-emerald-500 mb-8 mx-auto">
                <CheckCircle2 size={64} />
              </div>
              <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-4">SUCCESSFUL!</h2>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                Your registration for the <span className="text-white">Faryal FC Elite Cup 2026</span> is confirmed. A receipt has been sent to your email.
              </p>
              
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 mb-10 text-left">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Registration ID: #FFC-9982-1A</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Match Date</span>
                    <span className="text-xs font-black text-white uppercase">Oct 15, 2026</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Venue</span>
                    <span className="text-xs font-black text-white uppercase">Faryal FC Ground</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-600/20 uppercase tracking-widest"
              >
                BACK TO HOME
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
