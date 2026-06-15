import { useCallback, useEffect, useState } from 'react';
import {
  subscribeToUserProfile,
  updateUserFavorites,
} from '../services/firestoreService';
import { useAuth } from './useAuth';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setProfile(null);
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    const unsubscribe = subscribeToUserProfile(user.uid, (userProfile) => {
      setProfile(userProfile);
      setFavorites(userProfile?.favorites || []);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const isFavorite = useCallback(
    (city) => favorites.some(
      (item) => item.city.toLowerCase() === city.toLowerCase(),
    ),
    [favorites],
  );

  const addFavorite = useCallback(
    async (weather) => {
      if (!user || isFavorite(weather.city)) {
        return;
      }

      setSaving(true);

      try {
        const newFavorite = {
          city: weather.city,
          country: weather.country,
          addedAt: new Date().toISOString(),
        };

        const updatedFavorites = [...favorites, newFavorite];
        await updateUserFavorites(user.uid, updatedFavorites);
      } finally {
        setSaving(false);
      }
    },
    [user, favorites, isFavorite],
  );

  const removeFavorite = useCallback(
    async (city) => {
      if (!user) {
        return;
      }

      setSaving(true);

      try {
        const updatedFavorites = favorites.filter(
          (item) => item.city.toLowerCase() !== city.toLowerCase(),
        );
        await updateUserFavorites(user.uid, updatedFavorites);
      } finally {
        setSaving(false);
      }
    },
    [user, favorites],
  );

  const toggleFavorite = useCallback(
    async (weather) => {
      if (isFavorite(weather.city)) {
        await removeFavorite(weather.city);
      } else {
        await addFavorite(weather);
      }
    },
    [addFavorite, isFavorite, removeFavorite],
  );

  return {
    favorites,
    profile,
    loading,
    saving,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };
}
