import supabase from './db-client.js';

const RADIO_BROWSER_HOST = 'https://de1.api.radio-browser.info';
const USER_AGENT = 'RadioWorld/1.0 (https://radioworld.app)';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const response = await fetch(`${RADIO_BROWSER_HOST}/json/countries`, {
      headers: { 'User-Agent': USER_AGENT },
    });
    if (!response.ok) throw new Error(`Radio Browser returned ${response.status}`);
    const data = await response.json();
    const sorted = data
      .filter((c) => c.stationcount > 0 && c.iso_3166_1)
      .sort((a, b) => b.stationcount - a.stationcount);
    return res.status(200).json(sorted);
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
