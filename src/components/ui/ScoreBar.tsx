import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ScoreBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "success" | "warning" | "danger";
  className?: string;
}

export function ScoreBar({
  value,
  max = 100,
  label,
  showValue = true,
  size = "md",
  color = "primary",
  className,
}: ScoreBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  const colorClasses = {
    primary: "bg-accent-primary",
    success: "bg-accent-success",
    warning: "bg-accent-warning",
    danger: "bg-accent-danger",
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm text-text-muted">{label}</span>}
          {showValue && (
            <span className="text-sm font-medium text-text-primary">{value}</span>
          )}
        </div>
      )}
      <div className={cn("w-full bg-bg-tertiary rounded-full overflow-hidden", sizeClasses[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full", colorClasses[color])}
        />
      </div>
    </div>
  );
}

interface ScoreGridProps {
  scores: {
    label: string;
    value: number;
    color?: "primary" | "success" | "warning" | "danger";
  }[];
  className?: string;
}

export function ScoreGrid({ scores, className }: ScoreGridProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      {scores.map((score) => (
        <ScoreBar
          key={score.label}
          label={score.label}
          value={score.value}
          color={score.color}
        />
      ))}
    </div>
  );
}
