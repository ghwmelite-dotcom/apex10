import { useEffect, useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowLeft,
  ExternalLink,
  Share2,
  Clock,
  User,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Settings,
  ChevronDown,
} from "lucide-react";
import type { NewsArticle } from "@/api/types";
import { useTextToSpeech, TTS_SPEED_PRESETS } from "@/hooks/useTextToSpeech";
import { cn } from "@/lib/utils";

interface ImmersiveReaderProps {
  article: NewsArticle;
  onClose: () => void;
}

export default function ImmersiveReader({ article, onClose }: ImmersiveReaderProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTTSSettings, setShowTTSSettings] = useState(false);

  // Text-to-speech hook
  const tts = useTextToSpeech({
    onSentenceChange: (index) => {
      // Scroll to highlighted sentence
      const sentenceEl = contentRef.current?.querySelector(`[data-sentence="${index}"]`);
      sentenceEl?.scrollIntoView({ behavior: "smooth", block: "center" });
    },
    onComplete: () => {
      // Optional: auto-close or show completion message
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
      } else if (e.key === " " && !e.target) {
        e.preventDefault();
        if (tts.isPlaying) {
          tts.isPaused ? tts.resume() : tts.pause();
        } else {
          tts.speak(article.content);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, tts, article.content]);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    const content = contentRef.current;
    content?.addEventListener("scroll", handleScroll);
    return () => content?.removeEventListener("scroll", handleScroll);
  }, []);

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
      // Fallback: copy to clipboard
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
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-bg-primary"
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-bg-secondary z-10">
        <motion.div
          className="h-full bg-gradient-to-r from-aurora-cyan to-aurora-purple"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-bg-primary/95 backdrop-blur-sm border-b border-border-default">
        <div className="container max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors"
            aria-label="Close reader"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span className="hidden sm:inline">{Math.round(scrollProgress)}% read</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors"
              aria-label="Open original article"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors"
              aria-label="Share article"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div
        ref={contentRef}
        className="h-[calc(100vh-64px-80px)] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border-default"
      >
        <article className="container max-w-3xl mx-auto px-4 py-8">
          {/* Source */}
          <div className="flex items-center gap-3 mb-6">
            {article.sourceIcon && (
              <img
                src={article.sourceIcon}
                alt={article.sourceName}
                className="w-6 h-6 rounded"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            <span className="text-sm font-medium text-aurora-cyan">{article.sourceName}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight mb-6">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-8 pb-8 border-b border-border-default">
            {article.author && (
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {article.author}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {formatDate(article.publishedAt)}
            </span>
            <span className="px-3 py-1 rounded-full bg-bg-secondary text-text-secondary">
              {article.readingTime} min read
            </span>
          </div>

          {/* Featured image */}
          {article.image && (
            <div className="mb-8 rounded-2xl overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Article content with sentence highlighting */}
          <div className="prose prose-invert max-w-none">
            {sentences.map((sentence, index) => (
              <span
                key={index}
                data-sentence={index}
                className={cn(
                  "transition-all duration-200",
                  tts.isPlaying && tts.currentSentence === index
                    ? "bg-aurora-cyan/10 border-l-2 border-aurora-cyan pl-4 -ml-4 block py-1"
                    : ""
                )}
              >
                {sentence}{" "}
              </span>
            ))}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border-default">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-bg-secondary text-text-muted text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>

      {/* TTS Controls Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg-secondary/95 backdrop-blur-sm border-t border-border-default">
        <div className="container max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Playback controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => tts.skipBackward()}
                disabled={!tts.isPlaying}
                className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous sentence"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayPause}
                className={cn(
                  "p-3 rounded-xl transition-colors",
                  tts.isPlaying
                    ? "bg-aurora-cyan text-bg-primary"
                    : "bg-aurora-cyan/20 text-aurora-cyan border border-aurora-cyan/30"
                )}
                aria-label={tts.isPlaying && !tts.isPaused ? "Pause" : "Play"}
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
                className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next sentence"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Progress */}
            <div className="flex-1 mx-4">
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-muted w-10">
                  {tts.currentSentence + 1}/{tts.totalSentences || sentences.length}
                </span>
                <div className="flex-1 h-1 bg-bg-tertiary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-aurora-cyan"
                    style={{ width: `${tts.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Speed & Voice settings */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const currentIndex = TTS_SPEED_PRESETS.findIndex((p) => p.value === tts.rate);
                  const nextIndex = (currentIndex + 1) % TTS_SPEED_PRESETS.length;
                  tts.setRate(TTS_SPEED_PRESETS[nextIndex].value);
                }}
                className="px-3 py-1.5 rounded-lg bg-bg-tertiary text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Change playback speed"
              >
                {tts.rate}x
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowTTSSettings(!showTTSSettings)}
                  className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                  aria-label="TTS settings"
                >
                  <Settings className="w-5 h-5" />
                </button>

                <AnimatePresence>
                  {showTTSSettings && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full right-0 mb-2 w-64 p-4 rounded-xl bg-bg-secondary border border-border-default shadow-xl"
                    >
                      <h4 className="text-sm font-medium text-text-primary mb-3">Voice Settings</h4>

                      {/* Voice selector */}
                      <div className="mb-4">
                        <label className="text-xs text-text-muted block mb-2">Voice</label>
                        <div className="relative">
                          <select
                            value={tts.voice?.voiceURI || ""}
                            onChange={(e) => {
                              const voice = tts.availableVoices.find(
                                (v) => v.voiceURI === e.target.value
                              );
                              if (voice) tts.setVoice(voice);
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-bg-tertiary border border-border-default text-sm text-text-primary appearance-none cursor-pointer"
                          >
                            {tts.availableVoices.map((voice) => (
                              <option key={voice.voiceURI} value={voice.voiceURI}>
                                {voice.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                        </div>
                      </div>

                      {/* Speed selector */}
                      <div>
                        <label className="text-xs text-text-muted block mb-2">Speed</label>
                        <div className="flex gap-1">
                          {TTS_SPEED_PRESETS.map((preset) => (
                            <button
                              key={preset.value}
                              onClick={() => tts.setRate(preset.value)}
                              className={cn(
                                "flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors",
                                tts.rate === preset.value
                                  ? "bg-aurora-cyan/20 text-aurora-cyan border border-aurora-cyan/30"
                                  : "bg-bg-tertiary text-text-muted hover:text-text-primary"
                              )}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {!tts.isSupported && (
                        <p className="mt-3 text-xs text-nova-red">
                          Text-to-speech is not supported in your browser.
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Volume2 className="w-5 h-5 text-text-muted hidden sm:block" />
            </div>
          </div>

          {/* Waveform animation (visible when playing) */}
          <AnimatePresence>
            {tts.isPlaying && !tts.isPaused && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-center gap-1 mt-3"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-aurora-cyan rounded-full"
                    animate={{
                      height: [8, 24, 8],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
