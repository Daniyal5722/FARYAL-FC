import { Player, Match, News, GroundInfo } from '../types';

export const PLAYERS: Player[] = [];
export const MATCHES: Match[] = [];
export const NEWS: News[] = [];

export const GROUND: GroundInfo = {
  name: 'Faryal FC Ground',
  address: '20-A Main Rd, Model Colony Block 24 Model Colony, Karachi, 75080, Pakistan',
  latitude: 24.903822,
  longitude: 67.194202,
  description: 'The official home of Faryal FC. A world-class facility located in the heart of Model Colony, Karachi, designed to foster talent and host competitive matches.',
  facilities: ['Professional Grass Pitch', 'Floodlights', 'Changing Rooms', 'Spectator Area', 'Training Zone'],
  capacity: '500',
  surface: 'Natural Grass',
  images: [
    'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop'
  ]
};
