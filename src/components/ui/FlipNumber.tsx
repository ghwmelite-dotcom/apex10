import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FlipNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  highlightChange?: boolean;
}

export function FlipNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 2,
  className,
  highlightChange = true,
}: FlipNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isIncreasing, setIsIncreasing] = useState<boolean | null>(null);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value !== prevValueRef.current) {
      setIsIncreasing(value > prevValueRef.current);
      setDisplayValue(value);
      prevValueRef.current = value;
    }
  }, [value]);

  const formattedValue = displayValue.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const digits = (prefix + formattedValue + suffix).split("");

  return (
    <span className={cn("inline-flex font-mono", className)}>
      <AnimatePresence mode="popLayout">
        {digits.map((digit, index) => (
          <motion.span
            key={`${digit}-${index}-${displayValue}`}
            initial={{ opacity: 0, y: isIncreasing ? 20 : -20, rotateX: isIncreasing ? -90 : 90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: isIncreasing ? -20 : 20, rotateX: isIncreasing ? 90 : -90 }}
            transition={{
              duration: 0.3,
              delay: index * 0.02,
              ease: [0.4, 0, 0.2, 1],
            }}
            className={cn(
              "inline-block",
              highlightChange && isIncreasing !== null && (
                isIncreasing ? "text-quantum-green" : "text-nova-red"
              )
            )}
            style={{ transformStyle: "preserve-3d" }}
          >
            {digit}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}

// Preset for price display
interface FlipPriceProps {
  value: number;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function FlipPrice({ value, className, size = "md" }: FlipPriceProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-4xl font-bold",
  };

  const decimals = value < 1 ? 4 : 2;

  return (
    <FlipNumber
      value={value}
      prefix="$"
      decimals={decimals}
      className={cn(sizeClasses[size], className)}
    />
  );
}

// Animated percentage change
interface FlipPercentProps {
  value: number;
  className?: string;
  showSign?: boolean;
}

export function FlipPercent({ value, className, showSign = true }: FlipPercentProps) {
  const isPositive = value >= 0;
  const prefix = showSign ? (isPositive ? "+" : "") : "";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1",
        isPositive ? "text-quantum-green" : "text-nova-red",
        className
      )}
    >
      <FlipNumber
        value={value}
        prefix={prefix}
        suffix="%"
        decimals={2}
        highlightChange={false}
      />
    </span>
  );
}
