import { Player, Match, News, GroundInfo } from '../types';

export const PLAYERS: Player[] = [
  {
    id: "player-hussian",
    name: "Hussain",
    number: 7,
    position: "",
    image: "/players/hussian.jpg",
    nationality: "Pakistan",
    birthDate: "",
    height: "",
    weight: "",
    bio: "",
    stats: {
      appearances: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      yellowCards: 0,
      redCards: 0
    },
    status: "active"
  },
  {
    id: "player-mahad",
    name: "Mahad",
    number: 10,
    position: "",
    image: "/players/mahad.jpg",
    nationality: "Pakistan",
    birthDate: "",
    height: "",
    weight: "",
    bio: "",
    stats: {
      appearances: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      yellowCards: 0,
      redCards: 0
    },
    status: "active"
  },
  {
    id: "player-nadir-1",
    name: "Nadir",
    number: 6,
    position: "",
    image: "/players/nadir.jpg",
    nationality: "Pakistan",
    birthDate: "",
    height: "",
    weight: "",
    bio: "",
    stats: {
      appearances: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      yellowCards: 0,
      redCards: 0
    },
    status: "active"
  },
  {
    id: "player-daniyal-hayat",
    name: "Daniyal Hayat",
    number: 22,
    position: "",
    image: "",
    nationality: "Pakistan",
    birthDate: "",
    height: "",
    weight: "",
    bio: "",
    stats: {
      appearances: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      yellowCards: 0,
      redCards: 0
    },
    status: "active"
  },
  {
    id: "player-qadir",
    name: "Qadir",
    number: null,
    position: "",
    image: "",
    nationality: "Pakistan",
    birthDate: "",
    height: "",
    weight: "",
    bio: "",
    stats: {
      appearances: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      yellowCards: 0,
      redCards: 0
    },
    status: "active"
  },
  {
    id: "player-mohammad",
    name: "Mohammad",
    number: null,
    position: "",
    image: "",
    nationality: "Pakistan",
    birthDate: "",
    height: "",
    weight: "",
    bio: "",
    stats: {
      appearances: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      yellowCards: 0,
      redCards: 0
    },
    status: "active"
  },
  {
    id: "player-nadir-2",
    name: "Nadir",
    number: null,
    position: "",
    image: "",
    nationality: "Pakistan",
    birthDate: "",
    height: "",
    weight: "",
    bio: "",
    stats: {
      appearances: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      yellowCards: 0,
      redCards: 0
    },
    status: "active"
  },
  {
    "id": "player-mudassar",
    "name": "Mudassar",
    "number": null,
    "position": "",
    "image": "",
    "nationality": "Pakistan",
    "birthDate": "",
    "height": "",
    "weight": "",
    "bio": "",
    "stats": {
      "appearances": 0,
      "goals": 0,
      "assists": 0,
      "cleanSheets": 0,
      "yellowCards": 0,
      "redCards": 0
    },
    "status": "active"
  },
  {
    "id": "player-saaz",
    "name": "Saaz",
    "number": null,
    "position": "",
    "image": "",
    "nationality": "Pakistan",
    "birthDate": "",
    "height": "",
    "weight": "",
    "bio": "",
    "stats": {
      "appearances": 0,
      "goals": 0,
      "assists": 0,
      "cleanSheets": 0,
      "yellowCards": 0,
      "redCards": 0
    },
    "status": "active"
  },
  {
    "id": "player-sufyan",
    "name": "Sufyan",
    "number": null,
    "position": "",
    "image": "",
    "nationality": "Pakistan",
    "birthDate": "",
    "height": "",
    "weight": "",
    "bio": "",
    "stats": {
      "appearances": 0,
      "goals": 0,
      "assists": 0,
      "cleanSheets": 0,
      "yellowCards": 0,
      "redCards": 0
    },
    "status": "active"
  }
];

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
