import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import supabase from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Station, Favorite } from '../types';

interface FavoritesContextValue {
  favorites: Favorite[];
  favoriteIds: Set<string>;
  loading: boolean;
  addFavorite: (station: Station) => Promise<void>;
  removeFavorite: (stationUuid: string) => Promise<void>;
  isFavorite: (stationUuid: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue>({
  favorites: [],
  favoriteIds: new Set(),
  loading: true,
  addFavorite: async () => {},
  removeFavorite: async () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    const fetchFavorites = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!error && data) setFavorites(data);
      setLoading(false);
    };
    fetchFavorites();
  }, [user]);

  const favoriteIds = new Set(favorites.map((f) => f.station_uuid));

  const addFavorite = async (station: Station) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        station_uuid: station.stationuuid,
        name: station.name,
        favicon: station.favicon,
        country: station.country,
        state: station.state,
        tags: station.tags,
      })
      .select()
      .single();
    if (error) throw error;
    if (data) setFavorites((prev) => [data, ...prev]);
  };

  const removeFavorite = async (stationUuid: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('station_uuid', stationUuid);
    if (error) throw error;
    setFavorites((prev) => prev.filter((f) => f.station_uuid !== stationUuid));
  };

  const isFavorite = (stationUuid: string) => favoriteIds.has(stationUuid);

  return (
    <FavoritesContext.Provider value={{ favorites, favoriteIds, loading, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
