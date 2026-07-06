import type { Station } from '../types';

export function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function getStationGradient(uuid: string) {
  const hues = [340, 200, 260, 30, 160, 10, 280];
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) hash = uuid.charCodeAt(i) + ((hash << 5) - hash);
  const h1 = hues[Math.abs(hash) % hues.length];
  const h2 = (h1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${h1} 70% 45%), hsl(${h2} 70% 35%))`;
}

export function getFallbackArtwork(station: Station) {
  const text = initials(station.name);
  const hues = [340, 200, 260, 30, 160, 10, 280];
  let hash = 0;
  for (let i = 0; i < station.stationuuid.length; i++) {
    hash = station.stationuuid.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h1 = hues[Math.abs(hash) % hues.length];
  const h2 = (h1 + 40) % 360;
  const c1 = `hsl(${h1} 70% 45%)`;
  const c2 = `hsl(${h2} 70% 35%)`;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="100%" stop-color="${c2}" />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#g)" />
      <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="72" font-weight="bold" font-family="system-ui, sans-serif">${text}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

export function addToRecentlyPlayed(station: Station) {
  const key = 'rw_recently_played';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  const filtered = existing.filter((s: Station) => s.stationuuid !== station.stationuuid);
  filtered.unshift(station);
  localStorage.setItem(key, JSON.stringify(filtered.slice(0, 20)));
}

export function getRecentlyPlayed(): Station[] {
  return JSON.parse(localStorage.getItem('rw_recently_played') || '[]');
}

export function encodeCityParam(name: string) {
  return encodeURIComponent(name).replace(/%20/g, '+');
}

export function decodeCityParam(param: string) {
  return decodeURIComponent(param.replace(/\+/g, ' '));
}
