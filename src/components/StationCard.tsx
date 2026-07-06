import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import type { Station } from '../types';
import { usePlayer } from '../contexts/PlayerContext';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import StationArtwork from './StationArtwork';
import StationMeta from './StationMeta';

interface StationCardProps {
  station: Station;
  index?: number;
  compact?: boolean;
}

export default function StationCard({ station, index = 0, compact = false }: StationCardProps) {
  const { playStation, station: currentStation, isPlaying, isBuffering } = usePlayer();
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [expanded, setExpanded] = useState(false);
  const isCurrent = currentStation?.stationuuid === station.stationuuid;
  const isCurrentPlaying = isCurrent && isPlaying;
  const favorite = isFavorite(station.stationuuid);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
      className={`group rounded-2xl bg-zinc-900/60 border border-zinc-800/60 hover:border-zinc-700 transition-all overflow-hidden ${
        isCurrent ? 'ring-1 ring-rose-500/40 border-rose-500/30' : ''
      }`}
    >
      <div
        className={`flex items-center gap-3 p-3 ${compact ? '' : 'sm:gap-4 sm:p-4'}`}
        onClick={() => setExpanded(!expanded)}
      >
        <StationArtwork station={station} size={compact ? 'sm' : 'md'} />

        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-white truncate ${compact ? 'text-sm' : 'text-base'}`}>
            {station.name}
          </h3>
          <p className="text-xs text-zinc-400 truncate mt-0.5">
            {station.country}
            {station.state ? ` • ${station.state}` : ''}
          </p>
          {!compact && (
            <p className="text-[11px] text-zinc-500 truncate mt-1">
              {station.codec && `${station.codec} `}
              {station.bitrate ? `${station.bitrate}k • ` : ''}
              {station.clickcount > 0 && `${station.clickcount.toLocaleString()} plays`}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1">
          {!compact && user && (
            <button
              onClick={handleFavorite}
              className={`p-2 rounded-full transition-colors ${
                favorite ? 'text-rose-500' : 'text-zinc-500 hover:text-white'
              }`}
              aria-label={favorite ? 'Remove favorite' : 'Add favorite'}
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              playStation(station);
            }}
            className={`shrink-0 rounded-full flex items-center justify-center transition-all ${
              compact
                ? 'w-9 h-9 bg-rose-500 text-white hover:bg-rose-400'
                : 'w-11 h-11 bg-rose-500 text-white hover:bg-rose-400 shadow-lg shadow-rose-500/20'
            }`}
            aria-label={isCurrentPlaying ? 'Pause' : 'Play'}
          >
            {isCurrent && isBuffering ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isCurrentPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className={`${compact ? 'w-3.5 h-3.5 ml-0.5' : 'w-4 h-4 ml-0.5'} fill-current`} />
            )}
          </button>

          {!compact && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="p-2 text-zinc-500 hover:text-white transition-colors"
              aria-label="Toggle details"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && !compact && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-zinc-800/60"
          >
            <div className="p-4 pt-3">
              <StationMeta station={station} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
