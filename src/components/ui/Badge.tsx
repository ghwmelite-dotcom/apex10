import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "info" | "success" | "warning" | "danger";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          {
            "bg-bg-tertiary text-text-secondary": variant === "default",
            "bg-accent-primary/20 text-accent-primary": variant === "info",
            "bg-accent-success/20 text-accent-success": variant === "success",
            "bg-accent-warning/20 text-accent-warning": variant === "warning",
            "bg-accent-danger/20 text-accent-danger": variant === "danger",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
