
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Volume2, VolumeX, Heart } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import StationArtwork from './StationArtwork';

export default function Player() {
  const { station, isPlaying, isBuffering, error, volume, togglePlay, stop, setVolume } = usePlayer();
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  if (!station) return null;

  const favorite = isFavorite(station.stationuuid);

  const handleFavorite = async () => {
    try {
      if (favorite) await removeFavorite(station.stationuuid);
      else await addFavorite(station);
    } catch (err) {
      console.error('Favorite error:', err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-16 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/80 shadow-2xl shadow-black/50"
      >
        {error && (
          <div className="px-4 py-1.5 bg-red-500/10 border-b border-red-500/20 text-[11px] text-red-300 text-center">
            {error}
          </div>
        )}
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <StationArtwork station={station} size="md" className="rounded-xl" />

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white truncate">{station.name}</h4>
              <p className="text-[11px] text-zinc-400 truncate">
                {station.country}{station.state ? ` • ${station.state}` : ''}
              </p>
            </div>

            <div className="flex items-center gap-1">
              {user && (
                <button
                  onClick={handleFavorite}
                  className={`p-2.5 rounded-full transition-colors ${
                    favorite ? 'text-rose-500' : 'text-zinc-400 hover:text-white'
                  }`}
                  aria-label="Toggle favorite"
                >
                  <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
                </button>
              )}

              <button
                onClick={togglePlay}
                className="w-11 h-11 rounded-full bg-white text-zinc-950 flex items-center justify-center hover:bg-zinc-200 transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isBuffering ? (
                  <div className="w-5 h-5 border-2 border-zinc-500/30 border-t-zinc-950 rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5 fill-current" />
                )}
              </button>

              <button
                onClick={stop}
                className="p-2.5 text-zinc-400 hover:text-white transition-colors"
                aria-label="Stop"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => setVolume(volume === 0 ? 1 : 0)}
              className="text-zinc-400 hover:text-white"
              aria-label={volume === 0 ? 'Unmute' : 'Mute'}
            >
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
              aria-label="Volume"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
