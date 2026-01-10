import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";
import { usePrices } from "@/hooks/useAssets";
import { cn } from "@/lib/utils";

interface MarketPulseProps {
  symbols?: string;
  className?: string;
  compact?: boolean;
}

export function MarketPulse({
  symbols = "BTC,ETH,SOL",
  className,
  compact = false,
}: MarketPulseProps) {
  const { data: prices } = usePrices(symbols);
  const [bpm, setBpm] = useState(60);
  const [sentiment, setSentiment] = useState<"bullish" | "bearish" | "neutral">("neutral");
  const [waveData, setWaveData] = useState<number[]>([]);

  // Calculate market pulse from price changes
  useEffect(() => {
    if (!prices) return;

    const changes = Object.values(prices).map((p) => Math.abs(p.change24h));
    const avgVolatility = changes.reduce((a, b) => a + b, 0) / changes.length;
    const avgChange = Object.values(prices).reduce((a, p) => a + p.change24h, 0) / Object.values(prices).length;

    // BPM based on volatility (40-120 range)
    const calculatedBpm = Math.min(120, Math.max(40, 60 + avgVolatility * 3));
    setBpm(Math.round(calculatedBpm));

    // Sentiment based on average change
    if (avgChange > 1) setSentiment("bullish");
    else if (avgChange < -1) setSentiment("bearish");
    else setSentiment("neutral");
  }, [prices]);

  // Generate waveform data
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveData((prev) => {
        const newData = [...prev.slice(-29)];
        // Add new data point based on BPM
        const amplitude = (bpm - 40) / 80; // 0-1 range
        const noise = Math.random() * 0.3;
        newData.push(0.5 + amplitude * 0.4 * Math.sin(Date.now() / 200) + noise * 0.2);
        return newData;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [bpm]);

  const sentimentConfig = {
    bullish: {
      color: "text-quantum-green",
      bgColor: "bg-quantum-green/20",
      label: "Bullish",
      icon: TrendingUp,
    },
    bearish: {
      color: "text-nova-red",
      bgColor: "bg-nova-red/20",
      label: "Bearish",
      icon: TrendingDown,
    },
    neutral: {
      color: "text-aurora-cyan",
      bgColor: "bg-aurora-cyan/20",
      label: "Neutral",
      icon: Activity,
    },
  };

  const config = sentimentConfig[sentiment];
  const SentimentIcon = config.icon;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 60 / bpm,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={cn("w-2 h-2 rounded-full", config.bgColor)}
        />
        <span className={cn("text-sm font-medium", config.color)}>{bpm} BPM</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border-default",
        "bg-gradient-to-br from-bg-secondary to-bg-tertiary",
        className
      )}
    >
      {/* Pulse rings background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={cn("absolute rounded-full border", config.color)}
            style={{ borderColor: "currentColor", opacity: 0.1 }}
            animate={{
              scale: [1, 2.5],
              opacity: [0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeOut",
            }}
            initial={{ width: 40, height: 40 }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{
                duration: 60 / bpm,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={cn("p-2 rounded-lg", config.bgColor)}
            >
              <Activity className={cn("w-4 h-4", config.color)} />
            </motion.div>
            <span className="font-medium text-text-primary">Market Pulse</span>
          </div>
          <div className="flex items-center gap-1.5">
            <SentimentIcon className={cn("w-4 h-4", config.color)} />
            <span className={cn("text-sm font-medium", config.color)}>
              {config.label}
            </span>
          </div>
        </div>

        {/* BPM Display */}
        <div className="flex items-baseline gap-2 mb-4">
          <motion.span
            key={bpm}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("text-4xl font-bold", config.color)}
          >
            {bpm}
          </motion.span>
          <span className="text-text-muted">BPM</span>
        </div>

        {/* Waveform */}
        <div className="h-12 flex items-center gap-0.5">
          {waveData.map((value, i) => (
            <motion.div
              key={i}
              className={cn("w-1 rounded-full", config.bgColor)}
              animate={{ height: `${value * 100}%` }}
              transition={{ duration: 0.1 }}
              style={{
                opacity: 0.3 + (i / waveData.length) * 0.7,
              }}
            />
          ))}
        </div>

        {/* Subtitle */}
        <p className="mt-3 text-xs text-text-muted">
          Based on top asset volatility and price movements
        </p>
      </div>
    </motion.div>
  );
}

// Mini version for header
export function MarketPulseMini() {
  const { data: prices } = usePrices("BTC,ETH,SOL");
  const [bpm, setBpm] = useState(60);

  useEffect(() => {
    if (!prices) return;
    const changes = Object.values(prices).map((p) => Math.abs(p.change24h));
    const avgVolatility = changes.reduce((a, b) => a + b, 0) / changes.length;
    setBpm(Math.round(Math.min(120, Math.max(40, 60 + avgVolatility * 3))));
  }, [prices]);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-tertiary/50 border border-border-default">
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{
          duration: 60 / bpm,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-2 h-2 rounded-full bg-aurora-cyan"
      />
      <span className="text-sm text-text-muted">{bpm} BPM</span>
    </div>
  );
}
