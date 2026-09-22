import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { ClubSettings } from '../types';

export const useClubSettings = () => {
  const [settings, setSettings] = useState<ClubSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.settings.get();
        setSettings(data);
      } catch (err) {
        console.error('Error fetching club settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return { settings, loading };
};
