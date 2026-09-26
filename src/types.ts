export type PlayerPosition = 'GK' | 'CB' | 'LB' | 'RB' | 'LWB' | 'RWB' | 'CDM' | 'CM' | 'CAM' | 'LM' | 'RM' | 'LW' | 'RW' | 'ST' | 'CF';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  image?: string;
  color: string;
  secondaryColor?: string;
  captainId?: string;
  coach: string;
  played?: number;
  wins?: number;
  draws?: number;
  losses?: number;
  goalsFor?: number;
  goalsAgainst?: number;
  goalDifference?: number;
  points?: number;
  status: 'active' | 'inactive';
  description?: string;
  isClubTeam?: boolean;
}

export interface Player {
  id: string;
  name: string;
  number: number | null;
  position: string;
  image: string;
  nationality: string;
  birthDate: string;
  height?: string;
  weight?: string;
  bio: string;
  isCaptain?: boolean;
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
  playerName?: string;
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
  events?: MatchEvent[];
  notes?: string;
  matchReport?: string;
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
  summary?: string;
  image: string;
  category: string;
  date: string;
  author: string;
  status?: 'draft' | 'published';
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
  description?: string;
  facilities?: string[];
  capacity?: string;
  surface?: string;
  images?: string[];
}

export type GroundInfo = GroundLocation;

export interface ThemeConfig {
  mode: 'dark' | 'light' | 'system';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  mutedTextColor: string;
  borderColor: string;
  buttonColor: string;
  buttonHoverColor: string;
  borderRadius: 'sharp' | 'sm' | 'md' | 'lg' | 'xl';
  stylePreset: 'modern_sports' | 'professional' | 'minimal' | 'premium' | 'classic';
  typography: {
    headingFont: string;
    bodyFont: string;
    navigationFont?: string;
    fontScale: 'compact' | 'normal' | 'large';
    headingWeight: string;
    bodyWeight: string;
    letterSpacing: string;
  };
  animations: {
    enabled: boolean;
    intensity: 'low' | 'medium' | 'high';
    pageTransitions: boolean;
    hoverAnimations: boolean;
    backgroundAnimation: boolean;
    motionEffects: boolean;
  };
  background: {
    type: 'solid' | 'gradient' | 'image' | 'animated';
    customImageUrl?: string;
    patternOpacity: number;
  };
}

export interface BrandingConfig {
  clubName: string;
  shortName: string;
  tagline: string;
  logo: string;
  headerLogo?: string;
  footerLogo?: string;
  favicon?: string;
}

export interface HeroConfig {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  visible: boolean;
  showAnimation: boolean;
}

export interface HomepageSection {
  id: string;
  name: string;
  visible: boolean;
  order: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  visible: boolean;
  order: number;
  isExternal?: boolean;
}

export interface PageSEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export interface SEOConfig {
  siteTitle: string;
  metaDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  robots: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterHandle?: string;
  siteName?: string;
  locale?: string;
  pages?: Record<string, PageSEOConfig>;
  title?: string;
  description?: string;
}

export interface MaintenanceConfig {
  enabled: boolean;
  message: string;
  expectedBackTime?: string;
  allowAdminBypass: boolean;
}

export interface SocialLinksConfig {
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  twitter?: string;
}

export interface ContactConfig {
  email: string;
  phone: string;
  address: string;
  description?: string;
}

export interface FooterConfig {
  description: string;
  copyrightText: string;
  showSocials: boolean;
  showContact: boolean;
  showNav: boolean;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  category: 'logo' | 'player' | 'match' | 'news' | 'gallery' | 'background';
  size?: number;
  uploadedAt: string;
}

export interface ActivityLog {
  id: string;
  adminEmail: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface ClubSettings {
  name: string;
  shortName: string;
  founded: string;
  logo: string;
  headerLogo?: string;
  footerLogo?: string;
  favicon?: string;
  tagline?: string;
  primaryColor: string;
  secondaryColor: string;
  stadium: string;
  ground: GroundLocation;
  history: string;
  vision: string;
  mission: string;
  socials: SocialLinksConfig;
  contact: ContactConfig;
  theme?: ThemeConfig;
  branding?: BrandingConfig;
  hero?: HeroConfig;
  homepageSections?: HomepageSection[];
  navigation?: NavigationItem[];
  footer?: FooterConfig;
  seo?: SEOConfig;
  maintenance?: MaintenanceConfig;
  formation?: FormationConfig;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  category: string;
  date?: string;
}

export type FormationType = '4-4-2' | '4-3-3' | '4-2-3-1' | '3-5-2' | '3-4-3' | '5-3-2';

export interface TacticalPillar {
  title: string;
  desc: string;
}

export interface FormationConfig {
  defaultFormation: FormationType;
  enabledFormations: FormationType[];
  title?: string;
  subtitle?: string;
  description?: string;
  tacticalNotes?: string;
  tacticalPillars?: TacticalPillar[];
  lineup?: Record<string, string>; // key: `${formation}-${positionIndex}` -> playerId
}
