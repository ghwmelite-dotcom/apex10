import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Sun,
  TrendingUp,
  TrendingDown,
  Activity,
  X,
  Settings,
  Palette,
} from "lucide-react";
import { usePrices } from "@/hooks/useAssets";

// Ambient mode context
interface AmbientContextType {
  isAmbient: boolean;
  toggleAmbient: () => void;
  setAmbient: (value: boolean) => void;
}

const AmbientContext = createContext<AmbientContextType | null>(null);

export function useAmbientMode() {
  const context = useContext(AmbientContext);
  if (!context) {
    throw new Error("useAmbientMode must be used within AmbientProvider");
  }
  return context;
}

interface AmbientProviderProps {
  children: ReactNode;
}

export function AmbientProvider({ children }: AmbientProviderProps) {
  const [isAmbient, setIsAmbient] = useState(false);

  const toggleAmbient = () => setIsAmbient((prev) => !prev);
  const setAmbient = (value: boolean) => setIsAmbient(value);

  // Disable scroll in ambient mode
  useEffect(() => {
    if (isAmbient) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isAmbient]);

  return (
    <AmbientContext.Provider value={{ isAmbient, toggleAmbient, setAmbient }}>
      {children}
      <AnimatePresence>{isAmbient && <AmbientOverlay />}</AnimatePresence>
    </AmbientContext.Provider>
  );
}

// The main ambient overlay
function AmbientOverlay() {
  const { setAmbient } = useAmbientMode();
  const { data: prices } = usePrices("BTC,ETH,SOL");
  const [theme, setTheme] = useState<"aurora" | "midnight" | "sunset">("aurora");
  const [showSettings, setShowSettings] = useState(false);

  // ESC key handler to exit ambient mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAmbient(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setAmbient]);

  const themes = {
    aurora: {
      colors: ["from-aurora-cyan/30", "via-aurora-purple/20", "to-aurora-pink/30"],
      orbs: ["bg-aurora-cyan/20", "bg-aurora-purple/20", "bg-aurora-pink/20"],
    },
    midnight: {
      colors: ["from-blue-900/40", "via-purple-900/30", "to-indigo-900/40"],
      orbs: ["bg-blue-500/20", "bg-purple-500/20", "bg-indigo-500/20"],
    },
    sunset: {
      colors: ["from-orange-500/30", "via-pink-500/20", "to-purple-500/30"],
      orbs: ["bg-orange-500/20", "bg-pink-500/20", "bg-purple-500/20"],
    },
  };

  const currentTheme = themes[theme];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] bg-bg-primary"
    >
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.colors.join(" ")}`}>
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              `radial-gradient(circle at 20% 20%, ${currentTheme.orbs[0].replace("bg-", "rgba(0,0,0,0.2)")} 0%, transparent 50%)`,
              `radial-gradient(circle at 80% 80%, ${currentTheme.orbs[1].replace("bg-", "rgba(0,0,0,0.2)")} 0%, transparent 50%)`,
              `radial-gradient(circle at 20% 20%, ${currentTheme.orbs[0].replace("bg-", "rgba(0,0,0,0.2)")} 0%, transparent 50%)`,
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full blur-3xl ${currentTheme.orbs[i % 3]}`}
            style={{
              width: `${150 + i * 50}px`,
              height: `${150 + i * 50}px`,
              left: `${10 + i * 15}%`,
              top: `${10 + (i % 3) * 25}%`,
            }}
            animate={{
              x: [0, 50 * (i % 2 === 0 ? 1 : -1), 0],
              y: [0, 30 * (i % 2 === 0 ? -1 : 1), 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8">
        {/* Time display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <AmbientClock />
        </motion.div>

        {/* Price cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-8 justify-center"
        >
          {prices && Object.entries(prices).map(([symbol, data], index) => (
            <AmbientPriceCard
              key={symbol}
              symbol={symbol}
              price={data.priceUsd}
              change={data.change24h}
              delay={index * 0.1}
            />
          ))}
        </motion.div>

        {/* Pulse indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex items-center gap-3 text-text-muted"
        >
          <Activity className="w-4 h-4" />
          <span className="text-sm">Market is live</span>
          <motion.div
            className="w-2 h-2 rounded-full bg-quantum-green"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-6 right-6 flex items-center gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSettings(!showSettings)}
          className="p-3 rounded-xl bg-bg-secondary/70 backdrop-blur-sm border border-border-default text-text-muted hover:text-text-primary"
        >
          <Settings className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setAmbient(false)}
          className="p-3 rounded-xl bg-bg-secondary/70 backdrop-blur-sm border border-nova-red/50 text-nova-red hover:border-nova-red"
        >
          <X className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Theme settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-20 right-6 p-4 rounded-2xl bg-bg-secondary/80 backdrop-blur-xl border border-border-default"
          >
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-4 h-4 text-aurora-cyan" />
              <span className="text-sm font-medium text-text-primary">Theme</span>
            </div>
            <div className="flex gap-3">
              {(["aurora", "midnight", "sunset"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`w-10 h-10 rounded-xl border-2 transition-all ${
                    theme === t ? "border-aurora-cyan scale-110" : "border-border-default"
                  } ${
                    t === "aurora"
                      ? "bg-gradient-to-br from-aurora-cyan to-aurora-purple"
                      : t === "midnight"
                      ? "bg-gradient-to-br from-blue-900 to-purple-900"
                      : "bg-gradient-to-br from-orange-500 to-purple-500"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-text-muted"
      >
        Press ESC or click X to exit ambient mode
      </motion.p>
    </motion.div>
  );
}

// Ambient clock display
function AmbientClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <motion.div
        className="text-8xl md:text-9xl font-light text-text-primary tracking-tight tabular-nums"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </motion.div>
      <p className="text-xl text-text-muted mt-2">
        {time.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
      </p>
    </div>
  );
}

// Ambient price card
function AmbientPriceCard({
  symbol,
  price,
  change,
  delay,
}: {
  symbol: string;
  price: number;
  change: number;
  delay: number;
}) {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative p-6 rounded-2xl bg-bg-secondary/30 backdrop-blur-xl border border-border-default/50 min-w-[200px]"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl font-bold text-text-primary">{symbol}</span>
        <div className={`flex items-center gap-1 ${isPositive ? "text-quantum-green" : "text-nova-red"}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="text-sm font-medium">{change.toFixed(2)}%</span>
        </div>
      </div>
      <motion.div
        className="text-3xl font-light text-text-primary tabular-nums"
        animate={{ opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, delay: delay * 2 }}
      >
        ${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </motion.div>
    </motion.div>
  );
}

// Toggle button for ambient mode
export function AmbientToggle() {
  const { isAmbient, toggleAmbient } = useAmbientMode();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleAmbient}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-tertiary hover:bg-bg-secondary transition-colors border border-border-default"
    >
      {isAmbient ? (
        <>
          <Sun className="w-4 h-4 text-solar-gold" />
          <span className="text-sm text-text-secondary">Exit Ambient</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-aurora-purple" />
          <span className="text-sm text-text-secondary">Ambient Mode</span>
        </>
      )}
    </motion.button>
  );
}
