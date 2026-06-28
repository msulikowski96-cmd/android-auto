import 'dotenv/config';
import express from 'express';

const app = express();
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const API_HOST = 'sportapi7.p.rapidapi.com';
const BASE_URL = `https://${API_HOST}`;
const WORLD_CUP_TOURNAMENT_ID = 16;
const WORLD_CUP_2026_SEASON_ID = 58210;
const cache = new Map();

const ttlByPath = (path) => {
  if (path.includes('/statistics') || path.includes('/incidents')) return 45_000;
  if (path.includes('/lineups')) return 180_000;
  if (path.includes('/standings')) return 600_000;
  if (path.includes('/scheduled-events')) return 300_000;
  return 60_000;
};

async function sportApi(path) {
  if (!RAPIDAPI_KEY) {
    throw new Error('Brak RAPIDAPI_KEY w zmiennych środowiskowych backendu');
  }

  const cached = cache.get(path);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': API_HOST,
    },
  });

  if (!response.ok) {
    throw new Error(`SportAPI7 error ${response.status}`);
  }

  const data = await response.json();
  cache.set(path, {data, expiresAt: Date.now() + ttlByPath(path)});
  return data;
}

app.get('/api/worldcup/matches/today', (_req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  res.redirect(`/api/worldcup/matches/date/${today}`);
});

app.get('/api/worldcup/matches/date/:date', async (req, res) => {
  try {
    const {date} = req.params;
    const data = await sportApi(`/api/v1/sport/football/scheduled-events/${date}`);
    const matches = (data.events || []).filter((event) => event?.tournament?.uniqueTournament?.id === WORLD_CUP_TOURNAMENT_ID);
    res.json({date, matches, cache: '5m'});
  } catch (error) {
    res.status(500).json({error: 'Nie udało się pobrać meczów World Cup', details: error.message});
  }
});

app.get('/api/worldcup/match/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const [details, statistics, incidents, lineups] = await Promise.all([
      sportApi(`/api/v1/event/${id}`),
      sportApi(`/api/v1/event/${id}/statistics`),
      sportApi(`/api/v1/event/${id}/incidents`),
      sportApi(`/api/v1/event/${id}/lineups`),
    ]);
    res.json({details, statistics, incidents, lineups});
  } catch (error) {
    res.status(500).json({error: 'Nie udało się pobrać szczegółów meczu', details: error.message});
  }
});

app.get('/api/worldcup/match/:id/stats', async (req, res) => {
  try {
    res.json(await sportApi(`/api/v1/event/${req.params.id}/statistics`));
  } catch (error) {
    res.status(500).json({error: 'Nie udało się pobrać statystyk meczu', details: error.message});
  }
});

app.get('/api/worldcup/match/:id/lineups', async (req, res) => {
  try {
    res.json(await sportApi(`/api/v1/event/${req.params.id}/lineups`));
  } catch (error) {
    res.status(500).json({error: 'Nie udało się pobrać składów meczu', details: error.message});
  }
});

app.get('/api/worldcup/standings', async (_req, res) => {
  try {
    res.json(await sportApi(`/api/v1/unique-tournament/${WORLD_CUP_TOURNAMENT_ID}/season/${WORLD_CUP_2026_SEASON_ID}/standings/total`));
  } catch (error) {
    res.status(500).json({error: 'Nie udało się pobrać tabeli World Cup', details: error.message});
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`World Cup backend działa na porcie ${port}`);
});
