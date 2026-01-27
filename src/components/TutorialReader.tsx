import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Clock, Monitor, Smartphone, Shield, ArrowRightLeft,
  ArrowUpRight, Sparkles, Lock, ChevronUp, CheckCircle2,
  BookOpen, Zap, Target, ArrowLeft, ChevronDown, ChevronRight,
  Copy, Check, Lightbulb, AlertTriangle, Info, Play, Pause,
  RotateCcw, Trophy, Star, ArrowRight, Rocket, PartyPopper, Gift
} from "lucide-react";

// Confetti colors - vibrant celebration palette
const CELEBRATION_COLORS = [
  "#FFD700", // Gold
  "#FFA500", // Orange
  "#00FFD1", // Cyan
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#10B981", // Green
  "#3B82F6", // Blue
  "#F59E0B", // Amber
  "#FF6B6B", // Coral
  "#4ADE80", // Lime
];

// Get user's tutorial completion stats from localStorage
function getCompletionStats() {
  try {
    const stats = localStorage.getItem('tutorial-completion-stats');
    return stats ? JSON.parse(stats) : { totalCompleted: 0, streak: 0, lastCompletedDate: null };
  } catch {
    return { totalCompleted: 0, streak: 0, lastCompletedDate: null };
  }
}

// Update completion stats
function updateCompletionStats() {
  const stats = getCompletionStats();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  let newStreak = 1;
  if (stats.lastCompletedDate === today) {
    // Already completed one today, don't update streak
    newStreak = stats.streak;
  } else if (stats.lastCompletedDate === yesterday) {
    // Consecutive day - increase streak
    newStreak = stats.streak + 1;
  }

  const newStats = {
    totalCompleted: stats.totalCompleted + 1,
    streak: newStreak,
    lastCompletedDate: today,
  };

  localStorage.setItem('tutorial-completion-stats', JSON.stringify(newStats));
  return newStats;
}

interface TutorialMetadata {
  platform?: string;
  difficulty?: string;
  timeRequired?: string;
  requirements?: string[];
}

interface Tutorial {
  id: number;
  type: string;
  category: string;
  title: string;
  content: string;
  severity: string;
  order: number;
  metadata?: TutorialMetadata;
}

interface Section {
  id: string;
  title: string;
  content: string;
  isStep: boolean;
  stepNumber?: number;
}

// Get icon for tutorial category
function getTutorialIcon(category: string) {
  switch (category) {
    case "binance_desktop": return Monitor;
    case "binance_mobile": return Smartphone;
    case "binance_security": return Lock;
    case "binance_trading": return ArrowRightLeft;
    case "binance_withdraw": return ArrowUpRight;
    default: return Shield;
  }
}

// Parse markdown content into sections
function parseContentIntoSections(content: string): Section[] {
  const sections: Section[] = [];
  const lines = content.split('\n');
  let currentSection: Section | null = null;
  let stepCounter = 0;
  let sectionId = 0;

  for (const line of lines) {
    const h2Match = line.match(/^## (.+)$/);
    if (h2Match) {
      if (currentSection) {
        sections.push(currentSection);
      }
      const title = h2Match[1];
      const isStep = /^Step \d+/i.test(title) || /^What You'll Need/i.test(title) || /^(The|Your|Golden|Mobile|App)/i.test(title);
      if (isStep || sections.length > 0) {
        stepCounter++;
      }
      currentSection = {
        id: `section-${sectionId++}`,
        title: title.replace(/^Step \d+[:\s]*/i, ''),
        content: '',
        isStep: true,
        stepNumber: stepCounter
      };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    } else {
      // Content before first h2 - intro section
      if (!currentSection) {
        currentSection = {
          id: `section-intro`,
          title: 'Introduction',
          content: line + '\n',
          isStep: false
        };
      }
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections.filter(s => s.content.trim() || s.title !== 'Introduction');
}

// Progress indicator component
function ProgressBar({ progress, sections, completedSections }: {
  progress: number;
  sections: number;
  completedSections: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs text-amber-400 font-medium whitespace-nowrap">
        {completedSections}/{sections} completed
      </span>
    </div>
  );
}

// Mini celebration burst for step completion
function StepCompleteBurst({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: '50%',
            top: '50%',
            backgroundColor: CELEBRATION_COLORS[i % CELEBRATION_COLORS.length],
          }}
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 0],
            x: Math.cos(i * 30 * Math.PI / 180) * 80,
            y: Math.sin(i * 30 * Math.PI / 180) * 80,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// Interactive Step Card
function StepCard({
  section,
  isCompleted,
  isActive,
  isExpanded,
  onToggleComplete,
  onToggleExpand,
  onActivate
}: {
  section: Section;
  isCompleted: boolean;
  isActive: boolean;
  isExpanded: boolean;
  onToggleComplete: () => void;
  onToggleExpand: () => void;
  onActivate: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const [showBurst, setShowBurst] = useState(false);
  const [wasCompleted, setWasCompleted] = useState(isCompleted);

  // Trigger burst animation when step is completed
  useEffect(() => {
    if (isCompleted && !wasCompleted) {
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 700);
    }
    setWasCompleted(isCompleted);
  }, [isCompleted, wasCompleted]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${
        isActive
          ? 'border-amber-500/40 bg-gradient-to-br from-amber-500/[0.08] to-transparent shadow-lg shadow-amber-500/10'
          : isCompleted
          ? 'border-emerald-500/20 bg-emerald-500/[0.03]'
          : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
      }`}
    >
      {/* Step completion burst effect */}
      <StepCompleteBurst show={showBurst} />

      {/* Header - Always visible */}
      <div
        className="flex items-center gap-4 p-5 cursor-pointer"
        onClick={() => {
          onActivate();
          onToggleExpand();
        }}
      >
        {/* Checkbox */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete();
          }}
          whileTap={{ scale: 0.9 }}
          className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
            isCompleted
              ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-500 text-black shadow-lg shadow-emerald-500/30'
              : 'border-white/20 hover:border-amber-500/50 hover:bg-amber-500/10'
          }`}
        >
          <AnimatePresence mode="wait">
            {isCompleted ? (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0.5 }}
              >
                <Check className="w-4 h-4" />
              </motion.div>
            ) : (
              <motion.span
                key="number"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="text-sm font-bold text-white/40"
              >
                {section.stepNumber}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold transition-colors ${
            isCompleted ? 'text-emerald-400' : isActive ? 'text-amber-400' : 'text-white'
          }`}>
            {section.title}
          </h3>
          {!isExpanded && (
            <p className="text-sm text-gray-500 truncate mt-1">
              Click to expand and learn more
            </p>
          )}
        </div>

        {/* Expand indicator */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-gray-500'}`} />
        </motion.div>
      </div>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0">
              <div className="pl-12 border-l-2 border-white/[0.06] ml-4">
                <div className="pl-6">
                  <ReactMarkdown
                    components={{
                      h3: ({ children }) => (
                        <h4 className="text-base font-semibold text-amber-400 mt-6 mb-3 flex items-center gap-2 first:mt-0">
                          <Sparkles className="w-4 h-4 flex-shrink-0" />
                          <span>{children}</span>
                        </h4>
                      ),
                      h4: ({ children }) => (
                        <h5 className="text-sm font-semibold text-white/90 mt-4 mb-2">
                          {children}
                        </h5>
                      ),
                      p: ({ children }) => (
                        <p className="text-gray-300 leading-relaxed mb-4 text-[14px]">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="space-y-2 mb-4">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="space-y-2 mb-4 counter-reset-item">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-gray-300 leading-relaxed flex items-start gap-2 text-[14px]">
                          <span className="text-amber-500 mt-1 flex-shrink-0">•</span>
                          <span className="flex-1">{children}</span>
                        </li>
                      ),
                      strong: ({ children }) => (
                        <strong className="text-white font-semibold">{children}</strong>
                      ),
                      em: ({ children }) => (
                        <em className="text-amber-300 not-italic font-medium">{children}</em>
                      ),
                      code: ({ children, className }) => {
                        const text = String(children).trim();
                        const codeId = `code-${Math.random()}`;
                        return (
                          <span className="relative inline-flex items-center group">
                            <code className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 font-mono text-sm border border-amber-500/10">
                              {children}
                            </code>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(text, codeId);
                              }}
                              className="ml-1 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all"
                              title="Copy"
                            >
                              {copied === codeId ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3 text-gray-400" />
                              )}
                            </button>
                          </span>
                        );
                      },
                      blockquote: ({ children }) => (
                        <div className="my-4 p-4 rounded-xl bg-gradient-to-br from-amber-500/[0.08] to-transparent border-l-3 border-amber-500 relative">
                          <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <div className="text-amber-100/90 text-[14px] leading-relaxed">
                              {children}
                            </div>
                          </div>
                        </div>
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-4 rounded-xl border border-white/[0.06]">
                          <table className="w-full border-collapse text-sm">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="bg-amber-500/[0.08]">{children}</thead>
                      ),
                      th: ({ children }) => (
                        <th className="px-4 py-3 text-left text-xs font-semibold text-amber-400 border-b border-amber-500/20">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="px-4 py-3 text-xs text-gray-300 border-b border-white/[0.04]">
                          {children}
                        </td>
                      ),
                      hr: () => (
                        <hr className="my-6 border-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:text-amber-300 underline underline-offset-2"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {section.content}
                  </ReactMarkdown>

                  {/* Mark as complete button */}
                  <div className="mt-6 pt-4 border-t border-white/[0.06]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleComplete();
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Completed! Click to undo
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Mark as complete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Enhanced confetti with physics-like behavior
function ConfettiParticle({ color, delay, startX, shape }: {
  color: string;
  delay: number;
  startX: number;
  shape: 'square' | 'circle' | 'triangle' | 'star';
}) {
  const getShape = () => {
    switch (shape) {
      case 'circle': return 'rounded-full';
      case 'triangle': return 'triangle-clip';
      case 'star': return 'star-clip';
      default: return 'rounded-sm';
    }
  };

  const size = 6 + Math.random() * 8;
  const swayAmount = 100 + Math.random() * 150;
  const rotations = 2 + Math.floor(Math.random() * 4);

  return (
    <motion.div
      className={`absolute ${getShape()}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        left: `${startX}%`,
        top: -30,
        boxShadow: `0 0 ${size}px ${color}40`,
      }}
      initial={{ y: -30, opacity: 1, rotate: 0, scale: 1 }}
      animate={{
        y: [0, window.innerHeight + 50],
        opacity: [1, 1, 1, 0.8, 0],
        rotate: [0, (Math.random() > 0.5 ? 1 : -1) * 360 * rotations],
        x: [
          0,
          swayAmount * (Math.random() > 0.5 ? 1 : -1),
          swayAmount * 0.5 * (Math.random() > 0.5 ? 1 : -1),
          swayAmount * 0.8 * (Math.random() > 0.5 ? 1 : -1),
        ],
        scale: [0, 1.2, 1, 0.8, 0.5],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    />
  );
}

// Shockwave ring effect
function ShockwaveRing({ delay, color }: { delay: number; color: string }) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
      style={{ borderColor: color }}
      initial={{ width: 0, height: 0, opacity: 1 }}
      animate={{
        width: [0, 600, 1000],
        height: [0, 600, 1000],
        opacity: [0.8, 0.4, 0],
      }}
      transition={{
        duration: 1.5,
        delay: delay,
        ease: "easeOut",
      }}
    />
  );
}

// Firework burst with enhanced particles
function FireworkBurst({ x, y, delay }: { x: number; y: number; delay: number }) {
  const particles = Array.from({ length: 16 }, (_, i) => ({
    angle: (i * 22.5) * Math.PI / 180,
    color: CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)],
    distance: 80 + Math.random() * 100,
  }));

  return (
    <>
      {/* Central flash */}
      <motion.div
        className="absolute w-8 h-8 rounded-full bg-white"
        style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 3, 0], opacity: [1, 0.8, 0] }}
        transition={{ duration: 0.4, delay }}
      />
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            backgroundColor: p.color,
            boxShadow: `0 0 12px ${p.color}, 0 0 24px ${p.color}50`,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            x: [0, Math.cos(p.angle) * p.distance, Math.cos(p.angle) * p.distance * 1.3],
            y: [0, Math.sin(p.angle) * p.distance, Math.sin(p.angle) * p.distance * 1.5 + 50],
            scale: [0, 2, 1, 0],
            opacity: [1, 1, 0.6, 0],
          }}
          transition={{
            duration: 1.2,
            delay: delay,
            ease: "easeOut",
          }}
        />
      ))}
      {/* Trail sparks */}
      {particles.slice(0, 8).map((p, i) => (
        <motion.div
          key={`trail-${i}`}
          className="absolute w-1 h-1 rounded-full bg-white"
          style={{ left: `${x}%`, top: `${y}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            x: [0, Math.cos(p.angle) * p.distance * 0.5],
            y: [0, Math.sin(p.angle) * p.distance * 0.5],
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 0.6,
            delay: delay + 0.1,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}

// Floating achievement orb
function AchievementOrb({ delay, icon: Icon, label }: { delay: number; icon: any; label: string }) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 flex flex-col items-center gap-2"
      initial={{ x: '-50%', y: '100%', opacity: 0, scale: 0 }}
      animate={{
        y: [100, -20, -40],
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 1, 0.8],
      }}
      transition={{
        duration: 2,
        delay: delay,
        ease: "easeOut",
      }}
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/50">
        <Icon className="w-6 h-6 text-black" />
      </div>
      <span className="text-xs font-bold text-amber-400 whitespace-nowrap">{label}</span>
    </motion.div>
  );
}

// Glowing streak badge
function StreakBadge({ streak }: { streak: number }) {
  if (streak < 2) return null;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 1, type: "spring", bounce: 0.5 }}
      className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/50 border-2 border-white/20"
    >
      <div className="text-center">
        <div className="text-lg font-black text-white">{streak}</div>
        <div className="text-[8px] font-bold text-white/80 uppercase tracking-wider">Streak</div>
      </div>
      {/* Flame effect */}
      <motion.div
        className="absolute -top-2 left-1/2 -translate-x-1/2"
        animate={{ y: [-2, -6, -2], scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
      </motion.div>
    </motion.div>
  );
}

// Epic Celebration Modal with enhanced effects
function CelebrationModal({ onClose, tutorialTitle, tutorialId }: {
  onClose: () => void;
  tutorialTitle: string;
  tutorialId: number;
}) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [stats, setStats] = useState({ totalCompleted: 0, streak: 0 });
  const [phase, setPhase] = useState<'burst' | 'celebrate' | 'stats'>('burst');

  // Track completion and get stats
  useEffect(() => {
    const newStats = updateCompletionStats();
    setStats(newStats);

    // Mark this tutorial as celebrated so we don't show again
    localStorage.setItem(`tutorial-celebrated-${tutorialId}`, 'true');

    // Phase transitions
    const burstTimer = setTimeout(() => setPhase('celebrate'), 800);
    const celebrateTimer = setTimeout(() => setPhase('stats'), 1500);
    const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);

    return () => {
      clearTimeout(burstTimer);
      clearTimeout(celebrateTimer);
      clearTimeout(confettiTimer);
    };
  }, [tutorialId]);

  // Generate confetti with varied shapes
  const confettiPieces = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      color: CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)],
      delay: Math.random() * 1.2,
      startX: Math.random() * 100,
      shape: (['square', 'circle', 'triangle', 'star'] as const)[Math.floor(Math.random() * 4)],
    })), []
  );

  // Generate firework positions
  const fireworks = useMemo(() => [
    { x: 15, y: 25, delay: 0.1 },
    { x: 85, y: 20, delay: 0.3 },
    { x: 50, y: 15, delay: 0.5 },
    { x: 25, y: 35, delay: 0.7 },
    { x: 75, y: 30, delay: 0.9 },
    { x: 40, y: 25, delay: 1.1 },
    { x: 60, y: 35, delay: 1.3 },
  ], []);

  // Shockwave rings
  const shockwaves = useMemo(() => [
    { delay: 0, color: '#FFD700' },
    { delay: 0.15, color: '#FFA500' },
    { delay: 0.3, color: '#FF6B6B' },
  ], []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Animated background with gradient pulse */}
      <motion.div
        className="absolute inset-0 bg-black/95"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Initial shockwave burst */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {shockwaves.map((sw, i) => (
          <ShockwaveRing key={i} delay={sw.delay} color={sw.color} />
        ))}
      </div>

      {/* Confetti layer - enhanced with shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AnimatePresence>
          {showConfetti && confettiPieces.map((piece) => (
            <ConfettiParticle
              key={piece.id}
              color={piece.color}
              delay={piece.delay}
              startX={piece.startX}
              shape={piece.shape}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Fireworks layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {fireworks.map((fw, i) => (
          <FireworkBurst key={i} x={fw.x} y={fw.y} delay={fw.delay} />
        ))}
      </div>

      {/* Floating achievement orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AchievementOrb delay={1.5} icon={Trophy} label="+50 XP" />
        <div className="absolute left-[30%]">
          <AchievementOrb delay={1.8} icon={Star} label="Mastery" />
        </div>
        <div className="absolute left-[70%]">
          <AchievementOrb delay={2.1} icon={Zap} label="Speed" />
        </div>
      </div>

      {/* Radial glow effects - enhanced */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/30 blur-[150px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-orange-500/25 blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-yellow-500/20 blur-[100px]"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      {/* Modal content */}
      <motion.div
        initial={{ scale: 0, opacity: 0, rotateY: -90 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", duration: 0.8, bounce: 0.4, delay: 0.3 }}
        className="relative bg-gradient-to-br from-[#1a1a25] via-[#12121a] to-[#0a0a10] rounded-3xl p-8 max-w-lg w-full border border-amber-500/40 shadow-2xl"
        style={{ boxShadow: '0 0 60px rgba(251, 191, 36, 0.3), 0 0 120px rgba(251, 191, 36, 0.1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Streak badge */}
        <StreakBadge streak={stats.streak} />

        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.5), transparent)',
            backgroundSize: '200% 100%',
          }}
          animate={{
            backgroundPosition: ['200% 0', '-200% 0'],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Decorative top glow line */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-1 rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent"
          initial={{ width: 0 }}
          animate={{ width: '80%' }}
          transition={{ delay: 0.5, duration: 0.6 }}
        />

        <div className="relative text-center">
          {/* Animated trophy section - enhanced */}
          <div className="relative w-36 h-36 mx-auto mb-6">
            {/* Multiple pulsing rings */}
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: CELEBRATION_COLORS[i % CELEBRATION_COLORS.length] }}
                animate={{
                  scale: [1, 1.3 + i * 0.1, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay }}
              />
            ))}

            {/* Trophy container with glow */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: 1,
                rotate: 0,
              }}
              transition={{ type: "spring", duration: 0.8, bounce: 0.5, delay: 0.4 }}
              className="relative w-full h-full"
            >
              <motion.div
                animate={{
                  rotate: [0, 3, -3, 0],
                  y: [0, -4, 0],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full h-full rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-orange-600 flex items-center justify-center"
                style={{ boxShadow: '0 0 40px rgba(251, 191, 36, 0.6), 0 0 80px rgba(251, 191, 36, 0.3)' }}
              >
                <Trophy className="w-16 h-16 text-black drop-shadow-lg" />

                {/* Rotating shine effect */}
                <motion.div
                  className="absolute inset-0 rounded-full overflow-hidden"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Orbiting stars - enhanced */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ top: '50%', left: '50%' }}
                animate={{ rotate: [i * 36, i * 36 + 360] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                <motion.div
                  style={{ x: 75 + (i % 3) * 5, y: 0 }}
                  animate={{
                    scale: [0.6, 1.3, 0.6],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                >
                  <Star
                    className="text-amber-400 fill-amber-400"
                    style={{
                      width: 12 + (i % 3) * 4,
                      height: 12 + (i % 3) * 4,
                      filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.8))',
                    }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Achievement badge - enhanced with animation */}
          <motion.div
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.6, type: "spring", bounce: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 mb-4"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <PartyPopper className="w-5 h-5 text-amber-400" />
            </motion.div>
            <span className="text-sm font-bold text-amber-400 tracking-wide">ACHIEVEMENT UNLOCKED</span>
            <motion.div
              animate={{ rotate: [0, -15, 15, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <Gift className="w-5 h-5 text-amber-400" />
            </motion.div>
          </motion.div>

          {/* Title with text reveal */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-white mb-3"
          >
            Tutorial Complete!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-lg text-amber-400 font-semibold mb-2"
          >
            {tutorialTitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-gray-400 mb-6 text-sm leading-relaxed"
          >
            Congratulations! You've mastered all the steps and earned your reward.
            <br />Keep going to build your streak!
          </motion.p>

          {/* Enhanced stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-3 gap-4 mb-8 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
          >
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="text-2xl sm:text-3xl font-black text-white"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, type: "spring" }}
              >
                100%
              </motion.div>
              <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Completed</div>
            </motion.div>

            <motion.div
              className="text-center border-x border-white/[0.06]"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="text-2xl sm:text-3xl font-black text-amber-400"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
              >
                +50
              </motion.div>
              <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">XP Earned</div>
            </motion.div>

            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="flex items-center justify-center gap-0.5"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3, type: "spring" }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ delay: 1.3 + i * 0.1, type: "spring" }}
                  >
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-amber-400" style={{ filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.6))' }} />
                  </motion.div>
                ))}
              </motion.div>
              <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Rating</div>
            </motion.div>
          </motion.div>

          {/* Total progress indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mb-6 text-center"
          >
            <span className="text-xs text-gray-500">
              Total tutorials completed: <span className="text-amber-400 font-bold">{stats.totalCompleted}</span>
            </span>
          </motion.div>

          {/* Action button - enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <motion.button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-black font-bold text-lg transition-all relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ boxShadow: '0 0 30px rgba(251, 191, 36, 0.4)' }}
            >
              {/* Button shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <Rocket className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Continue Learning</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Floating action buttons
function FloatingActions({
  showBackToTop,
  onScrollToTop,
  completedCount,
  totalCount,
  onResetProgress
}: {
  showBackToTop: boolean;
  onScrollToTop: () => void;
  completedCount: number;
  totalCount: number;
  onResetProgress: () => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-[70] flex flex-col gap-3">
      {/* Reset progress */}
      {completedCount > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={onResetProgress}
          className="p-3 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-gray-400 hover:text-white transition-all"
          title="Reset progress"
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>
      )}

      {/* Back to top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={onScrollToTop}
            className="p-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-black shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-shadow"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main Tutorial Reader Component
export function TutorialReader({
  tutorial,
  onClose
}: {
  tutorial: Tutorial | null;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const sections = useMemo(() =>
    tutorial ? parseContentIntoSections(tutorial.content) : [],
    [tutorial]
  );

  const stepSections = useMemo(() =>
    sections.filter(s => s.isStep),
    [sections]
  );

  // Load saved progress from localStorage
  useEffect(() => {
    if (tutorial) {
      const saved = localStorage.getItem(`tutorial-progress-${tutorial.id}`);
      if (saved) {
        setCompletedSections(new Set(JSON.parse(saved)));
      }
    }
  }, [tutorial]);

  // Save progress to localStorage
  useEffect(() => {
    if (tutorial && completedSections.size > 0) {
      localStorage.setItem(
        `tutorial-progress-${tutorial.id}`,
        JSON.stringify([...completedSections])
      );
    }
  }, [tutorial, completedSections]);

  // Check for completion - only show celebration if not already celebrated
  useEffect(() => {
    if (stepSections.length > 0 && completedSections.size === stepSections.length && tutorial) {
      // Check if we've already celebrated this tutorial
      const alreadyCelebrated = localStorage.getItem(`tutorial-celebrated-${tutorial.id}`);
      if (!alreadyCelebrated) {
        // Small delay for a more dramatic reveal
        const timer = setTimeout(() => setShowCelebration(true), 500);
        return () => clearTimeout(timer);
      }
    }
  }, [completedSections, stepSections, tutorial]);

  useEffect(() => {
    if (!tutorial) {
      setIsVisible(false);
      setCompletedSections(new Set());
      setExpandedSections(new Set());
      setActiveSection(null);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
      // Auto-expand first section
      if (sections.length > 0) {
        setExpandedSections(new Set([sections[0].id]));
        setActiveSection(sections[0].id);
      }
    }, 50);

    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
        setShowBackToTop(scrollTop > 500);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [tutorial, onClose, sections]);

  const scrollToTop = useCallback(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleComplete = useCallback((sectionId: string) => {
    setCompletedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  const toggleExpand = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    if (tutorial) {
      localStorage.removeItem(`tutorial-progress-${tutorial.id}`);
      localStorage.removeItem(`tutorial-celebrated-${tutorial.id}`);
      setCompletedSections(new Set());
    }
  }, [tutorial]);

  const replayCelebration = useCallback(() => {
    if (tutorial) {
      localStorage.removeItem(`tutorial-celebrated-${tutorial.id}`);
      setShowCelebration(true);
    }
  }, [tutorial]);

  if (!tutorial) return null;

  const Icon = getTutorialIcon(tutorial.category);
  const metadata = tutorial.metadata;
  const isBinance = tutorial.category.startsWith('binance_');
  const completionPercent = stepSections.length > 0
    ? Math.round((completedSections.size / stepSections.length) * 100)
    : 0;

  return (
    <AnimatePresence>
      {tutorial && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999]"
          style={{ isolation: 'isolate' }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Main container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-full flex flex-col bg-[#0a0a0f]"
          >
            {/* Ambient effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-amber-500/[0.03] blur-[120px]" />
              <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-orange-500/[0.02] blur-[100px]" />
            </div>

            {/* Sticky Header */}
            <header className="relative z-10 flex-shrink-0 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl">
              <div className="max-w-4xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <button
                      onClick={onClose}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] transition-all group"
                    >
                      <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                      <span className="text-sm text-gray-400 group-hover:text-white transition-colors hidden sm:inline">Back</span>
                    </button>

                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-xl flex-shrink-0 ${
                        isBinance
                          ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20'
                          : 'bg-white/[0.05] border border-white/10'
                      }`}>
                        <Icon className={`w-4 h-4 ${isBinance ? 'text-amber-400' : 'text-white'}`} />
                      </div>
                      <div className="min-w-0">
                        <h1 className="text-sm font-semibold text-white truncate">
                          {tutorial.title}
                        </h1>
                        <div className="flex items-center gap-2 mt-0.5">
                          {metadata?.difficulty && (
                            <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded ${
                              metadata.difficulty === 'beginner'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : metadata.difficulty === 'intermediate'
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}>
                              {metadata.difficulty}
                            </span>
                          )}
                          {metadata?.timeRequired && (
                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {metadata.timeRequired}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl bg-white/[0.03] hover:bg-red-500/10 border border-white/[0.06] hover:border-red-500/20 transition-all group"
                  >
                    <X className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
                  </button>
                </div>

                <ProgressBar
                  progress={completionPercent}
                  sections={stepSections.length}
                  completedSections={completedSections.size}
                />
              </div>
            </header>

            {/* Scrollable content */}
            <div
              ref={containerRef}
              className="flex-1 overflow-y-auto overscroll-contain"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <div className="max-w-3xl mx-auto px-6 py-8">
                {/* Hero Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="mb-8"
                >
                  <div className="flex items-center gap-2 mb-4">
                    {isBinance && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/20">
                        Interactive Guide
                      </span>
                    )}
                    {metadata?.platform && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-white/[0.03] text-gray-400 border border-white/[0.06]">
                        {metadata.platform === 'desktop' ? '🖥️ Desktop' : metadata.platform === 'mobile' ? '📱 Mobile' : '🌐 All Platforms'}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-4 tracking-tight">
                    {tutorial.title.replace('Binance ', '').replace(': Complete Guide', '')}
                  </h1>

                  <p className="text-gray-400 text-sm mb-6">
                    Complete each step below by checking them off. Your progress is saved automatically.
                  </p>

                  {/* Requirements */}
                  {metadata?.requirements && metadata.requirements.length > 0 && (
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.06]">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Before you start
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {metadata.requirements.map((req, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] text-sm text-gray-300 border border-white/[0.04]"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Interactive Steps */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="space-y-4"
                >
                  {stepSections.map((section, index) => (
                    <StepCard
                      key={section.id}
                      section={section}
                      isCompleted={completedSections.has(section.id)}
                      isActive={activeSection === section.id}
                      isExpanded={expandedSections.has(section.id)}
                      onToggleComplete={() => toggleComplete(section.id)}
                      onToggleExpand={() => toggleExpand(section.id)}
                      onActivate={() => setActiveSection(section.id)}
                    />
                  ))}
                </motion.div>

                {/* Completion section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mt-12 pt-8 border-t border-white/[0.06]"
                >
                  <div className="text-center">
                    {completedSections.size === stepSections.length ? (
                      <>
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 mb-4"
                        >
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                          >
                            <Trophy className="w-6 h-6 text-emerald-400" />
                          </motion.div>
                          <span className="text-lg font-semibold text-emerald-400">
                            All steps completed!
                          </span>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1.5 }}
                          >
                            <PartyPopper className="w-5 h-5 text-amber-400" />
                          </motion.div>
                        </motion.div>

                        {/* Replay celebration button */}
                        <motion.button
                          onClick={replayCelebration}
                          className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 text-sm font-medium border border-amber-500/20 hover:bg-amber-500/20 transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Sparkles className="w-4 h-4" />
                          Replay Celebration
                        </motion.button>
                      </>
                    ) : (
                      <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] mb-4">
                        <Target className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-400">
                          {stepSections.length - completedSections.size} steps remaining
                        </span>
                      </div>
                    )}

                    <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                      {completedSections.size === stepSections.length
                        ? "You've mastered this guide. Ready to start your crypto journey?"
                        : "Complete all steps to finish this tutorial."
                      }
                    </p>

                    <button
                      onClick={onClose}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20"
                    >
                      Back to Learn Center
                    </button>
                  </div>
                </motion.div>

                <div className="h-20" />
              </div>
            </div>

            {/* Floating actions */}
            <FloatingActions
              showBackToTop={showBackToTop}
              onScrollToTop={scrollToTop}
              completedCount={completedSections.size}
              totalCount={stepSections.length}
              onResetProgress={resetProgress}
            />
          </motion.div>

          {/* Celebration modal */}
          <AnimatePresence>
            {showCelebration && (
              <CelebrationModal
                onClose={() => setShowCelebration(false)}
                tutorialTitle={tutorial.title.replace('Binance ', '').replace(': Complete Guide', '')}
                tutorialId={tutorial.id}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TutorialReader;
