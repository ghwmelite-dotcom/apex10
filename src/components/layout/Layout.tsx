import { ReactNode, createContext, useContext, useMemo, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import { CustomCursor } from "../CustomCursor";
import { ScrollProgress } from "../ScrollAnimations";
import { useCelebration } from "../Confetti";
import { useSound } from "@/lib/sounds";
import { useDiscoveryMode } from "../useDiscoveryMode";

// Lazy load heavy components to reduce initial bundle size (~170 KB savings)
const CommandPalette = lazy(() => import("../CommandPalette").then(m => ({ default: m.CommandPalette })));
const ParticleBackground = lazy(() => import("../ParticleBackground").then(m => ({ default: m.ParticleBackground })));
const DiscoveryMode = lazy(() => import("../DiscoveryMode").then(m => ({ default: m.DiscoveryMode })));
const AIMentor = lazy(() => import("../AIMentor").then(m => ({ default: m.AIMentor })));
const VoiceNavigation = lazy(() => import("../VoiceNavigation").then(m => ({ default: m.VoiceNavigation })));

interface LayoutProps {
  children: ReactNode;
}

// Create context for celebrations and sounds
interface AppContextType {
  triggerConfetti: () => void;
  triggerEmoji: (emoji?: string) => void;
  triggerFireworks: () => void;
  triggerAll: () => void;
  playClick: () => void;
  playSuccess: () => void;
  playNotification: () => void;
  playAchievement: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within Layout");
  }
  return context;
}

export default function Layout({ children }: LayoutProps) {
  const { isOpen, closeDiscovery, completeDiscovery, openDiscovery } = useDiscoveryMode();
  const {
    triggerConfetti,
    triggerEmoji,
    triggerFireworks,
    triggerAll,
    CelebrationComponents
  } = useCelebration();
  const { playClick, playSuccess, playNotification, playAchievement, playWhoosh } = useSound();

  // Play whoosh when discovery mode opens
  const handleDiscoveryClick = () => {
    try {
      playWhoosh();
    } catch {
      // Audio context may not be initialized
    }
    openDiscovery();
  };

  const handleDiscoveryComplete = () => {
    playAchievement();
    triggerAll();
    completeDiscovery();
  };

  // Memoize context value to prevent unnecessary re-renders of all consumers
  const contextValue = useMemo(
    () => ({
      triggerConfetti,
      triggerEmoji,
      triggerFireworks,
      triggerAll,
      playClick,
      playSuccess,
      playNotification,
      playAchievement,
    }),
    [triggerConfetti, triggerEmoji, triggerFireworks, triggerAll, playClick, playSuccess, playNotification, playAchievement]
  );

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen flex flex-col bg-bg-primary relative">
        {/* Custom cursor */}
        <CustomCursor />

        {/* Scroll progress bar */}
        <ScrollProgress />

        {/* Particle background - contained to prevent CLS, lazy loaded */}
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{ contain: "strict" }}
          aria-hidden="true"
        >
          <Suspense fallback={null}>
            <ParticleBackground variant="calm" className="w-full h-full opacity-50" />
          </Suspense>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header onDiscoveryClick={handleDiscoveryClick} />

          {/* Page content with transitions */}
          <motion.main
            className="flex-1 overflow-visible"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.main>

          <Footer />
        </div>

        {/* Command palette - lazy loaded, triggered by Cmd-K */}
        <Suspense fallback={null}>
          <CommandPalette />
        </Suspense>

        {/* Discovery mode - lazy loaded, triggered by user */}
        <Suspense fallback={null}>
          <DiscoveryMode
            isOpen={isOpen}
            onClose={closeDiscovery}
            onComplete={handleDiscoveryComplete}
          />
        </Suspense>

        {/* AI Mentor floating chat - lazy loaded */}
        <Suspense fallback={null}>
          <AIMentor />
        </Suspense>

        {/* Voice Navigation - lazy loaded */}
        <Suspense fallback={null}>
          <VoiceNavigation onDiscoveryTrigger={handleDiscoveryClick} />
        </Suspense>

        {/* Celebration effects */}
        <CelebrationComponents />
      </div>
    </AppContext.Provider>
  );
}
