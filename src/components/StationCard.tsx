import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Heart } from 'lucide-react';
import type { Station } from '../types';
import { usePlayer } from '../contexts/PlayerContext';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { getFallbackArtwork, formatNumber } from '../lib/utils';

interface StationCardProps {
  station: Station;
  index?: number;
  compact?: boolean;
}

export default function StationCard({ station, index = 0, compact = false }: StationCardProps) {
  const { playStation, station: currentStation, isPlaying, isBuffering } = usePlayer();
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [imgError, setImgError] = useState(false);
  const isCurrent = currentStation?.stationuuid === station.stationuuid;
  const isCurrentPlaying = isCurrent && isPlaying;
  const favorite = isFavorite(station.stationuuid);

  const imageUrl = station.favicon && !imgError ? station.favicon : getFallbackArtwork(station);
  const tags = station.tags
    ? station.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 3)
    : [];

  const handleFavorite = async () => {
    try {
      if (favorite) await removeFavorite(station.stationuuid);
      else await addFavorite(station);
    } catch (err) {
      console.error('Favorite error:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className={`group relative rounded-2xl bg-zinc-900/60 border border-zinc-800/60 hover:border-zinc-700 transition-all overflow-hidden ${
        compact ? 'p-3 flex items-center gap-3' : 'p-4'
      } ${isCurrent ? 'ring-1 ring-rose-500/40 border-rose-500/30' : ''}`}
    >
      {!compact && user && (
        <button
          onClick={handleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors z-10 ${
            favorite ? 'text-rose-500 bg-rose-500/10' : 'text-zinc-500 hover:text-rose-400 hover:bg-zinc-800'
          }`}
          aria-label={favorite ? 'Remove favorite' : 'Add favorite'}
        >
          <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
        </button>
      )}

      <div className={`flex ${compact ? 'items-center gap-3' : 'gap-4'}`}>
        <div
          className={`relative shrink-0 overflow-hidden rounded-xl bg-zinc-800 ${
            compact ? 'w-14 h-14' : 'w-20 h-20'
          }`}
        >
          <img
            src={imageUrl}
            alt={station.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-white truncate ${compact ? 'text-sm' : 'text-base'}`}>
            {station.name}
          </h3>
          <p className="text-xs text-zinc-400 truncate mt-0.5">
            {station.country}
            {station.state ? ` • ${station.state}` : ''}
          </p>

          {!compact && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/50"
                >
                  {tag}
                </span>
              ))}
              {station.codec && (
                <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                  {station.codec}
                  {station.bitrate ? ` ${station.bitrate}k` : ''}
                </span>
              )}
            </div>
          )}

          {!compact && (
            <div className="flex items-center gap-4 mt-2 text-[11px] text-zinc-500">
              <span className="flex items-center gap-1">
                {formatNumber(station.clickcount)} plays
              </span>
              <span className="truncate">{station.language || 'Unknown language'}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => playStation(station)}
          className={`shrink-0 rounded-full flex items-center justify-center transition-all ${
            compact
              ? 'w-10 h-10 bg-rose-500 text-white hover:bg-rose-400'
              : 'w-12 h-12 bg-rose-500 text-white hover:bg-rose-400 shadow-lg shadow-rose-500/20'
          }`}
          aria-label={isCurrentPlaying ? 'Pause' : 'Play'}
        >
          {isCurrent && isBuffering ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : isCurrentPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className={`${compact ? 'w-4 h-4 ml-0.5' : 'w-5 h-5 ml-0.5'} fill-current`} />
          )}
        </button>
      </div>
    </motion.div>
  );
}
