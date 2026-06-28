# World Cup Live Center

Aplikacja React z dashboardem Mundialu 2026 oraz przykładowym backendem Node/Express, który ukrywa klucz RapidAPI SportAPI7 po stronie serwera.

## Funkcje

- mecze z wybranego dnia z filtrem `uniqueTournament.id === 16`,
- live wynik, strzelcy, statystyki i składy,
- tabela grup z punktami, bilansem i formą,
- analiza AI po polsku na bazie danych meczowych,
- cache endpointów, żeby ograniczyć zużycie limitów RapidAPI.

## Uruchomienie

```bash
npm install
cp .env.example .env
# uzupełnij RAPIDAPI_KEY w .env
npm run dev
```

Backend można uruchomić osobno:

```bash
node server.js
```

## Endpointy backendu

- `GET /api/worldcup/matches/today`
- `GET /api/worldcup/matches/date/:date`
- `GET /api/worldcup/match/:id`
- `GET /api/worldcup/match/:id/stats`
- `GET /api/worldcup/match/:id/lineups`
- `GET /api/worldcup/standings`

Frontend nigdy nie odpytuje RapidAPI bezpośrednio. Klucz `RAPIDAPI_KEY` jest używany tylko w `server.js`.
