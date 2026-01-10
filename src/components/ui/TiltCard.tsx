import { useRef, useState, ReactNode, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  glareEnabled?: boolean;
  tiltAmount?: number;
  perspective?: number;
}

export function TiltCard({
  children,
  className,
  glareEnabled = true,
  tiltAmount = 10,
  perspective = 1000,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for smooth animation
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for smooth movement
  const springConfig = { stiffness: 300, damping: 30 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [tiltAmount, -tiltAmount]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-tiltAmount, tiltAmount]), springConfig);

  // Glare position
  const glareX = useTransform(x, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(y, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative", className)}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full"
      >
        {/* Card content */}
        {children}

        {/* Glare effect */}
        {glareEnabled && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              opacity: isHovered ? 0.15 : 0,
              background: `radial-gradient(
                circle at ${glareX.get()}% ${glareY.get()}%,
                rgba(255, 255, 255, 0.4) 0%,
                transparent 60%
              )`,
            }}
            animate={{
              opacity: isHovered ? 0.15 : 0,
            }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Border glow on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            boxShadow: isHovered
              ? "0 0 30px rgba(0, 255, 209, 0.2), inset 0 0 30px rgba(0, 255, 209, 0.05)"
              : "none",
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
}
