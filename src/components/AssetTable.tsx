import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
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
    <>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {assets.map((asset, index) => {
          const price = prices?.[asset.symbol];
          const isPositive = price && price.change24h >= 0;

          return (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
            >
              <Link
                to={`/asset/${asset.slug}`}
                className="block p-4 bg-bg-secondary rounded-xl border border-border-default active:bg-bg-tertiary transition-colors asset-row"
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Left: Rank + Asset Info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Rank Badge */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-aurora-cyan/20 to-aurora-purple/20 flex items-center justify-center border border-aurora-cyan/30">
                      <span className="text-sm font-bold text-aurora-cyan">
                        {asset.rank}
                      </span>
                    </div>

                    {/* Asset Icon & Name */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-bg-tertiary flex items-center justify-center flex-shrink-0 border border-border-default">
                        <span className="text-sm font-bold text-text-primary">
                          {asset.symbol.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-text-primary truncate text-sm">
                          {asset.name}
                        </p>
                        <p className="text-xs text-text-muted">{asset.symbol}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Price & Change */}
                  <div className="flex-shrink-0 text-right">
                    {price ? (
                      <>
                        <p className="font-medium text-text-primary text-sm">
                          {formatUsd(price.priceUsd)}
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-0.5">
                          {isPositive ? (
                            <TrendingUp className="w-3 h-3 text-quantum-green" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-nova-red" />
                          )}
                          <span
                            className={`text-xs font-medium ${
                              isPositive ? "text-quantum-green" : "text-nova-red"
                            }`}
                          >
                            {Math.abs(price.change24h).toFixed(2)}%
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className="text-text-muted text-sm">-</span>
                    )}
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-4 h-4 text-text-muted flex-shrink-0" />
                </div>

                {/* Bottom Row: Score & Risk */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-default/50">
                  {/* Score Bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">Score</span>
                    <div className="w-20 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-aurora-cyan to-aurora-blue rounded-full"
                        style={{ width: `${asset.overallScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-text-primary">
                      {asset.overallScore}
                    </span>
                  </div>

                  {/* Risk Badge */}
                  <Badge
                    variant={riskColors[asset.riskLevel as keyof typeof riskColors]}
                    className="text-xs"
                  >
                    {asset.riskLevel}
                  </Badge>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-bg-secondary rounded-2xl border border-border-default overflow-hidden">
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
    </>
  );
}
