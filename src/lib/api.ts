import { 
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, setDoc, 
  query, where, serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Team, Player, Match, News, Competition, Trophy, ClubSettings, GalleryItem } from '../types';
import { handleFirestoreError, OperationType } from '../contexts/FirebaseContext';

export const DEFAULT_CLUB_SETTINGS: ClubSettings = {
  name: "Faryal FC",
  shortName: "FFC",
  founded: "2024",
  logo: "/logo.png",
  primaryColor: "#002d62",
  secondaryColor: "#ffffff",
  stadium: "Faryal Ground",
  ground: {
    name: "Faryal FC Ground",
    address: "20-A Main Rd, Model Colony Block 24 Model Colony, Karachi, 75080, Pakistan",
    latitude: 24.903822,
    longitude: 67.194202,
    mapsUrl: "https://share.google/WntzBRDQxKW4EUPPI"
  },
  history: "Faryal FC was established in 2024 with a vision to build a world-class footballing community. Starting from local roots in Karachi, the club has quickly grown into a competitive force, emphasizing youth development, tactical excellence, and a spirit that never says die.",
  vision: "To become the premier destination for footballing talent in the region.",
  mission: "To develop technically gifted players who play with passion and integrity.",
  socials: {
    instagram: "https://instagram.com/faryalfc",
    facebook: "https://facebook.com/faryalfc",
    whatsapp: "https://wa.me/923000000000"
  },
  contact: {
    email: "info@faryalfc.com",
    phone: "+92 300 000 0000",
    address: "20-A Main Rd, Model Colony, Karachi, Pakistan"
  }
};

export const api = {
  teams: {
    getAll: async (): Promise<Team[]> => {
      try {
        const snap = await getDocs(collection(db, 'teams'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Team));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'teams');
        return [];
      }
    },
    getOne: async (id: string): Promise<Team> => {
      try {
        const d = await getDoc(doc(db, 'teams', id));
        if (!d.exists()) throw new Error('Team not found');
        return { id: d.id, ...d.data() } as Team;
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `teams/${id}`);
        throw error;
      }
    },
    create: async (data: Partial<Team>): Promise<Team> => {
      try {
        const docRef = await addDoc(collection(db, 'teams'), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        const d = await getDoc(docRef);
        return { id: d.id, ...d.data() } as Team;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'teams');
        throw error;
      }
    },
    update: async (id: string, data: Partial<Team>): Promise<Team> => {
      try {
        const { id: _, ...rest } = data as any;
        await updateDoc(doc(db, 'teams', id), {
          ...rest,
          updatedAt: serverTimestamp()
        });
        const d = await getDoc(doc(db, 'teams', id));
        return { id: d.id, ...d.data() } as Team;
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `teams/${id}`);
        throw error;
      }
    },
    delete: async (id: string): Promise<void> => {
      try {
        await deleteDoc(doc(db, 'teams', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `teams/${id}`);
        throw error;
      }
    }
  },

  players: {
    getAll: async (): Promise<Player[]> => {
      try {
        const playersSnap = await getDocs(collection(db, 'players'));
        const players = playersSnap.docs.map(d => ({ id: d.id, ...d.data() } as Player));

        let matches: Match[] = [];
        try {
          const matchesSnap = await getDocs(query(collection(db, 'matches'), where('status', '==', 'completed')));
          matches = matchesSnap.docs.map(d => d.data() as Match);
        } catch {
          // Non-blocking if matches query fails
        }

        return players.map(player => {
          let goals = 0, assists = 0, yellowCards = 0, redCards = 0, appearances = 0;

          matches.forEach(match => {
            const participated = match.events?.some(e => e.playerId === player.id || e.assistId === player.id);
            if (participated) appearances++;

            if (match.events) {
              match.events.forEach(event => {
                if (event.playerId === player.id) {
                  if (event.type === 'goal') goals++;
                  if (event.type === 'yellow_card') yellowCards++;
                  if (event.type === 'red_card') redCards++;
                }
                if (event.assistId === player.id) {
                  assists++;
                }
              });
            }
          });

          return {
            ...player,
            stats: {
              appearances: appearances || player.stats?.appearances || 0,
              goals: goals || player.stats?.goals || 0,
              assists: assists || player.stats?.assists || 0,
              yellowCards: yellowCards || player.stats?.yellowCards || 0,
              redCards: redCards || player.stats?.redCards || 0,
              cleanSheets: player.stats?.cleanSheets || 0
            }
          };
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'players');
        try {
          const res = await fetch('/api/players');
          if (res.ok) return await res.json();
        } catch {}
        return [];
      }
    },
    getOne: async (id: string): Promise<Player> => {
      try {
        const d = await getDoc(doc(db, 'players', id));
        if (!d.exists()) throw new Error('Player not found');
        const player = { id: d.id, ...d.data() } as Player;

        let matches: Match[] = [];
        try {
          const matchesSnap = await getDocs(query(collection(db, 'matches'), where('status', '==', 'completed')));
          matches = matchesSnap.docs.map(doc => doc.data() as Match);
        } catch {
          // ignore
        }

        let goals = 0, assists = 0, yellowCards = 0, redCards = 0, appearances = 0;
        matches.forEach(match => {
          const participated = match.events?.some(e => e.playerId === player.id || e.assistId === player.id);
          if (participated) appearances++;

          if (match.events) {
            match.events.forEach(event => {
              if (event.playerId === player.id) {
                if (event.type === 'goal') goals++;
                if (event.type === 'yellow_card') yellowCards++;
                if (event.type === 'red_card') redCards++;
              }
              if (event.assistId === player.id) {
                assists++;
              }
            });
          }
        });

        return {
          ...player,
          stats: {
            appearances: appearances || player.stats?.appearances || 0,
            goals: goals || player.stats?.goals || 0,
            assists: assists || player.stats?.assists || 0,
            yellowCards: yellowCards || player.stats?.yellowCards || 0,
            redCards: redCards || player.stats?.redCards || 0,
            cleanSheets: player.stats?.cleanSheets || 0
          }
        };
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `players/${id}`);
        try {
          const res = await fetch(`/api/players/${id}`);
          if (res.ok) return await res.json();
        } catch {}
        throw error;
      }
    },
    create: async (data: Partial<Player>): Promise<Player> => {
      try {
        const docRef = await addDoc(collection(db, 'players'), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        const d = await getDoc(docRef);
        return { id: d.id, ...d.data() } as Player;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'players');
        throw error;
      }
    },
    update: async (id: string, data: Partial<Player>): Promise<Player> => {
      try {
        const { id: _, ...rest } = data as any;
        await updateDoc(doc(db, 'players', id), {
          ...rest,
          updatedAt: serverTimestamp()
        });
        const d = await getDoc(doc(db, 'players', id));
        return { id: d.id, ...d.data() } as Player;
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `players/${id}`);
        throw error;
      }
    },
    delete: async (id: string): Promise<void> => {
      try {
        await deleteDoc(doc(db, 'players', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `players/${id}`);
        throw error;
      }
    }
  },

  matches: {
    getAll: async (): Promise<Match[]> => {
      try {
        const snap = await getDocs(collection(db, 'matches'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Match));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'matches');
        return [];
      }
    },
    getOne: async (id: string): Promise<Match> => {
      try {
        const d = await getDoc(doc(db, 'matches', id));
        if (!d.exists()) throw new Error('Match not found');
        return { id: d.id, ...d.data() } as Match;
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `matches/${id}`);
        throw error;
      }
    },
    create: async (data: Partial<Match>): Promise<Match> => {
      try {
        const docRef = await addDoc(collection(db, 'matches'), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        const d = await getDoc(docRef);
        return { id: d.id, ...d.data() } as Match;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'matches');
        throw error;
      }
    },
    update: async (id: string, data: Partial<Match>): Promise<Match> => {
      try {
        const { id: _, ...rest } = data as any;
        await updateDoc(doc(db, 'matches', id), {
          ...rest,
          updatedAt: serverTimestamp()
        });
        const d = await getDoc(doc(db, 'matches', id));
        return { id: d.id, ...d.data() } as Match;
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `matches/${id}`);
        throw error;
      }
    },
    delete: async (id: string): Promise<void> => {
      try {
        await deleteDoc(doc(db, 'matches', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `matches/${id}`);
        throw error;
      }
    }
  },

  news: {
    getAll: async (): Promise<News[]> => {
      try {
        const snap = await getDocs(collection(db, 'news'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as News));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'news');
        return [];
      }
    },
    getOne: async (id: string): Promise<News> => {
      try {
        const d = await getDoc(doc(db, 'news', id));
        if (!d.exists()) throw new Error('News item not found');
        return { id: d.id, ...d.data() } as News;
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `news/${id}`);
        throw error;
      }
    },
    create: async (data: Partial<News>): Promise<News> => {
      try {
        const docRef = await addDoc(collection(db, 'news'), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        const d = await getDoc(docRef);
        return { id: d.id, ...d.data() } as News;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'news');
        throw error;
      }
    },
    update: async (id: string, data: Partial<News>): Promise<News> => {
      try {
        const { id: _, ...rest } = data as any;
        await updateDoc(doc(db, 'news', id), {
          ...rest,
          updatedAt: serverTimestamp()
        });
        const d = await getDoc(doc(db, 'news', id));
        return { id: d.id, ...d.data() } as News;
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `news/${id}`);
        throw error;
      }
    },
    delete: async (id: string): Promise<void> => {
      try {
        await deleteDoc(doc(db, 'news', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `news/${id}`);
        throw error;
      }
    }
  },

  competitions: {
    getAll: async (): Promise<Competition[]> => {
      try {
        const snap = await getDocs(collection(db, 'competitions'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Competition));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'competitions');
        return [];
      }
    },
    create: async (data: Partial<Competition>): Promise<Competition> => {
      try {
        const docRef = await addDoc(collection(db, 'competitions'), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        const d = await getDoc(docRef);
        return { id: d.id, ...d.data() } as Competition;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'competitions');
        throw error;
      }
    },
    update: async (id: string, data: Partial<Competition>): Promise<Competition> => {
      try {
        const { id: _, ...rest } = data as any;
        await updateDoc(doc(db, 'competitions', id), {
          ...rest,
          updatedAt: serverTimestamp()
        });
        const d = await getDoc(doc(db, 'competitions', id));
        return { id: d.id, ...d.data() } as Competition;
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `competitions/${id}`);
        throw error;
      }
    },
    delete: async (id: string): Promise<void> => {
      try {
        await deleteDoc(doc(db, 'competitions', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `competitions/${id}`);
        throw error;
      }
    }
  },

  trophies: {
    getAll: async (): Promise<Trophy[]> => {
      try {
        const snap = await getDocs(collection(db, 'trophies'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Trophy));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'trophies');
        return [];
      }
    },
    create: async (data: Partial<Trophy>): Promise<Trophy> => {
      try {
        const docRef = await addDoc(collection(db, 'trophies'), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        const d = await getDoc(docRef);
        return { id: d.id, ...d.data() } as Trophy;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'trophies');
        throw error;
      }
    },
    update: async (id: string, data: Partial<Trophy>): Promise<Trophy> => {
      try {
        const { id: _, ...rest } = data as any;
        await updateDoc(doc(db, 'trophies', id), {
          ...rest,
          updatedAt: serverTimestamp()
        });
        const d = await getDoc(doc(db, 'trophies', id));
        return { id: d.id, ...d.data() } as Trophy;
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `trophies/${id}`);
        throw error;
      }
    },
    delete: async (id: string): Promise<void> => {
      try {
        await deleteDoc(doc(db, 'trophies', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `trophies/${id}`);
        throw error;
      }
    }
  },

  settings: {
    get: async (): Promise<ClubSettings> => {
      try {
        const d = await getDoc(doc(db, 'settings', 'club'));
        if (d.exists()) {
          return d.data() as ClubSettings;
        }
        return DEFAULT_CLUB_SETTINGS;
      } catch (error) {
        console.warn('Error reading settings from Firestore, returning default club settings:', error);
        return DEFAULT_CLUB_SETTINGS;
      }
    },
    update: async (data: Partial<ClubSettings>): Promise<ClubSettings> => {
      try {
        await setDoc(doc(db, 'settings', 'club'), data, { merge: true });
        const d = await getDoc(doc(db, 'settings', 'club'));
        return (d.data() as ClubSettings) || DEFAULT_CLUB_SETTINGS;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'settings/club');
        throw error;
      }
    }
  },

  standings: {
    get: async (): Promise<Team[]> => {
      try {
        const teamsSnap = await getDocs(collection(db, 'teams'));
        const teams = teamsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Team));

        let matches: Match[] = [];
        try {
          const matchesSnap = await getDocs(query(collection(db, 'matches'), where('status', '==', 'completed')));
          matches = matchesSnap.docs.map(doc => doc.data() as Match);
        } catch {
          // Non-blocking
        }

        const stats = teams.map((team: Team) => {
          const teamMatches = matches.filter(m => m.homeTeamId === team.id || m.awayTeamId === team.id);

          let wins = 0, draws = 0, losses = 0, gf = 0, ga = 0;

          teamMatches.forEach(m => {
            const isHome = m.homeTeamId === team.id;
            const teamScore = isHome ? (m.homeScore || 0) : (m.awayScore || 0);
            const oppScore = isHome ? (m.awayScore || 0) : (m.homeScore || 0);

            gf += teamScore;
            ga += oppScore;

            if (teamScore > oppScore) wins++;
            else if (teamScore === oppScore) draws++;
            else losses++;
          });

          return {
            ...team,
            played: teamMatches.length,
            wins,
            draws,
            losses,
            goalsFor: gf,
            goalsAgainst: ga,
            goalDifference: gf - ga,
            points: (wins * 3) + draws
          };
        });

        return stats.sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
          return b.goalsFor - a.goalsFor;
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'standings');
        return [];
      }
    }
  },

  gallery: {
    getAll: async (): Promise<GalleryItem[]> => {
      try {
        const snap = await getDocs(collection(db, 'gallery'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'gallery');
        return [];
      }
    },
    create: async (data: Partial<GalleryItem>): Promise<GalleryItem> => {
      try {
        const docRef = await addDoc(collection(db, 'gallery'), {
          ...data,
          createdAt: serverTimestamp()
        });
        const d = await getDoc(docRef);
        return { id: d.id, ...d.data() } as GalleryItem;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'gallery');
        throw error;
      }
    },
    delete: async (id: string): Promise<void> => {
      try {
        await deleteDoc(doc(db, 'gallery', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `gallery/${id}`);
        throw error;
      }
    }
  }
};
