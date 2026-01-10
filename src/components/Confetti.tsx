import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  size: number;
  shape: "circle" | "square" | "star";
}

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  particleCount?: number;
}

const COLORS = [
  "#00FFD1", // aurora-cyan
  "#8B5CF6", // aurora-purple
  "#EC4899", // aurora-pink
  "#3B82F6", // aurora-blue
  "#FFD700", // gold
  "#00FF88", // quantum-green
  "#FF6B35", // plasma-orange
];

export function Confetti({ isActive, duration = 3000, particleCount = 50 }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const newPieces: ConfettiPiece[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
        size: Math.random() * 8 + 4,
        shape: ["circle", "square", "star"][Math.floor(Math.random() * 3)] as "circle" | "square" | "star",
      }));
      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, duration, particleCount]);

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute"
              style={{
                left: `${piece.x}%`,
                top: -20,
              }}
              initial={{ y: -20, opacity: 1, rotate: 0 }}
              animate={{
                y: window.innerHeight + 100,
                opacity: [1, 1, 0],
                rotate: piece.rotation + 720,
                x: [0, Math.random() * 100 - 50, Math.random() * 200 - 100],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2 + Math.random(),
                delay: piece.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {piece.shape === "circle" && (
                <div
                  className="rounded-full"
                  style={{
                    width: piece.size,
                    height: piece.size,
                    backgroundColor: piece.color,
                    boxShadow: `0 0 10px ${piece.color}`,
                  }}
                />
              )}
              {piece.shape === "square" && (
                <div
                  style={{
                    width: piece.size,
                    height: piece.size,
                    backgroundColor: piece.color,
                    boxShadow: `0 0 10px ${piece.color}`,
                  }}
                />
              )}
              {piece.shape === "star" && (
                <svg
                  width={piece.size}
                  height={piece.size}
                  viewBox="0 0 24 24"
                  fill={piece.color}
                  style={{ filter: `drop-shadow(0 0 5px ${piece.color})` }}
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// Emoji burst effect
export function EmojiBurst({ isActive, emoji = "🎉", count = 20 }: { isActive: boolean; emoji?: string; count?: number }) {
  const [emojis, setEmojis] = useState<{ id: number; x: number; delay: number }[]>([]);

  useEffect(() => {
    if (isActive) {
      const newEmojis = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: 50 + (Math.random() * 30 - 15),
        delay: Math.random() * 0.3,
      }));
      setEmojis(newEmojis);

      const timer = setTimeout(() => {
        setEmojis([]);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isActive, count]);

  return (
    <AnimatePresence>
      {emojis.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {emojis.map((e) => (
            <motion.div
              key={e.id}
              className="absolute text-2xl"
              style={{ left: `${e.x}%`, top: "50%" }}
              initial={{ scale: 0, y: 0, opacity: 1 }}
              animate={{
                scale: [0, 1.5, 1],
                y: [0, -200 - Math.random() * 200],
                x: [0, (Math.random() - 0.5) * 200],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: e.delay,
                ease: "easeOut",
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// Fireworks effect
export function Fireworks({ isActive }: { isActive: boolean }) {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  useEffect(() => {
    if (isActive) {
      const newBursts = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 40,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
      setBursts(newBursts);

      const timer = setTimeout(() => {
        setBursts([]);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <AnimatePresence>
      {bursts.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {bursts.map((burst, i) => (
            <motion.div
              key={burst.id}
              className="absolute"
              style={{ left: `${burst.x}%`, top: `${burst.y}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.2, duration: 0.3 }}
            >
              {/* Center burst */}
              <motion.div
                className="absolute w-4 h-4 rounded-full"
                style={{ backgroundColor: burst.color, boxShadow: `0 0 20px ${burst.color}` }}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 0] }}
                transition={{ duration: 0.4, delay: i * 0.2 }}
              />
              {/* Particles */}
              {Array.from({ length: 12 }).map((_, j) => (
                <motion.div
                  key={j}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ backgroundColor: burst.color }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos((j * 30 * Math.PI) / 180) * 80,
                    y: Math.sin((j * 30 * Math.PI) / 180) * 80,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.8, delay: i * 0.2, ease: "easeOut" }}
                />
              ))}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// Hook for triggering celebrations
import { useCallback, useRef } from "react";

export function useCelebration() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState("🎉");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowConfetti(false), 100);
  }, []);

  const triggerEmoji = useCallback((emoji = "🎉") => {
    setCurrentEmoji(emoji);
    setShowEmoji(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowEmoji(false), 100);
  }, []);

  const triggerFireworks = useCallback(() => {
    setShowFireworks(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowFireworks(false), 100);
  }, []);

  const triggerAll = useCallback(() => {
    triggerConfetti();
    triggerFireworks();
  }, [triggerConfetti, triggerFireworks]);

  return {
    showConfetti,
    showEmoji,
    showFireworks,
    currentEmoji,
    triggerConfetti,
    triggerEmoji,
    triggerFireworks,
    triggerAll,
    CelebrationComponents: () => (
      <>
        <Confetti isActive={showConfetti} />
        <EmojiBurst isActive={showEmoji} emoji={currentEmoji} />
        <Fireworks isActive={showFireworks} />
      </>
    ),
  };
}
