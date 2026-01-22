import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, DollarSign, Activity, Users, Zap } from "lucide-react";
import { usePrices } from "@/hooks/useAssets";
import { useXRPData } from "@/hooks/useXRP";
import { formatUsd, formatNumber, cn } from "@/lib/utils";

// XRP Components
import {
  SignalIndicator,
  getSignalType,
  XRPPriceChart,
  WhaleTracker,
  ODLMonitor,
  EscrowTracker,
  XRPNewsSection,
  SentimentIndicator,
} from "@/components/xrp";

export default function XRPHub() {
  const { data: prices, isLoading: pricesLoading } = usePrices("XRP");
  const xrpPrice = prices?.["XRP"];

  const change24h = xrpPrice?.change24h ?? 0;
  const change7d = xrpPrice?.change7d ?? 0;
  const signal = getSignalType(change24h, change7d);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-xrp-hero border-b border-xrp-cyan/20">
        {/* Background effects */}
        <div className="absolute inset-0 bg-xrp-mesh opacity-60" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-xrp-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-xrp-teal/5 rounded-full blur-3xl" />

        <div className="container-custom relative z-10 py-8">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-text-muted hover:text-xrp-cyan transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left: Logo and main info */}
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* XRP Logo with animated glow */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
              >
                <div className="relative w-28 h-28 md:w-36 md:h-36">
                  {/* Animated glow rings */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-xrp-cyan/40"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{
                      background: "conic-gradient(from 0deg, transparent, rgba(0, 170, 228, 0.2), transparent)",
                    }}
                  />
                  <motion.div
                    className="absolute inset-3 rounded-full border border-xrp-cyan/20"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Logo container */}
                  <div className="absolute inset-6 rounded-full bg-xrp-navy flex items-center justify-center shadow-xrp-glow">
                    <span className="text-4xl md:text-5xl font-black text-xrp-cyan">XRP</span>
                  </div>
                </div>
              </motion.div>

              {/* Price and signal */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">XRP Intelligence Hub</h1>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    {pricesLoading ? (
                      <div className="h-12 w-48 bg-xrp-cyan/10 rounded-lg animate-pulse" />
                    ) : (
                      <>
                        <span className="text-4xl md:text-5xl font-bold text-white">
                          {xrpPrice ? formatUsd(xrpPrice.priceUsd) : "$--"}
                        </span>
                        <PriceChangeChip value={change24h} label="24h" />
                        <PriceChangeChip value={change7d} label="7d" />
                      </>
                    )}
                  </div>

                  <SignalIndicator change24h={change24h} change7d={change7d} size="lg" />
                </motion.div>
              </div>
            </div>

            {/* Right: Quick stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              <QuickStat
                icon={<BarChart3 className="w-4 h-4" />}
                label="Market Cap"
                value={xrpPrice ? formatNumber(xrpPrice.marketCap, true) : "--"}
                isLoading={pricesLoading}
              />
              <QuickStat
                icon={<DollarSign className="w-4 h-4" />}
                label="24h Volume"
                value={xrpPrice ? formatNumber(xrpPrice.volume24h, true) : "--"}
                isLoading={pricesLoading}
              />
              <QuickStat
                icon={<Activity className="w-4 h-4" />}
                label="Daily Txns"
                value="1.2M"
                isLoading={false}
              />
              <QuickStat
                icon={<Users className="w-4 h-4" />}
                label="Active Accounts"
                value="4.5M"
                isLoading={false}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-custom py-8">
        {/* Price Chart - Full width */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
          id="chart"
        >
          <XRPPriceChart currentPrice={xrpPrice?.priceUsd} change24h={change24h} />
        </motion.section>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Whale Tracker */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            id="whales"
          >
            <WhaleTracker />
          </motion.section>

          {/* ODL Corridors */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            id="odl"
          >
            <ODLMonitor />
          </motion.section>

          {/* Escrow Tracker */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            id="escrow"
          >
            <EscrowTracker />
          </motion.section>

          {/* Sentiment */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            id="sentiment"
          >
            <SentimentIndicator />
          </motion.section>
        </div>

        {/* News Section - Full width */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mb-8"
          id="news"
        >
          <XRPNewsSection />
        </motion.section>

        {/* About XRP - Expandable */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          id="about"
        >
          <AboutXRP />
        </motion.section>
      </div>
    </div>
  );
}

function QuickStat({
  icon,
  label,
  value,
  isLoading,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLoading: boolean;
}) {
  return (
    <div className="px-4 py-3 rounded-xl bg-xrp-navy/50 border border-xrp-cyan/10">
      <div className="flex items-center gap-2 text-xrp-cyan/60 text-xs mb-1">
        {icon}
        <span>{label}</span>
      </div>
      {isLoading ? (
        <div className="h-6 w-16 bg-xrp-cyan/10 rounded animate-pulse" />
      ) : (
        <span className="text-white font-semibold">{value}</span>
      )}
    </div>
  );
}

function PriceChangeChip({ value, label }: { value: number; label: string }) {
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

function AboutXRP() {
  return (
    <div className="rounded-2xl bg-bg-secondary/50 border border-xrp-cyan/10 overflow-hidden">
      <div className="p-6 border-b border-border-default">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-xrp-cyan/10">
            <Zap className="w-5 h-5 text-xrp-cyan" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">About XRP</h2>
        </div>
      </div>

      <div className="p-6">
        <div className="prose prose-invert max-w-none">
          <p className="text-text-secondary leading-relaxed mb-4">
            XRP is the native digital asset of the XRP Ledger (XRPL), designed for fast, low-cost cross-border payments.
            Created by Ripple Labs, XRP enables On-Demand Liquidity (ODL) for financial institutions worldwide.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <FeatureCard
              title="Lightning Fast"
              description="Transactions settle in 3-5 seconds with minimal fees"
            />
            <FeatureCard
              title="Enterprise Grade"
              description="Strategic partnerships with major banks and payment providers"
            />
            <FeatureCard
              title="Sustainable"
              description="Carbon-neutral blockchain with no mining required"
            />
          </div>

          <div className="mt-6 p-4 rounded-xl bg-xrp-navy/50 border border-xrp-cyan/20">
            <h4 className="font-semibold text-xrp-cyan mb-2">Escrow Mechanism</h4>
            <p className="text-sm text-text-muted">
              Ripple holds approximately 40 billion XRP in escrow, releasing 1 billion monthly.
              Unused XRP is returned to escrow, providing supply predictability for investors.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <a
              href="https://xrpl.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-xrp-cyan/10 text-xrp-cyan text-sm font-medium hover:bg-xrp-cyan/20 transition-colors"
            >
              XRPL.org
            </a>
            <a
              href="https://ripple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-xrp-cyan/10 text-xrp-cyan text-sm font-medium hover:bg-xrp-cyan/20 transition-colors"
            >
              Ripple.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 rounded-xl bg-bg-tertiary/50 border border-border-default">
      <h4 className="font-semibold text-text-primary mb-1">{title}</h4>
      <p className="text-sm text-text-muted">{description}</p>
    </div>
  );
}
