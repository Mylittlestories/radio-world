import supabase from './db-client.js';

const RADIO_BROWSER_HOST = 'https://de1.api.radio-browser.info';
const USER_AGENT = 'RadioWorld/1.0 (https://radioworld.app)';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const { country } = req.query;
    if (!country) return res.status(400).json({ error: 'country is required' });

    const response = await fetch(`${RADIO_BROWSER_HOST}/json/states`, {
      headers: { 'User-Agent': USER_AGENT },
    });
    if (!response.ok) throw new Error(`Radio Browser returned ${response.status}`);
    const data = await response.json();

    const normalizedCountry = decodeURIComponent(country).trim().toLowerCase();
    const cities = data
      .filter((s) => s.country && s.country.trim().toLowerCase() === normalizedCountry && s.stationcount > 0)
      .map((s) => ({
        name: s.name.trim(),
        country: s.country,
        stationcount: s.stationcount,
      }))
      .sort((a, b) => b.stationcount - a.stationcount);

    return res.status(200).json(cities);
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
