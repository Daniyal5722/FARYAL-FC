import { Player, Match, News, GroundInfo } from '../types';

export const PLAYERS: Player[] = [
  {
    id: "player-1",
    name: "Hamza Tariq",
    number: 1,
    position: "Goalkeeper",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    nationality: "Pakistan",
    birthDate: "1998-04-12",
    height: "188 cm",
    weight: "82 kg",
    bio: "First-choice goalkeeper and vice-captain with exceptional reflexes and commanding aerial presence.",
    stats: {
      appearances: 6,
      goals: 0,
      assists: 0,
      cleanSheets: 3,
      yellowCards: 0,
      redCards: 0
    },
    status: "active"
  },
  {
    id: "player-2",
    name: "Bilal Ahmed",
    number: 4,
    position: "Defender",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    nationality: "Pakistan",
    birthDate: "2000-08-19",
    height: "185 cm",
    weight: "79 kg",
    bio: "Solid central defender with exceptional tackling and tactical awareness.",
    stats: {
      appearances: 6,
      goals: 1,
      assists: 0,
      cleanSheets: 3,
      yellowCards: 1,
      redCards: 0
    },
    status: "active"
  },
  {
    id: "player-3",
    name: "Daniyal Hayyat",
    number: 10,
    position: "Forward",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    nationality: "Pakistan",
    birthDate: "2001-03-15",
    height: "178 cm",
    weight: "73 kg",
    bio: "Club captain and talismanic playmaker, known for lethal finishing and creative vision.",
    stats: {
      appearances: 6,
      goals: 7,
      assists: 4,
      cleanSheets: 0,
      yellowCards: 1,
      redCards: 0
    },
    status: "active"
  },
  {
    id: "player-4",
    name: "Zain Ul Abideen",
    number: 8,
    position: "Midfielder",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
    nationality: "Pakistan",
    birthDate: "2002-11-05",
    height: "175 cm",
    weight: "70 kg",
    bio: "Box-to-box midfielder with relentless stamina and dynamic passing range.",
    stats: {
      appearances: 6,
      goals: 3,
      assists: 3,
      cleanSheets: 0,
      yellowCards: 2,
      redCards: 0
    },
    status: "active"
  },
  {
    id: "player-5",
    name: "Saad Khan",
    number: 7,
    position: "Forward",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=400&auto=format&fit=crop",
    nationality: "Pakistan",
    birthDate: "2003-01-22",
    height: "176 cm",
    weight: "68 kg",
    bio: "Electric winger known for blistering pace, quick stepovers, and accurate crosses.",
    stats: {
      appearances: 6,
      goals: 3,
      assists: 5,
      cleanSheets: 0,
      yellowCards: 0,
      redCards: 0
    },
    status: "active"
  },
  {
    id: "player-6",
    name: "Usman Malik",
    number: 5,
    position: "Defender",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
    nationality: "Pakistan",
    birthDate: "1999-07-30",
    height: "183 cm",
    weight: "78 kg",
    bio: "Aggressive center-back who organizes the defensive line with authority.",
    stats: {
      appearances: 5,
      goals: 0,
      assists: 1,
      cleanSheets: 2,
      yellowCards: 2,
      redCards: 0
    },
    status: "active"
  },
  {
    id: "player-hussian",
    name: "HUSSIAN",
    number: 7,
    position: "Forward",
    image: "/players/hussian.jpg",
    nationality: "Pakistan",
    birthDate: "2000-05-14",
    height: "180 cm",
    weight: "78 kg",
    bio: "Explosive forward with physical power, sharp finishing, and relentless work ethic on the pitch.",
    stats: {
      appearances: 6,
      goals: 5,
      assists: 2,
      cleanSheets: 0,
      yellowCards: 1,
      redCards: 0
    },
    status: "active"
  },
  {
    id: "player-nadir",
    name: "NADIR",
    number: 6,
    position: "Midfielder",
    image: "/players/nadir.jpg",
    nationality: "Pakistan",
    birthDate: "2005-09-10",
    height: "177 cm",
    weight: "71 kg",
    bio: "Tenacious central midfielder with exceptional passing range, composure under pressure, and defensive tenacity.",
    stats: {
      appearances: 6,
      goals: 2,
      assists: 4,
      cleanSheets: 0,
      yellowCards: 1,
      redCards: 0
    },
    status: "active"
  },
  {
    id: "player-mahad",
    name: "MAHAD",
    number: 10,
    position: "Forward",
    image: "/players/mahad.jpg",
    nationality: "Pakistan",
    birthDate: "2010-06-25",
    height: "168 cm",
    weight: "58 kg",
    bio: "Gifted dynamic attacker with nimble footwork, infectious enthusiasm, and natural goal-scoring instincts.",
    stats: {
      appearances: 5,
      goals: 4,
      assists: 3,
      cleanSheets: 0,
      yellowCards: 0,
      redCards: 0
    },
    status: "active"
  }
];
export const MATCHES: Match[] = [];
export const NEWS: News[] = [];

export const GROUND: GroundInfo = {
  name: 'Faryal FC Ground',
  address: '20-A Main Rd, Model Colony Block 24 Model Colony, Karachi, 75080, Pakistan',
  latitude: 24.903822,
  longitude: 67.194202,
  mapsUrl: 'https://maps.google.com/?q=24.903822,67.194202',
  description: 'The official home of Faryal FC. A world-class facility located in the heart of Model Colony, Karachi, designed to foster talent and host competitive matches.',
  facilities: ['Professional Grass Pitch', 'Floodlights', 'Changing Rooms', 'Spectator Area', 'Training Zone'],
  capacity: '500',
  surface: 'Natural Grass',
  images: [
    'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop'
  ]
};
