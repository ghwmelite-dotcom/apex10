import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { formatUsd, cn } from "@/lib/utils";
import type { RankedAsset, PriceData } from "@/types";

interface EssentialNineProps {
  assets: RankedAsset[];
  prices?: Record<string, PriceData>;
  isLoading?: boolean;
}

export function EssentialNine({ assets, prices, isLoading }: EssentialNineProps) {
  // Filter out XRP (rank 0 or symbol XRP) and take the remaining 9
  const essentialAssets = assets
    .filter((a) => a.symbol !== "XRP" && a.rank > 0)
    .slice(0, 9);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-aurora-cyan to-aurora-purple rounded-full" />
            The Essential 9
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Curated crypto assets beyond XRP
          </p>
        </div>
        <Link
          to="/rankings"
          className="flex items-center gap-1 text-sm text-aurora-cyan hover:underline"
        >
          View All Rankings
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-bg-secondary/50 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {essentialAssets.map((asset, index) => (
            <EssentialCard
              key={asset.id}
              asset={asset}
              price={prices?.[asset.symbol]}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
}

interface EssentialCardProps {
  asset: RankedAsset;
  price?: PriceData;
  index: number;
}

function EssentialCard({ asset, price, index }: EssentialCardProps) {
  const change = price?.change24h ?? 0;
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Link
        to={`/asset/${asset.slug}`}
        className="flex items-center gap-4 p-4 rounded-xl bg-bg-secondary/50 border border-border-default hover:border-aurora-cyan/30 hover:bg-bg-secondary transition-all group"
      >
        {/* Rank */}
        <div className="w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-text-muted">#{asset.rank}</span>
        </div>

        {/* Logo placeholder */}
        <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center flex-shrink-0 border border-border-default">
          <span className="text-lg font-bold text-text-primary">
            {asset.symbol.charAt(0)}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-primary truncate">
              {asset.name}
            </span>
            <span className="text-xs text-text-muted">{asset.symbol}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm text-text-secondary">
              {price ? formatUsd(price.priceUsd) : "--"}
            </span>
          </div>
        </div>

        {/* Price change */}
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium flex-shrink-0",
            isPositive
              ? "bg-quantum-green/10 text-quantum-green"
              : "bg-nova-red/10 text-nova-red"
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>{isPositive ? "+" : ""}{change.toFixed(1)}%</span>
        </div>
      </Link>
    </motion.div>
  );
}
