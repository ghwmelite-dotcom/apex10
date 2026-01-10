import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Rocket,
  Shield,
  TrendingUp,
  BookOpen,
  ChevronRight,
  Sparkles,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DiscoveryStep {
  id: string;
  title: string;
  description: string;
  icon: typeof Rocket;
  gradient: string;
  action?: () => void;
}

interface DiscoveryModeProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function DiscoveryMode({ isOpen, onClose, onComplete }: DiscoveryModeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const navigate = useNavigate();

  const steps: DiscoveryStep[] = [
    {
      id: "welcome",
      title: "Welcome to Apex10",
      description:
        "Your journey through the crypto universe begins now. Discover high-potential assets with security-first education.",
      icon: Rocket,
      gradient: "from-aurora-cyan to-aurora-blue",
    },
    {
      id: "rankings",
      title: "Top 10 Rankings",
      description:
        "We curate the top 10 high-potential crypto assets using a transparent methodology. Each asset is scored on potential, utility, developer activity, and adoption.",
      icon: TrendingUp,
      gradient: "from-aurora-purple to-aurora-pink",
      action: () => navigate("/"),
    },
    {
      id: "security",
      title: "Security First",
      description:
        "Protect your assets with our comprehensive security hub. Complete the interactive checklist to ensure you're following best practices.",
      icon: Shield,
      gradient: "from-quantum-green to-aurora-cyan",
      action: () => navigate("/security"),
    },
    {
      id: "learn",
      title: "Learn & Grow",
      description:
        "Access step-by-step guides for wallet setup, crypto acquisition, and staying safe. Knowledge is your greatest asset.",
      icon: BookOpen,
      gradient: "from-solar-gold to-plasma-orange",
      action: () => navigate("/learn"),
    },
    {
      id: "complete",
      title: "You're Ready!",
      description:
        "You've completed the discovery tour. Explore the platform, check your security score, and start your journey!",
      icon: Sparkles,
      gradient: "from-aurora-cyan via-aurora-purple to-aurora-pink",
    },
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem("apex10-discovery-completed", "true");
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Backdrop with stars */}
        <div className="absolute inset-0 bg-bg-primary">
          {/* Stars */}
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Gradient orbs */}
          <motion.div
            className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{
              background: `linear-gradient(135deg, #00FFD1, #8B5CF6)`,
              left: "10%",
              top: "20%",
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-80 h-80 rounded-full opacity-20 blur-3xl"
            style={{
              background: `linear-gradient(135deg, #EC4899, #8B5CF6)`,
              right: "10%",
              bottom: "20%",
            }}
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 rounded-full bg-bg-secondary/50 backdrop-blur-sm border border-border-default hover:border-border-hover transition-colors"
        >
          <X className="w-5 h-5 text-text-muted" />
        </button>

        {/* Content */}
        <div className="relative z-10 w-full max-w-2xl px-6">
          {!isStarted ? (
            // Landing screen
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              {/* Animated rocket */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="mb-8"
              >
                <div className="inline-flex p-6 rounded-3xl bg-gradient-to-br from-aurora-cyan/20 to-aurora-purple/20 border border-aurora-cyan/30">
                  <Rocket className="w-16 h-16 text-aurora-cyan" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                <span className="aurora-text">Welcome to the edge</span>
                <br />
                <span className="text-text-primary">of discovery</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-text-muted mb-8 max-w-md mx-auto"
              >
                Your journey through the crypto universe begins now. Let us guide you
                through what makes Apex10 unique.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => setIsStarted(true)}
                className="btn-aurora text-lg px-8 py-4 group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Begin Discovery
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={onClose}
                className="block mx-auto mt-4 text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                Skip for now
              </motion.button>
            </motion.div>
          ) : (
            // Step content
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="text-center"
            >
              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      index === currentStep
                        ? "w-8 bg-aurora-cyan"
                        : index < currentStep
                        ? "bg-aurora-cyan"
                        : "bg-border-default"
                    )}
                    animate={index === currentStep ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                ))}
              </div>

              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="mb-8"
              >
                <div
                  className={cn(
                    "inline-flex p-5 rounded-2xl",
                    `bg-gradient-to-br ${currentStepData.gradient}`
                  )}
                  style={{
                    boxShadow: `0 0 60px rgba(0, 255, 209, 0.3)`,
                  }}
                >
                  <Icon className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-text-primary mb-4"
              >
                {currentStepData.title}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-text-muted mb-8 max-w-md mx-auto"
              >
                {currentStepData.description}
              </motion.p>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-4"
              >
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="btn-ghost-glow"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="btn-aurora group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {currentStep === steps.length - 1 ? (
                      <>
                        <Check className="w-5 h-5" />
                        Get Started
                      </>
                    ) : (
                      <>
                        Continue
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to manage discovery mode state
export function useDiscoveryMode() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem("apex10-discovery-completed");
    setHasCompleted(completed === "true");
  }, []);

  const openDiscovery = () => setIsOpen(true);
  const closeDiscovery = () => setIsOpen(false);
  const completeDiscovery = () => {
    setHasCompleted(true);
    setIsOpen(false);
  };

  // Auto-open for new users (optional)
  useEffect(() => {
    if (!hasCompleted) {
      const timer = setTimeout(() => {
        // Uncomment to auto-open for new users:
        // setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasCompleted]);

  return {
    isOpen,
    hasCompleted,
    openDiscovery,
    closeDiscovery,
    completeDiscovery,
  };
}
