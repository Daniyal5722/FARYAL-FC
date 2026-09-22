import { useState, useEffect } from 'react';
import { api, DEFAULT_CLUB_SETTINGS } from '../lib/api';
import { ClubSettings } from '../types';

export const useClubSettings = () => {
  const [settings, setSettings] = useState<ClubSettings>(DEFAULT_CLUB_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const data = await api.settings.get();
        if (isMounted) {
          setSettings(data || DEFAULT_CLUB_SETTINGS);
        }
      } catch (err) {
        console.error('Error fetching club settings:', err);
        if (isMounted) {
          setSettings(DEFAULT_CLUB_SETTINGS);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  return { settings, loading };
};
