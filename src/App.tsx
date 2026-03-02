import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Navigation, 
  Music, 
  Gauge, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Search, 
  Map as MapIcon,
  Fuel,
  Settings,
  Home,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type ScreenType = 'HOME' | 'NAVIGATION' | 'MEDIA' | 'VEHICLE';

interface VehicleData {
  speed: number;
  fuel: number;
  range: number;
  temp: number;
}

interface MediaState {
  title: string;
  artist: string;
  isPlaying: boolean;
  progress: number;
}

// --- Components ---

const Sidebar = ({ active, onSelect }: { active: ScreenType, onSelect: (s: ScreenType) => void }) => (
  <div className="w-20 bg-black border-r border-white/10 flex flex-col items-center py-8 gap-8">
    <button onClick={() => onSelect('HOME')} className={`p-3 rounded-2xl transition-all ${active === 'HOME' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>
      <Home size={28} />
    </button>
    <button onClick={() => onSelect('NAVIGATION')} className={`p-3 rounded-2xl transition-all ${active === 'NAVIGATION' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>
      <Navigation size={28} />
    </button>
    <button onClick={() => onSelect('MEDIA')} className={`p-3 rounded-2xl transition-all ${active === 'MEDIA' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>
      <Music size={28} />
    </button>
    <button onClick={() => onSelect('VEHICLE')} className={`p-3 rounded-2xl transition-all ${active === 'VEHICLE' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>
      <Gauge size={28} />
    </button>
    <div className="mt-auto">
      <button className="p-3 text-white/20 hover:text-white transition-colors">
        <Settings size={24} />
      </button>
    </div>
  </div>
);

const NavigationScreen = () => {
  const [trafficLevel, setTrafficLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [showAlternatives, setShowAlternatives] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const levels: ('LOW' | 'MEDIUM' | 'HIGH')[] = ['LOW', 'MEDIUM', 'HIGH'];
      setTrafficLevel(levels[Math.floor(Math.random() * levels.length)]);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const trafficColor = {
    LOW: 'text-emerald-500',
    MEDIUM: 'text-amber-500',
    HIGH: 'text-red-500'
  }[trafficLevel];

  const trafficLabel = {
    LOW: 'Małe natężenie ruchu',
    MEDIUM: 'Umiarkowany ruch',
    HIGH: 'Duże korki'
  }[trafficLevel];

  return (
    <div className="relative w-full h-full bg-zinc-900 overflow-hidden">
      {/* Mock Map with Traffic Lines */}
      <div className="absolute inset-0 opacity-40 bg-[url('https://picsum.photos/seed/map/1200/800')] bg-cover" />
      
      {/* Traffic Overlay Lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
        <path d="M100,200 L400,300 L700,250" stroke={trafficLevel === 'HIGH' ? '#ef4444' : '#f59e0b'} strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M200,500 L500,450 L800,550" stroke="#10b981" strokeWidth="8" fill="none" strokeLinecap="round" />
      </svg>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      
      {/* Search Bar */}
      <div className="absolute top-6 left-6 right-6 flex gap-4">
        <div className="flex-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-4">
          <Search className="text-white/40" size={20} />
          <input 
            type="text" 
            placeholder="Gdzie chcesz jechać?" 
            className="bg-transparent border-none outline-none text-white w-full text-lg"
          />
        </div>
        <button 
          onClick={() => setShowAlternatives(!showAlternatives)}
          className="bg-white text-black px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <MapIcon size={20} />
          Trasy
        </button>
      </div>

      {/* Traffic Status Toast */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-24 left-6 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 flex items-center gap-3"
      >
        <div className={`w-2 h-2 rounded-full animate-pulse ${trafficLevel === 'HIGH' ? 'bg-red-500' : trafficLevel === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
        <span className={`text-sm font-medium ${trafficColor}`}>{trafficLabel}</span>
      </motion.div>

      {/* Alternative Routes Overlay */}
      <AnimatePresence>
        {showAlternatives && (
          <motion.div 
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="absolute top-24 right-6 bottom-24 w-80 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 z-20"
          >
            <h3 className="text-white font-bold text-xl mb-6">Alternatywne Trasy</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-white font-semibold">Przez A2</span>
                  <span className="text-emerald-500 font-bold">-4 min</span>
                </div>
                <p className="text-white/40 text-sm">Najszybsza trasa mimo robót drogowych.</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-white font-semibold">Przez Centrum</span>
                  <span className="text-amber-500 font-bold">+8 min</span>
                </div>
                <p className="text-white/40 text-sm">Umiarkowany ruch na ul. Marszałkowskiej.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Card */}
      <div className="absolute bottom-6 left-6 w-80 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
            <Navigation className="text-black rotate-45" size={24} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-xl">350m</h3>
            <p className="text-white/60">Skręć w prawo w ul. Marszałkowską</p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-end">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider font-bold">Czas przyjazdu</p>
            <p className="text-white text-2xl font-medium">14:45</p>
          </div>
          <div className="text-right">
            <p className="text-white/40 text-xs uppercase tracking-wider font-bold">Dystans</p>
            <p className="text-white text-xl">12.4 km</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MediaScreen = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <div className="w-full h-full bg-black flex items-center justify-center p-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full" />
      
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-2xl">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-64 h-64 rounded-3xl shadow-2xl overflow-hidden border border-white/10"
        >
          <img src="https://picsum.photos/seed/album/400/400" alt="Album Art" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </motion.div>

        <div className="text-center">
          <h2 className="text-white text-4xl font-bold tracking-tight mb-2">Midnight City</h2>
          <p className="text-white/60 text-xl">M83 • Hurry Up, We're Dreaming</p>
        </div>

        <div className="w-full space-y-4">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white"
              animate={{ width: '45%' }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="flex justify-between text-white/40 text-sm font-mono">
            <span>2:14</span>
            <span>4:03</span>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <button className="text-white/60 hover:text-white transition-colors">
            <SkipBack size={32} fill="currentColor" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
          </button>
          <button className="text-white/60 hover:text-white transition-colors">
            <SkipForward size={32} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
};

const VehicleScreen = () => {
  const [speed, setSpeed] = useState(72);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(s => s + (Math.random() > 0.5 ? 1 : -1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full bg-zinc-950 p-12 grid grid-cols-2 gap-8">
      <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-white/5 rounded-2xl text-white/60">
            <Gauge size={24} />
          </div>
          <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Live Data</span>
        </div>
        <div>
          <p className="text-white/40 text-sm font-medium mb-1">Prędkość</p>
          <div className="flex items-baseline gap-2">
            <span className="text-white text-8xl font-light tracking-tighter">{speed}</span>
            <span className="text-white/20 text-2xl font-medium">km/h</span>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-white/5 rounded-2xl text-white/60">
            <Fuel size={24} />
          </div>
          <span className="text-white/20 text-xs font-bold uppercase tracking-widest">Fuel System</span>
        </div>
        <div>
          <p className="text-white/40 text-sm font-medium mb-1">Poziom Paliwa</p>
          <div className="flex items-baseline gap-2">
            <span className="text-white text-8xl font-light tracking-tighter">64</span>
            <span className="text-white/20 text-2xl font-medium">%</span>
          </div>
          <div className="mt-6 h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[64%]" />
          </div>
        </div>
      </div>

      <div className="col-span-2 bg-zinc-900/50 border border-white/5 rounded-3xl p-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/60">
            <Info size={32} />
          </div>
          <div>
            <h4 className="text-white text-xl font-medium">Status Systemu</h4>
            <p className="text-white/40">Wszystkie systemy sprawne • Ciśnienie opon OK</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-sm">Zasięg</p>
          <p className="text-white text-3xl font-medium">420 km</p>
        </div>
      </div>
    </div>
  );
};

const HomeScreen = ({ onSelect }: { onSelect: (s: ScreenType) => void }) => (
  <div className="w-full h-full bg-black p-12 grid grid-cols-3 gap-6">
    <div className="col-span-2 row-span-2 bg-zinc-900 rounded-3xl overflow-hidden relative group cursor-pointer" onClick={() => onSelect('NAVIGATION')}>
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/800/600')] bg-cover opacity-50 group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      <div className="absolute bottom-8 left-8">
        <div className="flex items-center gap-3 mb-2">
          <Navigation className="text-emerald-500" size={20} />
          <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Nawigacja</span>
        </div>
        <h3 className="text-white text-3xl font-bold">Kontynuuj do: Dom</h3>
        <p className="text-white/60">Pozostało 12 min • 4.2 km</p>
      </div>
    </div>

    <div className="bg-zinc-900 rounded-3xl p-8 flex flex-col justify-between cursor-pointer hover:bg-zinc-800 transition-colors" onClick={() => onSelect('MEDIA')}>
      <div className="flex justify-between items-start">
        <Music className="text-indigo-500" size={24} />
        <Play size={20} fill="currentColor" className="text-white/20" />
      </div>
      <div>
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Teraz odtwarzane</p>
        <h4 className="text-white text-xl font-bold truncate">Midnight City</h4>
        <p className="text-white/60 truncate">M83</p>
      </div>
    </div>

    <div className="bg-zinc-900 rounded-3xl p-8 flex flex-col justify-between cursor-pointer hover:bg-zinc-800 transition-colors" onClick={() => onSelect('VEHICLE')}>
      <div className="flex justify-between items-start">
        <Gauge className="text-amber-500" size={24} />
        <ChevronRight size={20} className="text-white/20" />
      </div>
      <div>
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Status Pojazdu</p>
        <h4 className="text-white text-xl font-bold">72 km/h</h4>
        <p className="text-white/60">Paliwo: 64%</p>
      </div>
    </div>
  </div>
);

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('HOME');
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header / Status Bar */}
      <div className="h-12 bg-black border-b border-white/5 flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <Car size={18} className="text-white/40" />
          <span className="text-white/40 text-xs font-medium tracking-widest uppercase">Android Auto Simulator</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-white/60 text-sm font-mono">12:45</span>
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-white/60 rounded-full" />
            <div className="w-1 h-3 bg-white/60 rounded-full" />
            <div className="w-1 h-3 bg-white/20 rounded-full" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <Sidebar active={activeScreen} onSelect={setActiveScreen} />
        
        <main className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full h-full"
            >
              {activeScreen === 'HOME' && <HomeScreen onSelect={setActiveScreen} />}
              {activeScreen === 'NAVIGATION' && <NavigationScreen />}
              {activeScreen === 'MEDIA' && <MediaScreen />}
              {activeScreen === 'VEHICLE' && <VehicleScreen />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Code Toggle Button */}
      <button 
        onClick={() => setShowCode(!showCode)}
        className="fixed bottom-6 right-6 bg-white text-black px-6 py-3 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform z-50 flex items-center gap-2"
      >
        <Info size={20} />
        {showCode ? 'Ukryj Kod Kotlin' : 'Pokaż Kod Kotlin'}
      </button>

      {/* Code Overlay */}
      <AnimatePresence>
        {showCode && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl overflow-y-auto p-12"
          >
            <div className="max-w-4xl mx-auto space-y-12 pb-24">
              <div className="flex justify-between items-center">
                <h2 className="text-white text-4xl font-bold">Implementacja Kotlin (Android Auto)</h2>
                <button onClick={() => setShowCode(false)} className="text-white/40 hover:text-white">Zamknij</button>
              </div>

              <section className="space-y-4">
                <h3 className="text-emerald-500 text-xl font-semibold flex items-center gap-2">
                  <Gauge size={24} /> 1. Dane Pojazdu (Hardware SDK)
                </h3>
                <p className="text-white/60">Używamy `CarHardwareManager` do odczytu prędkości i paliwa.</p>
                <pre className="bg-zinc-900 p-6 rounded-2xl text-zinc-300 overflow-x-auto font-mono text-sm leading-relaxed border border-white/5">
{`// Wymagane uprawnienia w AndroidManifest.xml:
// <uses-permission android:name="androidx.car.app.HARDWARE_INFO" />

class VehicleInfoScreen(carContext: CarContext) : Screen(carContext) {
    private var speed: Float = 0f
    private var fuelLevel: Float = 0f

    init {
        val hardware = carContext.getCarService(CarHardwareManager::class.java)
        val info = hardware.carInfo
        val sensors = hardware.carSensors

        // Subskrypcja prędkości
        sensors.addSpeedListener(CarHardwareExecutor.UI) { data ->
            speed = data.rawSpeedMetersPerSecond.value ?: 0f
            invalidate() // Odśwież UI
        }

        // Subskrypcja paliwa
        info.addEnergyLevelListener(CarHardwareExecutor.UI) { data ->
            fuelLevel = data.fuelVolumeDisplayUnit.value ?: 0f
            invalidate()
        }
    }

    override fun onGetTemplate(): Template {
        return PaneTemplate.Builder(
            Pane.Builder()
                .addRow(Row.Builder().setTitle("Prędkość").addText("\${speed} km/h").build())
                .addRow(Row.Builder().setTitle("Paliwo").addText("\${fuelLevel}%").build())
                .build()
        ).setTitle("Dane Pojazdu").build()
    }
}`}
                </pre>
              </section>

              <section className="space-y-4">
                <h3 className="text-indigo-500 text-xl font-semibold flex items-center gap-2">
                  <Music size={24} /> 2. Odtwarzanie Multimediów (MediaSession)
                </h3>
                <p className="text-white/60">Android Auto automatycznie renderuje UI dla aplikacji muzycznych, jeśli dostarczysz `MediaSession`.</p>
                <pre className="bg-zinc-900 p-6 rounded-2xl text-zinc-300 overflow-x-auto font-mono text-sm leading-relaxed border border-white/5">
{`class MusicService : MediaBrowserServiceCompat() {
    private lateinit var mediaSession: MediaSessionCompat

    override fun onCreate() {
        super.onCreate()
        mediaSession = MediaSessionCompat(this, "MusicService")
        
        mediaSession.setCallback(object : MediaSessionCompat.Callback() {
            override fun onPlay() { /* Logika play */ }
            override fun onPause() { /* Logika pauza */ }
            override fun onSkipToNext() { /* Następny utwór */ }
        })

        sessionToken = mediaSession.sessionToken
    }
}`}
                </pre>
              </section>

              <section className="space-y-4">
                <h3 className="text-amber-500 text-xl font-semibold flex items-center gap-2">
                  <Navigation size={24} /> 3. Nawigacja i Mapy (z Ruchem Live)
                </h3>
                <p className="text-white/60">Wymaga `NavigationManager` oraz dynamicznego odświeżania tras na podstawie danych o ruchu.</p>
                <pre className="bg-zinc-900 p-6 rounded-2xl text-zinc-300 overflow-x-auto font-mono text-sm leading-relaxed border border-white/5">
{`// Przykład integracji danych o ruchu drogowym
class NavScreen(carContext: CarContext) : Screen(carContext) {
    private var trafficData: TrafficInfo? = null

    init {
        fetchTrafficData()
    }

    private fun fetchTrafficData() {
        // Symulacja pobierania danych z API (np. Google Maps Traffic API)
        // W rzeczywistości użyłbyś Retrofit lub innej biblioteki sieciowej
        trafficData = TrafficInfo(congestionLevel = "HIGH", delayMinutes = 15)
        
        if (trafficData?.congestionLevel == "HIGH") {
            suggestAlternativeRoute()
        }
    }

    private fun suggestAlternativeRoute() {
        val alert = Alert.Builder("TRAFFIC_ALERT", "Wykryto korki", Alert.DURATION_SHOW_INDEFINITELY)
            .setSubtitle("Sugerowana alternatywna trasa (-5 min)")
            .addAction(Action.Builder().setTitle("Zmień trasę").setOnClickListener {
                // Logika zmiany trasy
            }.build())
            .build()
        
        carContext.getCarService(AppManager::class.java).showAlert(alert)
    }

    override fun onGetTemplate(): Template {
        return NavigationTemplate.Builder()
            .setNavigationInfo(
                RoutingInfo.Builder()
                    .setCurrentStep(
                        Step.Builder("Skręć w prawo w ul. Marszałkowską")
                            .setManeuver(Maneuver.Builder(Maneuver.TYPE_TURN_RIGHT_NORMAL).build())
                            .build(),
                        Distance.create(350.0, Distance.UNIT_METERS)
                    ).build()
            )
            .setBackgroundColor(CarColor.SECONDARY) // Można użyć do wizualizacji natężenia
            .build()
    }
}`}
                </pre>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
