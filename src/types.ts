export interface Country {
  name: string;
  iso_3166_1: string;
  stationcount: number;
}

export interface City {
  name: string;
  country: string;
  stationcount: number;
}

export interface Station {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  languagecodes: string;
  votes: number;
  clickcount: number;
  clicktrend: number;
  codec: string;
  bitrate: number;
  lastcheckok: number;
  lastchecktime: string;
  hls: number;
  geo_lat: number | null;
  geo_long: number | null;
}

export interface Favorite {
  id: number;
  user_id: string;
  station_uuid: string;
  name: string;
  favicon: string;
  country: string;
  state: string;
  tags: string;
  created_at: string;
}

export interface PlayerState {
  station: Station | null;
  isPlaying: boolean;
  isBuffering: boolean;
  error: string | null;
  volume: number;
}
