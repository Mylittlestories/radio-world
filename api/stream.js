import supabase from './db-client.js';

const RADIO_BROWSER_HOST = 'https://de1.api.radio-browser.info';
const USER_AGENT = 'RadioWorld/1.0 (https://radioworld.app)';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const { uuid } = req.query;
    if (!uuid) return res.status(400).json({ error: 'uuid is required' });

    const response = await fetch(`${RADIO_BROWSER_HOST}/json/stations/byuuid/${encodeURIComponent(uuid)}`, {
      headers: { 'User-Agent': USER_AGENT },
    });
    if (!response.ok) throw new Error(`Radio Browser returned ${response.status}`);
    const data = await response.json();
    const station = Array.isArray(data) ? data[0] : data;
    if (!station) return res.status(404).json({ error: 'Station not found' });

    return res.status(200).json({
      uuid: station.stationuuid,
      name: station.name,
      url: station.url_resolved || station.url,
      favicon: station.favicon,
      homepage: station.homepage,
      country: station.country,
      countrycode: station.countrycode,
      state: station.state,
      tags: station.tags,
      codec: station.codec,
      bitrate: station.bitrate,
      language: station.language,
    });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
