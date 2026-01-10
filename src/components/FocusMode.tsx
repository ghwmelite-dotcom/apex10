import { useState, useEffect, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Maximize2,
  Clock,
  Target,
  Zap,
  Trophy,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";

interface FocusModeProps {
  children: ReactNode;
  isActive: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  currentStep?: number;
  totalSteps?: number;
  onComplete?: () => void;
}

interface SessionStats {
  questionsAnswered: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  streak: number;
}

// Floating particle component for ambient effect
const FloatingParticle = ({ delay, duration, size }: { delay: number; duration: number; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-gradient-to-r from-accent-cyan/10 to-accent-purple/10 blur-sm"
    style={{
      width: size,
      height: size,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
    animate={{
      y: [0, -30, 0],
      x: [0, Math.random() * 20 - 10, 0],
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// Session timer component
const SessionTimer = ({ seconds, isPaused }: { seconds: number; isPaused: boolean }) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className="flex items-center gap-2 text-text-secondary">
      <Clock className={`w-4 h-4 ${isPaused ? "text-amber-400" : "text-accent-cyan"}`} />
      <span className="font-mono text-sm">
        {minutes.toString().padStart(2, "0")}:{remainingSeconds.toString().padStart(2, "0")}
      </span>
      {isPaused && (
        <span className="text-xs text-amber-400 animate-pulse">PAUSED</span>
      )}
    </div>
  );
};

// Progress ring component
const ProgressRing = ({ progress, size = 40 }: { progress: number; size?: number }) => {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-bg-tertiary"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00FFD1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-text-primary">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

// Stats card component
const StatCard = ({
  icon: Icon,
  label,
  value,
  color
}: {
  icon: typeof Target;
  label: string;
  value: string | number;
  color: string;
}) => (
  <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-bg-secondary/50 backdrop-blur-sm border border-border-primary/30">
    <div className={`p-1.5 rounded-md ${color}`}>
      <Icon className="w-3.5 h-3.5" />
    </div>
    <div className="flex flex-col">
      <span className="text-xs text-text-muted">{label}</span>
      <span className="text-sm font-semibold text-text-primary">{value}</span>
    </div>
  </div>
);

export function FocusMode({
  children,
  isActive,
  onClose,
  title = "Focus Mode",
  subtitle,
  currentStep = 0,
  totalSteps = 0,
}: FocusModeProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    questionsAnswered: 0,
    correctAnswers: 0,
    timeSpent: 0,
    streak: 0,
  });

  // Timer effect
  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      setSessionStats((prev) => ({
        ...prev,
        timeSpent: prev.timeSpent + 1,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  // Reset stats when entering focus mode
  useEffect(() => {
    if (isActive) {
      setSessionStats({
        questionsAnswered: 0,
        correctAnswers: 0,
        timeSpent: 0,
        streak: 0,
      });
      setIsPaused(false);
    }
  }, [isActive]);

  // ESC key handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isActive) {
        onClose();
      }
      if (e.key === " " && isActive) {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    },
    [isActive, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when active
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isActive]);

  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  const accuracy = sessionStats.questionsAnswered > 0
    ? Math.round((sessionStats.correctAnswers / sessionStats.questionsAnswered) * 100)
    : 0;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-bg-primary"
        >
          {/* Ambient background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Gradient orbs */}
            <motion.div
              className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-accent-cyan/5 blur-[100px]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-accent-purple/5 blur-[100px]"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            />

            {/* Floating particles */}
            {Array.from({ length: 15 }).map((_, i) => (
              <FloatingParticle
                key={i}
                delay={i * 0.5}
                duration={6 + Math.random() * 4}
                size={4 + Math.random() * 8}
              />
            ))}

            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0, 255, 209, 0.5) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 255, 209, 0.5) 1px, transparent 1px)
                `,
                backgroundSize: "50px 50px",
              }}
            />
          </div>

          {/* Top bar */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border-primary/20 bg-bg-primary/80 backdrop-blur-xl"
          >
            {/* Left section - Title & Progress */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 border border-accent-cyan/30">
                  <Maximize2 className="w-5 h-5 text-accent-cyan" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
                  {subtitle && (
                    <p className="text-sm text-text-secondary">{subtitle}</p>
                  )}
                </div>
              </div>

              {totalSteps > 0 && (
                <div className="flex items-center gap-3 pl-6 border-l border-border-primary/30">
                  <ProgressRing progress={progress} />
                  <div className="flex flex-col">
                    <span className="text-xs text-text-muted">Progress</span>
                    <span className="text-sm font-medium text-text-primary">
                      {currentStep} / {totalSteps}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Center section - Session stats */}
            <div className="hidden md:flex items-center gap-3">
              <StatCard
                icon={Target}
                label="Answered"
                value={sessionStats.questionsAnswered}
                color="bg-accent-cyan/20 text-accent-cyan"
              />
              <StatCard
                icon={Zap}
                label="Streak"
                value={sessionStats.streak}
                color="bg-amber-500/20 text-amber-400"
              />
              <StatCard
                icon={Trophy}
                label="Accuracy"
                value={`${accuracy}%`}
                color="bg-accent-purple/20 text-accent-purple"
              />
            </div>

            {/* Right section - Timer & Controls */}
            <div className="flex items-center gap-4">
              <SessionTimer seconds={sessionStats.timeSpent} isPaused={isPaused} />

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-2 rounded-lg hover:bg-bg-secondary/50 text-text-secondary hover:text-text-primary transition-colors"
                  title={isPaused ? "Resume (Space)" : "Pause (Space)"}
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setSessionStats({
                    questionsAnswered: 0,
                    correctAnswers: 0,
                    timeSpent: 0,
                    streak: 0,
                  })}
                  className="p-2 rounded-lg hover:bg-bg-secondary/50 text-text-secondary hover:text-text-primary transition-colors"
                  title="Reset Session"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-text-secondary hover:text-red-400 transition-colors"
                  title="Exit Focus Mode (ESC)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.header>

          {/* Main content area */}
          <motion.main
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 h-[calc(100vh-73px)] overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto px-6 py-8">
              {/* Pause overlay */}
              <AnimatePresence>
                {isPaused && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/90 backdrop-blur-sm"
                  >
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.9 }}
                      className="text-center"
                    >
                      <div className="p-6 rounded-2xl bg-bg-secondary/50 border border-border-primary/30 backdrop-blur-xl">
                        <Pause className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-text-primary mb-2">Session Paused</h2>
                        <p className="text-text-secondary mb-4">Press Space or click Resume to continue</p>
                        <button
                          onClick={() => setIsPaused(false)}
                          className="px-6 py-2 rounded-lg bg-gradient-to-r from-accent-cyan to-accent-purple text-bg-primary font-medium hover:opacity-90 transition-opacity"
                        >
                          Resume Training
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Render children with session context */}
              {children}
            </div>
          </motion.main>

          {/* Bottom hint bar */}
          <motion.footer
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-6 py-3 border-t border-border-primary/20 bg-bg-primary/80 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <kbd className="px-2 py-1 rounded bg-bg-secondary/50 border border-border-primary/30 font-mono">ESC</kbd>
              <span>Exit</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <kbd className="px-2 py-1 rounded bg-bg-secondary/50 border border-border-primary/30 font-mono">Space</kbd>
              <span>Pause/Resume</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <ChevronRight className="w-3 h-3" />
              <span>Stay focused, learn smart</span>
            </div>
          </motion.footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Context for updating session stats from child components
import { createContext, useContext } from "react";

interface FocusModeContextType {
  updateStats: (update: Partial<SessionStats>) => void;
  incrementAnswered: (correct: boolean) => void;
}

export const FocusModeContext = createContext<FocusModeContextType | null>(null);

export function useFocusMode() {
  const context = useContext(FocusModeContext);
  return context;
}

// Provider wrapper component
export function FocusModeProvider({
  children,
  onStatsUpdate,
}: {
  children: ReactNode;
  onStatsUpdate?: (stats: SessionStats) => void;
}) {
  const [stats, setStats] = useState<SessionStats>({
    questionsAnswered: 0,
    correctAnswers: 0,
    timeSpent: 0,
    streak: 0,
  });

  const updateStats = useCallback((update: Partial<SessionStats>) => {
    setStats((prev) => {
      const newStats = { ...prev, ...update };
      onStatsUpdate?.(newStats);
      return newStats;
    });
  }, [onStatsUpdate]);

  const incrementAnswered = useCallback((correct: boolean) => {
    setStats((prev) => {
      const newStats = {
        ...prev,
        questionsAnswered: prev.questionsAnswered + 1,
        correctAnswers: correct ? prev.correctAnswers + 1 : prev.correctAnswers,
        streak: correct ? prev.streak + 1 : 0,
      };
      onStatsUpdate?.(newStats);
      return newStats;
    });
  }, [onStatsUpdate]);

  return (
    <FocusModeContext.Provider value={{ updateStats, incrementAnswered }}>
      {children}
    </FocusModeContext.Provider>
  );
}

export default FocusMode;
