import { useEffect, useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Share2,
  Clock,
  User,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  BookOpen,
  Calendar,
} from "lucide-react";
import type { NewsArticle } from "@/api/types";
import { useTextToSpeech, TTS_SPEED_PRESETS } from "@/hooks/useTextToSpeech";
import { cn } from "@/lib/utils";

interface ImmersiveReaderProps {
  article: NewsArticle;
  onClose: () => void;
}

// Category color mapping
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  market: { bg: "bg-aurora-cyan/10", text: "text-aurora-cyan", border: "border-aurora-cyan/30" },
  defi: { bg: "bg-aurora-purple/10", text: "text-aurora-purple", border: "border-aurora-purple/30" },
  nft: { bg: "bg-aurora-pink/10", text: "text-aurora-pink", border: "border-aurora-pink/30" },
  regulation: { bg: "bg-nova-gold/10", text: "text-nova-gold", border: "border-nova-gold/30" },
  technology: { bg: "bg-aurora-blue/10", text: "text-aurora-blue", border: "border-aurora-blue/30" },
  analysis: { bg: "bg-success-green/10", text: "text-success-green", border: "border-success-green/30" },
};

export default function ImmersiveReader({ article, onClose }: ImmersiveReaderProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // Text-to-speech hook
  const tts = useTextToSpeech({
    onSentenceChange: (index) => {
      const sentenceEl = contentRef.current?.querySelector(`[data-sentence="${index}"]`);
      sentenceEl?.scrollIntoView({ behavior: "smooth", block: "center" });
    },
  });

  // Split content into sentences for highlighting
  const sentences = article.content
    .replace(/([.!?])\s+/g, "$1|SPLIT|")
    .split("|SPLIT|")
    .filter((s) => s.trim().length > 0);

  // Lock body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Get scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === " " && e.target === document.body) {
        e.preventDefault();
        handlePlayPause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, tts]);

  // Handle share
  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url,
        });
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(article.url);
    }
  }, [article]);

  // Handle play/pause toggle
  const handlePlayPause = useCallback(() => {
    if (tts.isPlaying) {
      tts.isPaused ? tts.resume() : tts.pause();
    } else {
      tts.speak(article.content);
    }
  }, [tts, article.content]);

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const categoryStyle = categoryColors[article.category] || categoryColors.market;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] overflow-y-auto"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" />

      {/* Modal Container */}
      <div className="relative min-h-full flex items-center justify-center p-4 sm:p-6 md:p-8">
        {/* Modal */}
        <motion.article
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "relative w-full max-w-lg md:max-w-xl lg:max-w-2xl",
            "bg-bg-primary rounded-2xl",
            "border border-border-default",
            "shadow-2xl shadow-black/50",
            "overflow-hidden"
          )}
        >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-1.5 sm:p-2 rounded-full bg-black/60 backdrop-blur-sm text-white/90 hover:text-white hover:bg-black/80 transition-all"
              aria-label="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Featured Image */}
            <div className="relative h-32 xs:h-36 sm:h-44 md:h-52 overflow-hidden">
              {article.image && !imageError ? (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-aurora-cyan/20 via-aurora-purple/20 to-aurora-pink/20 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-text-muted/30" />
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/20 to-transparent" />

              {/* Source badge */}
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">
                {article.sourceIcon && (
                  <img
                    src={article.sourceIcon}
                    alt={article.sourceName}
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                <span className="text-[10px] sm:text-xs font-medium text-white">{article.sourceName}</span>
              </div>

              {/* Category badge */}
              <div className={cn(
                "absolute bottom-2 left-2 sm:bottom-3 sm:left-3 px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold",
                categoryStyle.bg,
                categoryStyle.text,
                "border",
                categoryStyle.border
              )}>
                {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
              </div>
            </div>

            {/* Content */}
            <div ref={contentRef} className="p-3 sm:p-4 md:p-5">
              {/* Title */}
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-text-primary leading-snug mb-2 sm:mb-3">
                {article.title}
              </h1>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-text-muted mb-3 pb-3 border-b border-border-default">
                {article.author && (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span className="truncate max-w-[100px] sm:max-w-[150px]">
                      {article.author.split(' by ').pop()}
                    </span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatTimeAgo(article.publishedAt)}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{article.readingTime} min</span>
                </span>
              </div>

              {/* Article content */}
              <div className="text-text-secondary leading-relaxed text-xs sm:text-sm md:text-base mb-4">
                {sentences.map((sentence, index) => (
                  <span
                    key={index}
                    data-sentence={index}
                    className={cn(
                      "transition-all duration-200",
                      tts.isPlaying && tts.currentSentence === index
                        ? "bg-aurora-cyan/20 text-aurora-cyan rounded px-0.5"
                        : ""
                    )}
                  >
                    {sentence}{" "}
                  </span>
                ))}
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-4">
                  {article.tags.slice(0, 4).map((tag, i) => (
                    <span
                      key={i}
                      className="px-1.5 sm:px-2 py-0.5 rounded-full bg-bg-secondary text-text-muted text-[10px] sm:text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-aurora-cyan text-bg-primary font-semibold text-xs sm:text-sm hover:bg-aurora-cyan/90 transition-colors"
                >
                  Read Full Article
                  <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
                <button
                  onClick={handleShare}
                  className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-bg-secondary border border-border-default text-text-muted hover:text-text-primary transition-all"
                  aria-label="Share"
                >
                  <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* TTS Controls */}
            <div className="border-t border-border-default bg-bg-secondary/50 px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center justify-between">
                {/* Controls */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => tts.skipBackward()}
                    disabled={!tts.isPlaying}
                    className="p-1 sm:p-1.5 rounded-lg text-text-muted hover:text-text-primary disabled:opacity-40 transition-all"
                    aria-label="Previous"
                  >
                    <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlayPause}
                    className={cn(
                      "p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all",
                      tts.isPlaying && !tts.isPaused
                        ? "bg-aurora-cyan text-bg-primary"
                        : "bg-aurora-cyan/20 text-aurora-cyan border border-aurora-cyan/30"
                    )}
                    aria-label={tts.isPlaying && !tts.isPaused ? "Pause" : "Listen"}
                  >
                    {tts.isPlaying && !tts.isPaused ? (
                      <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    ) : (
                      <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
                    )}
                  </motion.button>

                  <button
                    onClick={() => tts.skipForward()}
                    disabled={!tts.isPlaying}
                    className="p-1 sm:p-1.5 rounded-lg text-text-muted hover:text-text-primary disabled:opacity-40 transition-all"
                    aria-label="Next"
                  >
                    <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  {/* Speed */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                      className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-bg-tertiary text-[10px] sm:text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {tts.rate}x
                    </button>

                    <AnimatePresence>
                      {showSpeedMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute bottom-full left-0 mb-1 p-1 rounded-lg bg-bg-secondary border border-border-default shadow-lg z-10"
                        >
                          {TTS_SPEED_PRESETS.map((preset) => (
                            <button
                              key={preset.value}
                              onClick={() => {
                                tts.setRate(preset.value);
                                setShowSpeedMenu(false);
                              }}
                              className={cn(
                                "block w-full px-2 sm:px-3 py-1 text-[10px] sm:text-xs text-left rounded transition-colors whitespace-nowrap",
                                tts.rate === preset.value
                                  ? "bg-aurora-cyan/20 text-aurora-cyan"
                                  : "text-text-secondary hover:bg-bg-tertiary"
                              )}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Playing indicator */}
                  {tts.isPlaying && !tts.isPaused && (
                    <div className="hidden xs:flex items-center gap-0.5 ml-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-0.5 bg-aurora-cyan rounded-full"
                          animate={{ height: [3, 10, 3] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Progress */}
                {tts.isPlaying && (
                  <span className="text-[10px] sm:text-xs text-text-muted">
                    {tts.currentSentence + 1}/{sentences.length}
                  </span>
                )}
            </div>
          </div>
        </motion.article>
      </div>
    </motion.div>
  );
}
