import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Target,
  Rocket,
  CheckCircle,
  Circle,
  Clock,
  ChevronRight,
  Loader2,
  Sparkles,
  Shield,
  TrendingUp,
  Layers,
  Image,
  Zap,
  RefreshCw,
} from "lucide-react";
import { useAchievements } from "./AchievementSystem";

interface LearningWeek {
  week: number;
  topic: string;
  description: string;
  dailyTasks: string[];
  resources: string[];
}

interface LearningPathData {
  path: LearningWeek[];
  estimatedDuration: string;
  difficulty: string;
}

const INTERESTS = [
  { id: "bitcoin", label: "Bitcoin", icon: Sparkles },
  { id: "ethereum", label: "Ethereum", icon: Layers },
  { id: "defi", label: "DeFi", icon: TrendingUp },
  { id: "nfts", label: "NFTs", icon: Image },
  { id: "trading", label: "Trading", icon: TrendingUp },
  { id: "security", label: "Security", icon: Shield },
];

const LEVELS = [
  { id: "beginner", label: "Beginner", description: "New to crypto", icon: Circle },
  { id: "intermediate", label: "Intermediate", description: "Know the basics", icon: Target },
  { id: "advanced", label: "Advanced", description: "Ready for deep dives", icon: Rocket },
];

export function LearningPathGenerator() {
  const [step, setStep] = useState<"setup" | "generating" | "path">("setup");
  const [level, setLevel] = useState<string>("beginner");
  const [interests, setInterests] = useState<string[]>([]);
  const [timePerDay, setTimePerDay] = useState(15);
  const [learningPath, setLearningPath] = useState<LearningPathData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const { addXP, unlockAchievement, hasAchievement } = useAchievements();

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const generatePath = async () => {
    if (interests.length === 0) return;

    setIsLoading(true);
    setStep("generating");

    try {
      const response = await fetch("/api/ai/learning/path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level,
          interests,
          timePerDay,
        }),
      });

      const data = await response.json();
      setLearningPath(data);
      setStep("path");

      // Award achievement for first lesson
      if (!hasAchievement("first_lesson")) {
        unlockAchievement("first_lesson");
      }
    } catch (error) {
      console.error("Failed to generate learning path:", error);
      setStep("setup");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = (taskId: string) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks((prev) => prev.filter((t) => t !== taskId));
    } else {
      setCompletedTasks((prev) => [...prev, taskId]);
      addXP(15); // Award XP for completing a task
    }
  };

  const resetPath = () => {
    setStep("setup");
    setLearningPath(null);
    setCompletedTasks([]);
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {step === "setup" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Level selection */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-aurora-cyan" />
                What's your experience level?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {LEVELS.map((l) => {
                  const Icon = l.icon;
                  const selected = level === l.id;
                  return (
                    <motion.button
                      key={l.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setLevel(l.id)}
                      className={`p-4 rounded-xl text-left transition-all ${
                        selected
                          ? "bg-aurora-cyan/20 border-2 border-aurora-cyan"
                          : "bg-bg-tertiary border-2 border-transparent hover:border-border-default"
                      }`}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${selected ? "text-aurora-cyan" : "text-text-muted"}`} />
                      <p className={`font-medium ${selected ? "text-aurora-cyan" : "text-text-primary"}`}>
                        {l.label}
                      </p>
                      <p className="text-sm text-text-muted">{l.description}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Interest selection */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-aurora-purple" />
                What interests you? (Select at least one)
              </h3>
              <div className="flex flex-wrap gap-3">
                {INTERESTS.map((interest) => {
                  const Icon = interest.icon;
                  const selected = interests.includes(interest.id);
                  return (
                    <motion.button
                      key={interest.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleInterest(interest.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                        selected
                          ? "bg-aurora-purple/20 border-2 border-aurora-purple text-aurora-purple"
                          : "bg-bg-tertiary border-2 border-transparent text-text-secondary hover:border-border-default"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {interest.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Time per day */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-solar-gold" />
                How much time can you dedicate daily?
              </h3>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={timePerDay}
                  onChange={(e) => setTimePerDay(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-bg-tertiary rounded-full appearance-none cursor-pointer accent-aurora-cyan"
                />
                <span className="text-lg font-medium text-text-primary min-w-[80px] text-right">
                  {timePerDay} min
                </span>
              </div>
            </div>

            {/* Generate button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generatePath}
              disabled={interests.length === 0}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-aurora-cyan to-aurora-purple text-bg-primary font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-5 h-5" />
              Generate My Learning Path
            </motion.button>
          </motion.div>
        )}

        {step === "generating" && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <Loader2 className="w-12 h-12 text-aurora-cyan animate-spin mb-4" />
            <p className="text-lg text-text-primary font-medium">
              Crafting your personalized learning path...
            </p>
            <p className="text-sm text-text-muted mt-2">
              Our AI is analyzing your preferences
            </p>
          </motion.div>
        )}

        {step === "path" && learningPath && (
          <motion.div
            key="path"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Path header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-text-primary">
                  Your Personalized Path
                </h3>
                <p className="text-text-muted">
                  {learningPath.estimatedDuration} • {learningPath.difficulty} level
                </p>
              </div>
              <button
                onClick={resetPath}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-tertiary text-text-secondary hover:text-text-primary"
              >
                <RefreshCw className="w-4 h-4" />
                Start Over
              </button>
            </div>

            {/* Progress */}
            <div className="p-4 rounded-xl bg-bg-tertiary">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-muted">Overall Progress</span>
                <span className="text-sm font-medium text-aurora-cyan">
                  {completedTasks.length} tasks completed
                </span>
              </div>
              <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-aurora-cyan to-aurora-purple rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(completedTasks.length / (learningPath.path.length * 3)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Weekly modules */}
            <div className="space-y-4">
              {learningPath.path.map((week, weekIndex) => (
                <motion.div
                  key={week.week}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: weekIndex * 0.1 }}
                  className="p-5 rounded-2xl bg-bg-secondary border border-border-default"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-aurora-cyan/20 to-aurora-purple/20 flex items-center justify-center">
                      <span className="text-lg font-bold text-aurora-cyan">{week.week}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-text-primary mb-1">
                        {week.topic}
                      </h4>
                      <p className="text-sm text-text-muted mb-4">{week.description}</p>

                      {/* Daily tasks */}
                      <div className="space-y-2">
                        {week.dailyTasks.map((task, taskIndex) => {
                          const taskId = `${week.week}-${taskIndex}`;
                          const completed = completedTasks.includes(taskId);
                          return (
                            <button
                              key={taskId}
                              onClick={() => toggleTask(taskId)}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                                completed
                                  ? "bg-quantum-green/10 border border-quantum-green/30"
                                  : "bg-bg-tertiary hover:bg-bg-tertiary/80"
                              }`}
                            >
                              {completed ? (
                                <CheckCircle className="w-5 h-5 text-quantum-green flex-shrink-0" />
                              ) : (
                                <Circle className="w-5 h-5 text-text-muted flex-shrink-0" />
                              )}
                              <span
                                className={`text-sm text-left ${
                                  completed ? "text-text-muted line-through" : "text-text-primary"
                                }`}
                              >
                                {task}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Resources */}
                      {week.resources.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border-default">
                          <p className="text-xs text-text-muted uppercase tracking-wider mb-2">
                            Resources
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {week.resources.map((resource, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 text-xs rounded-full bg-bg-tertiary text-text-secondary"
                              >
                                {resource}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Compact learning path widget for dashboard
export function LearningPathWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl bg-gradient-to-br from-aurora-purple/10 to-aurora-cyan/10 border border-border-default"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-aurora-purple/20">
          <BookOpen className="w-5 h-5 text-aurora-purple" />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">Learning Path</h3>
          <p className="text-sm text-text-muted">AI-powered personalized curriculum</p>
        </div>
      </div>
      <a
        href="/learn"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-aurora-purple/20 text-aurora-purple font-medium hover:bg-aurora-purple/30 transition-colors"
      >
        Start Learning
        <ChevronRight className="w-4 h-4" />
      </a>
    </motion.div>
  );
}
