import { TrendingUp, Info, BarChart3, Grid, List, Orbit, Sparkles } from "lucide-react";
import { useState, lazy, Suspense } from "react";
import { useTop10Assets, usePrices } from "@/hooks/useAssets";
import { Card, SkeletonCard, SkeletonAssetRow } from "@/components/ui";

// XRP Components
import { XRPHero, XRPDeepDive, EssentialNine } from "@/components/xrp";

// Featured Cryptos 2026
import { FeaturedCryptos2026 } from "@/components/FeaturedCryptos2026";

// Only lazy load truly heavy components (Three.js, WebGL)
const OrbitalView = lazy(() => import("@/components/OrbitalView"));

// Critical above-the-fold components - load synchronously to prevent CLS
import { AssetCard } from "@/components/AssetCard";
import { AssetTable } from "@/components/AssetTable";
import { MarketPulse } from "@/components/MarketPulse";
import { FloatingOrbs } from "@/components/ParticleBackground";
import { LiveActivityFeed, LiveActivityTicker } from "@/components/LiveActivityFeed";
import { HolographicCard } from "@/components/HolographicCard";
import { CommunityPulse } from "@/components/CommunityPulse";
import { TiltCard } from "@/components/ui/TiltCard";
import { MagneticButton, MagneticAuroraButton } from "@/components/ui/MagneticButton";

// Simple CSS-based animation wrapper (no framer-motion for initial render)
const FadeIn = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <div
    className={`animate-fade-in ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    {children}
  </div>
);

export default function Dashboard() {
  const { data: assets, isLoading: assetsLoading, error: assetsError } = useTop10Assets();

  // Build symbols string including XRP
  const symbols = assets?.map((a) => a.symbol).join(",") || "XRP";
  const allSymbols = symbols.includes("XRP") ? symbols : `XRP,${symbols}`;
  const { data: prices } = usePrices(allSymbols);

  // Get XRP price data
  const xrpPrice = prices?.["XRP"];

  return (
    <div className="container-custom py-8 relative">
      {/* Floating orbs background */}
      <FloatingOrbs />

      {/* XRP Hero Section - Above the fold */}
      <FadeIn>
        <XRPHero price={xrpPrice} isLoading={!prices} />
      </FadeIn>

      {/* XRP Deep Dive Section */}
      <FadeIn delay={0.1}>
        <XRPDeepDive />
      </FadeIn>

      {/* Featured Cryptos 2026 - IBTimes Top 10 */}
      <FadeIn delay={0.125}>
        <FeaturedCryptos2026 />
      </FadeIn>

      {/* Essential Nine Section */}
      <FadeIn delay={0.15}>
        <EssentialNine
          assets={assets || []}
          prices={prices}
          isLoading={assetsLoading}
        />
      </FadeIn>

      {/* Main Content Area - Two Column Layout on Desktop */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Live Activity Feed - Main Column */}
        <div className="flex-1 min-w-0">
          <FadeIn delay={0.2}>
            <LiveActivityFeed />
          </FadeIn>

          {/* Market Pulse - Desktop */}
          <FadeIn delay={0.25} className="mt-6 hidden lg:block">
            <MarketPulse symbols={allSymbols} />
          </FadeIn>

          {/* Info Banner about methodology */}
          <FadeIn delay={0.3} className="mt-6">
            <TiltCard>
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
          </FadeIn>
        </div>

        {/* Community Pulse - Side Column (Desktop Only) */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <CommunityPulse />
          </div>
        </div>
      </div>

      {/* Methodology Link */}
      <FadeIn delay={0.35} className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-bg-secondary/50 border border-border-default">
          <Sparkles className="w-4 h-4 text-aurora-purple" />
          <p className="text-text-muted text-sm">
            Want to understand how we rank assets?{" "}
            <button className="text-aurora-cyan hover:underline font-medium" aria-label="View ranking methodology">
              View our methodology
            </button>
          </p>
        </div>
      </FadeIn>

      {/* Live Activity + Market Pulse - Mobile */}
      <div className="lg:hidden mt-8 space-y-6">
        <MarketPulse symbols={allSymbols} />
      </div>
    </div>
  );
}
