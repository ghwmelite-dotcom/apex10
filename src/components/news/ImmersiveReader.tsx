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
import { createPortal } from "react-dom";
import type { NewsArticle } from "@/api/types";
import { useTextToSpeech, TTS_SPEED_PRESETS } from "@/hooks/useTextToSpeech";
import { cn } from "@/lib/utils";

interface ImmersiveReaderProps {
  article: NewsArticle;
  onClose: () => void;
}

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

  const tts = useTextToSpeech({
    onSentenceChange: (index) => {
      const sentenceEl = contentRef.current?.querySelector(`[data-sentence="${index}"]`);
      sentenceEl?.scrollIntoView({ behavior: "smooth", block: "center" });
    },
  });

  const sentences = article.content
    .replace(/([.!?])\s+/g, "$1|SPLIT|")
    .split("|SPLIT|")
    .filter((s) => s.trim().length > 0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, url: article.url });
      } catch {}
    } else {
      navigator.clipboard.writeText(article.url);
    }
  }, [article]);

  const handlePlayPause = useCallback(() => {
    if (tts.isPlaying) {
      tts.isPaused ? tts.resume() : tts.pause();
    } else {
      tts.speak(article.content);
    }
  }, [tts, article.content]);

  const formatTimeAgo = (dateString: string) => {
    const diffHours = Math.floor((Date.now() - new Date(dateString).getTime()) / 3600000);
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 168) return `${Math.floor(diffHours / 24)}d ago`;
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const categoryStyle = categoryColors[article.category] || categoryColors.market;

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 sm:p-6"
      style={{ zIndex: 9999 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg md:max-w-xl bg-[#0d1117] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image */}
        <div className="relative h-40 sm:h-48 bg-gray-900">
          {article.image && !imageError ? (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-900/30 to-purple-900/30">
              <BookOpen className="w-12 h-12 text-gray-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] to-transparent" />

          {/* Source */}
          <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/70 text-white text-xs font-medium">
            {article.sourceName}
          </div>

          {/* Category */}
          <div className={cn(
            "absolute bottom-3 left-3 px-2 py-1 rounded-full text-xs font-semibold border",
            categoryStyle.bg, categoryStyle.text, categoryStyle.border
          )}>
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="p-4 sm:p-5">
          <h1 className="text-lg sm:text-xl font-bold text-white mb-3">{article.title}</h1>

          <div className="flex items-center gap-3 text-xs text-gray-400 mb-4 pb-4 border-b border-gray-800">
            {article.author && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {article.author.split(' by ').pop()}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatTimeAgo(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readingTime} min
            </span>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed mb-5">
            {sentences.map((sentence, index) => (
              <span
                key={index}
                data-sentence={index}
                className={tts.isPlaying && tts.currentSentence === index ? "bg-cyan-500/20 text-cyan-400" : ""}
              >
                {sentence}{" "}
              </span>
            ))}
          </p>

          {/* CTA */}
          <div className="flex gap-2">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 text-black font-semibold text-sm hover:bg-cyan-400 transition-colors"
            >
              Read Full Article
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-gray-800 text-gray-400 hover:text-white transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TTS Controls */}
        <div className="border-t border-gray-800 bg-gray-900/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => tts.skipBackward()}
                disabled={!tts.isPlaying}
                className="p-1.5 text-gray-500 hover:text-white disabled:opacity-40"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={handlePlayPause}
                className={cn(
                  "p-2.5 rounded-xl transition-colors",
                  tts.isPlaying && !tts.isPaused
                    ? "bg-cyan-500 text-black"
                    : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                )}
              >
                {tts.isPlaying && !tts.isPaused ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={() => tts.skipForward()}
                disabled={!tts.isPlaying}
                className="p-1.5 text-gray-500 hover:text-white disabled:opacity-40"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="px-2 py-1 rounded-lg bg-gray-800 text-xs text-gray-400"
                >
                  {tts.rate}x
                </button>
                {showSpeedMenu && (
                  <div className="absolute bottom-full left-0 mb-1 p-1 rounded-lg bg-gray-800 border border-gray-700 shadow-lg">
                    {TTS_SPEED_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => { tts.setRate(preset.value); setShowSpeedMenu(false); }}
                        className={cn(
                          "block w-full px-3 py-1 text-xs text-left rounded",
                          tts.rate === preset.value ? "bg-cyan-500/20 text-cyan-400" : "text-gray-400 hover:bg-gray-700"
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {tts.isPlaying && (
              <span className="text-xs text-gray-500">{tts.currentSentence + 1}/{sentences.length}</span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
