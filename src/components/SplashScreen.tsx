import { useEffect } from "react";
import { motion } from "framer-motion";

interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export function SplashScreen({ onComplete, duration = 2000 }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-bg-primary overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Aurora gradient background orbs */}
      <div className="absolute inset-0">
        {/* Cyan orb */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{
            background: "radial-gradient(circle, rgba(0, 255, 209, 0.4) 0%, transparent 70%)",
            top: "10%",
            left: "20%",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Purple orb */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
            bottom: "10%",
            right: "15%",
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.3, 0.4],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Blue orb */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full blur-[80px]"
          style={{
            background: "radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%)",
            top: "50%",
            right: "30%",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo container with glow */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1,
          }}
          className="relative"
        >
          {/* Outer glow ring */}
          <motion.div
            className="absolute -inset-4 rounded-[2rem] opacity-60"
            style={{
              background: "linear-gradient(135deg, #00FFD1, #00D4FF, #8B5CF6)",
            }}
            animate={{
              boxShadow: [
                "0 0 30px rgba(0, 255, 209, 0.4), 0 0 60px rgba(0, 255, 209, 0.2)",
                "0 0 60px rgba(0, 255, 209, 0.6), 0 0 100px rgba(0, 255, 209, 0.3)",
                "0 0 30px rgba(0, 255, 209, 0.4), 0 0 60px rgba(0, 255, 209, 0.2)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Inner glow */}
          <motion.div
            className="absolute -inset-2 rounded-[1.75rem] blur-xl"
            style={{
              background: "linear-gradient(135deg, rgba(0, 255, 209, 0.5), rgba(0, 212, 255, 0.5), rgba(139, 92, 246, 0.5))",
            }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Logo */}
          <div
            className="relative w-28 h-28 md:w-32 md:h-32 rounded-[1.5rem] flex items-center justify-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #00D4FF, #00FFD1, #8B5CF6)",
            }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              }}
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 1,
              }}
            />
            <span className="text-4xl md:text-5xl font-bold text-bg-primary relative z-10">
              A10
            </span>
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-aurora-cyan via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
            Apex10
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-2 text-text-muted text-sm"
          >
            CryptoDiscover
          </motion.p>
        </motion.div>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex gap-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: "linear-gradient(135deg, #00FFD1, #00D4FF)",
              }}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
    </motion.div>
  );
}
