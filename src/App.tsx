import React, {useMemo, useState} from 'react';
import {
  Activity,
  BarChart3,
  BrainCircuit,
  CalendarDays,
  ChevronRight,
  CircleDot,
  Clock3,
  Goal,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import {motion} from 'motion/react';

type MatchStatus = 'live' | 'scheduled' | 'finished';

type Match = {
  id: number;
  minute?: string;
  status: MatchStatus;
  group: string;
  venue: string;
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  possession: [number, number];
  shots: [number, number];
  corners: [number, number];
  cards: [number, number];
  scorers: string[];
  ai: string;
};

type Standing = {
  group: string;
  team: string;
  played: number;
  goalDiff: number;
  points: number;
  form: string;
};

const matches: Match[] = [
  {
    id: 931246,
    minute: "67'",
    status: 'live',
    group: 'Grupa D',
    venue: 'Estadio Azteca, Mexico City',
    home: 'Brazylia',
    away: 'Japonia',
    homeScore: 2,
    awayScore: 1,
    possession: [61, 39],
    shots: [14, 8],
    corners: [6, 3],
    cards: [2, 1],
    scorers: ["23' Vinicius", "58' Mitoma", "64' Rodrygo"],
    ai: 'Brazylia kontroluje środek pola i tworzy przewagę po lewej stronie. Japonia groźnie kontruje, ale traci za dużo miejsca między obrońcami.',
  },
  {
    id: 931247,
    minute: "FT",
    status: 'finished',
    group: 'Grupa A',
    venue: 'BMO Field, Toronto',
    home: 'Meksyk',
    away: 'Korea Płd.',
    homeScore: 1,
    awayScore: 1,
    possession: [52, 48],
    shots: [10, 9],
    corners: [5, 4],
    cards: [1, 3],
    scorers: ["31' Giménez", "77' Son"],
    ai: 'Remis utrzymuje Meksyk na czele grupy. Korea zyskała tempo po zmianach i poprawiła pressing w ostatnich 20 minutach.',
  },
  {
    id: 931248,
    status: 'scheduled',
    group: 'Grupa B',
    venue: 'MetLife Stadium, New York/New Jersey',
    home: 'Francja',
    away: 'Senegal',
    homeScore: null,
    awayScore: null,
    possession: [0, 0],
    shots: [0, 0],
    corners: [0, 0],
    cards: [0, 0],
    scorers: [],
    ai: 'Model przedmeczowy wskazuje na przewagę Francji w finalizacji, ale Senegal ma wysoką skuteczność odbiorów w bocznych sektorach.',
  },
];

const standings: Standing[] = [
  {group: 'Grupa A', team: 'Meksyk', played: 3, goalDiff: 3, points: 6, form: 'W-D-W'},
  {group: 'Grupa A', team: 'Korea Płd.', played: 3, goalDiff: 1, points: 4, form: 'D-W-L'},
  {group: 'Grupa A', team: 'Czechy', played: 2, goalDiff: 0, points: 3, form: 'W-L'},
  {group: 'Grupa A', team: 'RPA', played: 2, goalDiff: -4, points: 1, form: 'D-L'},
];

const apiEndpoints = [
  'GET /api/worldcup/matches/date/:date',
  'GET /api/worldcup/match/:id',
  'GET /api/worldcup/standings',
  'GET /api/worldcup/match/:id/lineups',
];

const StatusPill = ({status, minute}: {status: MatchStatus; minute?: string}) => {
  const label = status === 'live' ? `LIVE ${minute}` : status === 'finished' ? 'Zakończony' : 'Nadchodzący';
  const color = status === 'live' ? 'bg-red-500/15 text-red-300 border-red-400/30' : status === 'finished' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30' : 'bg-sky-500/15 text-sky-300 border-sky-400/30';
  return <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest ${color}`}>{label}</span>;
};

const StatRow = ({label, value}: {label: string; value: [number, number]}) => {
  const total = Math.max(value[0] + value[1], 1);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-white/70"><span>{value[0]}</span><span>{label}</span><span>{value[1]}</span></div>
      <div className="grid grid-cols-2 gap-1 overflow-hidden rounded-full bg-white/10">
        <div className="h-2 bg-lime-400" style={{width: `${(value[0] / total) * 200}%`}} />
        <div className="h-2 justify-self-end bg-cyan-400" style={{width: `${(value[1] / total) * 200}%`}} />
      </div>
    </div>
  );
};

const MatchCard: React.FC<{match: Match; selected: boolean; onClick: () => void}> = ({match, selected, onClick}) => (
  <button onClick={onClick} className={`w-full rounded-3xl border p-5 text-left transition ${selected ? 'border-lime-300/60 bg-white/12 shadow-2xl shadow-lime-500/10' : 'border-white/10 bg-white/[0.06] hover:bg-white/10'}`}>
    <div className="mb-5 flex items-center justify-between"><StatusPill status={match.status} minute={match.minute} /><span className="text-xs text-white/40">#{match.id}</span></div>
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
      <p className="text-xl font-black text-white">{match.home}</p>
      <div className="rounded-2xl bg-black/40 px-4 py-3 text-center font-mono text-3xl font-black text-white">{match.homeScore ?? '-'}:{match.awayScore ?? '-'}</div>
      <p className="text-right text-xl font-black text-white">{match.away}</p>
    </div>
    <div className="mt-5 flex items-center justify-between text-sm text-white/50"><span>{match.group}</span><ChevronRight size={18} /></div>
  </button>
);

export default function App() {
  const [selectedId, setSelectedId] = useState(matches[0].id);
  const selected = useMemo(() => matches.find((match) => match.id === selectedId) ?? matches[0], [selectedId]);
  const liveCount = matches.filter((match) => match.status === 'live').length;

  return (
    <main className="min-h-screen overflow-hidden bg-[#06110d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(132,204,22,0.22),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(34,211,238,0.16),transparent_28%)]" />
      <div className="relative mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
        <header className="flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-black/30 p-6 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3 text-lime-300"><Trophy /><span className="text-sm font-bold uppercase tracking-[0.35em]">World Cup Live Center</span></div>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight lg:text-6xl">Dashboard Mundialu 2026 z danymi SportAPI7</h1>
            <p className="mt-4 max-w-2xl text-white/60">Frontend pyta wyłącznie Twój backend, a klucz RapidAPI zostaje po stronie serwera. Widok pokazuje mecze, live wynik, tabele, składy, statystyki i analizę AI po polsku.</p>
          </div>
          <div className="grid min-w-72 grid-cols-2 gap-3">
            <div className="rounded-3xl bg-white/10 p-5"><Activity className="mb-4 text-red-300" /><p className="text-3xl font-black">{liveCount}</p><p className="text-sm text-white/50">mecz live</p></div>
            <div className="rounded-3xl bg-white/10 p-5"><Clock3 className="mb-4 text-cyan-300" /><p className="text-3xl font-black">30s</p><p className="text-sm text-white/50">cache live</p></div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.35fr_0.9fr]">
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-black"><CalendarDays className="text-lime-300" /> Mecze 2026-06-28</h2>
            {matches.map((match) => <MatchCard key={match.id} match={match} selected={match.id === selected.id} onClick={() => setSelectedId(match.id)} />)}
          </div>

          <motion.div key={selected.id} initial={{opacity: 0, y: 18}} animate={{opacity: 1, y: 0}} className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 flex items-start justify-between gap-4"><div><StatusPill status={selected.status} minute={selected.minute} /><h2 className="mt-4 text-3xl font-black">{selected.home} vs {selected.away}</h2><p className="mt-2 text-white/50">{selected.venue}</p></div><Goal className="text-lime-300" size={36} /></div>
            <div className="rounded-3xl bg-black/40 p-6 text-center"><div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4"><strong className="text-2xl">{selected.home}</strong><span className="font-mono text-6xl font-black">{selected.homeScore ?? '-'}:{selected.awayScore ?? '-'}</span><strong className="text-2xl">{selected.away}</strong></div></div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="space-y-4 rounded-3xl bg-black/25 p-5"><h3 className="flex items-center gap-2 font-bold"><BarChart3 className="text-cyan-300" /> Statystyki</h3><StatRow label="Posiadanie" value={selected.possession} /><StatRow label="Strzały" value={selected.shots} /><StatRow label="Rzuty rożne" value={selected.corners} /><StatRow label="Żółte kartki" value={selected.cards} /></div>
              <div className="space-y-4 rounded-3xl bg-black/25 p-5"><h3 className="flex items-center gap-2 font-bold"><CircleDot className="text-lime-300" /> Bramki i zdarzenia</h3>{selected.scorers.length ? selected.scorers.map((scorer) => <p key={scorer} className="rounded-2xl bg-white/10 px-4 py-3 text-white/80">{scorer}</p>) : <p className="text-white/50">Składy i zdarzenia pojawią się przed pierwszym gwizdkiem.</p>}<div className="mt-4 flex gap-3 text-sm text-white/50"><Users size={18} /> 4-3-3 vs 4-2-3-1</div></div>
            </div>
            <div className="mt-6 rounded-3xl border border-lime-300/20 bg-lime-300/10 p-5"><h3 className="mb-3 flex items-center gap-2 font-black text-lime-200"><BrainCircuit /> Analiza AI</h3><p className="text-white/75">{selected.ai} Szansa na kolejnego gola gospodarzy: <strong className="text-lime-200">wysoka</strong>.</p></div>
          </motion.div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6"><h2 className="mb-5 flex items-center gap-2 text-xl font-black"><Shield className="text-cyan-300" /> Tabela grupy</h2><div className="space-y-3">{standings.map((row, index) => <div key={row.team} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl bg-black/25 p-3"><span className="text-white/40">{index + 1}</span><div><p className="font-bold">{row.team}</p><p className="text-xs text-white/45">{row.played} mecze • bilans {row.goalDiff > 0 ? '+' : ''}{row.goalDiff} • {row.form}</p></div><strong className="text-lime-200">{row.points} pkt</strong></div>)}</div></div>
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6"><h2 className="mb-5 flex items-center gap-2 text-xl font-black"><Zap className="text-yellow-300" /> Backend flow</h2><div className="space-y-3 text-sm text-white/65">{apiEndpoints.map((endpoint) => <code key={endpoint} className="block rounded-2xl bg-black/35 p-3 text-lime-100">{endpoint}</code>)}</div><p className="mt-4 text-sm text-white/45">SportAPI7 → Node/FastAPI → cache/baza → React/mobile app.</p></div>
            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/15 to-lime-300/10 p-6"><Sparkles className="mb-4 text-cyan-200" /><h2 className="text-xl font-black">Cache policy</h2><p className="mt-2 text-sm text-white/60">Mecze dzienne 5–15 min, live/statystyki 30–60 s, tabele 5–10 min, składy 2–5 min przed meczem.</p></div>
          </aside>
        </section>
      </div>
    </main>
  );
}
