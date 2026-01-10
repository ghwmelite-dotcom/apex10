import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, formatPercent } from "@/lib/utils";

interface PriceChangeProps {
  value: number;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function PriceChange({
  value,
  size = "md",
  showIcon = true,
  className,
}: PriceChangeProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium",
        sizeClasses[size],
        {
          "text-crypto-positive": isPositive,
          "text-crypto-negative": !isPositive && !isNeutral,
          "text-text-muted": isNeutral,
        },
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {formatPercent(value)}
    </span>
  );
}
