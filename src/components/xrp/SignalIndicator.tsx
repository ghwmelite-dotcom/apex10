import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export type SignalType = "bullish" | "neutral" | "bearish";

interface SignalIndicatorProps {
  change24h: number;
  change7d: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function getSignalType(change24h: number, change7d: number): SignalType {
  // Bullish: 24h > 3% OR 7d > 10%
  if (change24h > 3 || change7d > 10) return "bullish";
  // Bearish: 24h < -3% OR 7d < -10%
  if (change24h < -3 || change7d < -10) return "bearish";
  // Neutral: Otherwise
  return "neutral";
}

export function SignalIndicator({
  change24h,
  change7d,
  size = "md",
  showLabel = true,
}: SignalIndicatorProps) {
  const signal = getSignalType(change24h, change7d);

  const config = {
    bullish: {
      color: "text-quantum-green",
      bg: "bg-quantum-green/20",
      border: "border-quantum-green/30",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.4)]",
      label: "Bullish",
      Icon: TrendingUp,
    },
    neutral: {
      color: "text-solar-gold",
      bg: "bg-solar-gold/20",
      border: "border-solar-gold/30",
      glow: "shadow-[0_0_20px_rgba(255,215,0,0.4)]",
      label: "Neutral",
      Icon: Minus,
    },
    bearish: {
      color: "text-nova-red",
      bg: "bg-nova-red/20",
      border: "border-nova-red/30",
      glow: "shadow-[0_0_20px_rgba(239,68,68,0.4)]",
      label: "Bearish",
      Icon: TrendingDown,
    },
  };

  const sizeConfig = {
    sm: { dot: "w-2 h-2", text: "text-xs", icon: "w-3 h-3", padding: "px-2 py-1" },
    md: { dot: "w-3 h-3", text: "text-sm", icon: "w-4 h-4", padding: "px-3 py-1.5" },
    lg: { dot: "w-4 h-4", text: "text-base", icon: "w-5 h-5", padding: "px-4 py-2" },
  };

  const { color, bg, border, glow, label, Icon } = config[signal];
  const { dot, text, icon, padding } = sizeConfig[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border",
        bg,
        border,
        glow,
        padding
      )}
    >
      {/* Animated pulse dot */}
      <div className="relative">
        <motion.div
          className={cn("rounded-full", bg, dot)}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            signal === "bullish" ? "bg-quantum-green" : signal === "bearish" ? "bg-nova-red" : "bg-solar-gold"
          )}
        />
      </div>

      <Icon className={cn(icon, color)} />

      {showLabel && (
        <span className={cn("font-semibold", text, color)}>{label}</span>
      )}
    </motion.div>
  );
}

export function SignalBadge({ signal }: { signal: SignalType }) {
  const config = {
    bullish: {
      bg: "bg-quantum-green/10",
      text: "text-quantum-green",
      label: "BULLISH",
    },
    neutral: {
      bg: "bg-solar-gold/10",
      text: "text-solar-gold",
      label: "NEUTRAL",
    },
    bearish: {
      bg: "bg-nova-red/10",
      text: "text-nova-red",
      label: "BEARISH",
    },
  };

  const { bg, text, label } = config[signal];

  return (
    <span className={cn("px-2 py-0.5 rounded text-xs font-bold tracking-wider", bg, text)}>
      {label}
    </span>
  );
}
