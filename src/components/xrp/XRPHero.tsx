import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, TrendingDown, BarChart3, DollarSign } from "lucide-react";
import { SignalIndicator, getSignalType } from "./SignalIndicator";
import { formatUsd, formatNumber, cn } from "@/lib/utils";
import type { PriceData } from "@/types";

interface XRPHeroProps {
  price?: PriceData;
  isLoading?: boolean;
}

export function XRPHero({ price, isLoading }: XRPHeroProps) {
  const change24h = price?.change24h ?? 0;
  const change7d = price?.change7d ?? 0;
  const signal = getSignalType(change24h, change7d);

  const taglines = {
    bullish: "Momentum building. Smart money is watching.",
    neutral: "Consolidating. Patience rewarded.",
    bearish: "Accumulation zone. Long-term holders stay strong.",
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-xrp-hero border border-xrp-cyan/20 mb-8 xrp-hero-container">
      {/* Background effects */}
      <div className="absolute inset-0 bg-xrp-mesh opacity-60" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-xrp-cyan/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-xrp-teal/10 rounded-full blur-3xl" />

      <div className="relative z-10 p-6 md:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left: Logo and Price */}
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* XRP Logo with glow ring - Removed framer-motion for LCP optimization */}
            <div className="relative">
              <div className="relative w-24 h-24 md:w-32 md:h-32">
                {/* Animated glow ring - CSS animation instead of framer-motion */}
                <div
                  className="absolute inset-0 rounded-full border-2 border-xrp-cyan/50 animate-xrp-ring"
                  style={{
                    background: "conic-gradient(from 0deg, transparent, rgba(0, 170, 228, 0.3), transparent)",
                  }}
                />
                <div
                  className="absolute inset-2 rounded-full border border-xrp-cyan/30"
                  style={{ animation: "xrp-ring 15s linear infinite reverse" }}
                />

                {/* Logo container */}
                <div className="absolute inset-4 rounded-full bg-xrp-navy flex items-center justify-center shadow-xrp-glow">
                  <span className="text-3xl md:text-4xl font-black text-xrp-cyan">XRP</span>
                </div>
              </div>
            </div>

            {/* Price and stats - Removed animation delay for LCP */}
            <div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">XRP</h1>
                  <SignalIndicator change24h={change24h} change7d={change7d} size="md" />
                </div>

                {isLoading ? (
                  <div className="h-12 w-48 bg-xrp-cyan/10 rounded-lg animate-pulse" />
                ) : (
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl md:text-5xl font-bold text-white">
                      {price ? formatUsd(price.priceUsd) : "$--"}
                    </span>
                    <PriceChangeIndicator value={change24h} label="24h" />
                  </div>
                )}

                <p className="mt-3 text-xrp-cyan/80 text-sm md:text-base max-w-md">
                  {taglines[signal]}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Stats and CTAs - Removed animation for LCP */}
          <div className="flex flex-col gap-4">
            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={<BarChart3 className="w-4 h-4" />}
                label="Market Cap"
                value={price ? formatNumber(price.marketCap, true) : "--"}
                isLoading={isLoading}
              />
              <StatCard
                icon={<DollarSign className="w-4 h-4" />}
                label="24h Volume"
                value={price ? formatNumber(price.volume24h, true) : "--"}
                isLoading={isLoading}
              />
            </div>

            {/* CTAs - Removed animation for LCP */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/xrp"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-xrp-gradient text-xrp-navy font-semibold hover:shadow-xrp-glow transition-all"
              >
                Explore XRP Intelligence
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/rankings"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-xrp-cyan/30 text-xrp-cyan hover:bg-xrp-cyan/10 transition-all"
              >
                View All 10 Cryptos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  isLoading,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLoading?: boolean;
}) {
  return (
    <div className="px-4 py-3 rounded-xl bg-xrp-navy/50 border border-xrp-cyan/10">
      <div className="flex items-center gap-2 text-xrp-cyan/60 text-xs mb-1">
        {icon}
        <span>{label}</span>
      </div>
      {isLoading ? (
        <div className="h-6 w-20 bg-xrp-cyan/10 rounded animate-pulse" />
      ) : (
        <span className="text-white font-semibold">{value}</span>
      )}
    </div>
  );
}

function PriceChangeIndicator({ value, label }: { value: number; label: string }) {
  const isPositive = value >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium",
        isPositive ? "bg-quantum-green/20 text-quantum-green" : "bg-nova-red/20 text-nova-red"
      )}
    >
      <Icon className="w-3 h-3" />
      <span>{isPositive ? "+" : ""}{value.toFixed(2)}%</span>
      <span className="text-xs opacity-70">{label}</span>
    </div>
  );
}
