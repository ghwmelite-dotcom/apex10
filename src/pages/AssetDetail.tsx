import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useAsset, usePrices } from "@/hooks/useAssets";
import { GenerativeHeader } from "@/components/GenerativeHeader";
import { TiltCard } from "@/components/ui/TiltCard";
import { FlipPrice, FlipPercent } from "@/components/ui/FlipNumber";
import { MagneticButton, MagneticGhostButton } from "@/components/ui/MagneticButton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  ScoreGrid,
  Skeleton,
} from "@/components/ui";

export default function AssetDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: asset, isLoading, error } = useAsset(slug || "");
  const { data: prices } = usePrices(asset?.symbol || "");
  const price = prices?.[asset?.symbol || ""];

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-64 w-full rounded-2xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="container-custom py-8">
        <Card className="p-8 text-center glass-card">
          <AlertTriangle className="w-12 h-12 text-plasma-orange mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Asset Not Found
          </h2>
          <p className="text-text-muted mb-4">
            The asset you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/">
            <Button>Back to Rankings</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const riskColors = {
    low: "success",
    medium: "warning",
    high: "danger",
  } as const;

  const scores = [
    { label: "Potential", value: asset.potentialScore, color: "primary" as const },
    { label: "Utility", value: asset.utilityScore, color: "primary" as const },
    { label: "Developer", value: asset.developerScore, color: "primary" as const },
    { label: "Adoption", value: asset.adoptionScore, color: "primary" as const },
  ];

  return (
    <div className="container-custom py-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Link to="/">
          <MagneticGhostButton className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Rankings
          </MagneticGhostButton>
        </Link>
      </motion.div>

      {/* Generative Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <GenerativeHeader symbol={asset.symbol} name={asset.name} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <TiltCard>
              <Card className="glass-card p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Badge>#{asset.rank}</Badge>
                    <Badge variant="info">{asset.category}</Badge>
                  </div>
                  <Badge variant={riskColors[asset.riskLevel as keyof typeof riskColors]}>
                    {asset.riskLevel} risk
                  </Badge>
                </div>

                {/* Price Display */}
                {price && (
                  <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-border-default">
                    <FlipPrice value={price.priceUsd} size="xl" />
                    <FlipPercent value={price.change24h} className="text-lg" />
                  </div>
                )}

                {/* Description */}
                <p className="text-text-secondary leading-relaxed">
                  {asset.description}
                </p>

                {/* Links */}
                <div className="flex items-center gap-3 mt-6">
                  {asset.website && (
                    <a
                      href={asset.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MagneticButton className="btn-ghost-glow flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Website
                      </MagneticButton>
                    </a>
                  )}
                  {asset.whitepaper && (
                    <a
                      href={asset.whitepaper}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MagneticButton className="btn-ghost-glow flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Whitepaper
                      </MagneticButton>
                    </a>
                  )}
                </div>
              </Card>
            </TiltCard>
          </motion.div>

          {/* Strengths & Weaknesses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <TiltCard>
                <Card className="glass-card p-6 h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-quantum-green/20">
                      <CheckCircle className="w-5 h-5 text-quantum-green" />
                    </div>
                    <h3 className="font-semibold text-text-primary">Strengths</h3>
                  </div>
                  <ul className="space-y-3">
                    {(asset.strengths as string[] || []).map((strength, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <TrendingUp className="w-4 h-4 text-quantum-green mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-text-secondary">{strength}</span>
                      </motion.li>
                    ))}
                  </ul>
                </Card>
              </TiltCard>

              {/* Weaknesses */}
              <TiltCard>
                <Card className="glass-card p-6 h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-plasma-orange/20">
                      <AlertTriangle className="w-5 h-5 text-plasma-orange" />
                    </div>
                    <h3 className="font-semibold text-text-primary">Considerations</h3>
                  </div>
                  <ul className="space-y-3">
                    {(asset.weaknesses as string[] || []).map((weakness, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <TrendingDown className="w-4 h-4 text-plasma-orange mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-text-secondary">{weakness}</span>
                      </motion.li>
                    ))}
                  </ul>
                </Card>
              </TiltCard>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Score Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TiltCard>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 pb-6 border-b border-border-default">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-text-muted">Overall Score</span>
                      <span className="text-4xl font-bold aurora-text">
                        {asset.overallScore}
                      </span>
                    </div>
                    <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${asset.overallScore}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-aurora-cyan to-aurora-purple rounded-full shadow-glow"
                      />
                    </div>
                  </div>
                  <ScoreGrid scores={scores} />
                </CardContent>
              </Card>
            </TiltCard>
          </motion.div>

          {/* Quick Stats */}
          {price && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <TiltCard>
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Market Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">Market Cap</span>
                        <span className="font-medium text-text-primary">
                          ${(price.marketCap / 1e9).toFixed(2)}B
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">24h Volume</span>
                        <span className="font-medium text-text-primary">
                          ${(price.volume24h / 1e6).toFixed(2)}M
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">7d Change</span>
                        <FlipPercent value={price.change7d} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
