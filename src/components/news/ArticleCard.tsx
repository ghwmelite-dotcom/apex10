import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, User, ExternalLink, Headphones } from "lucide-react";
import type { NewsArticle, NewsCategory } from "@/api/types";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: NewsArticle;
  onRead?: (article: NewsArticle) => void;
  onListen?: (article: NewsArticle) => void;
  featured?: boolean;
  index?: number;
}

// Category color mapping
const categoryColors: Record<Exclude<NewsCategory, "all">, { bg: string; text: string; border: string }> = {
  market: {
    bg: "bg-aurora-cyan/10",
    text: "text-aurora-cyan",
    border: "border-aurora-cyan/30",
  },
  defi: {
    bg: "bg-aurora-purple/10",
    text: "text-aurora-purple",
    border: "border-aurora-purple/30",
  },
  nft: {
    bg: "bg-aurora-pink/10",
    text: "text-aurora-pink",
    border: "border-aurora-pink/30",
  },
  regulation: {
    bg: "bg-nova-gold/10",
    text: "text-nova-gold",
    border: "border-nova-gold/30",
  },
  technology: {
    bg: "bg-aurora-blue/10",
    text: "text-aurora-blue",
    border: "border-aurora-blue/30",
  },
  analysis: {
    bg: "bg-success-green/10",
    text: "text-success-green",
    border: "border-success-green/30",
  },
};

// Format relative time
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const ArticleCard = memo(function ArticleCard({
  article,
  onRead,
  onListen,
  featured = false,
  index = 0,
}: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);
  const categoryStyle = categoryColors[article.category as Exclude<NewsCategory, "all">] || categoryColors.market;

  const handleCardClick = () => {
    onRead?.(article);
  };

  const handleListenClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onListen?.(article);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={handleCardClick}
      className={cn(
        "group relative rounded-2xl overflow-hidden cursor-pointer",
        "bg-bg-secondary/80 backdrop-blur-sm",
        "border border-border-default hover:border-aurora-cyan/30",
        "transition-all duration-300",
        "hover:shadow-glow hover:scale-[1.02]",
        featured && "md:col-span-2 lg:row-span-2"
      )}
    >
      {/* Image */}
      <div className={cn(
        "relative overflow-hidden",
        featured ? "h-64" : "h-48"
      )}>
        {article.image && !imageError ? (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-aurora-cyan/20 to-aurora-purple/20 flex items-center justify-center">
            <div className="text-4xl font-bold text-text-muted opacity-30">
              {article.sourceName.charAt(0)}
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent" />

        {/* Source badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 rounded-lg bg-bg-primary/80 backdrop-blur-sm border border-border-default">
          {article.sourceIcon && (
            <img
              src={article.sourceIcon}
              alt={article.sourceName}
              className="w-4 h-4 rounded-sm"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
          <span className="text-xs font-medium text-text-secondary">
            {article.sourceName}
          </span>
        </div>

        {/* Category badge */}
        <div className={cn(
          "absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium",
          categoryStyle.bg,
          categoryStyle.text,
          "border",
          categoryStyle.border
        )}>
          {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className={cn(
          "font-semibold text-text-primary line-clamp-2 group-hover:text-aurora-cyan transition-colors",
          featured ? "text-xl" : "text-base"
        )}>
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-text-muted line-clamp-2">
          {article.description}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-text-muted">
          <div className="flex items-center gap-3">
            {article.author && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {article.author.split(" ")[0]}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(article.publishedAt)}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-bg-tertiary">
            {article.readingTime} min read
          </span>
        </div>

        {/* Action buttons - shown on hover */}
        <div className="flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-aurora-cyan/10 border border-aurora-cyan/30 text-aurora-cyan text-sm font-medium hover:bg-aurora-cyan/20 transition-colors"
            aria-label={`Read article: ${article.title}`}
          >
            <ExternalLink className="w-4 h-4" />
            Read
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleListenClick}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-aurora-purple/10 border border-aurora-purple/30 text-aurora-purple text-sm font-medium hover:bg-aurora-purple/20 transition-colors"
            aria-label={`Listen to article: ${article.title}`}
          >
            <Headphones className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-aurora-cyan/5 to-transparent" />
      </div>
    </motion.article>
  );
});

// Skeleton loader for articles
export function ArticleCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div className={cn(
      "rounded-2xl overflow-hidden bg-bg-secondary/80 border border-border-default",
      featured && "md:col-span-2 lg:row-span-2"
    )}>
      <div className={cn("skeleton", featured ? "h-64" : "h-48")} />
      <div className="p-4 space-y-3">
        <div className="skeleton h-6 w-3/4 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="flex items-center gap-3 pt-2">
          <div className="skeleton h-4 w-20 rounded" />
          <div className="skeleton h-4 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}

export default ArticleCard;
