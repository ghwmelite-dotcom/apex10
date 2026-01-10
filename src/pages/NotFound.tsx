import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, RefreshCw, Rocket, Sparkles } from "lucide-react";

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isExploding, setIsExploding] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 100, damping: 20 });
  const springY = useSpring(cursorY, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setMousePosition({ x, y });
        cursorX.set(x * 0.02);
        cursorY.set(y * 0.02);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY]);

  const handleExplode = () => {
    setIsExploding(true);
    setTimeout(() => setIsExploding(false), 2000);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-bg-primary"
    >
      {/* Animated space background */}
      <div className="absolute inset-0">
        {/* Stars */}
        {[...Array(150)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 1 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Shooting stars */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`shooting-${i}`}
            className="absolute w-20 h-0.5 bg-gradient-to-r from-transparent via-white to-aurora-cyan"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              rotate: 45,
            }}
            initial={{ x: -100, opacity: 0 }}
            animate={{
              x: ["-100%", "200%"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 2 + Math.random() * 5,
              repeatDelay: 5,
            }}
          />
        ))}

        {/* Nebula clouds */}
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-30 blur-3xl"
          style={{
            background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
            left: "20%",
            top: "30%",
            x: springX,
            y: springY,
          }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, #00FFD1 0%, transparent 70%)",
            right: "20%",
            bottom: "30%",
            x: springX,
            y: springY,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Floating astronaut */}
        <motion.div
          className="mb-8"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            x: springX,
            rotateY: mousePosition.x * 0.05,
            rotateX: mousePosition.y * -0.05,
          }}
        >
          <div className="inline-block relative">
            {/* Astronaut helmet */}
            <motion.div
              className="w-32 h-32 mx-auto bg-gradient-to-b from-gray-200 to-gray-400 rounded-full relative"
              style={{
                boxShadow: "inset 0 -10px 30px rgba(0,0,0,0.3), 0 0 60px rgba(139, 92, 246, 0.3)",
              }}
            >
              {/* Visor */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-aurora-cyan/80 via-aurora-purple/80 to-aurora-pink/80 overflow-hidden">
                {/* Reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                {/* Face inside - confused expression */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl">😵</span>
                </div>
              </div>
              {/* Antenna */}
              <motion.div
                className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-6 bg-gray-400"
                animate={{ rotate: [-10, 10, -10] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-nova-red">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-nova-red"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Tether */}
            <svg className="absolute left-full top-1/2 w-40 h-20 opacity-50" viewBox="0 0 160 80">
              <motion.path
                d="M 0 40 Q 40 20, 80 40 T 160 40"
                stroke="url(#tetherGradient)"
                strokeWidth="2"
                fill="none"
                animate={{
                  d: [
                    "M 0 40 Q 40 20, 80 40 T 160 40",
                    "M 0 40 Q 40 60, 80 40 T 160 40",
                    "M 0 40 Q 40 20, 80 40 T 160 40",
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <defs>
                <linearGradient id="tetherGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00FFD1" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>

        {/* 404 text with glitch effect */}
        <motion.div
          className="relative mb-4"
          onClick={handleExplode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ cursor: "pointer" }}
        >
          <motion.h1
            className="text-[150px] md:text-[200px] font-black leading-none select-none"
            style={{
              background: "linear-gradient(135deg, #00FFD1, #8B5CF6, #EC4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 60px rgba(139, 92, 246, 0.5)",
            }}
            animate={
              isExploding
                ? {
                    scale: [1, 1.2, 0],
                    rotate: [0, 10, -10, 0],
                    opacity: [1, 1, 0],
                  }
                : {}
            }
            transition={{ duration: 0.5 }}
          >
            404
          </motion.h1>

          {/* Glitch layers */}
          <motion.h1
            className="absolute inset-0 text-[150px] md:text-[200px] font-black leading-none text-aurora-cyan opacity-0"
            animate={{
              opacity: [0, 0.8, 0],
              x: [0, -5, 5, 0],
            }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
          >
            404
          </motion.h1>
          <motion.h1
            className="absolute inset-0 text-[150px] md:text-[200px] font-black leading-none text-aurora-pink opacity-0"
            animate={{
              opacity: [0, 0.8, 0],
              x: [0, 5, -5, 0],
            }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3, delay: 0.1 }}
          >
            404
          </motion.h1>

          {/* Explosion particles */}
          {isExploding && (
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 rounded-full"
                  style={{
                    background: ["#00FFD1", "#8B5CF6", "#EC4899"][i % 3],
                  }}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i * 18 * Math.PI) / 180) * 200,
                    y: Math.sin((i * 18 * Math.PI) / 180) * 200,
                    opacity: [1, 0],
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              ))}
            </div>
          )}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold text-text-primary mb-4"
        >
          Houston, we have a problem!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-text-muted mb-8 max-w-md mx-auto"
        >
          The page you're looking for has drifted into deep space.
          <br />
          <span className="text-aurora-cyan">Click the 404</span> to see it explode!
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-aurora-cyan to-aurora-purple rounded-xl text-bg-primary font-semibold hover:shadow-glow transition-all"
          >
            <Home className="w-5 h-5" />
            <span>Return Home</span>
            <Rocket className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 bg-bg-secondary border border-border-default rounded-xl text-text-primary hover:border-aurora-cyan/50 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </button>
        </motion.div>

        {/* Fun fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-4 rounded-xl bg-bg-secondary/50 border border-border-default max-w-md mx-auto"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-aurora-purple mt-0.5" />
            <p className="text-sm text-text-muted text-left">
              <span className="text-aurora-purple font-medium">Fun fact:</span> The term "404 error" comes from room 404 at CERN, where the World Wide Web was invented. Legends say it's where missing files went to hide.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Floating debris */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`debris-${i}`}
          className="absolute w-2 h-2 bg-aurora-cyan/30 rounded-full"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 360],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}
