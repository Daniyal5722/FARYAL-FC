import { 
  collection, doc, getDocs, getDoc, addDoc, setDoc, deleteDoc, 
  query, where, serverTimestamp, orderBy, limit 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { 
  Team, Player, Match, News, Competition, Trophy, ClubSettings, GalleryItem, 
  MediaItem, ActivityLog 
} from '../types';
import { handleFirestoreError, OperationType } from '../contexts/FirebaseContext';
import { DEFAULT_FULL_SETTINGS } from '../data/defaultConfig';
import { 
  INITIAL_PLAYERS, INITIAL_TEAMS, INITIAL_MATCHES, INITIAL_NEWS, 
  INITIAL_GALLERY, INITIAL_TROPHIES, INITIAL_COMPETITIONS 
} from '../data/mockData';

export const DEFAULT_CLUB_SETTINGS = DEFAULT_FULL_SETTINGS;

function cleanPayload<T extends Record<string, any>>(data: T): Record<string, any> {
  const { id: _, ...rest } = data;
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

export const api = {
  teams: {
    getAll: async (): Promise<Team[]> => {
      try {
        const snap = await getDocs(collection(db, 'teams'));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as Team));
        }
        return INITIAL_TEAMS;
      } catch (error) {
        console.warn('Firestore teams read failed, using default data:', error);
        return INITIAL_TEAMS;
      }
    },
    getOne: async (id: string): Promise<Team> => {
      try {
        const d = await getDoc(doc(db, 'teams', id));
        if (d.exists()) {
          return { id: d.id, ...d.data() } as Team;
        }
        const fallback = INITIAL_TEAMS.find(t => t.id === id);
        if (fallback) return fallback;
        throw new Error('Team not found');
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `teams/${id}`);
        throw error;
      }
    },
    create: async (data: Partial<Team>): Promise<Team> => {
      try {
        const payload = {
          ...cleanPayload(data),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        let targetId = data.id;
        if (targetId) {
          await setDoc(doc(db, 'teams', targetId), payload, { merge: true });
        } else {
          const docRef = await addDoc(collection(db, 'teams'), payload);
          targetId = docRef.id;
        }

        api.activity.log('Created Team', `Added team ${data.name || ''}`).catch(() => {});
        return { id: targetId, ...data } as Team;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'teams');
        throw error;
      }
    },
    update: async (id: string, data: Partial<Team>): Promise<Team> => {
      try {
        const payload = {
          ...cleanPayload(data),
          updatedAt: serverTimestamp()
        };
        await setDoc(doc(db, 'teams', id), payload, { merge: true });
        api.activity.log('Updated Team', `Modified team ${data.name || id}`).catch(() => {});
        return { id, ...data } as Team;
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `teams/${id}`);
        throw error;
      }
    },
    delete: async (id: string): Promise<void> => {
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
        const playersSnap = await getDocs(collection(db, 'players'));
        let players: Player[] = [];
        
        if (!playersSnap.empty) {
          players = playersSnap.docs.map(d => ({ id: d.id, ...d.data() } as Player));
        } else {
          players = INITIAL_PLAYERS;
        }

        let matches: Match[] = [];
        try {
          const matchesSnap = await getDocs(query(collection(db, 'matches'), where('status', '==', 'completed')));
          if (!matchesSnap.empty) {
            matches = matchesSnap.docs.map(d => d.data() as Match);
          } else {
            matches = INITIAL_MATCHES.filter(m => m.status === 'completed');
          }
        } catch {
          matches = INITIAL_MATCHES.filter(m => m.status === 'completed');
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
        console.warn('Firestore players list error, fallback to defaults:', error);
        return INITIAL_PLAYERS;
      }
    },
    getOne: async (id: string): Promise<Player> => {
      try {
        const d = await getDoc(doc(db, 'players', id));
        if (d.exists()) {
          return { id: d.id, ...d.data() } as Player;
        }
        const fallback = INITIAL_PLAYERS.find(p => p.id === id);
        if (fallback) return fallback;
        throw new Error('Player not found');
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `players/${id}`);
        throw error;
      }
    },
    create: async (data: Partial<Player>): Promise<Player> => {
      try {
        const payload = {
          ...cleanPayload(data),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        let targetId = data.id;
        if (targetId) {
          await setDoc(doc(db, 'players', targetId), payload, { merge: true });
        } else {
          const docRef = await addDoc(collection(db, 'players'), payload);
          targetId = docRef.id;
        }

        api.activity.log('Added Player', `Added squad member ${data.name || ''}`).catch(() => {});
        return { id: targetId, ...data } as Player;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'players');
        throw error;
      }
    },
    update: async (id: string, data: Partial<Player>): Promise<Player> => {
      try {
        const payload = {
          ...cleanPayload(data),
          updatedAt: serverTimestamp()
        };
        // setDoc with merge: true will both update existing docs and upsert if not in Firestore yet
        await setDoc(doc(db, 'players', id), payload, { merge: true });
        api.activity.log('Updated Player', `Updated player ${data.name || id}`).catch(() => {});
        return { id, ...data } as Player;
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `players/${id}`);
        throw error;
      }
    },
    delete: async (id: string): Promise<void> => {
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
        const snap = await getDocs(collection(db, 'matches'));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as Match));
        }
        return INITIAL_MATCHES;
      } catch (error) {
        console.warn('Firestore matches error, fallback to defaults:', error);
        return INITIAL_MATCHES;
      }
    },
    getOne: async (id: string): Promise<Match> => {
      try {
        const d = await getDoc(doc(db, 'matches', id));
        if (d.exists()) {
          return { id: d.id, ...d.data() } as Match;
        }
        const fallback = INITIAL_MATCHES.find(m => m.id === id);
        if (fallback) return fallback;
        throw new Error('Match not found');
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `matches/${id}`);
        throw error;
      }
    },
    create: async (data: Partial<Match>): Promise<Match> => {
      try {
        const payload = {
          ...cleanPayload(data),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        let targetId = data.id;
        if (targetId) {
          await setDoc(doc(db, 'matches', targetId), payload, { merge: true });
        } else {
          const docRef = await addDoc(collection(db, 'matches'), payload);
          targetId = docRef.id;
        }

        api.activity.log('Created Match', `Added match ${data.homeTeamName || ''} vs ${data.awayTeamName || ''}`).catch(() => {});
        return { id: targetId, ...data } as Match;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'matches');
        throw error;
      }
    },
    update: async (id: string, data: Partial<Match>): Promise<Match> => {
      try {
        const payload = {
          ...cleanPayload(data),
          updatedAt: serverTimestamp()
        };
        await setDoc(doc(db, 'matches', id), payload, { merge: true });
        api.activity.log('Updated Match', `Updated fixture/score ${data.homeTeamName || ''} vs ${data.awayTeamName || ''}`).catch(() => {});
        return { id, ...data } as Match;
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `matches/${id}`);
        throw error;
      }
    },
    delete: async (id: string): Promise<void> => {
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
        const snap = await getDocs(collection(db, 'news'));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as News));
        }
        return INITIAL_NEWS;
      } catch (error) {
        console.warn('Firestore news error, fallback to defaults:', error);
        return INITIAL_NEWS;
      }
    },
    getOne: async (id: string): Promise<News> => {
      try {
        const d = await getDoc(doc(db, 'news', id));
        if (d.exists()) {
          return { id: d.id, ...d.data() } as News;
        }
        const fallback = INITIAL_NEWS.find(n => n.id === id);
        if (fallback) return fallback;
        throw new Error('News item not found');
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `news/${id}`);
        throw error;
      }
    },
    create: async (data: Partial<News>): Promise<News> => {
      try {
        const payload = {
          ...cleanPayload(data),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        let targetId = data.id;
        if (targetId) {
          await setDoc(doc(db, 'news', targetId), payload, { merge: true });
        } else {
          const docRef = await addDoc(collection(db, 'news'), payload);
          targetId = docRef.id;
        }

        api.activity.log('Published News', `Added article ${data.title || ''}`).catch(() => {});
        return { id: targetId, ...data } as News;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'news');
        throw error;
      }
    },
    update: async (id: string, data: Partial<News>): Promise<News> => {
      try {
        const payload = {
          ...cleanPayload(data),
          updatedAt: serverTimestamp()
        };
        await setDoc(doc(db, 'news', id), payload, { merge: true });
        api.activity.log('Updated News', `Modified article ${data.title || id}`).catch(() => {});
        return { id, ...data } as News;
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `news/${id}`);
        throw error;
      }
    },
    delete: async (id: string): Promise<void> => {
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
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as Competition));
        }
        return INITIAL_COMPETITIONS;
      } catch {
        return INITIAL_COMPETITIONS;
      }
    },
    create: async (data: Partial<Competition>): Promise<Competition> => {
      try {
        const payload = {
          ...cleanPayload(data),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        let targetId = data.id;
        if (targetId) {
          await setDoc(doc(db, 'competitions', targetId), payload, { merge: true });
        } else {
          const docRef = await addDoc(collection(db, 'competitions'), payload);
          targetId = docRef.id;
        }

        api.activity.log('Created Competition', `Added ${data.name || ''}`).catch(() => {});
        return { id: targetId, ...data } as Competition;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'competitions');
        throw error;
      }
    },
    update: async (id: string, data: Partial<Competition>): Promise<Competition> => {
      try {
        const payload = {
          ...cleanPayload(data),
          updatedAt: serverTimestamp()
        };
        await setDoc(doc(db, 'competitions', id), payload, { merge: true });
        api.activity.log('Updated Competition', `Modified ${data.name || id}`).catch(() => {});
        return { id, ...data } as Competition;
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `competitions/${id}`);
        throw error;
      }
    },
    delete: async (id: string): Promise<void> => {
      try {
        await deleteDoc(doc(db, 'competitions', id));
        api.activity.log('Deleted Competition', `Removed ${id}`).catch(() => {});
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
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as Trophy));
        }
        return INITIAL_TROPHIES;
      } catch {
        return INITIAL_TROPHIES;
      }
    },
    create: async (data: Partial<Trophy>): Promise<Trophy> => {
      try {
        const payload = {
          ...cleanPayload(data),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        let targetId = data.id;
        if (targetId) {
          await setDoc(doc(db, 'trophies', targetId), payload, { merge: true });
        } else {
          const docRef = await addDoc(collection(db, 'trophies'), payload);
          targetId = docRef.id;
        }

        api.activity.log('Added Trophy', `Added achievement ${data.competition || data.achievement || ''}`).catch(() => {});
        return { id: targetId, ...data } as Trophy;
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'trophies');
        throw error;
      }
    },
    update: async (id: string, data: Partial<Trophy>): Promise<Trophy> => {
      try {
        const payload = {
          ...cleanPayload(data),
          updatedAt: serverTimestamp()
        };
        await setDoc(doc(db, 'trophies', id), payload, { merge: true });
        api.activity.log('Updated Trophy', `Modified trophy ${id}`).catch(() => {});
        return { id, ...data } as Trophy;
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `trophies/${id}`);
        throw error;
      }
    },
    delete: async (id: string): Promise<void> => {
      try {
        await deleteDoc(doc(db, 'trophies', id));
        api.activity.log('Deleted Trophy', `Removed trophy ${id}`).catch(() => {});
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
        const payload = {
          ...cleanPayload(data),
          uploadedAt: new Date().toISOString()
        };
        const docRef = await addDoc(collection(db, 'media'), payload);
        api.activity.log('Uploaded Media', `Added asset ${data.name || ''}`).catch(() => {});
        return { id: docRef.id, ...data } as MediaItem;
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
        const userEmail = auth.currentUser?.email || 'mdaniyalhayyat@gmail.com';
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
      try {
        const [teams, players, matches, news, competitions, trophies, gallery, settings] = await Promise.all([
          api.teams.getAll(),
          api.players.getAll(),
          api.matches.getAll(),
          api.news.getAll(),
          api.competitions.getAll(),
          api.trophies.getAll(),
          api.gallery.getAll(),
          api.settings.get()
        ]);
        return {
          version: '1.0',
          exportedAt: new Date().toISOString(),
          data: {
            teams,
            players,
            matches,
            news,
            competitions,
            trophies,
            gallery,
            settings
          }
        };
      } catch (err) {
        console.error('Export data error:', err);
        throw err;
      }
    },
    restoreData: async (backupData: any): Promise<any> => {
      try {
        const dataset = backupData.data || backupData;
        if (dataset.settings) {
          await api.settings.update(dataset.settings);
        }
        if (Array.isArray(dataset.players)) {
          for (const p of dataset.players) {
            await setDoc(doc(db, 'players', p.id || String(Date.now())), cleanPayload(p), { merge: true });
          }
        }
        if (Array.isArray(dataset.teams)) {
          for (const t of dataset.teams) {
            await setDoc(doc(db, 'teams', t.id || String(Date.now())), cleanPayload(t), { merge: true });
          }
        }
        if (Array.isArray(dataset.matches)) {
          for (const m of dataset.matches) {
            await setDoc(doc(db, 'matches', m.id || String(Date.now())), cleanPayload(m), { merge: true });
          }
        }
        if (Array.isArray(dataset.news)) {
          for (const n of dataset.news) {
            await setDoc(doc(db, 'news', n.id || String(Date.now())), cleanPayload(n), { merge: true });
          }
        }
        api.activity.log('Restored Backup', 'Imported club dataset from backup').catch(() => {});
        return { success: true };
      } catch (err) {
        console.error('Restore error:', err);
        throw err;
      }
    }
  },

  upload: {
    image: async (base64Data: string, name: string): Promise<string> => {
      // Return base64 data for seamless local and offline storage
      return base64Data;
    }
  },

  settings: {
    get: async (): Promise<ClubSettings> => {
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
        const payload = cleanPayload(data);
        await setDoc(doc(db, 'settings', 'club'), payload, { merge: true });
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
        const teams = await api.teams.getAll();
        let matches: Match[] = [];
        try {
          const matchesSnap = await getDocs(query(collection(db, 'matches'), where('status', '==', 'completed')));
          if (!matchesSnap.empty) {
            matches = matchesSnap.docs.map(doc => doc.data() as Match);
          } else {
            matches = INITIAL_MATCHES.filter(m => m.status === 'completed');
          }
        } catch {
          matches = INITIAL_MATCHES.filter(m => m.status === 'completed');
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
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem));
        }
        return INITIAL_GALLERY;
      } catch {
        return INITIAL_GALLERY;
      }
    },
    create: async (data: Partial<GalleryItem>): Promise<GalleryItem> => {
      try {
        const payload = {
          ...cleanPayload(data),
          createdAt: serverTimestamp()
        };
        let targetId = data.id;
        if (targetId) {
          await setDoc(doc(db, 'gallery', targetId), payload, { merge: true });
        } else {
          const docRef = await addDoc(collection(db, 'gallery'), payload);
          targetId = docRef.id;
        }
        api.activity.log('Added Gallery Photo', `Uploaded image ${data.caption || ''}`).catch(() => {});
        return { id: targetId, ...data } as GalleryItem;
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
