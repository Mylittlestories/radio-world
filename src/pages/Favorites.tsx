import { Link } from 'react-router-dom';
import { Heart, LogIn } from 'lucide-react';
import StationCard from '../components/StationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import type { Station, Favorite } from '../types';

export default function Favorites() {
  const { user } = useAuth();
  const { favorites, loading } = useFavorites();

  const stations: Station[] = favorites.map((f: Favorite) => ({
    stationuuid: f.station_uuid,
    name: f.name,
    url: '',
    url_resolved: '',
    homepage: '',
    favicon: f.favicon,
    tags: f.tags,
    country: f.country,
    countrycode: '',
    state: f.state,
    language: '',
    languagecodes: '',
    votes: 0,
    clickcount: 0,
    clicktrend: 0,
    codec: '',
    bitrate: 0,
    lastcheckok: 1,
    lastchecktime: '',
    hls: 0,
    geo_lat: null,
    geo_long: null,
  }));

  return (
    <div className="pb-40">
      <div className="sticky top-16 z-20 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/50 px-4 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Your favorites</h1>
              <p className="text-xs text-zinc-400">
                {loading ? 'Loading...' : `${favorites.length} saved station${favorites.length === 1 ? '' : 's'}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {!user ? (
          <div className="text-center py-16">
            <LogIn className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-white">Sign in to save favorites</h2>
            <p className="text-sm text-zinc-400 mt-1">Create an account or sign in to keep your favorite stations.</p>
            <Link to="/login" className="mt-4 inline-block px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-medium transition-colors">
              Sign in
            </Link>
          </div>
        ) : loading ? (
          <LoadingSpinner />
        ) : stations.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-white">No favorites yet</h2>
            <p className="text-sm text-zinc-400 mt-1">Tap the heart on any station to save it here.</p>
            <Link to="/search" className="mt-4 inline-block px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-medium transition-colors">
              Discover stations
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stations.map((station, i) => (
              <StationCard key={station.stationuuid} station={station} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
