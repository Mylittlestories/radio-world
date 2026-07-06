import { useState, useEffect } from 'react';
import { Radio } from 'lucide-react';
import type { Station } from '../types';
import { getFallbackArtwork } from '../lib/utils';

interface StationArtworkProps {
  station: Station;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function sizeClasses(size: StationArtworkProps['size']) {
  switch (size) {
    case 'sm': return 'w-10 h-10 text-lg';
    case 'lg': return 'w-24 h-24 text-4xl';
    default: return 'w-16 h-16 text-2xl';
  }
}

function getHomepageFavicon(homepage: string) {
  try {
    const url = new URL(homepage);
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
  } catch {
    return null;
  }
}

export default function StationArtwork({ station, size = 'md', className = '' }: StationArtworkProps) {
  const [src, setSrc] = useState<string | null>(station.favicon || null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setSrc(station.favicon || null);
    setAttempt(0);
  }, [station.stationuuid, station.favicon]);

  const fallback = getFallbackArtwork(station);
  const homepageIcon = station.homepage ? getHomepageFavicon(station.homepage) : null;

  const handleError = () => {
    if (attempt === 0 && homepageIcon && homepageIcon !== src) {
      setSrc(homepageIcon);
      setAttempt(1);
    } else {
      setSrc(fallback);
      setAttempt(2);
    }
  };

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl bg-zinc-800 flex items-center justify-center ${sizeClasses(size)} ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={station.name}
          className="w-full h-full object-cover"
          onError={handleError}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500">
          <Radio className="w-1/2 h-1/2" />
        </div>
      )}
    </div>
  );
}
