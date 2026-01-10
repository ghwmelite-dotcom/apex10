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
  Volume2,
  VolumeX,
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
        // User cancelled or error
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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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
    return formatDate(dateString);
  };

  const categoryStyle = categoryColors[article.category] || categoryColors.market;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-bg-primary/90 backdrop-blur-xl"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full max-w-4xl max-h-[90vh] overflow-hidden",
          "bg-bg-secondary/95 backdrop-blur-sm",
          "rounded-3xl border border-border-default",
          "shadow-2xl shadow-black/50",
          "flex flex-col"
        )}
      >
        {/* Header with image */}
        <div className="relative">
          {/* Featured Image */}
          <div className="relative h-48 md:h-64 overflow-hidden">
            {article.image && !imageError ? (
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-aurora-cyan/20 via-aurora-purple/20 to-aurora-pink/20 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-text-muted/30" />
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-bg-secondary/60 to-transparent" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-bg-primary/80 backdrop-blur-sm border border-border-default text-text-muted hover:text-text-primary hover:bg-bg-primary transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Source badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-primary/80 backdrop-blur-sm border border-border-default">
              {article.sourceIcon && (
                <img
                  src={article.sourceIcon}
                  alt={article.sourceName}
                  className="w-4 h-4 rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <span className="text-sm font-medium text-text-primary">{article.sourceName}</span>
            </div>

            {/* Category badge */}
            <div className={cn(
              "absolute bottom-4 left-4 px-3 py-1 rounded-lg text-xs font-semibold",
              categoryStyle.bg,
              categoryStyle.text,
              "border",
              categoryStyle.border
            )}>
              {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-6 md:px-8 py-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border-default"
        >
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight mb-4">
            {article.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-6 pb-6 border-b border-border-default">
            {article.author && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span className="text-text-secondary">{article.author}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{formatTimeAgo(article.publishedAt)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{article.readingTime} min read</span>
            </span>
          </div>

          {/* Article content with sentence highlighting */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-text-secondary leading-relaxed text-base md:text-lg">
              {sentences.map((sentence, index) => (
                <span
                  key={index}
                  data-sentence={index}
                  className={cn(
                    "transition-all duration-200",
                    tts.isPlaying && tts.currentSentence === index
                      ? "bg-aurora-cyan/20 text-aurora-cyan rounded px-1 -mx-1"
                      : ""
                  )}
                >
                  {sentence}{" "}
                </span>
              ))}
            </p>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border-default">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-bg-tertiary text-text-muted text-sm hover:text-text-primary transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Read full article CTA */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-aurora-cyan/10 to-aurora-purple/10 border border-aurora-cyan/20">
            <p className="text-text-secondary mb-4">
              Want to read the full article with all the details?
            </p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-aurora-cyan text-bg-primary font-semibold hover:bg-aurora-cyan/90 transition-colors"
            >
              Read Full Article
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Footer with TTS controls */}
        <div className="border-t border-border-default bg-bg-tertiary/50 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* TTS Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => tts.skipBackward()}
                disabled={!tts.isPlaying}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Previous sentence"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayPause}
                className={cn(
                  "p-3 rounded-xl transition-all",
                  tts.isPlaying && !tts.isPaused
                    ? "bg-aurora-cyan text-bg-primary shadow-glow"
                    : "bg-aurora-cyan/20 text-aurora-cyan border border-aurora-cyan/30 hover:bg-aurora-cyan/30"
                )}
                aria-label={tts.isPlaying && !tts.isPaused ? "Pause" : "Listen to article"}
              >
                {tts.isPlaying && !tts.isPaused ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </motion.button>

              <button
                onClick={() => tts.skipForward()}
                disabled={!tts.isPlaying}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Next sentence"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Speed selector */}
              <div className="relative">
                <button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="px-3 py-1.5 rounded-lg bg-bg-secondary text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  {tts.rate}x
                </button>

                <AnimatePresence>
                  {showSpeedMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full left-0 mb-2 p-2 rounded-xl bg-bg-secondary border border-border-default shadow-xl"
                    >
                      {TTS_SPEED_PRESETS.map((preset) => (
                        <button
                          key={preset.value}
                          onClick={() => {
                            tts.setRate(preset.value);
                            setShowSpeedMenu(false);
                          }}
                          className={cn(
                            "block w-full px-4 py-2 text-sm text-left rounded-lg transition-colors",
                            tts.rate === preset.value
                              ? "bg-aurora-cyan/20 text-aurora-cyan"
                              : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                          )}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* TTS indicator */}
              {tts.isPlaying && !tts.isPaused && (
                <div className="flex items-center gap-1 ml-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-aurora-cyan rounded-full"
                      animate={{ height: [4, 16, 4] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Progress indicator */}
            {tts.isPlaying && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted">
                <span>{tts.currentSentence + 1} / {sentences.length}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-all"
                aria-label="Share article"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-all"
                aria-label="Open original"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
