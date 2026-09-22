export type PlayerPosition = 'GK' | 'CB' | 'LB' | 'RB' | 'LWB' | 'RWB' | 'CDM' | 'CM' | 'CAM' | 'LM' | 'RM' | 'LW' | 'RW' | 'ST' | 'CF';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  image: string;
  color: string;
  secondaryColor?: string;
  captainId?: string;
  coach: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  status: 'active' | 'inactive';
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  image: string;
  nationality: string;
  birthDate: string;
  height?: string;
  weight?: string;
  bio: string;
  stats: {
    appearances: number;
    goals: number;
    assists: number;
    cleanSheets: number;
    yellowCards?: number;
    redCards?: number;
  };
  status: 'active' | 'injured' | 'suspended' | 'inactive';
}

export interface MatchEvent {
  id: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
  minute: number;
  playerId: string;
  assistId?: string;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName: string;
  awayTeamName: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  status: 'upcoming' | 'completed' | 'live' | 'postponed' | 'cancelled';
  homeScore: number;
  awayScore: number;
  events: MatchEvent[];
}

export interface Competition {
  id: string;
  name: string;
  season: string;
  startDate: string;
  endDate: string;
  type: 'league' | 'cup' | 'tournament';
  active: boolean;
  status: 'active' | 'completed' | 'upcoming';
}

export interface News {
  id: string;
  title: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: string;
}

export interface Trophy {
  id: string;
  competition: string;
  season: string;
  image: string;
  achievement: string;
  description: string;
}

export interface GroundLocation {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  mapsUrl: string;
}

export interface ClubSettings {
  name: string;
  shortName: string;
  founded: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  stadium: string;
  ground: GroundLocation;
  history: string;
  vision: string;
  mission: string;
  socials: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
    whatsapp?: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
}

export interface GroundInfo {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  facilities: string[];
  capacity?: string;
  surface: string;
  images: string[];
}

export type FormationType = '4-4-2' | '4-3-3' | '4-2-3-1' | '3-5-2' | '3-4-3' | '5-3-2';
