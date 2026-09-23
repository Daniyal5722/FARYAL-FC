import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home, ArrowLeft, Search } from 'lucide-react';
import { SEO } from '../components/SEO';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-20">
      <SEO
        title="Page Not Found (404) | Faryal FC"
        description="The requested page could not be found on the official Faryal FC website. Return to the home page or browse the squad roster."
        noIndex={true}
      />
      <div className="max-w-md w-full text-center space-y-6 bg-slate-900/60 border border-slate-800/80 p-8 rounded-3xl backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
          <Shield size={32} />
        </div>
        <div>
          <span className="text-4xl font-black text-blue-500 font-mono">404</span>
          <h1 className="text-2xl font-black text-white uppercase italic tracking-tight mt-1">
            Page Not Found
          </h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            The page you are looking for doesn't exist or has been moved. Explore our squad, fixtures, or return home.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20"
          >
            <Home size={14} />
            <span>Return Home</span>
          </Link>
          <Link
            to="/team"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition-all"
          >
            <span>View Squad</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
