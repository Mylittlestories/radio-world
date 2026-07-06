import { Globe, ThumbsUp, Activity, Radio, Music, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type { Station } from '../types';
import { formatNumber } from '../lib/utils';

interface StationMetaProps {
  station: Station;
}

export default function StationMeta({ station }: StationMetaProps) {
  const tags = station.tags
    ? station.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="space-y-3 text-sm">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 text-xs font-medium rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/50"
          >
            {tag}
          </span>
        ))}
        {tags.length === 0 && (
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700/50">
            No tags
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-zinc-400">
          <MapPin className="w-4 h-4 text-cyan-500" />
          <span className="truncate">{station.country || 'Unknown'}</span>
        </div>
        {station.state && (
          <div className="flex items-center gap-2 text-zinc-400">
            <Radio className="w-4 h-4 text-cyan-500" />
            <span className="truncate">{station.state}</span>
          </div>
        )}
        {station.language && (
          <div className="flex items-center gap-2 text-zinc-400">
            <Music className="w-4 h-4 text-rose-500" />
            <span className="truncate">{station.language}</span>
          </div>
        )}
        {(station.codec || station.bitrate) && (
          <div className="flex items-center gap-2 text-zinc-400">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span>
              {station.codec || 'Unknown'}
              {station.bitrate ? ` @ ${station.bitrate}k` : ''}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 text-zinc-400">
          <ThumbsUp className="w-4 h-4 text-amber-500" />
          <span>{formatNumber(station.votes)} votes</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <Activity className="w-4 h-4 text-blue-500" />
          <span>{formatNumber(station.clickcount)} plays</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          {station.lastcheckok === 1 ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Stream checked OK</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>Stream check failed</span>
            </>
          )}
        </div>
        {station.lastchecktime && (
          <div className="flex items-center gap-2 text-zinc-400">
            <Clock className="w-4 h-4 text-zinc-500" />
            <span className="truncate">Checked {station.lastchecktime.split(' ')[0]}</span>
          </div>
        )}
      </div>

      {station.homepage && (
        <a
          href={station.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors"
        >
          <Globe className="w-4 h-4" />
          Visit station website
        </a>
      )}
    </div>
  );
}
