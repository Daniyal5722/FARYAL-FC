import { Team, Player, Match, News, Competition, Trophy, ClubSettings } from '../types';

const API_BASE = '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  teams: {
    getAll: () => request<Team[]>('/teams'),
    getOne: (id: string) => request<Team>(`/teams/${id}`),
    create: (data: Partial<Team>) => request<Team>('/teams', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Team>) => request<Team>(`/teams/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/teams/${id}`, { method: 'DELETE' }),
  },
  players: {
    getAll: () => request<Player[]>('/players'),
    getOne: (id: string) => request<Player>(`/players/${id}`),
    create: (data: Partial<Player>) => request<Player>('/players', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Player>) => request<Player>(`/players/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/players/${id}`, { method: 'DELETE' }),
  },
  matches: {
    getAll: () => request<Match[]>('/matches'),
    getOne: (id: string) => request<Match>(`/matches/${id}`),
    create: (data: Partial<Match>) => request<Match>('/matches', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Match>) => request<Match>(`/matches/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/matches/${id}`, { method: 'DELETE' }),
  },
  news: {
    getAll: () => request<News[]>('/news'),
    getOne: (id: string) => request<News>(`/news/${id}`),
    create: (data: Partial<News>) => request<News>('/news', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<News>) => request<News>(`/news/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/news/${id}`, { method: 'DELETE' }),
  },
  competitions: {
    getAll: () => request<Competition[]>('/competitions'),
    create: (data: Partial<Competition>) => request<Competition>('/competitions', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Competition>) => request<Competition>(`/competitions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/competitions/${id}`, { method: 'DELETE' }),
  },
  trophies: {
    getAll: () => request<Trophy[]>('/trophies'),
    create: (data: Partial<Trophy>) => request<Trophy>('/trophies', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Trophy>) => request<Trophy>(`/trophies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/trophies/${id}`, { method: 'DELETE' }),
  },
  settings: {
    get: () => request<ClubSettings>('/settings'),
    update: (data: Partial<ClubSettings>) => request<ClubSettings>('/settings', { method: 'PUT', body: JSON.stringify(data) }),
  },
  standings: {
    get: () => request<Team[]>('/standings'),
  },
};
