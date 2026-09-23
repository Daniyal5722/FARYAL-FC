import {
  ThemeConfig,
  BrandingConfig,
  HeroConfig,
  HomepageSection,
  NavigationItem,
  SEOConfig,
  MaintenanceConfig,
  ClubSettings
} from '../types';

export const DEFAULT_THEME: ThemeConfig = {
  mode: 'dark',
  primaryColor: '#002d62',
  secondaryColor: '#07111F',
  accentColor: '#3b82f6',
  backgroundColor: '#020617',
  surfaceColor: '#0f172a',
  textColor: '#f8fafc',
  mutedTextColor: '#94a3b8',
  borderColor: '#1e293b',
  buttonColor: '#2563eb',
  buttonHoverColor: '#1d4ed8',
  borderRadius: 'md',
  stylePreset: 'modern_sports',
  typography: {
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    navigationFont: 'Plus Jakarta Sans',
    fontScale: 'normal',
    headingWeight: '900',
    bodyWeight: '500',
    letterSpacing: '-0.02em',
  },
  animations: {
    enabled: true,
    intensity: 'medium',
    pageTransitions: true,
    hoverAnimations: true,
    backgroundAnimation: true,
    motionEffects: true,
  },
  background: {
    type: 'gradient',
    patternOpacity: 0.15,
  },
};

export const THEME_PRESETS: Record<string, Partial<ThemeConfig>> = {
  modern_sports: {
    primaryColor: '#002d62',
    secondaryColor: '#07111F',
    accentColor: '#3b82f6',
    backgroundColor: '#020617',
    surfaceColor: '#0f172a',
    borderRadius: 'md',
    stylePreset: 'modern_sports',
  },
  professional: {
    primaryColor: '#0f172a',
    secondaryColor: '#1e293b',
    accentColor: '#0284c7',
    backgroundColor: '#030712',
    surfaceColor: '#111827',
    borderRadius: 'sm',
    stylePreset: 'professional',
  },
  minimal: {
    primaryColor: '#18181b',
    secondaryColor: '#27272a',
    accentColor: '#e4e4e7',
    backgroundColor: '#09090b',
    surfaceColor: '#18181b',
    borderRadius: 'sharp',
    stylePreset: 'minimal',
  },
  premium: {
    primaryColor: '#001a3d',
    secondaryColor: '#000d20',
    accentColor: '#60a5fa',
    backgroundColor: '#010409',
    surfaceColor: '#0d1117',
    borderRadius: 'lg',
    stylePreset: 'premium',
  },
  classic: {
    primaryColor: '#1e3a8a',
    secondaryColor: '#172554',
    accentColor: '#38bdf8',
    backgroundColor: '#0b0f19',
    surfaceColor: '#151c2e',
    borderRadius: 'xl',
    stylePreset: 'classic',
  },
};

export const DEFAULT_BRANDING: BrandingConfig = {
  clubName: 'Faryal FC',
  shortName: 'FFC',
  tagline: 'Built For The Game',
  logo: '/logo.png',
  headerLogo: '/logo.png',
  footerLogo: '/logo.png',
  favicon: '/favicon.ico',
};

export const DEFAULT_HERO: HeroConfig = {
  title: 'FARYAL FC',
  subtitle: 'BUILT FOR THE GAME',
  description: 'Developing elite football talent with tactical discipline, uncompromising spirit, and professional standards in Karachi, Pakistan.',
  backgroundImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1920&auto=format&fit=crop',
  ctaText: 'VIEW SQUAD',
  ctaLink: '/team',
  secondaryCtaText: 'LATEST FIXTURES',
  secondaryCtaLink: '/matches',
  visible: true,
  showAnimation: true,
};

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSection[] = [
  { id: 'hero', name: 'Hero Section', visible: true, order: 1 },
  { id: 'featured_match', name: 'Match Center & Next Game', visible: true, order: 2 },
  { id: 'squad', name: 'Player Spotlight', visible: true, order: 3 },
  { id: 'standings', name: 'League Standings', visible: true, order: 4 },
  { id: 'results', name: 'Latest Match Results', visible: true, order: 5 },
  { id: 'news', name: 'Club News & Updates', visible: true, order: 6 },
  { id: 'ground', name: 'Home Ground Location', visible: true, order: 7 },
  { id: 'story', name: 'Our History & Mission', visible: true, order: 8 },
  { id: 'gallery', name: 'Club Gallery', visible: true, order: 9 },
];

export const DEFAULT_NAVIGATION: NavigationItem[] = [
  { id: 'home', label: 'Home', url: '/', visible: true, order: 1 },
  { id: 'team', label: 'Squad', url: '/team', visible: true, order: 2 },
  { id: 'matches', label: 'Matches', url: '/matches', visible: true, order: 3 },
  { id: 'standings', label: 'Standings', url: '/standings', visible: true, order: 4 },
  { id: 'formation', label: 'Formation', url: '/formation', visible: true, order: 5 },
  { id: 'goals', label: 'Goals', url: '/goals', visible: true, order: 6 },
  { id: 'ground', label: 'Ground', url: '/ground', visible: true, order: 7 },
  { id: 'news', label: 'News', url: '/news', visible: true, order: 8 },
  { id: 'gallery', label: 'Gallery', url: '/gallery', visible: true, order: 9 },
  { id: 'about', label: 'About', url: '/about', visible: true, order: 10 },
  { id: 'contact', label: 'Contact', url: '/contact', visible: true, order: 11 },
];

export const DEFAULT_SEO: SEOConfig = {
  siteTitle: 'Faryal FC | Official Football Club Website',
  metaDescription: 'Faryal FC is a football club featuring team players, matches, fixtures, results, standings, news, and official club information.',
  keywords: 'Faryal FC, football club, Karachi football, Pakistan football, football squad, league standings, Faryal FC Ground, Model Colony football',
  ogTitle: 'Faryal FC | Official Football Club Website',
  ogDescription: 'Faryal FC is a football club featuring team players, matches, fixtures, results, standings, news, and official club information.',
  ogImage: '/faryal_crest.png',
  canonicalUrl: 'https://faryal-fc.vercel.app',
  robots: 'index, follow',
  robotsIndex: true,
  robotsFollow: true,
  twitterTitle: 'Faryal FC | Official Football Club Website',
  twitterDescription: 'Faryal FC is a football club featuring team players, matches, fixtures, results, standings, news, and official club information.',
  twitterImage: '/faryal_crest.png',
  twitterHandle: '@faryalfc',
  siteName: 'Faryal FC',
  locale: 'en_PK',
  pages: {
    home: {
      title: 'Faryal FC | Official Football Club Website',
      description: 'Faryal FC is a football club featuring team players, matches, fixtures, results, standings, news, and official club information.',
      canonicalUrl: 'https://faryal-fc.vercel.app/'
    },
    team: {
      title: 'Faryal FC Players | Official Squad',
      description: 'Meet the official Faryal FC squad roster. Explore player positions, captain info, bios, appearances, goals, and season statistics.',
      canonicalUrl: 'https://faryal-fc.vercel.app/team'
    },
    matches: {
      title: 'Faryal FC Matches | Fixtures & Results',
      description: 'View Faryal FC match fixtures, upcoming schedules, real-time match events, and latest competitive results.',
      canonicalUrl: 'https://faryal-fc.vercel.app/matches'
    },
    standings: {
      title: 'Faryal FC Standings | League Table',
      description: 'Check the official league table standings, points, goal differences, and head-to-head records for Faryal FC.',
      canonicalUrl: 'https://faryal-fc.vercel.app/standings'
    },
    news: {
      title: 'Faryal FC News | Latest Club Updates',
      description: 'Get the latest Faryal FC club announcements, match reports, squad news, and press releases.',
      canonicalUrl: 'https://faryal-fc.vercel.app/news'
    },
    ground: {
      title: 'Faryal FC Ground | Official Home Stadium & Facility',
      description: 'Official stadium details, directions, facilities, and pitch information for Faryal FC Ground in Model Colony, Karachi.',
      canonicalUrl: 'https://faryal-fc.vercel.app/ground'
    },
    formation: {
      title: 'Faryal FC Tactics | Squad Formation & Pitch Lineup',
      description: 'Explore starting lineups, tactical formation strategies, and pitch positioning for Faryal FC.',
      canonicalUrl: 'https://faryal-fc.vercel.app/formation'
    },
    goals: {
      title: 'Faryal FC Goals | Season Highlights & Top Scorers',
      description: 'Track season goals, assists, top scorers, and match milestone highlights for Faryal FC.',
      canonicalUrl: 'https://faryal-fc.vercel.app/goals'
    },
    gallery: {
      title: 'Faryal FC Gallery | Official Match & Training Photos',
      description: 'High-resolution photo gallery showcasing Faryal FC match action, squad training, and club events.',
      canonicalUrl: 'https://faryal-fc.vercel.app/gallery'
    },
    about: {
      title: 'About Faryal FC | History, Vision & Mission',
      description: 'Discover the story, founding vision, and mission of Faryal Football Club based in Karachi, Pakistan.',
      canonicalUrl: 'https://faryal-fc.vercel.app/about'
    },
    contact: {
      title: 'Contact Faryal FC | Trials, Fixtures & Inquiries',
      description: 'Contact Faryal FC management for academy trials, friendly matches, media inquiries, and club collaborations.',
      canonicalUrl: 'https://faryal-fc.vercel.app/contact'
    }
  }
};

export const DEFAULT_MAINTENANCE: MaintenanceConfig = {
  enabled: false,
  message: 'Faryal FC official portal is currently undergoing scheduled maintenance. We will be back online shortly.',
  expectedBackTime: 'Soon',
  allowAdminBypass: true,
};

export const DEFAULT_FULL_SETTINGS: ClubSettings = {
  name: 'Faryal FC',
  shortName: 'FFC',
  founded: '2024',
  logo: '/logo.png',
  headerLogo: '/logo.png',
  footerLogo: '/logo.png',
  favicon: '/favicon.ico',
  tagline: 'Built For The Game',
  primaryColor: '#002d62',
  secondaryColor: '#07111F',
  stadium: 'Faryal Ground',
  ground: {
    name: 'Faryal FC Ground',
    address: '20-A Main Rd, Model Colony Block 24 Model Colony, Karachi, 75080, Pakistan',
    latitude: 24.903822,
    longitude: 67.194202,
    mapsUrl: 'https://share.google/WntzBRDQxKW4EUPPI',
    description: 'The home fortress of Faryal FC located in Model Colony, Karachi.',
    facilities: ['Floodlights', 'Dressing Rooms', 'Warm-up Zone', 'Medical Bay', 'Parking'],
    capacity: '1,500',
    surface: 'Natural Grass Turf',
  },
  history: 'Faryal FC was established in 2024 with a vision to build a world-class footballing community. Starting from local roots in Karachi, the club has quickly grown into a competitive force, emphasizing youth development, tactical excellence, and a spirit that never says die.',
  vision: 'To become the premier destination for footballing talent in the region and inspire the next generation of athletes.',
  mission: 'To develop technically gifted players who play with passion, tactical discipline, and unrelenting integrity.',
  socials: {
    instagram: 'https://instagram.com/faryalfc',
    facebook: 'https://facebook.com/faryalfc',
    whatsapp: 'https://wa.me/923000000000',
    youtube: 'https://youtube.com/@faryalfc',
    tiktok: 'https://tiktok.com/@faryalfc',
    twitter: 'https://twitter.com/faryalfc',
  },
  contact: {
    email: 'info@faryalfc.com',
    phone: '+92 300 000 0000',
    address: '20-A Main Rd, Model Colony, Karachi, Pakistan',
    description: 'Get in touch with Faryal FC management for trials, fixtures, sponsorships, or media inquiries.',
  },
  footer: {
    description: 'Official digital platform of Faryal FC. Built for the community, driven by passion.',
    copyrightText: '© 2024-2026 Faryal FC. All rights reserved.',
    showSocials: true,
    showContact: true,
    showNav: true,
  },
  theme: DEFAULT_THEME,
  branding: DEFAULT_BRANDING,
  hero: DEFAULT_HERO,
  homepageSections: DEFAULT_HOMEPAGE_SECTIONS,
  navigation: DEFAULT_NAVIGATION,
  seo: DEFAULT_SEO,
  maintenance: DEFAULT_MAINTENANCE,
};
