import { useState, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Newspaper,
  Radio,
  Filter,
  ChevronDown,
  RefreshCw,
  Sparkles,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useNewsFeed, useTrendingNews, useNewsSources, useNewsCategories } from "@/hooks/useNews";
import { ArticleCard, ArticleCardSkeleton } from "@/components/news/ArticleCard";
import type { NewsArticle, NewsCategory, NewsSource } from "@/api/types";
import { cn } from "@/lib/utils";
import { FloatingOrbs } from "@/components/ParticleBackground";

// Lazy load the immersive reader to reduce initial bundle
const ImmersiveReader = lazy(() => import("@/components/news/ImmersiveReader"));

// Category icons and colors
const categoryConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  all: { icon: <Sparkles className="w-4 h-4" />, color: "aurora-cyan" },
  market: { icon: <TrendingUp className="w-4 h-4" />, color: "aurora-cyan" },
  defi: { icon: <Sparkles className="w-4 h-4" />, color: "aurora-purple" },
  nft: { icon: <Sparkles className="w-4 h-4" />, color: "aurora-pink" },
  regulation: { icon: <AlertCircle className="w-4 h-4" />, color: "nova-gold" },
  technology: { icon: <Sparkles className="w-4 h-4" />, color: "aurora-blue" },
  analysis: { icon: <Sparkles className="w-4 h-4" />, color: "success-green" },
};

export default function NewsHub() {
  // State
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>("all");
  const [selectedSource, setSelectedSource] = useState<NewsSource>("all");
  const [page, setPage] = useState(1);
  const [readerArticle, setReaderArticle] = useState<NewsArticle | null>(null);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);

  // Data fetching
  const {
    data: feedData,
    isLoading: feedLoading,
    error: feedError,
    refetch,
    isFetching,
  } = useNewsFeed({
    category: selectedCategory,
    source: selectedSource,
    page,
    limit: 20,
  });

  const { data: trending } = useTrendingNews(5);
  const { data: sources } = useNewsSources();
  const { data: categories } = useNewsCategories();

  // Handlers
  const handleCategoryChange = useCallback((category: NewsCategory) => {
    setSelectedCategory(category);
    setPage(1);
  }, []);

  const handleSourceChange = useCallback((source: NewsSource) => {
    setSelectedSource(source);
    setShowSourceDropdown(false);
    setPage(1);
  }, []);

  const handleReadArticle = useCallback((article: NewsArticle) => {
    setReaderArticle(article);
  }, []);

  const handleListenArticle = useCallback((article: NewsArticle) => {
    setReaderArticle(article);
  }, []);

  const handleCloseReader = useCallback(() => {
    setReaderArticle(null);
  }, []);

  const handleLoadMore = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  return (
    <div className="container-custom py-8 relative min-h-screen">
      <FloatingOrbs />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-aurora-purple/20 to-aurora-pink/20 border border-aurora-purple/30 shadow-glow">
              <Newspaper className="w-8 h-8 text-aurora-purple" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="aurora-text">Crypto</span>{" "}
                <span className="text-text-primary">News</span>
              </h1>
              <p className="text-text-muted mt-1">
                Real-time news from top crypto sources
              </p>
            </div>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-green/10 border border-success-green/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success-green" />
              </span>
              <span className="text-sm font-medium text-success-green">Live</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => refetch()}
              disabled={isFetching}
              className={cn(
                "p-2 rounded-xl bg-bg-secondary border border-border-default",
                "hover:border-aurora-cyan/30 transition-all",
                isFetching && "animate-spin"
              )}
              aria-label="Refresh news"
            >
              <RefreshCw className="w-5 h-5 text-text-muted" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Trending Section */}
      {trending && trending.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Radio className="w-5 h-5 text-nova-red" />
            <h2 className="text-lg font-semibold text-text-primary">Trending Now</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border-default">
            {trending.map((article, i) => (
              <motion.button
                key={article.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleReadArticle(article)}
                className="flex-shrink-0 w-72 p-4 rounded-xl bg-bg-secondary/80 border border-border-default hover:border-aurora-cyan/30 text-left transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-aurora-cyan/10 flex items-center justify-center text-aurora-cyan font-bold text-sm">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-text-primary line-clamp-2 group-hover:text-aurora-cyan transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-1">{article.sourceName}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>
      )}

      {/* Filters Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(categories || [
            { id: "all", name: "All", count: 0 },
            { id: "market", name: "Market", count: 0 },
            { id: "defi", name: "DeFi", count: 0 },
            { id: "nft", name: "NFT", count: 0 },
            { id: "regulation", name: "Regulation", count: 0 },
            { id: "technology", name: "Technology", count: 0 },
            { id: "analysis", name: "Analysis", count: 0 },
          ]).map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryChange(cat.id as NewsCategory)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                selectedCategory === cat.id
                  ? "bg-aurora-cyan/20 text-aurora-cyan border border-aurora-cyan/30 shadow-glow-sm"
                  : "bg-bg-secondary/80 text-text-muted border border-border-default hover:border-text-muted/30"
              )}
            >
              {categoryConfig[cat.id]?.icon}
              {cat.name}
              {cat.count > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-bg-tertiary text-xs">
                  {cat.count}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Source Filter Dropdown */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowSourceDropdown(!showSourceDropdown)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-secondary/80 border border-border-default hover:border-aurora-cyan/30 transition-all text-sm"
            >
              <Filter className="w-4 h-4 text-text-muted" />
              <span className="text-text-secondary">
                Source: <span className="text-text-primary font-medium">
                  {selectedSource === "all" ? "All Sources" : sources?.find(s => s.id === selectedSource)?.name || selectedSource}
                </span>
              </span>
              <ChevronDown className={cn(
                "w-4 h-4 text-text-muted transition-transform",
                showSourceDropdown && "rotate-180"
              )} />
            </button>

            <AnimatePresence>
              {showSourceDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-64 p-2 rounded-xl bg-bg-secondary border border-border-default shadow-xl z-50"
                >
                  <button
                    onClick={() => handleSourceChange("all")}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors",
                      selectedSource === "all"
                        ? "bg-aurora-cyan/10 text-aurora-cyan"
                        : "text-text-secondary hover:bg-bg-tertiary"
                    )}
                  >
                    <Sparkles className="w-4 h-4" />
                    All Sources
                  </button>
                  {sources?.map((source) => (
                    <button
                      key={source.id}
                      onClick={() => handleSourceChange(source.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors",
                        selectedSource === source.id
                          ? "bg-aurora-cyan/10 text-aurora-cyan"
                          : "text-text-secondary hover:bg-bg-tertiary"
                      )}
                    >
                      {source.icon && (
                        <img
                          src={source.icon}
                          alt={source.name}
                          className="w-4 h-4 rounded-sm"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      {source.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results count */}
          <span className="text-sm text-text-muted">
            {feedData?.total || 0} articles
          </span>
        </div>
      </motion.section>

      {/* Error State */}
      {feedError && (
        <div className="p-8 rounded-2xl bg-nova-red/10 border border-nova-red/30 text-center mb-8">
          <AlertCircle className="w-12 h-12 text-nova-red mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">Failed to load news</h3>
          <p className="text-text-muted mb-4">Please try again later</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => refetch()}
            className="px-6 py-2 rounded-xl bg-aurora-cyan/20 border border-aurora-cyan/30 text-aurora-cyan font-medium"
          >
            Try Again
          </motion.button>
        </div>
      )}

      {/* Articles Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {feedLoading ? (
          // Loading skeletons
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <ArticleCardSkeleton key={i} featured={i === 0} />
            ))}
          </>
        ) : (
          // Actual articles
          feedData?.articles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              onRead={handleReadArticle}
              onListen={handleListenArticle}
              featured={index === 0 && page === 1}
              index={index}
            />
          ))
        )}
      </motion.section>

      {/* Load More */}
      {feedData?.hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLoadMore}
            disabled={isFetching}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-aurora-cyan/20 to-aurora-purple/20 border border-aurora-cyan/30 text-aurora-cyan font-medium hover:shadow-glow transition-all"
          >
            {isFetching ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Loading...
              </span>
            ) : (
              "Load More Articles"
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Empty State */}
      {!feedLoading && feedData?.articles.length === 0 && (
        <div className="py-16 text-center">
          <Newspaper className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No articles found</h3>
          <p className="text-text-muted">Try adjusting your filters</p>
        </div>
      )}

      {/* Immersive Reader Modal */}
      <Suspense fallback={null}>
        <AnimatePresence>
          {readerArticle && (
            <ImmersiveReader
              article={readerArticle}
              onClose={handleCloseReader}
            />
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  );
}
