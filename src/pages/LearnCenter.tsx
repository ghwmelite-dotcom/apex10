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

// Tutorial Card Component - Enhanced visual design
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

  // Get first paragraph as preview
  const preview = tutorial.content.split("\n").find(line =>
    line.trim() && !line.startsWith("#") && !line.startsWith("-")
  ) || tutorial.content.slice(0, 150);

  // Get step count from content
  const stepCount = (tutorial.content.match(/^## Step \d+/gm) || []).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <div
        className={`relative h-full p-6 rounded-2xl cursor-pointer transition-all duration-300 group overflow-hidden ${
          isBinanceTutorial
            ? "bg-gradient-to-br from-amber-500/[0.08] via-amber-600/[0.04] to-transparent border border-amber-500/20 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10"
            : "bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 hover:border-white/20"
        }`}
        onClick={onClick}
      >
        {/* Decorative gradient orb */}
        <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          isBinanceTutorial ? "bg-amber-500/20" : "bg-cyan-500/10"
        }`} />

        {/* Header */}
        <div className="relative flex items-start gap-4 mb-5">
          <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
            isBinanceTutorial
              ? "bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/20"
              : "bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/20"
          }`}>
            <Icon className={`w-7 h-7 ${isBinanceTutorial ? "text-black" : "text-cyan-400"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {metadata?.platform && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider ${
                  isBinanceTutorial
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "bg-white/5 text-gray-400 border border-white/10"
                }`}>
                  {metadata.platform === "desktop" ? <Monitor className="w-3 h-3" /> :
                   metadata.platform === "mobile" ? <Smartphone className="w-3 h-3" /> : null}
                  {metadata.platform === "desktop" ? "Desktop" :
                   metadata.platform === "mobile" ? "Mobile" : "All"}
                </span>
              )}
              {metadata?.difficulty && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider ${
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
            <h3 className="font-semibold text-white leading-tight line-clamp-2 group-hover:text-amber-400 transition-colors">
              {tutorial.title.replace("Binance ", "").replace(": Complete Guide", "")}
            </h3>
          </div>
        </div>

        {/* Preview text */}
        <p className="relative text-sm text-gray-400 line-clamp-2 mb-5 leading-relaxed">
          {preview.replace(/[#*_`]/g, "").trim().slice(0, 120)}...
        </p>

        {/* Footer */}
        <div className="relative flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            {metadata?.timeRequired && (
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                {metadata.timeRequired}
              </span>
            )}
            {stepCount > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <Sparkles className="w-3.5 h-3.5" />
                {stepCount} steps
              </span>
            )}
          </div>
          <button className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
            isBinanceTutorial
              ? "text-amber-500 group-hover:text-amber-400"
              : "text-cyan-500 group-hover:text-cyan-400"
          }`}>
            Start Guide
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
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
    <div className="container-custom py-8">
      {/* Tutorial Reader - Full screen immersive experience */}
      <TutorialReader
        tutorial={selectedTutorial}
        onClose={() => setSelectedTutorial(null)}
      />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-accent-secondary/20 to-accent-primary/20">
            <BookOpen className="w-6 h-6 text-accent-secondary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Learn Center</h1>
            <p className="text-text-muted">
              Step-by-step guides for safe crypto acquisition and management
            </p>
          </div>
        </div>
      </motion.div>

      {/* AI-Powered Learning Path */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-12"
      >
        <Card className="p-6 bg-gradient-to-br from-aurora-purple/5 to-aurora-cyan/5 border-aurora-purple/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-aurora-purple/20 to-aurora-cyan/20">
              <Brain className="w-6 h-6 text-aurora-purple" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                Personalized Learning Path
                <Badge variant="info" className="text-xs">AI Powered</Badge>
              </h2>
              <p className="text-sm text-text-muted">
                Get a customized curriculum tailored to your interests and experience
              </p>
            </div>
          </div>
          <LearningPathGenerator />
        </Card>
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
          <div className="flex items-center gap-3 mb-6">
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
            <div>
              <h2 className="text-xl font-semibold text-text-primary">
                Binance Setup Tutorials
              </h2>
              <p className="text-sm text-text-muted">
                Complete step-by-step guides for setting up and using Binance
              </p>
            </div>
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              {binanceTutorials.length} Guides
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        ) : walletGuides ? (
          <div className="space-y-8">
            {Object.entries(walletGuides).map(([category, guides]) => (
              <div key={category}>
                <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-4">
                  {category} Wallets
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(guides as any[]).map((guide) => {
                    const metadata = guide.metadata as {
                      pros?: string[];
                      cons?: string[];
                      priceRange?: string;
                    } | null;

                    return (
                      <Card key={guide.id} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-bg-tertiary flex items-center justify-center">
                              <Wallet className="w-6 h-6 text-accent-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-text-primary">
                                {guide.title}
                              </h4>
                              {metadata?.priceRange && (
                                <span className="text-sm text-text-muted">
                                  {metadata.priceRange}
                                </span>
                              )}
                            </div>
                          </div>
                          <Badge variant="info">{category}</Badge>
                        </div>

                        <p className="text-sm text-text-muted mb-4">
                          {guide.content}
                        </p>

                        {metadata?.pros && (
                          <div className="mb-3">
                            <span className="text-xs font-medium text-accent-success">
                              Pros:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {metadata.pros.map((pro, i) => (
                                <Badge key={i} variant="success" className="text-xs">
                                  {pro}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {metadata?.cons && (
                          <div>
                            <span className="text-xs font-medium text-accent-warning">
                              Cons:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {metadata.cons.map((con, i) => (
                                <Badge key={i} variant="warning" className="text-xs">
                                  {con}
                                </Badge>
                              ))}
                            </div>
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
          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart className="w-5 h-5 text-accent-primary" />
            <h2 className="text-xl font-semibold text-text-primary">
              How to Buy Crypto
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        className="mt-12"
      >
        <Card className="p-6 bg-gradient-glow border-accent-warning/20">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-accent-warning/20">
              <Shield className="w-6 h-6 text-accent-warning" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-2">
                Safety First
              </h3>
              <p className="text-sm text-text-muted mb-4">
                Before buying crypto, make sure you've completed our security
                checklist. Never invest more than you can afford to lose, and
                always store your assets securely.
              </p>
              <a href="/security">
                <Button variant="secondary" className="gap-2">
                  <Shield className="w-4 h-4" />
                  View Security Checklist
                </Button>
              </a>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
