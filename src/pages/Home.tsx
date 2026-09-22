import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';
import { MatchCard } from '../components/MatchCard';
import { PlayerCard } from '../components/PlayerCard';
import { Player, Match, Team, News, Trophy as TrophyType, ClubSettings } from '../types';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Trophy, Star, Users, Zap, Loader2, 
  Calendar, MapPin, Award, Instagram, Facebook, Twitter, Mail, Phone
} from 'lucide-react';
import { api } from '../lib/api';
import { useClubSettings } from '../hooks/useClubSettings';

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
  const upcomingMatches = matches.filter(m => m.status === 'upcoming').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const latestMatch = completedMatches[0];
  const nextMatch = upcomingMatches[0];
  const recentResults = completedMatches.slice(1, 4);
  const topScorers = [...players].sort((a, b) => (b.stats?.goals || 0) - (a.stats?.goals || 0)).slice(0, 5);
  const clubPosition = standings.findIndex(t => t.id === 'team-1') + 1 || '-';

  return (
    <div className="bg-slate-950">
      <Hero />

      {/* Club Introduction */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">About {settings.name}</span>
            <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none mb-8">
              OUR <span className="text-slate-800">HISTORY</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8">
              {settings.history || "Founded with a vision to revolutionize local football, Faryal FC stands as a beacon of excellence and community spirit. Our journey is defined by passion, resilience, and an unwavering commitment to the beautiful game."}
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-white font-black uppercase italic tracking-tighter mb-2">Our Vision</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{settings.vision || "To be the most respected and successful football club in the region."}</p>
              </div>
              <div>
                <h4 className="text-white font-black uppercase italic tracking-tighter mb-2">Our Mission</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{settings.mission || "Developing elite talent and fostering a winning culture for all ages."}</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-video rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative group">
                <img 
                    src="https://images.unsplash.com/photo-1575361204480-aadea2d4d449?q=80&w=1000&auto=format&fit=crop" 
                    alt="Club Atmosphere" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                <div className="absolute bottom-8 left-8">
                    <p className="text-white font-black italic text-2xl uppercase tracking-tighter">Established {settings.founded}</p>
                </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Match Center Preview */}
      <section className="py-24 px-6 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Latest Result */}
            <div className="lg:col-span-2">
              <div className="flex items-end justify-between mb-8">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Latest Result</h3>
                <Link to="/matches" className="text-blue-500 text-[10px] font-black uppercase tracking-widest hover:underline">View All</Link>
              </div>
              {latestMatch ? (
                <MatchCard match={latestMatch} />
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
                    <p className="text-slate-500 font-bold uppercase tracking-widest">No recent results</p>
                </div>
              )}
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentResults.map(match => (
                    <div key={match.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-500 uppercase">{new Date(match.date).toLocaleDateString()}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white uppercase italic tracking-tighter">{match.homeScore} - {match.awayScore}</span>
                        </div>
                    </div>
                ))}
              </div>
            </div>

            {/* Upcoming Match */}
            <div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-8">Next Match</h3>
              {nextMatch ? (
                <div className="bg-blue-600 rounded-3xl p-8 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em] mb-6">{nextMatch.competition}</p>
                        <div className="flex flex-col items-center gap-6 mb-8">
                            <div className="text-center">
                                <p className="text-3xl font-black text-white uppercase italic tracking-tighter mb-1">{nextMatch.homeTeamName}</p>
                                <span className="text-blue-200 text-xs font-bold uppercase tracking-widest">Home</span>
                            </div>
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-black italic text-white text-xl">VS</div>
                            <div className="text-center">
                                <p className="text-3xl font-black text-white uppercase italic tracking-tighter mb-1">{nextMatch.awayTeamName}</p>
                                <span className="text-blue-200 text-xs font-bold uppercase tracking-widest">Away</span>
                            </div>
                        </div>
                        <div className="border-t border-white/10 pt-6 flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-white">
                                <Calendar size={14} className="text-blue-200" />
                                <span className="text-xs font-bold">{new Date(nextMatch.date).toLocaleDateString()} @ {nextMatch.time}</span>
                            </div>
                            <div className="flex items-center gap-3 text-white">
                                <MapPin size={14} className="text-blue-200" />
                                <span className="text-xs font-bold">{nextMatch.venue}</span>
                            </div>
                        </div>
                    </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center h-full flex flex-col justify-center">
                    <p className="text-slate-500 font-bold uppercase tracking-widest">No upcoming matches</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Standings & Top Scorers */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Standings Preview */}
            <div className="lg:col-span-2">
                <div className="flex items-end justify-between mb-8">
                    <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                        LEAGUE <span className="text-slate-800">TABLE</span>
                    </h2>
                    <Link to="/standings" className="text-blue-500 text-[10px] font-black uppercase tracking-widest hover:underline">Full Standings</Link>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pos</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Team</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">P</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">GD</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Pts</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {standings.slice(0, 6).map((team, i) => (
                                <tr key={team.id} className={cn("hover:bg-slate-800/30 transition-colors", team.id === 'team-1' && "bg-blue-600/5")}>
                                    <td className="px-6 py-4 text-sm font-black text-white italic">{i + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {team.logo && <img src={team.logo} className="w-6 h-6 object-contain" alt="" />}
                                            <span className="text-sm font-bold text-white uppercase tracking-tighter">{team.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-400 text-center">{team.played}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-400 text-center">{team.goalDifference}</td>
                                    <td className="px-6 py-4 text-sm font-black text-blue-500 text-center">{team.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Top Scorers */}
            <div>
                <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none mb-8">
                    TOP <span className="text-slate-800">SCORERS</span>
                </h2>
                <div className="space-y-4">
                    {topScorers.map((player, i) => (
                        <div key={player.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between group hover:border-blue-500 transition-all">
                            <div className="flex items-center gap-4">
                                <span className="text-2xl font-black text-slate-800 italic group-hover:text-blue-500 transition-colors">#{i+1}</span>
                                <div>
                                    <p className="text-sm font-black text-white uppercase italic tracking-tighter">{player.name}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{player.position}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-white italic tracking-tighter">{player.stats?.goals || 0}</p>
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Goals</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Featured Players */}
      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div>
              <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-4 block">First Team Squad</span>
              <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                SQUAD <span className="text-slate-800">PREVIEW</span>
              </h2>
            </div>
            <Link to="/team" className="flex items-center gap-2 text-slate-400 hover:text-blue-500 font-bold uppercase tracking-widest text-sm transition-colors group">
              View Full Squad <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {players.slice(0, 4).map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
                LATEST <span className="text-slate-800">NEWS</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {news.length > 0 ? news.slice(0, 3).map((article, i) => (
                    <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden group hover:border-blue-500 transition-all"
                    >
                        <div className="aspect-video relative">
                            <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{article.category}</div>
                        </div>
                        <div className="p-8">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">{new Date(article.date).toLocaleDateString()}</p>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4 line-clamp-2 leading-tight group-hover:text-blue-500 transition-colors">{article.title}</h3>
                            <p className="text-slate-400 text-sm line-clamp-3 mb-6 font-medium leading-relaxed">{article.content}</p>
                            <Link to={`/news/${article.id}`} className="inline-flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-[0.2em] group/link">
                                Read Full Article <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                )) : (
                    <div className="col-span-full py-24 text-center">
                        <p className="text-slate-500 font-bold uppercase tracking-widest">No news available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
      </section>

      {/* Quick Links & Info */}
      <section className="py-24 px-6 bg-slate-900 border-t border-slate-800">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div>
                  <h4 className="text-white font-black uppercase italic tracking-tighter mb-6 text-xl">Contact Us</h4>
                  <div className="space-y-4">
                      <div className="flex items-center gap-3 text-slate-400">
                          <Mail size={16} className="text-blue-500" />
                          <span className="text-sm font-medium">{settings.contact.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400">
                          <Phone size={16} className="text-blue-500" />
                          <span className="text-sm font-medium">{settings.contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400">
                          <MapPin size={16} className="text-blue-500" />
                          <span className="text-sm font-medium">{settings.contact.address}</span>
                      </div>
                  </div>
              </div>
              <div>
                  <h4 className="text-white font-black uppercase italic tracking-tighter mb-6 text-xl">Quick Links</h4>
                  <div className="grid grid-cols-2 gap-4">
                      {['Team', 'Matches', 'Standings', 'Gallery', 'About', 'Contact'].map(link => (
                          <Link key={link} to={`/${link.toLowerCase()}`} className="text-slate-400 text-sm font-medium hover:text-blue-500 transition-colors">{link}</Link>
                      ))}
                  </div>
              </div>
              <div className="lg:col-span-2">
                  <h4 className="text-white font-black uppercase italic tracking-tighter mb-6 text-xl">Our Socials</h4>
                  <div className="flex flex-wrap gap-4">
                      {[
                          { icon: Instagram, label: 'Instagram', color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500' },
                          { icon: Facebook, label: 'Facebook', color: 'bg-[#1877F2]' },
                          { icon: Twitter, label: 'Twitter', color: 'bg-[#1DA1F2]' }
                      ].map(social => (
                          <a key={social.label} href="#" className={cn("flex items-center gap-3 px-6 py-3 rounded-xl text-white font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105", social.color)}>
                              <social.icon size={16} /> {social.label}
                          </a>
                      ))}
                  </div>
              </div>
          </div>
      </section>

    </div>
  );
};

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');
