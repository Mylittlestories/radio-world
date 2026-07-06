import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react';
import type { Station, PlayerState } from '../types';
import { getStreamUrl } from '../lib/radioBrowser';
import { addToRecentlyPlayed } from '../lib/utils';

interface PlayerContextValue extends PlayerState {
  playStation: (station: Station) => void;
  togglePlay: () => void;
  stop: () => void;
  setVolume: (v: number) => void;
}

const PlayerContext = createContext<PlayerContextValue>({
  station: null,
  isPlaying: false,
  isBuffering: false,
  error: null,
  volume: 1,
  playStation: () => {},
  togglePlay: () => {},
  stop: () => {},
  setVolume: () => {},
});

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [station, setStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolumeState] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audioRef.current = audio;

    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
      setError(null);
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onError = () => {
      setIsBuffering(false);
      setIsPlaying(false);
      setError('This station is currently unavailable. Please try another.');
    };
    const onStalled = () => setIsBuffering(true);
    const onCanPlay = () => setIsBuffering(false);

    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('stalled', onStalled);
    audio.addEventListener('canplay', onCanPlay);

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('stalled', onStalled);
      audio.removeEventListener('canplay', onCanPlay);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const playStation = async (newStation: Station) => {
    if (!audioRef.current) return;
    setError(null);
    try {
      const { url } = await getStreamUrl(newStation.stationuuid);
      if (!url) throw new Error('No stream URL available');

      if (station?.stationuuid === newStation.stationuuid && isPlaying) {
        return;
      }

      audioRef.current.pause();
      audioRef.current.src = url;
      audioRef.current.load();
      setStation(newStation);
      setIsBuffering(true);
      addToRecentlyPlayed(newStation);
      await audioRef.current.play();
    } catch (err) {
      setIsBuffering(false);
      setError('Unable to play this station.');
      setStation(newStation);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !station) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => setError('Unable to resume playback.'));
    }
  };

  const stop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.src = '';
    setStation(null);
    setIsPlaying(false);
    setIsBuffering(false);
    setError(null);
  };

  const setVolume = (v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
  };

  return (
    <PlayerContext.Provider value={{ station, isPlaying, isBuffering, error, volume, playStation, togglePlay, stop, setVolume }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
