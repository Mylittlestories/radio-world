import supabase from './db-client.js';

const RADIO_BROWSER_HOST = 'https://de1.api.radio-browser.info';
const USER_AGENT = 'RadioWorld/1.0 (https://radioworld.app)';

function buildSearchUrl(query) {
  const params = new URLSearchParams();
  params.set('hidebroken', 'true');
  params.set('order', 'clickcount');
  params.set('reverse', 'true');
  params.set('limit', query.limit || '50');

  if (query.uuid) {
    return `${RADIO_BROWSER_HOST}/json/stations/byuuid/${encodeURIComponent(query.uuid)}?${params.toString()}`;
  }
  if (query.search) {
    params.set('name', query.search);
    return `${RADIO_BROWSER_HOST}/json/stations/search?${params.toString()}`;
  }
  if (query.countrycode) {
    params.set('countrycode', query.countrycode);
  }
  if (query.country) {
    params.set('country', query.country);
  }
  if (query.state) {
    params.set('state', query.state);
  }
  return `${RADIO_BROWSER_HOST}/json/stations/search?${params.toString()}`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const url = buildSearchUrl(req.query);
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
    });
    if (!response.ok) throw new Error(`Radio Browser returned ${response.status}`);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
