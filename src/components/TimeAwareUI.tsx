import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Sunrise, Sunset, Coffee, Sparkles } from "lucide-react";

// Time periods with their characteristics
type TimePeriod = "morning" | "day" | "evening" | "night";

interface TimeContext {
  period: TimePeriod;
  hour: number;
  greeting: string;
  suggestion: string;
  accentColor: string;
  gradientColors: string;
  icon: typeof Sun;
  ambientIntensity: number;
}

const TIME_CONTEXTS: Record<TimePeriod, Omit<TimeContext, "hour">> = {
  morning: {
    period: "morning",
    greeting: "Good morning",
    suggestion: "Start your day by checking the market overview",
    accentColor: "text-solar-gold",
    gradientColors: "from-solar-gold/20 via-plasma-orange/10 to-aurora-cyan/10",
    icon: Sunrise,
    ambientIntensity: 0.7,
  },
  day: {
    period: "day",
    greeting: "Good afternoon",
    suggestion: "Perfect time for learning something new about crypto",
    accentColor: "text-aurora-cyan",
    gradientColors: "from-aurora-cyan/20 via-aurora-purple/10 to-aurora-pink/10",
    icon: Sun,
    ambientIntensity: 1,
  },
  evening: {
    period: "evening",
    greeting: "Good evening",
    suggestion: "Wind down with some security training",
    accentColor: "text-aurora-purple",
    gradientColors: "from-aurora-purple/20 via-aurora-pink/10 to-nova-red/10",
    icon: Sunset,
    ambientIntensity: 0.6,
  },
  night: {
    period: "night",
    greeting: "Good night",
    suggestion: "Enable ambient mode for a relaxed viewing experience",
    accentColor: "text-aurora-pink",
    gradientColors: "from-aurora-pink/20 via-aurora-purple/10 to-bg-secondary/20",
    icon: Moon,
    ambientIntensity: 0.4,
  },
};

function getTimePeriod(hour: number): TimePeriod {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "day";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

const TimeAwareContext = createContext<TimeContext | null>(null);

export function useTimeAware() {
  const context = useContext(TimeAwareContext);
  if (!context) {
    throw new Error("useTimeAware must be used within TimeAwareProvider");
  }
  return context;
}

interface TimeAwareProviderProps {
  children: ReactNode;
}

export function TimeAwareProvider({ children }: TimeAwareProviderProps) {
  const [hour, setHour] = useState(() => new Date().getHours());

  useEffect(() => {
    // Update hour every minute
    const interval = setInterval(() => {
      setHour(new Date().getHours());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const period = getTimePeriod(hour);
  const contextValue: TimeContext = {
    ...TIME_CONTEXTS[period],
    hour,
  };

  return (
    <TimeAwareContext.Provider value={contextValue}>
      {children}
    </TimeAwareContext.Provider>
  );
}

// Dynamic greeting component
export function TimeGreeting({ userName }: { userName?: string }) {
  const { greeting, suggestion, accentColor, icon: Icon, period } = useTimeAware();
  const [showSuggestion, setShowSuggestion] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSuggestion(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", delay: 0.2 }}
          className={`p-3 rounded-xl bg-gradient-to-br ${
            period === "morning"
              ? "from-solar-gold/20 to-plasma-orange/10"
              : period === "day"
              ? "from-aurora-cyan/20 to-aurora-purple/10"
              : period === "evening"
              ? "from-aurora-purple/20 to-aurora-pink/10"
              : "from-aurora-pink/20 to-bg-tertiary"
          }`}
        >
          <Icon className={`w-6 h-6 ${accentColor}`} />
        </motion.div>
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-text-primary"
          >
            {greeting}
            {userName && <span className="text-text-muted">, {userName}</span>}
          </motion.h2>
          <AnimatePresence>
            {showSuggestion && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-text-muted mt-1"
              >
                {suggestion}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// Ambient background that changes with time
export function AmbientBackground() {
  const { period, gradientColors, ambientIntensity } = useTimeAware();

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base gradient */}
      <motion.div
        key={period}
        initial={{ opacity: 0 }}
        animate={{ opacity: ambientIntensity * 0.3 }}
        transition={{ duration: 2 }}
        className={`absolute inset-0 bg-gradient-to-br ${gradientColors}`}
      />

      {/* Floating orbs that change with time */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl ${
          period === "morning"
            ? "bg-solar-gold/10"
            : period === "day"
            ? "bg-aurora-cyan/10"
            : period === "evening"
            ? "bg-aurora-purple/10"
            : "bg-aurora-pink/5"
        }`}
        style={{ opacity: ambientIntensity * 0.5 }}
      />

      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl ${
          period === "morning"
            ? "bg-plasma-orange/10"
            : period === "day"
            ? "bg-aurora-purple/10"
            : period === "evening"
            ? "bg-aurora-pink/10"
            : "bg-aurora-purple/5"
        }`}
        style={{ opacity: ambientIntensity * 0.4 }}
      />

      {/* Stars for night time */}
      {period === "night" && (
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Time-aware quick actions
export function TimeBasedSuggestions() {
  const { period, accentColor, icon: Icon } = useTimeAware();

  const suggestions = {
    morning: [
      { label: "Market Overview", href: "/", icon: Sparkles },
      { label: "News Digest", href: "/learn", icon: Coffee },
    ],
    day: [
      { label: "Learn Basics", href: "/learn", icon: Sparkles },
      { label: "Security Quiz", href: "/security", icon: Coffee },
    ],
    evening: [
      { label: "Security Training", href: "/security", icon: Sparkles },
      { label: "Review Progress", href: "/", icon: Coffee },
    ],
    night: [
      { label: "Ambient Mode", href: "/", icon: Moon },
      { label: "Light Reading", href: "/learn", icon: Sparkles },
    ],
  };

  const currentSuggestions = suggestions[period];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-text-muted mr-2">Suggested:</span>
      {currentSuggestions.map((item, index) => {
        const ItemIcon = item.icon;
        return (
          <motion.a
            key={item.label}
            href={item.href}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-tertiary hover:bg-bg-secondary transition-colors text-sm`}
          >
            <ItemIcon className={`w-4 h-4 ${accentColor}`} />
            <span className="text-text-secondary hover:text-text-primary">
              {item.label}
            </span>
          </motion.a>
        );
      })}
    </div>
  );
}

// Mini time indicator
export function TimeIndicator() {
  const { period, accentColor, icon: Icon } = useTimeAware();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-tertiary/50">
      <Icon className={`w-4 h-4 ${accentColor}`} />
      <span className="text-sm text-text-secondary tabular-nums">
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
}
