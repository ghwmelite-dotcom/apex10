import { TrendingUp, Info, BarChart3, Grid, List, Orbit, Sparkles, ArrowLeft } from "lucide-react";
import { useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useTop10Assets, usePrices } from "@/hooks/useAssets";
import { Card, SkeletonCard, SkeletonAssetRow } from "@/components/ui";

// Only lazy load truly heavy components (Three.js, WebGL)
const OrbitalView = lazy(() => import("@/components/OrbitalView"));

// Critical components
import { AssetCard } from "@/components/AssetCard";
import { AssetTable } from "@/components/AssetTable";
import { FloatingOrbs } from "@/components/ParticleBackground";
import { HolographicCard } from "@/components/HolographicCard";
import { TiltCard } from "@/components/ui/TiltCard";
import { MagneticButton, MagneticAuroraButton } from "@/components/ui/MagneticButton";

type ViewMode = "table" | "grid" | "orbital";

export default function Rankings() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const { data: assets, isLoading: assetsLoading, error: assetsError } = useTop10Assets();
  const symbols = assets?.map((a) => a.symbol).join(",") || "";
  const { data: prices } = usePrices(symbols);

  // Filter to only show ranked assets (rank > 0, excludes XRP flagship)
  const rankedAssets = assets?.filter((a) => a.rank > 0) || [];

  return (
    <div className="container-custom py-8 relative">
      {/* Floating orbs background */}
      <FloatingOrbs />

      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-text-muted hover:text-aurora-cyan transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Hero Section */}
      <div className="mb-8 relative">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-aurora-cyan/20 to-aurora-purple/20 border border-aurora-cyan/30 shadow-glow animate-scale-in">
              <TrendingUp className="w-8 h-8 text-aurora-cyan" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="aurora-text">Top 10</span>{" "}
                <span className="text-text-primary">Rankings</span>
              </h1>
              <p className="text-text-muted mt-1">
                Curated high-potential crypto assets with transparent methodology
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
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

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-text-muted" />
          <span className="text-text-muted text-sm">
            {rankedAssets.length} assets ranked
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
      </div>

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

      {/* Data Display */}
      {rankedAssets.length > 0 && !assetsLoading && (
        <>
          {viewMode === "orbital" ? (
            <Suspense fallback={
              <div className="h-[500px] rounded-2xl bg-bg-secondary border border-border-default flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-2 border-aurora-cyan border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-text-muted">Loading 3D View...</span>
                </div>
              </div>
            }>
              <OrbitalView assets={rankedAssets} />
            </Suspense>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {rankedAssets.map((asset, index) => (
                <HolographicCard key={asset.id} intensity={index < 3 ? "high" : "medium"}>
                  <AssetCard
                    asset={asset}
                    price={prices?.[asset.symbol]}
                    index={index}
                  />
                </HolographicCard>
              ))}
            </div>
          ) : (
            <AssetTable assets={rankedAssets} prices={prices} />
          )}
        </>
      )}

      {/* Methodology Link */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-bg-secondary/50 border border-border-default">
          <Sparkles className="w-4 h-4 text-aurora-purple" />
          <p className="text-text-muted text-sm">
            Want to understand how we rank assets?{" "}
            <button className="text-aurora-cyan hover:underline font-medium" aria-label="View ranking methodology">
              View our methodology
            </button>
          </p>
        </div>
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
      aria-label={`Switch to ${label} view`}
      aria-pressed={active}
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
