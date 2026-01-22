import { motion } from "framer-motion";
import { Newspaper, ExternalLink, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  url: string;
  timestamp: Date;
  category: "ripple" | "xrp" | "regulatory" | "partnership";
}

// Placeholder news - in production this would come from a news API
const PLACEHOLDER_NEWS: NewsArticle[] = [
  {
    id: "1",
    title: "Ripple Expands ODL Partnership in Asia Pacific Region",
    source: "CoinDesk",
    url: "#",
    timestamp: new Date(Date.now() - 3600000),
    category: "partnership",
  },
  {
    id: "2",
    title: "XRP Ledger Sees Record Transaction Volume in Q1",
    source: "The Block",
    url: "#",
    timestamp: new Date(Date.now() - 7200000),
    category: "xrp",
  },
  {
    id: "3",
    title: "SEC vs Ripple: Latest Court Developments Analyzed",
    source: "Bloomberg",
    url: "#",
    timestamp: new Date(Date.now() - 14400000),
    category: "regulatory",
  },
  {
    id: "4",
    title: "Ripple CEO Comments on Crypto Regulatory Clarity",
    source: "CNBC",
    url: "#",
    timestamp: new Date(Date.now() - 21600000),
    category: "ripple",
  },
  {
    id: "5",
    title: "XRPL Foundation Announces New Developer Grants Program",
    source: "Decrypt",
    url: "#",
    timestamp: new Date(Date.now() - 28800000),
    category: "xrp",
  },
];

interface XRPNewsSectionProps {
  articles?: NewsArticle[];
  isLoading?: boolean;
  compact?: boolean;
}

export function XRPNewsSection({
  articles = PLACEHOLDER_NEWS,
  isLoading,
  compact = false,
}: XRPNewsSectionProps) {
  const categoryConfig = {
    ripple: { color: "text-xrp-cyan", bg: "bg-xrp-cyan/10", label: "Ripple" },
    xrp: { color: "text-aurora-purple", bg: "bg-aurora-purple/10", label: "XRP" },
    regulatory: { color: "text-solar-gold", bg: "bg-solar-gold/10", label: "Regulatory" },
    partnership: { color: "text-quantum-green", bg: "bg-quantum-green/10", label: "Partnership" },
  };

  const formatTime = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / 3600000);
    if (hours < 1) return "< 1h ago";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const displayArticles = compact ? articles.slice(0, 4) : articles;

  return (
    <div className="rounded-2xl bg-bg-secondary/50 border border-xrp-cyan/10 overflow-hidden">
      <div className="p-4 border-b border-border-default flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-xrp-cyan/10">
            <Newspaper className="w-4 h-4 text-xrp-cyan" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">XRP News</h3>
            <p className="text-xs text-text-muted">Latest from Ripple & XRP</p>
          </div>
        </div>
        {!compact && (
          <a
            href="/news?filter=xrp"
            className="flex items-center gap-1 text-xs text-xrp-cyan hover:underline"
          >
            All News
            <ArrowRight className="w-3 h-3" />
          </a>
        )}
      </div>

      <div className="divide-y divide-border-default">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 animate-pulse">
              <div className="h-4 bg-bg-tertiary rounded w-full mb-2" />
              <div className="h-3 bg-bg-tertiary rounded w-2/3" />
            </div>
          ))
        ) : (
          displayArticles.map((article, index) => (
            <motion.a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="block p-4 hover:bg-bg-tertiary/50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm text-text-primary font-medium line-clamp-2 group-hover:text-xrp-cyan transition-colors">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded",
                        categoryConfig[article.category].bg,
                        categoryConfig[article.category].color
                      )}
                    >
                      {categoryConfig[article.category].label}
                    </span>
                    <span className="text-xs text-text-muted">{article.source}</span>
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <Clock className="w-3 h-3" />
                      {formatTime(article.timestamp)}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            </motion.a>
          ))
        )}
      </div>

      {compact && (
        <div className="p-3 border-t border-border-default bg-bg-tertiary/30">
          <a
            href="/xrp#news"
            className="flex items-center justify-center gap-1 text-xs text-xrp-cyan hover:underline"
          >
            View All XRP News
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}
