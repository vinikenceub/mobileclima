import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  fetchUserProfile,
  subscribeToUserProfile,
  updateUserFavorites,
} from '../services/firestoreService';
import { useAuth } from './useAuth';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const applyProfile = useCallback((userProfile) => {
    setProfile(userProfile);
    setFavorites(userProfile?.favorites || []);
    setLoading(false);
  }, []);

  const refreshProfile = useCallback(async (userId) => {
    const userProfile = await fetchUserProfile(userId);
    applyProfile(userProfile);
    return userProfile;
  }, [applyProfile]);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setProfile(null);
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    // #region agent log
    fetch('http://127.0.0.1:7806/ingest/6e5c8b9d-a7cc-4efc-9860-f2c4b561787a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'7fd7c6'},body:JSON.stringify({sessionId:'7fd7c6',runId:'firestore-fix',hypothesisId:'B',location:'useFavorites.js:subscribe',message:'Single listener subscribe',data:{userId:user.uid},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    const unsubscribe = subscribeToUserProfile(user.uid, applyProfile);

    return () => {
      // #region agent log
      fetch('http://127.0.0.1:7806/ingest/6e5c8b9d-a7cc-4efc-9860-f2c4b561787a',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'7fd7c6'},body:JSON.stringify({sessionId:'7fd7c6',runId:'firestore-fix',hypothesisId:'B',location:'useFavorites.js:unsubscribe',message:'Single listener unsubscribe',data:{userId:user.uid},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      unsubscribe();
    };
  }, [user, applyProfile]);

  const syncProfileAfterWrite = useCallback(async () => {
    if (Platform.OS === 'web' && user) {
      await refreshProfile(user.uid);
    }
  }, [user, refreshProfile]);

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
        await syncProfileAfterWrite();
      } finally {
        setSaving(false);
      }
    },
    [user, favorites, isFavorite, syncProfileAfterWrite],
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
        await syncProfileAfterWrite();
      } finally {
        setSaving(false);
      }
    },
    [user, favorites, syncProfileAfterWrite],
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

  const value = {
    favorites,
    profile,
    loading,
    saving,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('useFavorites deve ser usado dentro de FavoritesProvider');
  }

  return context;
}
