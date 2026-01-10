import { ReactNode, createContext, useContext } from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import { CommandPalette } from "../CommandPalette";
import { ParticleBackground } from "../ParticleBackground";
import { DiscoveryMode, useDiscoveryMode } from "../DiscoveryMode";
import { CustomCursor } from "../CustomCursor";
import { ScrollProgress } from "../ScrollAnimations";
import { useCelebration } from "../Confetti";
import { useSound } from "@/lib/sounds";
import { AIMentor } from "../AIMentor";
import { VoiceNavigation } from "../VoiceNavigation";

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

  return (
    <AppContext.Provider
      value={{
        triggerConfetti,
        triggerEmoji,
        triggerFireworks,
        triggerAll,
        playClick,
        playSuccess,
        playNotification,
        playAchievement,
      }}
    >
      <div className="min-h-screen flex flex-col bg-bg-primary relative">
        {/* Custom cursor */}
        <CustomCursor />

        {/* Scroll progress bar */}
        <ScrollProgress />

        {/* Particle background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <ParticleBackground variant="calm" className="w-full h-full opacity-50" />
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header onDiscoveryClick={handleDiscoveryClick} />

          {/* Page content with transitions */}
          <motion.main
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.main>

          <Footer />
        </div>

        {/* Command palette */}
        <CommandPalette />

        {/* Discovery mode */}
        <DiscoveryMode
          isOpen={isOpen}
          onClose={closeDiscovery}
          onComplete={handleDiscoveryComplete}
        />

        {/* AI Mentor floating chat */}
        <AIMentor />

        {/* Voice Navigation */}
        <VoiceNavigation onDiscoveryTrigger={handleDiscoveryClick} />

        {/* Celebration effects */}
        <CelebrationComponents />
      </div>
    </AppContext.Provider>
  );
}
