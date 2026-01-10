import { motion } from "framer-motion";
import { TrendingUp, Info, BarChart3, Grid, List, Orbit, Sparkles } from "lucide-react";
import { useState, lazy, Suspense } from "react";
import { useTop10Assets, usePrices } from "@/hooks/useAssets";
import { AssetCard } from "@/components/AssetCard";
import { AssetTable } from "@/components/AssetTable";

// Lazy load Three.js heavy component
const OrbitalView = lazy(() => import("@/components/OrbitalView"));
import { MarketPulse } from "@/components/MarketPulse";
import { FloatingOrbs } from "@/components/ParticleBackground";
import { TiltCard } from "@/components/ui/TiltCard";
import { MagneticButton, MagneticAuroraButton } from "@/components/ui/MagneticButton";
import { Card, SkeletonCard, SkeletonAssetRow } from "@/components/ui";
import { LiveActivityFeed, LiveActivityTicker } from "@/components/LiveActivityFeed";
import { HolographicCard } from "@/components/HolographicCard";
import { FadeInOnScroll, StaggerContainer, StaggerItem, RevealText } from "@/components/ScrollAnimations";
import { TimeGreeting, TimeBasedSuggestions } from "@/components/TimeAwareUI";
import { XPProgressBar } from "@/components/AchievementSystem";
import { AmbientToggle } from "@/components/AmbientMode";
import { CommunityPulse, CommunityPulseMini } from "@/components/CommunityPulse";
import { FeatureShowcase } from "@/components/FeatureShowcase";

type ViewMode = "table" | "grid" | "orbital";

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const { data: assets, isLoading: assetsLoading, error: assetsError } = useTop10Assets();
  const symbols = assets?.map((a) => a.symbol).join(",") || "";
  const { data: prices } = usePrices(symbols);

  return (
    <div className="container-custom py-8 relative">
      {/* Floating orbs background */}
      <FloatingOrbs />

      {/* Time-Aware Greeting & Progress */}
      <FadeInOnScroll direction="up" className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between">
              <TimeGreeting />
              <AmbientToggle />
            </div>
            <div className="mt-4">
              <TimeBasedSuggestions />
            </div>
          </div>
          <div className="hidden lg:block">
            <XPProgressBar />
          </div>
        </div>
      </FadeInOnScroll>

      {/* Hero Section */}
      <FadeInOnScroll direction="up" className="mb-8 relative">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-aurora-cyan/20 to-aurora-purple/20 border border-aurora-cyan/30 shadow-glow"
            >
              <TrendingUp className="w-8 h-8 text-aurora-cyan" />
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <RevealText text="Top 10" className="aurora-text" />{" "}
                <RevealText text="Rankings" delay={0.2} className="text-text-primary" />
              </h1>
              <p className="text-text-muted mt-1">
                Curated high-potential crypto assets with transparent methodology
              </p>
            </div>
          </div>

          {/* Live Activity Ticker - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <LiveActivityTicker />
            <div className="w-72">
              <MarketPulse symbols={symbols} />
            </div>
          </div>
        </div>
      </FadeInOnScroll>

      {/* New Features Showcase */}
      <FadeInOnScroll direction="up" delay={0.1}>
        <FeatureShowcase />
      </FadeInOnScroll>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TiltCard className="mb-6">
          <div className="glass-card p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-aurora-cyan/20">
                <Info className="w-5 h-5 text-aurora-cyan" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">
                  Our rankings evaluate assets across four dimensions:{" "}
                  <span className="text-aurora-cyan font-medium">Potential</span>,{" "}
                  <span className="text-aurora-purple font-medium">Utility</span>,{" "}
                  <span className="text-aurora-blue font-medium">Developer Activity</span>, and{" "}
                  <span className="text-aurora-pink font-medium">Adoption</span>.
                  Rankings are for educational purposes only.
                </p>
              </div>
            </div>
          </div>
        </TiltCard>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-text-muted" />
          <span className="text-text-muted text-sm">
            {assets?.length || 0} assets ranked
          </span>
        </div>

        <div className="flex items-center gap-2 bg-bg-secondary/80 backdrop-blur-sm rounded-xl p-1 border border-border-default">
          <ViewButton
            active={viewMode === "table"}
            onClick={() => setViewMode("table")}
            icon={<List className="w-4 h-4" />}
            label="List"
          />
          <ViewButton
            active={viewMode === "grid"}
            onClick={() => setViewMode("grid")}
            icon={<Grid className="w-4 h-4" />}
            label="Grid"
          />
          <ViewButton
            active={viewMode === "orbital"}
            onClick={() => setViewMode("orbital")}
            icon={<Orbit className="w-4 h-4" />}
            label="Orbital"
          />
        </div>
      </motion.div>

      {/* Error State */}
      {assetsError && (
        <Card className="p-8 text-center glass-card">
          <p className="text-nova-red mb-4">Failed to load assets</p>
          <MagneticAuroraButton onClick={() => window.location.reload()}>
            Retry
          </MagneticAuroraButton>
        </Card>
      )}

      {/* Loading State */}
      {assetsLoading && (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : viewMode === "orbital" ? (
            <div className="h-[500px] rounded-2xl skeleton" />
          ) : (
            <div className="bg-bg-secondary rounded-2xl border border-border-default overflow-hidden">
              {Array.from({ length: 10 }).map((_, i) => (
                <SkeletonAssetRow key={i} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Main Content Area - Two Column Layout on Desktop */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Data Display - Main Column */}
        <div className="flex-1 min-w-0">
          {assets && !assetsLoading && (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === "orbital" ? (
                <Suspense fallback={
                  <div className="h-[500px] rounded-2xl bg-bg-secondary border border-border-default flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-2 border-aurora-cyan border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-text-muted">Loading 3D View...</span>
                    </div>
                  </div>
                }>
                  <OrbitalView assets={assets} />
                </Suspense>
              ) : viewMode === "grid" ? (
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" staggerDelay={0.08}>
                  {assets.map((asset, index) => (
                    <StaggerItem key={asset.id}>
                      <HolographicCard intensity={index < 3 ? "high" : "medium"}>
                        <AssetCard
                          asset={asset}
                          price={prices?.[asset.symbol]}
                          index={index}
                        />
                      </HolographicCard>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              ) : (
                <AssetTable assets={assets} prices={prices} />
              )}
            </motion.div>
          )}
        </div>

        {/* Live Activity Feed & Community - Side Column (Desktop Only) */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <FadeInOnScroll direction="right">
              <LiveActivityFeed />
            </FadeInOnScroll>
            <FadeInOnScroll direction="right" delay={0.1}>
              <CommunityPulse />
            </FadeInOnScroll>
          </div>
        </div>
      </div>

      {/* Methodology Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-bg-secondary/50 border border-border-default">
          <Sparkles className="w-4 h-4 text-aurora-purple" />
          <p className="text-text-muted text-sm">
            Want to understand how we rank assets?{" "}
            <button className="text-aurora-cyan hover:underline font-medium">
              View our methodology
            </button>
          </p>
        </div>
      </motion.div>

      {/* Live Activity + Market Pulse - Mobile */}
      <div className="lg:hidden mt-8 space-y-6">
        <FadeInOnScroll>
          <LiveActivityFeed />
        </FadeInOnScroll>
        <FadeInOnScroll delay={0.1}>
          <MarketPulse symbols={symbols} />
        </FadeInOnScroll>
      </div>

    </div>
  );
}

// View toggle button component
function ViewButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <MagneticButton
      onClick={onClick}
      strength={0.2}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
        active
          ? "bg-aurora-cyan/20 text-aurora-cyan shadow-glow-sm"
          : "text-text-muted hover:text-text-primary hover:bg-bg-tertiary"
      }`}
    >
      {icon}
      <span className="text-sm font-medium hidden sm:inline">{label}</span>
    </MagneticButton>
  );
}
