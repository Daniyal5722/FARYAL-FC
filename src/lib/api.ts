import { 
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, setDoc, 
  query, where, serverTimestamp, orderBy, limit 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { 
  Team, Player, Match, News, Competition, Trophy, ClubSettings, GalleryItem, 
  MediaItem, ActivityLog 
} from '../types';
import { handleFirestoreError, OperationType } from '../contexts/FirebaseContext';
import { DEFAULT_FULL_SETTINGS } from '../data/defaultConfig';

export const DEFAULT_CLUB_SETTINGS = DEFAULT_FULL_SETTINGS;

export const api = {
  teams: {
    getAll: async (): Promise<Team[]> => {
      try {
        const res = await fetch('/api/teams');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) return data;
        }
      } catch {}
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
        const res = await fetch(`/api/teams/${id}`);
        if (res.ok) return await res.json();
      } catch {}
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
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch('/api/teams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const item = await res.json();
          api.activity.log('Created Team', `Added team ${data.name || ''}`).catch(() => {});
          return item;
        }
      } catch {}
      try {
        const docRef = await addDoc(collection(db, 'teams'), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        const d = await getDoc(docRef);
        api.activity.log('Created Team', `Added team ${data.name || ''}`).catch(() => {});
        return { id: d.id, ...d.data() } as Team;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'teams');
        throw error;
      }
    },
    update: async (id: string, data: Partial<Team>): Promise<Team> => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`/api/teams/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const item = await res.json();
          api.activity.log('Updated Team', `Modified team ${data.name || id}`).catch(() => {});
          return item;
        }
      } catch {}
      try {
        const { id: _, ...rest } = data as any;
        await updateDoc(doc(db, 'teams', id), {
          ...rest,
          updatedAt: serverTimestamp()
        });
        const d = await getDoc(doc(db, 'teams', id));
        api.activity.log('Updated Team', `Modified team ${data.name || id}`).catch(() => {});
        return { id: d.id, ...d.data() } as Team;
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `teams/${id}`);
        throw error;
      }
    },
    delete: async (id: string): Promise<void> => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`/api/teams/${id}`, {
          method: 'DELETE',
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        });
        if (res.ok) {
          api.activity.log('Deleted Team', `Removed team ${id}`).catch(() => {});
          return;
        }
      } catch {}
      try {
        await deleteDoc(doc(db, 'teams', id));
        api.activity.log('Deleted Team', `Removed team ${id}`).catch(() => {});
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `teams/${id}`);
        throw error;
      }
    }
  },

  players: {
    getAll: async (): Promise<Player[]> => {
      try {
        const res = await fetch('/api/players');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            return data;
          }
        }
      } catch (err) {
        console.warn('Fetch /api/players failed, falling back to Firestore:', err);
      }

      try {
        const playersSnap = await getDocs(collection(db, 'players'));
        const players = playersSnap.docs.map(d => ({ id: d.id, ...d.data() } as Player));

        let matches: Match[] = [];
        try {
          const matchesSnap = await getDocs(query(collection(db, 'matches'), where('status', '==', 'completed')));
          matches = matchesSnap.docs.map(d => d.data() as Match);
        } catch {}

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
        return [];
      }
    },
    getOne: async (id: string): Promise<Player> => {
      try {
        const res = await fetch(`/api/players/${id}`);
        if (res.ok) return await res.json();
      } catch {}

      try {
        const d = await getDoc(doc(db, 'players', id));
        if (!d.exists()) throw new Error('Player not found');
        return { id: d.id, ...d.data() } as Player;
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `players/${id}`);
        throw error;
      }
    },
    create: async (data: Partial<Player>): Promise<Player> => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch('/api/players', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const item = await res.json();
          api.activity.log('Added Player', `Added squad member ${data.name || ''}`).catch(() => {});
          return item;
        }
      } catch {}

      try {
        const docRef = await addDoc(collection(db, 'players'), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        const d = await getDoc(docRef);
        api.activity.log('Added Player', `Added squad member ${data.name || ''}`).catch(() => {});
        return { id: d.id, ...d.data() } as Player;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'players');
        throw error;
      }
    },
    update: async (id: string, data: Partial<Player>): Promise<Player> => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`/api/players/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const item = await res.json();
          api.activity.log('Updated Player', `Updated player ${data.name || id}`).catch(() => {});
          return item;
        }
      } catch {}

      try {
        const { id: _, ...rest } = data as any;
        await updateDoc(doc(db, 'players', id), {
          ...rest,
          updatedAt: serverTimestamp()
        });
        const d = await getDoc(doc(db, 'players', id));
        api.activity.log('Updated Player', `Updated player ${data.name || id}`).catch(() => {});
        return { id: d.id, ...d.data() } as Player;
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `players/${id}`);
        throw error;
      }
    },
    delete: async (id: string): Promise<void> => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`/api/players/${id}`, {
          method: 'DELETE',
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        });
        if (res.ok) {
          api.activity.log('Deleted Player', `Deleted player ${id}`).catch(() => {});
          return;
        }
      } catch {}

      try {
        await deleteDoc(doc(db, 'players', id));
        api.activity.log('Deleted Player', `Deleted player ${id}`).catch(() => {});
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `players/${id}`);
        throw error;
      }
    }
  },

  matches: {
    getAll: async (): Promise<Match[]> => {
      try {
        const res = await fetch('/api/matches');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) return data;
        }
      } catch {}

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
        const res = await fetch(`/api/matches/${id}`);
        if (res.ok) return await res.json();
      } catch {}

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
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch('/api/matches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const item = await res.json();
          api.activity.log('Created Match', `Added match ${data.homeTeamName} vs ${data.awayTeamName}`).catch(() => {});
          return item;
        }
      } catch {}

      try {
        const docRef = await addDoc(collection(db, 'matches'), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        const d = await getDoc(docRef);
        api.activity.log('Created Match', `Added match ${data.homeTeamName} vs ${data.awayTeamName}`).catch(() => {});
        return { id: d.id, ...d.data() } as Match;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'matches');
        throw error;
      }
    },
    update: async (id: string, data: Partial<Match>): Promise<Match> => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`/api/matches/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const item = await res.json();
          api.activity.log('Updated Match', `Updated fixture/score ${data.homeTeamName || ''} vs ${data.awayTeamName || ''}`).catch(() => {});
          return item;
        }
      } catch {}

      try {
        const { id: _, ...rest } = data as any;
        await updateDoc(doc(db, 'matches', id), {
          ...rest,
          updatedAt: serverTimestamp()
        });
        const d = await getDoc(doc(db, 'matches', id));
        api.activity.log('Updated Match', `Updated match ${id}`).catch(() => {});
        return { id: d.id, ...d.data() } as Match;
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `matches/${id}`);
        throw error;
      }
    },
    delete: async (id: string): Promise<void> => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`/api/matches/${id}`, {
          method: 'DELETE',
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        });
        if (res.ok) {
          api.activity.log('Deleted Match', `Deleted match ${id}`).catch(() => {});
          return;
        }
      } catch {}

      try {
        await deleteDoc(doc(db, 'matches', id));
        api.activity.log('Deleted Match', `Deleted match ${id}`).catch(() => {});
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `matches/${id}`);
        throw error;
      }
    }
  },

  news: {
    getAll: async (): Promise<News[]> => {
      try {
        const res = await fetch('/api/news');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) return data;
        }
      } catch {}

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
        const res = await fetch(`/api/news/${id}`);
        if (res.ok) return await res.json();
      } catch {}

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
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const item = await res.json();
          api.activity.log('Published News', `Added article ${data.title || ''}`).catch(() => {});
          return item;
        }
      } catch {}

      try {
        const docRef = await addDoc(collection(db, 'news'), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        const d = await getDoc(docRef);
        api.activity.log('Published News', `Added article ${data.title || ''}`).catch(() => {});
        return { id: d.id, ...d.data() } as News;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'news');
        throw error;
      }
    },
    update: async (id: string, data: Partial<News>): Promise<News> => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`/api/news/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const item = await res.json();
          api.activity.log('Updated News', `Modified article ${data.title || id}`).catch(() => {});
          return item;
        }
      } catch {}

      try {
        const { id: _, ...rest } = data as any;
        await updateDoc(doc(db, 'news', id), {
          ...rest,
          updatedAt: serverTimestamp()
        });
        const d = await getDoc(doc(db, 'news', id));
        api.activity.log('Updated News', `Modified article ${data.title || id}`).catch(() => {});
        return { id: d.id, ...d.data() } as News;
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `news/${id}`);
        throw error;
      }
    },
    delete: async (id: string): Promise<void> => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`/api/news/${id}`, {
          method: 'DELETE',
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        });
        if (res.ok) {
          api.activity.log('Deleted News', `Removed article ${id}`).catch(() => {});
          return;
        }
      } catch {}

      try {
        await deleteDoc(doc(db, 'news', id));
        api.activity.log('Deleted News', `Removed article ${id}`).catch(() => {});
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

  media: {
    getAll: async (): Promise<MediaItem[]> => {
      try {
        const snap = await getDocs(collection(db, 'media'));
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as MediaItem));
      } catch {
        return [];
      }
    },
    create: async (data: Partial<MediaItem>): Promise<MediaItem> => {
      try {
        const docRef = await addDoc(collection(db, 'media'), {
          ...data,
          uploadedAt: new Date().toISOString()
        });
        const d = await getDoc(docRef);
        api.activity.log('Uploaded Media', `Added asset ${data.name || ''}`).catch(() => {});
        return { id: d.id, ...d.data() } as MediaItem;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'media');
        throw error;
      }
    },
    delete: async (id: string): Promise<void> => {
      try {
        await deleteDoc(doc(db, 'media', id));
        api.activity.log('Deleted Media', `Deleted asset ${id}`).catch(() => {});
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `media/${id}`);
        throw error;
      }
    }
  },

  activity: {
    getAll: async (): Promise<ActivityLog[]> => {
      try {
        const snap = await getDocs(query(collection(db, 'activities'), orderBy('timestamp', 'desc'), limit(50)));
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as ActivityLog));
      } catch {
        return [];
      }
    },
    log: async (action: string, details: string): Promise<void> => {
      try {
        const userEmail = auth.currentUser?.email || 'admin@faryalfc.com';
        await addDoc(collection(db, 'activities'), {
          adminEmail: userEmail,
          action,
          details,
          timestamp: new Date().toISOString()
        });
      } catch {}
    }
  },

  backup: {
    exportData: async (): Promise<any> => {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/backup', {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      });
      if (!res.ok) throw new Error('Failed to export backup');
      return await res.json();
    },
    restoreData: async (data: any): Promise<any> => {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/backup/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ data })
      });
      if (!res.ok) throw new Error('Failed to restore backup');
      api.activity.log('Restored Backup', 'Imported club dataset from backup').catch(() => {});
      return await res.json();
    }
  },

  upload: {
    image: async (base64Data: string, name: string): Promise<string> => {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Data, name })
        });
        if (res.ok) {
          const data = await res.json();
          return data.url;
        }
      } catch {}
      return base64Data;
    }
  },

  settings: {
    get: async (): Promise<ClubSettings> => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data && data.name) {
            return { ...DEFAULT_FULL_SETTINGS, ...data };
          }
        }
      } catch {}

      try {
        const d = await getDoc(doc(db, 'settings', 'club'));
        if (d.exists()) {
          return { ...DEFAULT_FULL_SETTINGS, ...(d.data() as ClubSettings) };
        }
        return DEFAULT_FULL_SETTINGS;
      } catch (error) {
        console.warn('Error reading settings from Firestore, returning defaults:', error);
        return DEFAULT_FULL_SETTINGS;
      }
    },
    update: async (data: Partial<ClubSettings>): Promise<ClubSettings> => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const item = await res.json();
          api.activity.log('Updated Settings', 'Modified global website configuration').catch(() => {});
          return item;
        }
      } catch {}

      try {
        await setDoc(doc(db, 'settings', 'club'), data, { merge: true });
        const d = await getDoc(doc(db, 'settings', 'club'));
        api.activity.log('Updated Settings', 'Modified global website configuration').catch(() => {});
        return (d.data() as ClubSettings) || DEFAULT_FULL_SETTINGS;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'settings/club');
        throw error;
      }
    }
  },

  standings: {
    get: async (): Promise<Team[]> => {
      try {
        const res = await fetch('/api/standings');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) return data;
        }
      } catch {}

      try {
        const teamsSnap = await getDocs(collection(db, 'teams'));
        const teams = teamsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Team));

        let matches: Match[] = [];
        try {
          const matchesSnap = await getDocs(query(collection(db, 'matches'), where('status', '==', 'completed')));
          matches = matchesSnap.docs.map(doc => doc.data() as Match);
        } catch {}

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
        api.activity.log('Added Gallery Photo', `Uploaded image ${data.caption || ''}`).catch(() => {});
        return { id: d.id, ...d.data() } as GalleryItem;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'gallery');
        throw error;
      }
    },
    delete: async (id: string): Promise<void> => {
      try {
        await deleteDoc(doc(db, 'gallery', id));
        api.activity.log('Deleted Gallery Photo', `Removed photo ${id}`).catch(() => {});
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `gallery/${id}`);
        throw error;
      }
    }
  }
};
