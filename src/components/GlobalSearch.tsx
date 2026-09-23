import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X, Trophy, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import { Player, Match } from '../types';

export const GlobalSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    if (isOpen) {
      api.players.getAll().then(setPlayers).catch(() => {});
      api.matches.getAll().then(setMatches).catch(() => {});
    }
  }, [isOpen]);

  const filteredPlayers = players.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  const filteredMatches = matches.filter(m => 
    m.homeTeamName.toLowerCase().includes(query.toLowerCase()) || 
    m.awayTeamName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-slate-400 hover:text-white transition-colors"
      >
        <SearchIcon size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md p-6 flex flex-col items-center"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 text-slate-500 hover:text-white p-2"
            >
              <X size={32} />
            </button>

            <div className="w-full max-w-2xl mt-20">
              <div className="relative mb-12">
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search players, matches, news..."
                  className="w-full bg-transparent border-b-4 border-slate-800 py-6 text-4xl md:text-6xl font-black text-white italic tracking-tighter outline-none focus:border-blue-600 transition-all placeholder:text-slate-900"
                />
              </div>

              {query.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Players Results */}
                  <div>
                    <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.3em] mb-6">Players</h3>
                    <div className="space-y-4">
                      {filteredPlayers.slice(0, 5).map(player => (
                        <Link
                          key={player.id}
                          to={`/player/${player.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500 transition-all group"
                        >
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800">
                            <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-white font-black uppercase italic tracking-tighter group-hover:text-blue-500 transition-colors">{player.name}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">{player.position}</p>
                          </div>
                        </Link>
                      ))}
                      {filteredPlayers.length === 0 && <p className="text-slate-700 text-sm font-bold">No players found.</p>}
                    </div>
                  </div>

                  {/* Matches Results */}
                  <div>
                    <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.3em] mb-6">Matches</h3>
                    <div className="space-y-4">
                      {filteredMatches.slice(0, 5).map(match => (
                        <Link
                          key={match.id}
                          to="/matches"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500 transition-all group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-600 group-hover:text-blue-500">
                            <Trophy size={20} />
                          </div>
                          <div>
                            <p className="text-white font-black uppercase italic tracking-tighter group-hover:text-blue-500 transition-colors">
                              {match.homeTeamName} vs {match.awayTeamName}
                            </p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">{match.date}</p>
                          </div>
                        </Link>
                      ))}
                      {filteredMatches.length === 0 && <p className="text-slate-700 text-sm font-bold">No matches found.</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
