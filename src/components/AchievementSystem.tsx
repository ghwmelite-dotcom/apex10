import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Star,
  Shield,
  BookOpen,
  Target,
  Flame,
  Zap,
  Award,
  Lock,
  CheckCircle,
  TrendingUp,
  Sparkles,
  X,
} from "lucide-react";
import { useSound } from "@/lib/sounds";

// Achievement definitions
export const ACHIEVEMENTS = {
  // Learning achievements
  first_lesson: {
    id: "first_lesson",
    name: "First Steps",
    description: "Complete your first learning module",
    icon: BookOpen,
    category: "learning",
    xpReward: 50,
    color: "text-aurora-cyan",
    bgColor: "from-aurora-cyan/20 to-aurora-cyan/5",
  },
  crypto_basics: {
    id: "crypto_basics",
    name: "Crypto Scholar",
    description: "Complete the cryptocurrency basics course",
    icon: Star,
    category: "learning",
    xpReward: 200,
    color: "text-solar-gold",
    bgColor: "from-solar-gold/20 to-solar-gold/5",
  },
  defi_explorer: {
    id: "defi_explorer",
    name: "DeFi Explorer",
    description: "Learn about decentralized finance",
    icon: Zap,
    category: "learning",
    xpReward: 250,
    color: "text-aurora-purple",
    bgColor: "from-aurora-purple/20 to-aurora-purple/5",
  },

  // Security achievements
  security_aware: {
    id: "security_aware",
    name: "Security Aware",
    description: "Complete the security checklist",
    icon: Shield,
    category: "security",
    xpReward: 100,
    color: "text-quantum-green",
    bgColor: "from-quantum-green/20 to-quantum-green/5",
  },
  phishing_hunter: {
    id: "phishing_hunter",
    name: "Phishing Hunter",
    description: "Identify 5 phishing attempts correctly",
    icon: Target,
    category: "security",
    xpReward: 300,
    color: "text-accent-danger",
    bgColor: "from-accent-danger/20 to-accent-danger/5",
  },
  quiz_master: {
    id: "quiz_master",
    name: "Quiz Master",
    description: "Score 100% on 3 security quizzes",
    icon: Award,
    category: "security",
    xpReward: 400,
    color: "text-solar-gold",
    bgColor: "from-solar-gold/20 to-solar-gold/5",
  },

  // Engagement achievements
  daily_login: {
    id: "daily_login",
    name: "Consistent Learner",
    description: "Log in 7 days in a row",
    icon: Flame,
    category: "engagement",
    xpReward: 150,
    color: "text-accent-danger",
    bgColor: "from-accent-danger/20 to-accent-danger/5",
  },
  explorer: {
    id: "explorer",
    name: "Platform Explorer",
    description: "Visit all sections of the platform",
    icon: TrendingUp,
    category: "engagement",
    xpReward: 75,
    color: "text-aurora-cyan",
    bgColor: "from-aurora-cyan/20 to-aurora-cyan/5",
  },

  // Mastery achievements
  level_5: {
    id: "level_5",
    name: "Rising Star",
    description: "Reach level 5",
    icon: Star,
    category: "mastery",
    xpReward: 100,
    color: "text-solar-gold",
    bgColor: "from-solar-gold/20 to-solar-gold/5",
  },
  level_10: {
    id: "level_10",
    name: "Crypto Enthusiast",
    description: "Reach level 10",
    icon: Trophy,
    category: "mastery",
    xpReward: 250,
    color: "text-aurora-purple",
    bgColor: "from-aurora-purple/20 to-aurora-purple/5",
  },
  completionist: {
    id: "completionist",
    name: "Completionist",
    description: "Unlock all other achievements",
    icon: Sparkles,
    category: "mastery",
    xpReward: 1000,
    color: "text-aurora-pink",
    bgColor: "from-aurora-pink/20 to-aurora-pink/5",
  },
} as const;

// XP required for each level
const XP_PER_LEVEL = 100;
const XP_MULTIPLIER = 1.5;

function getXPForLevel(level: number): number {
  return Math.floor(XP_PER_LEVEL * Math.pow(XP_MULTIPLIER, level - 1));
}

function getLevelFromXP(xp: number): { level: number; currentXP: number; requiredXP: number } {
  let level = 1;
  let totalXP = 0;

  while (true) {
    const required = getXPForLevel(level);
    if (totalXP + required > xp) {
      return {
        level,
        currentXP: xp - totalXP,
        requiredXP: required,
      };
    }
    totalXP += required;
    level++;
  }
}

// Context for achievement system
interface AchievementContextType {
  xp: number;
  level: number;
  currentXP: number;
  requiredXP: number;
  achievements: string[];
  addXP: (amount: number) => void;
  unlockAchievement: (id: string) => void;
  hasAchievement: (id: string) => boolean;
  streak: number;
}

const AchievementContext = createContext<AchievementContextType | null>(null);

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error("useAchievements must be used within AchievementProvider");
  }
  return context;
}

interface AchievementProviderProps {
  children: ReactNode;
}

export function AchievementProvider({ children }: AchievementProviderProps) {
  const [xp, setXP] = useState(() => {
    const saved = localStorage.getItem("apex_xp");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [achievements, setAchievements] = useState<string[]>(() => {
    const saved = localStorage.getItem("apex_achievements");
    return saved ? JSON.parse(saved) : [];
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("apex_streak");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [newAchievement, setNewAchievement] = useState<string | null>(null);
  const { playAchievement } = useSound();

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("apex_xp", xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem("apex_achievements", JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem("apex_streak", streak.toString());
  }, [streak]);

  // Check for daily login
  useEffect(() => {
    const lastLogin = localStorage.getItem("apex_last_login");
    const today = new Date().toDateString();

    if (lastLogin !== today) {
      localStorage.setItem("apex_last_login", today);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastLogin === yesterday.toDateString()) {
        setStreak((s) => s + 1);
      } else if (lastLogin !== today) {
        setStreak(1);
      }
    }
  }, []);

  const levelInfo = getLevelFromXP(xp);

  const addXP = (amount: number) => {
    const prevLevel = getLevelFromXP(xp).level;
    setXP((prev) => prev + amount);
    const newLevel = getLevelFromXP(xp + amount).level;

    // Check for level-up achievements
    if (newLevel >= 5 && !achievements.includes("level_5")) {
      unlockAchievement("level_5");
    }
    if (newLevel >= 10 && !achievements.includes("level_10")) {
      unlockAchievement("level_10");
    }
  };

  const unlockAchievement = (id: string) => {
    if (achievements.includes(id)) return;

    const achievement = ACHIEVEMENTS[id as keyof typeof ACHIEVEMENTS];
    if (!achievement) return;

    setAchievements((prev) => [...prev, id]);
    setNewAchievement(id);
    playAchievement();

    // Add XP reward
    setXP((prev) => prev + achievement.xpReward);

    // Check for completionist
    const allOtherAchievements = Object.keys(ACHIEVEMENTS).filter((a) => a !== "completionist");
    if (allOtherAchievements.every((a) => achievements.includes(a) || a === id)) {
      if (!achievements.includes("completionist")) {
        setTimeout(() => unlockAchievement("completionist"), 2000);
      }
    }
  };

  const hasAchievement = (id: string) => achievements.includes(id);

  return (
    <AchievementContext.Provider
      value={{
        xp,
        level: levelInfo.level,
        currentXP: levelInfo.currentXP,
        requiredXP: levelInfo.requiredXP,
        achievements,
        addXP,
        unlockAchievement,
        hasAchievement,
        streak,
      }}
    >
      {children}

      {/* Achievement popup */}
      <AnimatePresence>
        {newAchievement && (
          <AchievementPopup
            achievementId={newAchievement}
            onClose={() => setNewAchievement(null)}
          />
        )}
      </AnimatePresence>
    </AchievementContext.Provider>
  );
}

// Achievement popup component
function AchievementPopup({
  achievementId,
  onClose,
}: {
  achievementId: string;
  onClose: () => void;
}) {
  const achievement = ACHIEVEMENTS[achievementId as keyof typeof ACHIEVEMENTS];
  if (!achievement) return null;

  const Icon = achievement.icon;

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -100, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: -100, x: "-50%" }}
      className="fixed top-24 left-1/2 z-[100] w-[360px]"
    >
      <div
        className={`relative overflow-hidden rounded-2xl border border-border-default bg-gradient-to-br ${achievement.bgColor} backdrop-blur-xl shadow-2xl`}
      >
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1, delay: 0.3 }}
        />

        <div className="relative p-4">
          <div className="flex items-start gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2 }}
              className={`p-3 rounded-xl bg-bg-secondary/50 ${achievement.color}`}
            >
              <Icon className="w-8 h-8" />
            </motion.div>

            <div className="flex-1">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs font-medium text-quantum-green uppercase tracking-wider"
              >
                Achievement Unlocked!
              </motion.p>
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg font-bold text-text-primary mt-1"
              >
                {achievement.name}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-text-muted mt-1"
              >
                {achievement.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-2 mt-2"
              >
                <Sparkles className="w-4 h-4 text-solar-gold" />
                <span className="text-sm font-semibold text-solar-gold">
                  +{achievement.xpReward} XP
                </span>
              </motion.div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-bg-tertiary transition-colors"
            >
              <X className="w-4 h-4 text-text-muted" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// XP Progress bar component
export function XPProgressBar() {
  const { level, currentXP, requiredXP, xp, streak } = useAchievements();

  return (
    <div className="p-4 bg-bg-secondary rounded-xl border border-border-default">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-aurora-cyan to-aurora-purple flex items-center justify-center">
              <span className="text-lg font-bold text-bg-primary">{level}</span>
            </div>
            {streak > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent-danger flex items-center justify-center">
                <Flame className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">Level {level}</p>
            <p className="text-xs text-text-muted">{xp.toLocaleString()} Total XP</p>
          </div>
        </div>

        {streak > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent-danger/20">
            <Flame className="w-4 h-4 text-accent-danger" />
            <span className="text-sm font-medium text-accent-danger">{streak} day streak</span>
          </div>
        )}
      </div>

      <div className="relative h-3 bg-bg-tertiary rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-aurora-cyan to-aurora-purple rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentXP / requiredXP) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="flex justify-between mt-2 text-xs text-text-muted">
        <span>{currentXP} XP</span>
        <span>{requiredXP} XP to Level {level + 1}</span>
      </div>
    </div>
  );
}

// Achievements grid component
export function AchievementsGrid() {
  const { achievements, hasAchievement } = useAchievements();

  const categories = [
    { key: "learning", label: "Learning" },
    { key: "security", label: "Security" },
    { key: "engagement", label: "Engagement" },
    { key: "mastery", label: "Mastery" },
  ];

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const categoryAchievements = Object.values(ACHIEVEMENTS).filter(
          (a) => a.category === category.key
        );

        return (
          <div key={category.key}>
            <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-3">
              {category.label}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categoryAchievements.map((achievement) => {
                const Icon = achievement.icon;
                const unlocked = hasAchievement(achievement.id);

                return (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ scale: 1.02 }}
                    className={`relative p-4 rounded-xl border transition-all ${
                      unlocked
                        ? `border-border-default bg-gradient-to-br ${achievement.bgColor}`
                        : "border-border-default/50 bg-bg-tertiary/30 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          unlocked ? `bg-bg-secondary/50 ${achievement.color}` : "bg-bg-tertiary"
                        }`}
                      >
                        {unlocked ? (
                          <Icon className="w-5 h-5" />
                        ) : (
                          <Lock className="w-5 h-5 text-text-muted" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            unlocked ? "text-text-primary" : "text-text-muted"
                          }`}
                        >
                          {achievement.name}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <Sparkles className="w-3 h-3 text-solar-gold" />
                          <span className="text-xs text-solar-gold font-medium">
                            {achievement.xpReward} XP
                          </span>
                        </div>
                      </div>
                    </div>

                    {unlocked && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-4 h-4 text-quantum-green" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Compact achievement badge for header/sidebar
export function AchievementBadge() {
  const { level, currentXP, requiredXP, streak } = useAchievements();

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-aurora-cyan to-aurora-purple flex items-center justify-center">
          <span className="text-xs font-bold text-bg-primary">{level}</span>
        </div>
        <svg className="absolute inset-0 w-8 h-8 -rotate-90">
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-bg-tertiary"
          />
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray={`${(currentXP / requiredXP) * 88} 88`}
            className="text-quantum-green"
          />
        </svg>
      </div>

      {streak > 0 && (
        <div className="flex items-center gap-1">
          <Flame className="w-3 h-3 text-accent-danger" />
          <span className="text-xs font-medium text-accent-danger">{streak}</span>
        </div>
      )}
    </div>
  );
}
