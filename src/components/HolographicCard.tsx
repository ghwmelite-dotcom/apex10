import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export function HolographicCard({
  children,
  className,
  intensity = "medium",
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const intensityMap = {
    low: { rotate: 5, glare: 0.1 },
    medium: { rotate: 10, glare: 0.2 },
    high: { rotate: 15, glare: 0.3 },
  };

  const { rotate: maxRotate, glare: glareOpacity } = intensityMap[intensity];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateXValue = (mouseY / (rect.height / 2)) * -maxRotate;
    const rotateYValue = (mouseX / (rect.width / 2)) * maxRotate;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);

    // Calculate glare position
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition({ x: 50, y: 50 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className={cn("relative group", className)}
    >
      {/* Holographic rainbow effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden"
        style={{
          background: `
            linear-gradient(
              ${Math.atan2(glarePosition.y - 50, glarePosition.x - 50) * (180 / Math.PI)}deg,
              rgba(255, 0, 128, 0.3) 0%,
              rgba(255, 128, 0, 0.3) 14%,
              rgba(255, 255, 0, 0.3) 28%,
              rgba(0, 255, 128, 0.3) 42%,
              rgba(0, 128, 255, 0.3) 57%,
              rgba(128, 0, 255, 0.3) 71%,
              rgba(255, 0, 128, 0.3) 85%,
              rgba(255, 0, 128, 0.3) 100%
            )
          `,
          backgroundSize: "200% 200%",
          animation: "holographic 3s ease-in-out infinite",
        }}
      />

      {/* Glare effect */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(
            circle at ${glarePosition.x}% ${glarePosition.y}%,
            rgba(255, 255, 255, ${glareOpacity}) 0%,
            transparent 50%
          )`,
        }}
      />

      {/* Sparkle particles */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Card content with 3D transform */}
      <div
        style={{
          transform: "translateZ(20px)",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>

      <style>{`
        @keyframes holographic {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </motion.div>
  );
}

// Shimmer border variant
export function ShimmerBorderCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative group", className)}>
      {/* Animated border */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-aurora-cyan via-aurora-purple to-aurora-pink opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
      <div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(90deg, #00FFD1, #8B5CF6, #EC4899, #00FFD1)",
          backgroundSize: "300% 100%",
          animation: "shimmer-border 3s linear infinite",
        }}
      />

      {/* Content */}
      <div className="relative rounded-2xl bg-bg-secondary">
        {children}
      </div>

      <style>{`
        @keyframes shimmer-border {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 300% 50%;
          }
        }
      `}</style>
    </div>
  );
}
