import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Wallet, ShoppingCart, Shield, Brain, X, ExternalLink, Monitor, Smartphone, Lock, ArrowRightLeft, ArrowUpRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useWalletGuides, useAcquisitionGuides } from "@/hooks/useSecurity";
import {
  Card,
  Badge,
  Button,
  Skeleton,
} from "@/components/ui";
import { LearningPathGenerator } from "@/components/LearningPath";

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

// Tutorial Modal Component
function TutorialModal({
  tutorial,
  onClose
}: {
  tutorial: Tutorial | null;
  onClose: () => void;
}) {
  if (!tutorial) return null;

  const Icon = getTutorialIcon(tutorial.category);
  const metadata = tutorial.metadata;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-bg-secondary border border-border-primary"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-bg-secondary border-b border-border-primary p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent-primary/20">
                  <Icon className="w-6 h-6 text-accent-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary">{tutorial.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    {metadata?.platform && (
                      <Badge variant="info" className="text-xs">
                        {metadata.platform === "desktop" ? "Desktop" :
                         metadata.platform === "mobile" ? "Mobile" : "All Platforms"}
                      </Badge>
                    )}
                    {metadata?.difficulty && (
                      <Badge variant={getDifficultyColor(metadata.difficulty) as any} className="text-xs capitalize">
                        {metadata.difficulty}
                      </Badge>
                    )}
                    {metadata?.timeRequired && (
                      <span className="text-xs text-text-muted">
                        ⏱ {metadata.timeRequired}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            {/* Requirements */}
            {metadata?.requirements && metadata.requirements.length > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-bg-tertiary">
                <span className="text-xs font-medium text-text-muted uppercase">Requirements:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {metadata.requirements.map((req, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="prose prose-invert prose-sm max-w-none
              prose-headings:text-text-primary
              prose-h2:text-xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border-primary prose-h2:pb-2
              prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
              prose-h4:text-base prose-h4:font-medium prose-h4:mt-4 prose-h4:mb-2
              prose-p:text-text-secondary prose-p:leading-relaxed
              prose-strong:text-text-primary prose-strong:font-semibold
              prose-ul:my-3 prose-ul:space-y-1
              prose-ol:my-3 prose-ol:space-y-1
              prose-li:text-text-secondary
              prose-table:my-4
              prose-th:bg-bg-tertiary prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:text-text-primary
              prose-td:px-4 prose-td:py-2 prose-td:border-b prose-td:border-border-primary
              prose-code:bg-bg-tertiary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-accent-primary prose-code:text-sm
              prose-blockquote:border-l-accent-primary prose-blockquote:bg-bg-tertiary prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
            ">
              <ReactMarkdown>{tutorial.content}</ReactMarkdown>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Tutorial Card Component
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
    >
      <Card
        className={`p-6 h-full cursor-pointer hover:border-accent-primary/50 transition-all duration-200 ${
          isBinanceTutorial ? "border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent" : ""
        }`}
        onClick={onClick}
      >
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isBinanceTutorial
              ? "bg-gradient-to-br from-amber-500/20 to-amber-600/20"
              : "bg-accent-primary/20"
          }`}>
            {isBinanceTutorial ? (
              <Icon className="w-6 h-6 text-amber-500" />
            ) : (
              <span className="text-lg font-bold text-accent-primary">{index + 1}</span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {isBinanceTutorial && (
                <Badge className="text-xs bg-amber-500/20 text-amber-400 border-amber-500/30">
                  Binance
                </Badge>
              )}
              {metadata?.platform && (
                <Badge variant="info" className="text-xs">
                  {metadata.platform === "desktop" ? "Desktop" :
                   metadata.platform === "mobile" ? "Mobile" : "All"}
                </Badge>
              )}
              {metadata?.difficulty && (
                <Badge variant={getDifficultyColor(metadata.difficulty) as any} className="text-xs capitalize">
                  {metadata.difficulty}
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-text-primary">{tutorial.title}</h3>
          </div>
        </div>

        <p className="text-sm text-text-muted line-clamp-3 mb-4">
          {preview.replace(/[#*_`]/g, "").slice(0, 150)}...
        </p>

        <div className="flex items-center justify-between">
          {metadata?.timeRequired && (
            <span className="text-xs text-text-muted">⏱ {metadata.timeRequired}</span>
          )}
          <Button variant="ghost" size="sm" className="gap-1 text-accent-primary">
            Read Guide <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </Card>
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
      {/* Tutorial Modal */}
      {selectedTutorial && (
        <TutorialModal
          tutorial={selectedTutorial}
          onClose={() => setSelectedTutorial(null)}
        />
      )}

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
