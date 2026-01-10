import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Card, Badge, PriceChange, ScoreBar } from "./ui";
import { formatUsd } from "@/lib/utils";
import type { RankedAsset } from "@/types";

interface AssetCardProps {
  asset: RankedAsset;
  price?: {
    priceUsd: number;
    change24h: number;
  };
  index?: number;
}

export function AssetCard({ asset, price, index = 0 }: AssetCardProps) {
  const riskColors = {
    low: "success",
    medium: "warning",
    high: "danger",
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link to={`/asset/${asset.slug}`}>
        <Card hover className="p-5 h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Rank Badge */}
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
                <span className="text-sm font-bold text-accent-primary">
                  #{asset.rank}
                </span>
              </div>

              {/* Asset Icon Placeholder */}
              <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center">
                <span className="text-lg font-bold text-text-primary">
                  {asset.symbol.charAt(0)}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-text-primary">{asset.name}</h3>
                <span className="text-sm text-text-muted">{asset.symbol}</span>
              </div>
            </div>

            <Badge variant={riskColors[asset.riskLevel as keyof typeof riskColors]}>
              {asset.riskLevel} risk
            </Badge>
          </div>

          {/* Price Section */}
          {price && (
            <div className="flex items-baseline justify-between mb-4 pb-4 border-b border-border-default">
              <span className="text-2xl font-bold text-text-primary">
                {formatUsd(price.priceUsd)}
              </span>
              <PriceChange value={price.change24h} />
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-text-muted mb-4 line-clamp-2">
            {asset.shortDescription}
          </p>

          {/* Score */}
          <ScoreBar
            label="Overall Score"
            value={asset.overallScore}
            color={asset.overallScore >= 85 ? "success" : "primary"}
          />

          {/* Category */}
          <div className="mt-4 flex items-center justify-between">
            <Badge>{asset.category}</Badge>
            <ExternalLink className="w-4 h-4 text-text-muted" />
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
