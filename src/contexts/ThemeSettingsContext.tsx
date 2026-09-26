import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ClubSettings, ThemeConfig, BrandingConfig, HeroConfig, HomepageSection, NavigationItem, SEOConfig, MaintenanceConfig, FormationConfig } from '../types';
import { DEFAULT_FULL_SETTINGS, DEFAULT_THEME, THEME_PRESETS, DEFAULT_FORMATION_CONFIG } from '../data/defaultConfig';
import { api } from '../lib/api';
import { useFirebase } from './FirebaseContext';

interface ThemeSettingsContextType {
  settings: ClubSettings;
  theme: ThemeConfig;
  branding: BrandingConfig;
  hero: HeroConfig;
  formation: FormationConfig;
  homepageSections: HomepageSection[];
  navigation: NavigationItem[];
  seo: SEOConfig;
  maintenance: MaintenanceConfig;
  loading: boolean;
  updateSettings: (newSettings: Partial<ClubSettings>) => Promise<void>;
  updateTheme: (newTheme: Partial<ThemeConfig>, previewOnly?: boolean) => void;
  saveTheme: (themeToSave?: ThemeConfig) => Promise<void>;
  resetTheme: () => Promise<void>;
  applyPreset: (presetKey: string) => void;
}

const ThemeSettingsContext = createContext<ThemeSettingsContextType | undefined>(undefined);

const RADIUS_MAP: Record<string, string> = {
  sharp: '0px',
  sm: '6px',
  md: '12px',
  lg: '18px',
  xl: '26px',
};

export const ThemeSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ClubSettings>(DEFAULT_FULL_SETTINGS);
  const [activeTheme, setActiveTheme] = useState<ThemeConfig>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const { user } = useFirebase();

  const applyCssVariables = useCallback((theme: ThemeConfig) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    root.style.setProperty('--color-primary', theme.primaryColor || '#002d62');
    root.style.setProperty('--color-secondary', theme.secondaryColor || '#07111F');
    root.style.setProperty('--color-accent', theme.accentColor || '#3b82f6');
    root.style.setProperty('--color-background', theme.backgroundColor || '#020617');
    root.style.setProperty('--color-surface', theme.surfaceColor || '#0f172a');
    root.style.setProperty('--color-text', theme.textColor || '#f8fafc');
    root.style.setProperty('--color-muted', theme.mutedTextColor || '#94a3b8');
    root.style.setProperty('--color-border', theme.borderColor || '#1e293b');
    root.style.setProperty('--color-button', theme.buttonColor || '#2563eb');
    root.style.setProperty('--color-button-hover', theme.buttonHoverColor || '#1d4ed8');

    const radiusVal = RADIUS_MAP[theme.borderRadius] || '12px';
    root.style.setProperty('--radius-val', radiusVal);

    if (theme.typography?.headingFont) {
      root.style.setProperty('--font-heading', `"${theme.typography.headingFont}", sans-serif`);
    }
    if (theme.typography?.bodyFont) {
      root.style.setProperty('--font-body', `"${theme.typography.bodyFont}", sans-serif`);
    }

    if (theme.mode === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.settings.get();
        if (data) {
          const merged: ClubSettings = {
            ...DEFAULT_FULL_SETTINGS,
            ...data,
            theme: { ...DEFAULT_THEME, ...(data.theme || {}) },
            branding: { ...DEFAULT_FULL_SETTINGS.branding!, ...(data.branding || {}) },
            hero: { ...DEFAULT_FULL_SETTINGS.hero!, ...(data.hero || {}) },
            homepageSections: data.homepageSections || DEFAULT_FULL_SETTINGS.homepageSections,
            navigation: data.navigation || DEFAULT_FULL_SETTINGS.navigation,
            seo: { ...DEFAULT_FULL_SETTINGS.seo!, ...(data.seo || {}) },
            maintenance: { ...DEFAULT_FULL_SETTINGS.maintenance!, ...(data.maintenance || {}) },
            formation: { ...DEFAULT_FORMATION_CONFIG, ...(data.formation || {}) },
            ground: { ...DEFAULT_FULL_SETTINGS.ground, ...(data.ground || {}) },
            socials: { ...DEFAULT_FULL_SETTINGS.socials, ...(data.socials || {}) },
            contact: { ...DEFAULT_FULL_SETTINGS.contact, ...(data.contact || {}) },
            footer: { ...DEFAULT_FULL_SETTINGS.footer!, ...(data.footer || {}) },
          };
          setSettings(merged);
          setActiveTheme(merged.theme || DEFAULT_THEME);
          applyCssVariables(merged.theme || DEFAULT_THEME);
        }
      } catch (err) {
        console.warn('Failed to fetch remote settings, using defaults:', err);
        applyCssVariables(DEFAULT_THEME);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [applyCssVariables]);

  const updateSettings = async (newSettings: Partial<ClubSettings>) => {
    const updated: ClubSettings = {
      ...settings,
      ...newSettings,
      ground: newSettings.ground ? { ...settings.ground, ...newSettings.ground } : settings.ground,
      socials: newSettings.socials ? { ...settings.socials, ...newSettings.socials } : settings.socials,
      contact: newSettings.contact ? { ...settings.contact, ...newSettings.contact } : settings.contact,
      footer: newSettings.footer ? { ...settings.footer!, ...newSettings.footer } : settings.footer,
      theme: newSettings.theme ? { ...settings.theme!, ...newSettings.theme } : settings.theme,
      branding: newSettings.branding ? { ...settings.branding!, ...newSettings.branding } : settings.branding,
      hero: newSettings.hero ? { ...settings.hero!, ...newSettings.hero } : settings.hero,
      seo: newSettings.seo ? { ...settings.seo!, ...newSettings.seo } : settings.seo,
      maintenance: newSettings.maintenance ? { ...settings.maintenance!, ...newSettings.maintenance } : settings.maintenance,
      formation: newSettings.formation ? { ...settings.formation!, ...newSettings.formation } : settings.formation,
    };

    setSettings(updated);
    if (updated.theme) {
      setActiveTheme(updated.theme);
      applyCssVariables(updated.theme);
    }

    try {
      await api.settings.update(updated);
    } catch (err) {
      console.error('Failed to sync settings with server:', err);
      throw err;
    }
  };

  const updateTheme = (newTheme: Partial<ThemeConfig>, previewOnly: boolean = false) => {
    const merged: ThemeConfig = { ...activeTheme, ...newTheme };
    setActiveTheme(merged);
    applyCssVariables(merged);

    if (!previewOnly) {
      updateSettings({ theme: merged }).catch((err) => {
        console.error('Failed to save theme in updateTheme:', err);
      });
    }
  };

  const saveTheme = async (themeToSave?: ThemeConfig) => {
    const target = themeToSave || activeTheme;
    await updateSettings({ theme: target });
  };

  const resetTheme = async () => {
    setActiveTheme(DEFAULT_THEME);
    applyCssVariables(DEFAULT_THEME);
    await updateSettings({ theme: DEFAULT_THEME });
  };

  const applyPreset = (presetKey: string) => {
    const preset = THEME_PRESETS[presetKey];
    if (preset) {
      const merged: ThemeConfig = { ...activeTheme, ...preset };
      setActiveTheme(merged);
      applyCssVariables(merged);
    }
  };

  return (
    <ThemeSettingsContext.Provider
      value={{
        settings,
        theme: activeTheme,
        branding: settings.branding || DEFAULT_FULL_SETTINGS.branding!,
        hero: settings.hero || DEFAULT_FULL_SETTINGS.hero!,
        homepageSections: settings.homepageSections || DEFAULT_FULL_SETTINGS.homepageSections!,
        navigation: settings.navigation || DEFAULT_FULL_SETTINGS.navigation!,
        seo: settings.seo || DEFAULT_FULL_SETTINGS.seo!,
        maintenance: settings.maintenance || DEFAULT_FULL_SETTINGS.maintenance!,
        formation: settings.formation || DEFAULT_FORMATION_CONFIG,
        loading,
        updateSettings,
        updateTheme,
        saveTheme,
        resetTheme,
        applyPreset,
      }}
    >
      {children}
    </ThemeSettingsContext.Provider>
  );
};

export const useThemeSettings = () => {
  const context = useContext(ThemeSettingsContext);
  if (!context) {
    throw new Error('useThemeSettings must be used within a ThemeSettingsProvider');
  }
  return context;
};
