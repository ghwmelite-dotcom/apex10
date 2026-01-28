import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Wallet, ShoppingCart, Shield, Brain, ExternalLink, Monitor, Smartphone, Lock, ArrowRightLeft, ArrowUpRight, Clock, Sparkles } from "lucide-react";
import { useWalletGuides, useAcquisitionGuides } from "@/hooks/useSecurity";
import {
  Card,
  Badge,
  Button,
  Skeleton,
} from "@/components/ui";
import { LearningPathGenerator } from "@/components/LearningPath";
import { TutorialReader } from "@/components/TutorialReader";
import { BeginnerTutorials } from "@/components/BeginnerTutorials";

// Tutorial type with metadata
interface Tutorial {
  id: number;
  type: string;
  category: string;
  title: string;
  content: string;
  severity: string;
  order: number;
  metadata?: {
    platform?: string;
    difficulty?: string;
    timeRequired?: string;
    requirements?: string[];
  };
}

// Get icon for tutorial category
function getTutorialIcon(category: string) {
  switch (category) {
    case "binance_desktop":
      return Monitor;
    case "binance_mobile":
      return Smartphone;
    case "binance_security":
      return Lock;
    case "binance_trading":
      return ArrowRightLeft;
    case "binance_withdraw":
      return ArrowUpRight;
    default:
      return ShoppingCart;
  }
}

// Get badge color for difficulty
function getDifficultyColor(difficulty?: string) {
  switch (difficulty) {
    case "beginner":
      return "success";
    case "intermediate":
      return "warning";
    case "advanced":
      return "error";
    default:
      return "info";
  }
}

// Tutorial Card Component - Compact responsive design
function TutorialCard({
  tutorial,
  index,
  onClick
}: {
  tutorial: Tutorial;
  index: number;
  onClick: () => void;
}) {
  const Icon = getTutorialIcon(tutorial.category);
  const metadata = tutorial.metadata;
  const isBinanceTutorial = tutorial.category.startsWith("binance_");

  // Get step count from content
  const stepCount = (tutorial.content.match(/^## /gm) || []).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.03 * Math.min(index, 10) }}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <div
        className={`relative h-full p-4 sm:p-5 rounded-xl cursor-pointer transition-all duration-300 group overflow-hidden ${
          isBinanceTutorial
            ? "bg-gradient-to-br from-amber-500/[0.08] via-amber-600/[0.04] to-transparent border border-amber-500/20 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10"
            : "bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 hover:border-white/20"
        }`}
        onClick={onClick}
      >
        {/* Header */}
        <div className="relative flex items-start gap-3 mb-3">
          <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
            isBinanceTutorial
              ? "bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/20"
              : "bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/20"
          }`}>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isBinanceTutorial ? "text-black" : "text-cyan-400"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm sm:text-base leading-tight line-clamp-2 group-hover:text-amber-400 transition-colors mb-2">
              {tutorial.title.replace("Binance ", "").replace(": Complete Guide", "")}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5">
              {metadata?.platform && (
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-medium uppercase tracking-wider ${
                  isBinanceTutorial
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "bg-white/5 text-gray-400 border border-white/10"
                }`}>
                  {metadata.platform === "desktop" ? <Monitor className="w-2.5 h-2.5" /> :
                   metadata.platform === "mobile" ? <Smartphone className="w-2.5 h-2.5" /> : null}
                  {metadata.platform === "desktop" ? "Desktop" :
                   metadata.platform === "mobile" ? "Mobile" : "All"}
                </span>
              )}
              {metadata?.difficulty && (
                <span className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-medium uppercase tracking-wider ${
                  metadata.difficulty === "beginner"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : metadata.difficulty === "intermediate"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  {metadata.difficulty}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-2 sm:gap-3">
            {metadata?.timeRequired && (
              <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {metadata.timeRequired}
              </span>
            )}
            {stepCount > 0 && (
              <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500">
                <Sparkles className="w-3 h-3" />
                {stepCount} steps
              </span>
            )}
          </div>
          <span className={`flex items-center gap-1 text-[10px] sm:text-xs font-medium transition-colors ${
            isBinanceTutorial
              ? "text-amber-500 group-hover:text-amber-400"
              : "text-cyan-500 group-hover:text-cyan-400"
          }`}>
            Start
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function LearnCenter() {
  const { data: walletGuides, isLoading: walletsLoading } = useWalletGuides();
  const { data: acquisitionGuides, isLoading: acquisitionLoading } = useAcquisitionGuides();
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  // Separate Binance tutorials from other guides
  const binanceTutorials = acquisitionGuides?.filter((g: Tutorial) =>
    g.category.startsWith("binance_")
  ) || [];

  const otherGuides = acquisitionGuides?.filter((g: Tutorial) =>
    !g.category.startsWith("binance_")
  ) || [];

  return (
    <div className="container-custom py-4 sm:py-8 min-h-screen overflow-visible">
      {/* Tutorial Reader - Full screen immersive experience */}
      <TutorialReader
        tutorial={selectedTutorial}
        onClose={() => setSelectedTutorial(null)}
      />

      {/* Hero Section - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-accent-secondary/20 to-accent-primary/20">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-accent-secondary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Learn Center</h1>
            <p className="text-xs sm:text-sm text-text-muted">
              Interactive guides for crypto acquisition
            </p>
          </div>
        </div>
      </motion.div>

      {/* AI-Powered Learning Path - Collapsible on mobile */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-8"
      >
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-aurora-purple/5 to-aurora-cyan/5 border-aurora-purple/20">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-aurora-purple/20 to-aurora-cyan/20">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-aurora-purple" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-xl font-semibold text-text-primary flex items-center gap-2 flex-wrap">
                Personalized Learning
                <Badge variant="info" className="text-[10px] sm:text-xs">AI</Badge>
              </h2>
              <p className="text-xs sm:text-sm text-text-muted hidden sm:block">
                Get a customized curriculum tailored to your interests
              </p>
            </div>
          </div>
          <LearningPathGenerator />
        </Card>
      </motion.section>

      {/* Beginner-Friendly Interactive Tutorials */}
      <motion.section
        id="beginner-tutorials"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="mb-12"
      >
        <BeginnerTutorials />
      </motion.section>

      {/* Binance Tutorials Section - Featured */}
      {binanceTutorials.length > 0 && (
        <motion.section
          id="binance"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/20">
              <img
                src="https://cryptologos.cc/logos/binance-coin-bnb-logo.png"
                alt="Binance"
                className="w-5 h-5"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
                Binance Setup Tutorials
              </h2>
              <p className="text-xs sm:text-sm text-text-muted">
                Interactive step-by-step guides for Binance
              </p>
            </div>
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
              {binanceTutorials.length} Guides
            </Badge>
          </div>

          {/* Responsive grid: 1 col mobile, 2 cols tablet, 3 cols desktop, 4 cols large */}
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {binanceTutorials.map((tutorial: Tutorial, index: number) => (
              <TutorialCard
                key={tutorial.id}
                tutorial={tutorial}
                index={index}
                onClick={() => setSelectedTutorial(tutorial)}
              />
            ))}
          </div>
        </motion.section>
      )}

      {/* Wallet Guides Section */}
      <motion.section
        id="wallets"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-6">
          <Wallet className="w-5 h-5 text-accent-primary" />
          <h2 className="text-xl font-semibold text-text-primary">
            Wallet Guides
          </h2>
        </div>

        {walletsLoading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        ) : walletGuides ? (
          <div className="space-y-6">
            {Object.entries(walletGuides).map(([category, guides]) => (
              <div key={category}>
                <h3 className="text-xs sm:text-sm font-medium text-text-muted uppercase tracking-wider mb-3">
                  {category} Wallets
                </h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {(guides as any[]).map((guide) => {
                    const metadata = guide.metadata as {
                      pros?: string[];
                      cons?: string[];
                      priceRange?: string;
                    } | null;

                    return (
                      <Card key={guide.id} className="p-4 sm:p-5">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-bg-tertiary flex items-center justify-center flex-shrink-0">
                            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-accent-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-text-primary text-sm sm:text-base line-clamp-1">
                              {guide.title}
                            </h4>
                            {metadata?.priceRange && (
                              <span className="text-xs sm:text-sm text-text-muted">
                                {metadata.priceRange}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-text-muted mb-3 line-clamp-2">
                          {guide.content}
                        </p>

                        {metadata?.pros && metadata.pros.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {metadata.pros.slice(0, 3).map((pro, i) => (
                              <Badge key={i} variant="success" className="text-[10px] sm:text-xs px-1.5 py-0.5">
                                {pro}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </motion.section>

      {/* Other Acquisition Guides Section */}
      {otherGuides.length > 0 && (
        <motion.section
          id="acquisition"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <ShoppingCart className="w-5 h-5 text-accent-primary" />
            <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
              How to Buy Crypto
            </h2>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {otherGuides.map((guide: Tutorial, index: number) => (
              <TutorialCard
                key={guide.id}
                tutorial={guide}
                index={index}
                onClick={() => setSelectedTutorial(guide)}
              />
            ))}
          </div>
        </motion.section>
      )}

      {/* Safety Reminder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 sm:mt-12"
      >
        <Card className="p-4 sm:p-6 bg-gradient-glow border-accent-warning/20">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-xl bg-accent-warning/20 flex-shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-accent-warning" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-text-primary text-sm sm:text-base mb-1 sm:mb-2">
                Safety First
              </h3>
              <p className="text-xs sm:text-sm text-text-muted mb-3 sm:mb-4">
                Complete our security checklist before buying crypto.
              </p>
              <a href="/security">
                <Button variant="secondary" className="gap-2 text-xs sm:text-sm py-2 px-3 sm:py-2 sm:px-4">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Security Checklist
                </Button>
              </a>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
