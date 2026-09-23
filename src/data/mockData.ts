import { Player, Team, Match, News, GroundInfo, GalleryItem, Trophy, Competition } from '../types';

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
    status: "active",
    isCaptain: true
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
  },
  {
    id: "player-saaz",
    name: "SAAZ",
    number: 11,
    position: "Forward",
    image: "/players/saaz.jpg",
    nationality: "Pakistan",
    birthDate: "2004-02-18",
    height: "175 cm",
    weight: "69 kg",
    bio: "Skillful winger with high agility, dangerous cut-ins, and accurate striking capability.",
    stats: {
      appearances: 6,
      goals: 4,
      assists: 3,
      cleanSheets: 0,
      yellowCards: 0,
      redCards: 0
    },
    status: "active"
  }
];

export const INITIAL_PLAYERS = PLAYERS;

export const TEAMS: Team[] = [
  {
    id: "faryal-fc",
    name: "Faryal FC",
    shortName: "FFC",
    logo: "/faryal_crest.png",
    color: "#002D62",
    secondaryColor: "#3B82F6",
    coach: "Daniyal Hayyat",
    status: "active",
    isClubTeam: true,
    description: "Official first team representing Faryal Football Club in competitive leagues.",
    played: 6,
    wins: 5,
    draws: 1,
    losses: 0,
    goalsFor: 18,
    goalsAgainst: 4,
    goalDifference: 14,
    points: 16
  },
  {
    id: "karachi-united",
    name: "Karachi United Academy",
    shortName: "KUA",
    logo: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=200&auto=format&fit=crop",
    color: "#dc2626",
    secondaryColor: "#991b1b",
    coach: "Adeel Khan",
    status: "active",
    played: 6,
    wins: 4,
    draws: 1,
    losses: 1,
    goalsFor: 14,
    goalsAgainst: 7,
    goalDifference: 7,
    points: 13
  },
  {
    id: "clifton-stars",
    name: "Clifton Stars FC",
    shortName: "CSF",
    logo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=200&auto=format&fit=crop",
    color: "#16a34a",
    secondaryColor: "#15803d",
    coach: "Shahzad Rana",
    status: "active",
    played: 6,
    wins: 3,
    draws: 2,
    losses: 1,
    goalsFor: 11,
    goalsAgainst: 8,
    goalDifference: 3,
    points: 11
  },
  {
    id: "model-colony-united",
    name: "Model Colony United",
    shortName: "MCU",
    logo: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=200&auto=format&fit=crop",
    color: "#d97706",
    secondaryColor: "#b45309",
    coach: "Irfan Qureshi",
    status: "active",
    played: 6,
    wins: 2,
    draws: 1,
    losses: 3,
    goalsFor: 9,
    goalsAgainst: 12,
    goalDifference: -3,
    points: 7
  },
  {
    id: "malir-strikers",
    name: "Malir Strikers FC",
    shortName: "MSF",
    logo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=200&auto=format&fit=crop",
    color: "#9333ea",
    secondaryColor: "#7e22ce",
    coach: "Waqas Baloch",
    status: "active",
    played: 6,
    wins: 1,
    draws: 1,
    losses: 4,
    goalsFor: 6,
    goalsAgainst: 15,
    goalDifference: -9,
    points: 4
  }
];

export const INITIAL_TEAMS = TEAMS;

export const MATCHES: Match[] = [
  {
    id: "match-1",
    homeTeamId: "faryal-fc",
    awayTeamId: "karachi-united",
    homeTeamName: "Faryal FC",
    awayTeamName: "Karachi United Academy",
    date: "2026-09-15",
    time: "17:30",
    venue: "Faryal FC Ground, Karachi",
    competition: "Karachi Premier League",
    status: "completed",
    homeScore: 3,
    awayScore: 1,
    events: [
      { id: "e1", type: "goal", minute: 14, playerId: "player-3", playerName: "Daniyal Hayyat" },
      { id: "e2", type: "goal", minute: 38, playerId: "player-saaz", playerName: "SAAZ", assistId: "player-3" },
      { id: "e3", type: "goal", minute: 72, playerId: "player-mahad", playerName: "MAHAD" }
    ],
    notes: "Dominant tactical display in front of the home crowd.",
    matchReport: "Faryal FC showcased clinical counter-attacking football to secure all 3 points against tough rivals."
  },
  {
    id: "match-2",
    homeTeamId: "clifton-stars",
    awayTeamId: "faryal-fc",
    homeTeamName: "Clifton Stars FC",
    awayTeamName: "Faryal FC",
    date: "2026-09-18",
    time: "16:00",
    venue: "Clifton Sports Complex",
    competition: "Karachi Premier League",
    status: "completed",
    homeScore: 0,
    awayScore: 2,
    events: [
      { id: "e4", type: "goal", minute: 29, playerId: "player-hussian", playerName: "HUSSIAN" },
      { id: "e5", type: "goal", minute: 81, playerId: "player-3", playerName: "Daniyal Hayyat" }
    ]
  },
  {
    id: "match-3",
    homeTeamId: "faryal-fc",
    awayTeamId: "model-colony-united",
    homeTeamName: "Faryal FC",
    awayTeamName: "Model Colony United",
    date: "2026-09-28",
    time: "17:00",
    venue: "Faryal FC Ground, Karachi",
    competition: "Karachi Premier League",
    status: "upcoming",
    homeScore: 0,
    awayScore: 0
  }
];

export const INITIAL_MATCHES = MATCHES;

export const NEWS: News[] = [
  {
    id: "news-1",
    title: "Faryal FC Powers to 3-1 Derby Triumph at Home Ground",
    summary: "A masterclass attacking performance ensures Faryal FC retains top position in the league standings.",
    content: "Under the floodlights of Faryal FC Ground in Model Colony, the home side delivered an unforgettable performance with goals from Captain Daniyal Hayyat, SAAZ, and young sensation Mahad.",
    category: "Match Report",
    date: "2026-09-16",
    author: "Faryal Media Desk",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
    status: "published"
  },
  {
    id: "news-2",
    title: "Youth Academy Trials Open for Fall 2026 Season",
    summary: "Faryal Football Club invites aspiring footballers under U-15 and U-19 age groups for official trials.",
    content: "Registration is now open for talented grassroots players across Karachi to join the official Faryal FC development squad with direct access to UEFA-certified coaching modules.",
    category: "Academy",
    date: "2026-09-10",
    author: "Coaching Staff",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop",
    status: "published"
  }
];

export const INITIAL_NEWS = NEWS;

export const GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
    caption: "First Team intense pre-match training under floodlights.",
    category: "Training",
    date: "2026-09-14"
  },
  {
    id: "gal-2",
    url: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop",
    caption: "Faryal FC Ground natural grass pitch in pristine matchday condition.",
    category: "Ground",
    date: "2026-09-10"
  },
  {
    id: "gal-3",
    url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop",
    caption: "Team huddle celebrating the derby triumph.",
    category: "Matchday",
    date: "2026-09-15"
  }
];

export const INITIAL_GALLERY = GALLERY;

export const TROPHIES: Trophy[] = [
  {
    id: "trophy-1",
    competition: "Karachi Champions League",
    season: "2025/2026",
    image: "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=400&auto=format&fit=crop",
    achievement: "Champions",
    description: "Undefeated championship campaign across 12 fixtures."
  },
  {
    id: "trophy-2",
    competition: "Sindh Football Cup",
    season: "2024/2025",
    image: "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?q=80&w=400&auto=format&fit=crop",
    achievement: "Finalists / Silver Medallists",
    description: "Runner-up finish in the regional knockout tournament."
  }
];

export const INITIAL_TROPHIES = TROPHIES;

export const COMPETITIONS: Competition[] = [
  {
    id: "comp-1",
    name: "Karachi Premier League",
    season: "2025/2026",
    startDate: "2026-08-01",
    endDate: "2026-11-30",
    type: "league",
    active: true,
    status: "active"
  },
  {
    id: "comp-2",
    name: "Model Colony Cup",
    season: "2026",
    startDate: "2026-10-15",
    endDate: "2026-11-05",
    type: "cup",
    active: true,
    status: "upcoming"
  }
];

export const INITIAL_COMPETITIONS = COMPETITIONS;

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
