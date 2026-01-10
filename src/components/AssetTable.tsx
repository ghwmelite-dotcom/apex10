import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Badge, PriceChange } from "./ui";
import { formatUsd } from "@/lib/utils";
import type { RankedAsset, PriceData } from "@/types";

interface AssetTableProps {
  assets: RankedAsset[];
  prices?: Record<string, PriceData>;
}

export function AssetTable({ assets, prices }: AssetTableProps) {
  const riskColors = {
    low: "success",
    medium: "warning",
    high: "danger",
  } as const;

  return (
    <div className="bg-bg-secondary rounded-2xl border border-border-default overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border-default bg-bg-tertiary/50">
        <div className="col-span-1 text-xs font-medium text-text-muted uppercase tracking-wider">
          Rank
        </div>
        <div className="col-span-3 text-xs font-medium text-text-muted uppercase tracking-wider">
          Asset
        </div>
        <div className="col-span-2 text-xs font-medium text-text-muted uppercase tracking-wider text-right">
          Price
        </div>
        <div className="col-span-2 text-xs font-medium text-text-muted uppercase tracking-wider text-right">
          24h Change
        </div>
        <div className="col-span-2 text-xs font-medium text-text-muted uppercase tracking-wider text-right">
          Score
        </div>
        <div className="col-span-1 text-xs font-medium text-text-muted uppercase tracking-wider text-center">
          Risk
        </div>
        <div className="col-span-1"></div>
      </div>

      {/* Table Body */}
      <div>
        {assets.map((asset, index) => {
          const price = prices?.[asset.symbol];

          return (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
            >
              <Link
                to={`/asset/${asset.slug}`}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border-default last:border-0 hover:bg-bg-tertiary/30 transition-colors group"
              >
                {/* Rank */}
                <div className="col-span-1 flex items-center">
                  <span className="text-lg font-bold text-accent-primary">
                    #{asset.rank}
                  </span>
                </div>

                {/* Asset Info */}
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-text-primary">
                      {asset.symbol.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-text-primary truncate">
                      {asset.name}
                    </p>
                    <p className="text-sm text-text-muted">{asset.symbol}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-2 flex items-center justify-end">
                  {price ? (
                    <span className="font-medium text-text-primary">
                      {formatUsd(price.priceUsd)}
                    </span>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </div>

                {/* 24h Change */}
                <div className="col-span-2 flex items-center justify-end">
                  {price ? (
                    <PriceChange value={price.change24h} />
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </div>

                {/* Score */}
                <div className="col-span-2 flex items-center justify-end">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-primary rounded-full"
                        style={{ width: `${asset.overallScore}%` }}
                      />
                    </div>
                    <span className="font-medium text-text-primary w-8">
                      {asset.overallScore}
                    </span>
                  </div>
                </div>

                {/* Risk */}
                <div className="col-span-1 flex items-center justify-center">
                  <Badge
                    variant={riskColors[asset.riskLevel as keyof typeof riskColors]}
                  >
                    {asset.riskLevel}
                  </Badge>
                </div>

                {/* Arrow */}
                <div className="col-span-1 flex items-center justify-end">
                  <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-accent-primary transition-colors" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
