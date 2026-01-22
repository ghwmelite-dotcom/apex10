import { motion } from "framer-motion";
import { MessageCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SentimentData {
  score: number; // 0-100
  trend: "up" | "down" | "stable";
  sources: {
    twitter: number;
    reddit: number;
    news: number;
  };
  mentions24h: number;
}

// Placeholder sentiment data
const PLACEHOLDER_SENTIMENT: SentimentData = {
  score: 68,
  trend: "up",
  sources: {
    twitter: 72,
    reddit: 65,
    news: 67,
  },
  mentions24h: 12500,
};

interface SentimentIndicatorProps {
  sentiment?: SentimentData;
  isLoading?: boolean;
  compact?: boolean;
}

export function SentimentIndicator({
  sentiment = PLACEHOLDER_SENTIMENT,
  isLoading,
  compact = false,
}: SentimentIndicatorProps) {
  const getSentimentLabel = (score: number) => {
    if (score >= 70) return { label: "Very Bullish", color: "text-quantum-green" };
    if (score >= 55) return { label: "Bullish", color: "text-quantum-green" };
    if (score >= 45) return { label: "Neutral", color: "text-solar-gold" };
    if (score >= 30) return { label: "Bearish", color: "text-nova-red" };
    return { label: "Very Bearish", color: "text-nova-red" };
  };

  const { label, color } = getSentimentLabel(sentiment.score);

  const TrendIcon = sentiment.trend === "up" ? TrendingUp : sentiment.trend === "down" ? TrendingDown : Minus;

  return (
    <div className="rounded-2xl bg-bg-secondary/50 border border-xrp-cyan/10 overflow-hidden">
      <div className="p-4 border-b border-border-default">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-xrp-cyan/10">
            <MessageCircle className="w-4 h-4 text-xrp-cyan" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Community Sentiment</h3>
            <p className="text-xs text-text-muted">XRP social analysis</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-6 animate-pulse">
          <div className="h-32 bg-bg-tertiary rounded-full w-32 mx-auto mb-4" />
          <div className="h-4 bg-bg-tertiary rounded w-1/2 mx-auto" />
        </div>
      ) : (
        <div className="p-6">
          {/* Sentiment gauge */}
          <div className="relative w-40 h-40 mx-auto mb-4">
            {/* Background ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-bg-tertiary"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#sentimentGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: sentiment.score / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                  strokeDasharray: "283",
                  strokeDashoffset: "0",
                }}
              />
              <defs>
                <linearGradient id="sentimentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="50%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("text-3xl font-bold", color)}>{sentiment.score}</span>
              <span className="text-xs text-text-muted">/ 100</span>
            </div>
          </div>

          {/* Sentiment label */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2">
              <span className={cn("font-semibold text-lg", color)}>{label}</span>
              <TrendIcon
                className={cn(
                  "w-4 h-4",
                  sentiment.trend === "up" ? "text-quantum-green" : sentiment.trend === "down" ? "text-nova-red" : "text-text-muted"
                )}
              />
            </div>
            <p className="text-xs text-text-muted mt-1">
              {sentiment.mentions24h.toLocaleString()} mentions in 24h
            </p>
          </div>

          {/* Source breakdown */}
          {!compact && (
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border-default">
              <SourceBar label="Twitter" value={sentiment.sources.twitter} />
              <SourceBar label="Reddit" value={sentiment.sources.reddit} />
              <SourceBar label="News" value={sentiment.sources.news} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SourceBar({ label, value }: { label: string; value: number }) {
  const getBarColor = (v: number) => {
    if (v >= 60) return "bg-quantum-green";
    if (v >= 40) return "bg-solar-gold";
    return "bg-nova-red";
  };

  return (
    <div className="text-center">
      <div className="text-xs text-text-muted mb-1">{label}</div>
      <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", getBarColor(value))}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <div className="text-xs font-medium text-text-primary mt-1">{value}</div>
    </div>
  );
}
