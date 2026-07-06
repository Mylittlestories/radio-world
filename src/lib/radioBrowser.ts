import type { Country, City, Station } from '../types';

const API_HOST = 'https://de1.api.radio-browser.info';
const USER_AGENT = 'RadioWorld/1.0';

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_HOST}${path}`, {
    headers: { 'User-Agent': USER_AGENT },
  });
  if (!res.ok) throw new Error(`Radio Browser error: ${res.status}`);
  return res.json();
}

export async function getCountries(): Promise<Country[]> {
  const data = await fetchJson<{ name: string; iso_3166_1: string; stationcount: number }[]>('/json/countries');
  return data
    .filter((c) => c.stationcount > 0 && c.iso_3166_1)
    .sort((a, b) => b.stationcount - a.stationcount);
}

export async function getCities(countryName: string): Promise<City[]> {
  const data = await fetchJson<{ name: string; country: string; stationcount: number }[]>('/json/states');
  const normalized = countryName.trim().toLowerCase();
  return data
    .filter((s) => s.country && s.country.trim().toLowerCase() === normalized && s.stationcount > 0)
    .map((s) => ({ name: s.name.trim(), country: s.country, stationcount: s.stationcount }))
    .sort((a, b) => b.stationcount - a.stationcount);
}

export async function searchStations(params: {
  countrycode?: string;
  state?: string;
  search?: string;
  uuid?: string;
  limit?: number;
}): Promise<Station[]> {
  const qs = new URLSearchParams();
  qs.set('hidebroken', 'true');
  qs.set('order', 'clickcount');
  qs.set('reverse', 'true');
  qs.set('limit', String(params.limit || 50));

  if (params.uuid) {
    return fetchJson<Station[]>(`/json/stations/byuuid/${encodeURIComponent(params.uuid)}?${qs.toString()}`);
  }
  if (params.search) {
    qs.set('name', params.search);
  } else {
    if (params.countrycode) qs.set('countrycode', params.countrycode);
    if (params.state) qs.set('state', params.state);
  }
  return fetchJson<Station[]>(`/json/stations/search?${qs.toString()}`);
}

export async function getStreamUrl(uuid: string): Promise<{ url: string; station: Station }> {
  const data = await fetchJson<Station[]>(`/json/stations/byuuid/${encodeURIComponent(uuid)}`);
  const station = data[0];
  if (!station) throw new Error('Station not found');
  return { url: station.url_resolved || station.url, station };
}
