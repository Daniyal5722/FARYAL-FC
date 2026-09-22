import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';
import { MatchCard } from '../components/MatchCard';
import { PlayerCard } from '../components/PlayerCard';
import { Player, Match, Team, News, Trophy as TrophyType, ClubSettings } from '../types';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Trophy, Star, Users, Zap, Loader2, 
  Calendar, MapPin, Award, Instagram, Facebook, Twitter, Mail, Phone,
  TrendingUp, Activity, Target, Clock
} from 'lucide-react';
import { api } from '../lib/api';
import { useClubSettings } from '../hooks/useClubSettings';
import { cn, formatDate } from '../lib/utils';

export const Home: React.FC = () => {
  const { settings } = useClubSettings();
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<Team[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersData, matchesData, standingsData, newsData] = await Promise.all([
          api.players.getAll(),
          api.matches.getAll(),
          api.standings.get(),
          api.news.getAll()
        ]);
        setPlayers(playersData);
        setMatches(matchesData);
        setStandings(standingsData);
        setNews(newsData);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !settings) {
    return (
      <div className="pt-32 pb-24 px-6 bg-slate-950 min-h-screen flex items-center justify-center">
        <Loader2 className="text-blue-500 animate-spin" size={48} />
      </div>
    );
  }

  const completedMatches = matches.filter(m => m.status === 'completed').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const upcomingMatches = matches.filter(m => m.status === 'upcoming' || m.status === 'live').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const latestMatch = completedMatches[0];
  const nextMatch = upcomingMatches[0];
  const recentResults = completedMatches.slice(1, 4);
  const topScorers = [...players].sort((a, b) => (b.stats?.goals || 0) - (a.stats?.goals || 0)).slice(0, 5);
  const topAssists = [...players].sort((a, b) => (b.stats?.assists || 0) - (a.stats?.assists || 0)).slice(0, 5);

  return (
    <div className="bg-slate-950 overflow-hidden">
      <Hero />

      {/* Next Match Ticker/Banner */}
      {nextMatch && (
        <div className="bg-blue-600 py-3 overflow-hidden relative group cursor-default">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-12 px-6">
                <span className="text-white font-black uppercase italic tracking-tighter text-sm">
                  NEXT MATCH: {nextMatch.homeTeamName} VS {nextMatch.awayTeamName} — {formatDate(nextMatch.date)} @ {nextMatch.time} — {nextMatch.competition}
                </span>
                <TrendingUp size={16} className="text-blue-200" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Match Center Section */}
      <section className="py-32 px-6 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div>
              <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Match Day</span>
              <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
                MATCH <span className="text-slate-800">CENTER</span>
              </h2>
            </div>
            <Link to="/matches" className="button-premium-outline">
              VIEW ALL FIXTURES
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Result Card */}
            <div className="lg:col-span-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500">
                  <Activity size={20} />
                </div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Latest Result</h3>
              </div>
              {latestMatch ? (
                <MatchCard match={latestMatch} homeTeam={standings.find(t => t.id === latestMatch.homeTeamId)} awayTeam={standings.find(t => t.id === latestMatch.awayTeamId)} />
              ) : (
                <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-24 text-center">
                    <p className="text-slate-500 font-black uppercase tracking-widest italic">No match data available</p>
                </div>
              )}
            </div>

            {/* Side Match Column */}
            <div className="lg:col-span-4 space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20 text-blue-500">
                  <Calendar size={20} />
                </div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Next Up</h3>
              </div>
              {nextMatch ? (
                <div className="bg-blue-600 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl shadow-blue-600/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700" />
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.4em] mb-8">{nextMatch.competition}</p>
                        <div className="space-y-8 mb-10">
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-black text-white uppercase italic tracking-tighter">{nextMatch.homeTeamName}</span>
                                <div className="w-10 h-10 bg-white/20 rounded-xl backdrop-blur-md flex items-center justify-center">
                                    <span className="text-xs font-black text-white italic">H</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-[1px] flex-1 bg-white/20" />
                                <span className="text-sm font-black text-white italic">VS</span>
                                <div className="h-[1px] flex-1 bg-white/20" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="w-10 h-10 bg-white/20 rounded-xl backdrop-blur-md flex items-center justify-center">
                                    <span className="text-xs font-black text-white italic">A</span>
                                </div>
                                <span className="text-2xl font-black text-white uppercase italic tracking-tighter">{nextMatch.awayTeamName}</span>
                            </div>
                        </div>
                        <div className="pt-8 border-t border-white/20 space-y-4">
                            <div className="flex items-center gap-4 text-white">
                                <Calendar size={16} className="text-blue-200" />
                                <span className="text-xs font-black uppercase tracking-widest">{formatDate(nextMatch.date)}</span>
                            </div>
                            <div className="flex items-center gap-4 text-white">
                                <Clock size={16} className="text-blue-200" />
                                <span className="text-xs font-black uppercase tracking-widest">{nextMatch.time}</span>
                            </div>
                            <div className="flex items-center gap-4 text-white">
                                <MapPin size={16} className="text-blue-200" />
                                <span className="text-xs font-black uppercase tracking-widest">{nextMatch.venue}</span>
                            </div>
                        </div>
                    </div>
                </div>
              ) : (
                <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-12 text-center h-full flex flex-col justify-center">
                    <p className="text-slate-500 font-black uppercase tracking-widest italic">No upcoming fixtures</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Standings & Stats Section */}
      <section className="py-32 px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Standings */}
            <div className="lg:col-span-7">
                <div className="flex items-end justify-between mb-12">
                  <div>
                    <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">League Position</span>
                    <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                      THE <span className="text-slate-800">TABLE</span>
                    </h2>
                  </div>
                  <Link to="/standings" className="text-blue-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">FULL STANDINGS</Link>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-800/50">
                        <tr>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Pos</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Club</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">P</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">GD</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Pts</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {standings.slice(0, 8).map((team, i) => (
                          <tr key={team.id} className={cn(
                            "hover:bg-slate-800/30 transition-colors group",
                            team.id === 'team-1' ? "bg-blue-600/5" : ""
                          )}>
                            <td className="px-8 py-5">
                              <span className={cn(
                                "text-lg font-black italic tracking-tighter",
                                i < 3 ? "text-blue-500" : "text-slate-500"
                              )}>{i + 1}</span>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-slate-950 rounded-lg p-1.5 border border-slate-800 group-hover:scale-110 transition-transform">
                                  <img src={team.logo} alt="" className="w-full h-full object-contain" />
                                </div>
                                <span className="text-sm font-black text-white uppercase italic tracking-tighter leading-none">{team.name}</span>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-sm font-bold text-slate-400 text-center">{team.played}</td>
                            <td className="px-8 py-5 text-sm font-bold text-slate-400 text-center">{team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}</td>
                            <td className="px-8 py-5 text-center">
                                <span className="text-lg font-black text-white italic tracking-tighter">{team.points}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
            </div>

            {/* Top Performers */}
            <div className="lg:col-span-5">
                <div className="mb-12">
                    <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Individual Brilliance</span>
                    <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                      TOP <span className="text-slate-800">PERFORMERS</span>
                    </h2>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-500">
                                <Target size={20} />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Leading Scorers</h3>
                        </div>
                        <div className="space-y-4">
                            {topScorers.map((player, i) => (
                                <div key={player.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xl font-black text-slate-800 italic group-hover:text-blue-500 transition-colors">0{i+1}</span>
                                        <div>
                                            <p className="text-sm font-black text-white uppercase italic tracking-tighter leading-tight">{player.name}</p>
                                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{player.position}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-black text-white italic tracking-tighter">{player.stats?.goals || 0}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-500">
                                <Star size={20} />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Playmakers</h3>
                        </div>
                        <div className="space-y-4">
                            {topAssists.map((player, i) => (
                                <div key={player.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xl font-black text-slate-800 italic group-hover:text-blue-500 transition-colors">0{i+1}</span>
                                        <div>
                                            <p className="text-sm font-black text-white uppercase italic tracking-tighter leading-tight">{player.name}</p>
                                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{player.position}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-black text-white italic tracking-tighter">{player.stats?.assists || 0}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured News Grid */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full -ml-80 -mb-80" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
            <div>
              <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Inside Faryal FC</span>
              <h2 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">
                LATEST <span className="text-slate-800">NEWS</span>
              </h2>
            </div>
            <Link to="/news" className="button-premium">
              BROWSE ALL NEWS
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {news.slice(0, 3).map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden hover:border-blue-500 transition-all duration-500"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl shadow-blue-600/30">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-10">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">{formatDate(article.date)}</span>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4 line-clamp-2 leading-none group-hover:text-blue-500 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 line-clamp-3">
                    {article.content}
                  </p>
                  <Link to={`/news/${article.id}`} className="flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-[0.3em] group/btn">
                    READ ARTICLE <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Official Partners / Sponsors (Placeholder) */}
      <section className="py-24 px-6 border-y border-slate-900 bg-slate-950/50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-20 opacity-30 grayscale contrast-125">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="text-3xl font-black italic tracking-tighter text-white uppercase">SPONSOR</div>
          ))}
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-32 px-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-8 group">
                <img src={settings.logo} alt={settings.name} className="w-16 h-16 object-contain" />
                <span className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none">
                  FARYAL <span className="text-slate-700">FC</span>
                </span>
              </Link>
              <p className="text-slate-400 font-medium leading-relaxed mb-10 max-w-md">
                {settings.history}
              </p>
              <div className="flex gap-4">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:border-blue-500 transition-all">
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-black uppercase italic tracking-tighter mb-8 text-xl">Information</h4>
              <nav className="flex flex-col gap-4">
                {['About Us', 'Matches', 'Squad', 'Standings', 'Gallery', 'Contact'].map(item => (
                  <Link key={item} to={`/${item.toLowerCase().replace(' ', '')}`} className="text-slate-500 font-bold uppercase tracking-widest text-xs hover:text-blue-500 transition-colors">
                    {item}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h4 className="text-white font-black uppercase italic tracking-tighter mb-8 text-xl">Find Us</h4>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="text-blue-500 shrink-0" size={18} />
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Official Ground</p>
                    <p className="text-sm font-bold text-white uppercase italic tracking-tighter leading-tight">{settings.ground.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="text-blue-500 shrink-0" size={18} />
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Email Support</p>
                    <p className="text-sm font-bold text-white uppercase italic tracking-tighter leading-tight">{settings.contact.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="text-blue-500 shrink-0" size={18} />
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Hotline</p>
                    <p className="text-sm font-bold text-white uppercase italic tracking-tighter leading-tight">{settings.contact.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-32 pt-10 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} FARYAL FOOTBALL CLUB — ALL RIGHTS RESERVED
            </p>
            <div className="flex gap-8">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] cursor-pointer hover:text-white transition-colors">PRIVACY POLICY</span>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] cursor-pointer hover:text-white transition-colors">TERMS OF SERVICE</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
