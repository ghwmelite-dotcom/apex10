import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  Loader2,
  History,
  Trash2,
  ExternalLink,
  Copy,
  Sparkles,
  Info,
  Droplets,
  Percent,
  Lock,
  Unlock,
  Code,
  User,
  Coins,
  RefreshCw,
} from "lucide-react";
import { useContractScanner, useScanHistory, RISK_EDUCATION } from "../hooks/useContractScanner";
import type { ChainId, RiskFactor, ContractAnalysisResult } from "../api/types";

// Chain options
const CHAINS: { id: ChainId; name: string; icon: string }[] = [
  { id: "ethereum", name: "Ethereum", icon: "⟠" },
  { id: "bsc", name: "BNB Chain", icon: "🔶" },
  { id: "polygon", name: "Polygon", icon: "🟣" },
  { id: "arbitrum", name: "Arbitrum", icon: "🔵" },
  { id: "base", name: "Base", icon: "🔷" },
];

// Chain explorer URLs
const CHAIN_EXPLORERS: Record<ChainId, string> = {
  ethereum: "https://etherscan.io",
  bsc: "https://bscscan.com",
  polygon: "https://polygonscan.com",
  arbitrum: "https://arbiscan.io",
  base: "https://basescan.org",
};

// Risk level colors
const RISK_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  critical: { bg: "bg-nova-red/20", text: "text-nova-red", border: "border-nova-red" },
  high: { bg: "bg-plasma-orange/20", text: "text-plasma-orange", border: "border-plasma-orange" },
  medium: { bg: "bg-solar-gold/20", text: "text-solar-gold", border: "border-solar-gold" },
  low: { bg: "bg-aurora-cyan/20", text: "text-aurora-cyan", border: "border-aurora-cyan" },
  safe: { bg: "bg-quantum-green/20", text: "text-quantum-green", border: "border-quantum-green" },
};

// Score circle component
function ScoreCircle({ score, level }: { score: number; level: string }) {
  const colors = RISK_COLORS[level] || RISK_COLORS.medium;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-bg-tertiary"
        />
        <motion.circle
          cx="64"
          cy="64"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          className={colors.text}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`text-3xl font-bold ${colors.text}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-text-muted uppercase tracking-wider">/ 100</span>
      </div>
    </div>
  );
}

// Risk factor card component
function RiskFactorCard({ factor }: { factor: RiskFactor }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = RISK_COLORS[factor.severity] || RISK_COLORS.medium;
  const education = RISK_EDUCATION[factor.id];

  const getIcon = () => {
    switch (factor.id) {
      case "honeypot":
        return <AlertTriangle className="w-5 h-5" />;
      case "rugPull":
        return <XCircle className="w-5 h-5" />;
      case "taxes":
        return <Percent className="w-5 h-5" />;
      case "liquidity":
        return <Droplets className="w-5 h-5" />;
      case "ownership":
        return <User className="w-5 h-5" />;
      case "mintable":
        return <Coins className="w-5 h-5" />;
      case "proxy":
        return <Code className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      className={`rounded-xl border ${colors.border}/30 ${colors.bg} overflow-hidden`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`${colors.text}`}>{getIcon()}</div>
          <div className="text-left">
            <div className="font-medium text-text-primary">{factor.name}</div>
            <div className="text-sm text-text-secondary">{factor.description}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}/50`}
          >
            {factor.severity.toUpperCase()}
          </span>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-text-muted" />
          ) : (
            <ChevronRight className="w-5 h-5 text-text-muted" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && education && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border-primary/20"
          >
            <div className="px-4 py-3 bg-bg-primary/50">
              <div className="flex items-start gap-2 text-sm">
                <Info className="w-4 h-4 text-accent-cyan mt-0.5 flex-shrink-0" />
                <p className="text-text-secondary">{education.explanation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Analysis result component
function AnalysisResult({ result }: { result: ContractAnalysisResult }) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const colors = RISK_COLORS[result.riskLevel] || RISK_COLORS.medium;
  const explorerUrl = CHAIN_EXPLORERS[result.chain];

  const copyAddress = () => {
    navigator.clipboard.writeText(result.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header with score */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-bg-secondary/50 border border-border-primary/30">
        <ScoreCircle score={result.riskScore} level={result.riskLevel} />

        <div className="flex-1 text-center md:text-left">
          {result.tokenInfo && (
            <div className="mb-2">
              <h2 className="text-2xl font-bold text-text-primary">
                {result.tokenInfo.name}{" "}
                <span className="text-text-secondary">({result.tokenInfo.symbol})</span>
              </h2>
            </div>
          )}

          <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
            <code className="text-sm text-text-muted font-mono">
              {result.address.slice(0, 10)}...{result.address.slice(-8)}
            </code>
            <button
              onClick={copyAddress}
              className="p-1 rounded hover:bg-bg-tertiary transition-colors"
            >
              {copiedAddress ? (
                <CheckCircle className="w-4 h-4 text-quantum-green" />
              ) : (
                <Copy className="w-4 h-4 text-text-muted" />
              )}
            </button>
            <a
              href={`${explorerUrl}/address/${result.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded hover:bg-bg-tertiary transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-text-muted" />
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text} border ${colors.border}/50`}
            >
              {result.riskLevel.toUpperCase()} RISK
            </span>
            {result.isVerified && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-quantum-green/20 text-quantum-green border border-quantum-green/50">
                VERIFIED
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-bg-tertiary text-text-secondary">
              {CHAINS.find((c) => c.id === result.chain)?.name}
            </span>
          </div>
        </div>
      </div>

      {/* AI Explanation */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-accent-purple/10 to-accent-cyan/10 border border-accent-purple/20">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-accent-purple/20">
            <Sparkles className="w-5 h-5 text-accent-purple" />
          </div>
          <div>
            <h3 className="font-medium text-text-primary mb-1">AI Security Analysis</h3>
            <p className="text-sm text-text-secondary">{result.aiExplanation}</p>
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Risk Factors</h3>
        <div className="space-y-2">
          {Object.values(result.riskFactors).map((factor) => (
            <RiskFactorCard key={factor.id} factor={factor} />
          ))}
        </div>
      </div>

      {/* Liquidity & Tax Analysis */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Liquidity */}
        <div className="p-4 rounded-xl bg-bg-secondary/50 border border-border-primary/30">
          <div className="flex items-center gap-2 mb-3">
            <Droplets className="w-5 h-5 text-accent-cyan" />
            <h3 className="font-medium text-text-primary">Liquidity</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text-secondary">Total Liquidity</span>
              <span className="font-medium text-text-primary">
                ${result.liquidityAnalysis.totalLiquidityUsd.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Locked</span>
              <span
                className={`flex items-center gap-1 font-medium ${result.liquidityAnalysis.isLocked ? "text-quantum-green" : "text-solar-gold"}`}
              >
                {result.liquidityAnalysis.isLocked ? (
                  <>
                    <Lock className="w-4 h-4" /> Yes
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" /> No
                  </>
                )}
              </span>
            </div>
            {result.liquidityAnalysis.lpPairs.length > 0 && (
              <div className="pt-2 border-t border-border-primary/20">
                <span className="text-sm text-text-muted">DEX Pairs:</span>
                <div className="mt-1 space-y-1">
                  {result.liquidityAnalysis.lpPairs.slice(0, 3).map((pair, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-text-secondary">
                        {pair.pair} ({pair.dex})
                      </span>
                      <span className="text-text-primary">
                        ${pair.liquidityUsd.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tax Analysis */}
        <div className="p-4 rounded-xl bg-bg-secondary/50 border border-border-primary/30">
          <div className="flex items-center gap-2 mb-3">
            <Percent className="w-5 h-5 text-accent-purple" />
            <h3 className="font-medium text-text-primary">Token Tax</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-text-secondary">Buy Tax</span>
                <span
                  className={`font-medium ${result.taxAnalysis.buyTax > 10 ? "text-plasma-orange" : "text-quantum-green"}`}
                >
                  {result.taxAnalysis.buyTax.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${result.taxAnalysis.buyTax > 10 ? "bg-plasma-orange" : "bg-quantum-green"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(result.taxAnalysis.buyTax, 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-text-secondary">Sell Tax</span>
                <span
                  className={`font-medium ${result.taxAnalysis.sellTax > 10 ? "text-plasma-orange" : "text-quantum-green"}`}
                >
                  {result.taxAnalysis.sellTax.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${result.taxAnalysis.sellTax > 10 ? "bg-plasma-orange" : "bg-quantum-green"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(result.taxAnalysis.sellTax, 100)}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Scan history sidebar
function ScanHistorySidebar({
  onSelect,
}: {
  onSelect: (address: string, chain: ChainId) => void;
}) {
  const { history, clear, removeItem } = useScanHistory();

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No scan history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-text-primary flex items-center gap-2">
          <History className="w-4 h-4" />
          Recent Scans
        </h3>
        <button
          onClick={clear}
          className="text-xs text-text-muted hover:text-nova-red transition-colors"
        >
          Clear All
        </button>
      </div>

      {history.map((item) => {
        const colors = RISK_COLORS[item.riskLevel] || RISK_COLORS.medium;
        return (
          <motion.div
            key={`${item.chain}-${item.address}`}
            className="p-3 rounded-lg bg-bg-secondary/50 border border-border-primary/30 hover:border-border-primary/50 cursor-pointer transition-all group"
            whileHover={{ scale: 1.01 }}
            onClick={() => onSelect(item.address, item.chain)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-text-primary truncate">
                  {item.tokenName} ({item.tokenSymbol})
                </div>
                <div className="text-xs text-text-muted font-mono truncate">
                  {item.address.slice(0, 8)}...{item.address.slice(-6)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}
                >
                  {item.riskScore}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item.address, item.chain);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-nova-red/20 rounded transition-all"
                >
                  <Trash2 className="w-3 h-3 text-nova-red" />
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Main page component
export default function ContractScanner() {
  const [address, setAddress] = useState("");
  const [selectedChain, setSelectedChain] = useState<ChainId>("ethereum");
  const [showChainDropdown, setShowChainDropdown] = useState(false);

  const { scanContract, result, isLoading, error, reset, isFromCache } = useContractScanner();
  const { refresh: refreshHistory } = useScanHistory();

  const handleScan = async () => {
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) return;
    await scanContract(address, selectedChain);
    refreshHistory();
  };

  const handleHistorySelect = (addr: string, chain: ChainId) => {
    setAddress(addr);
    setSelectedChain(chain);
    scanContract(addr, chain);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (/^0x[a-fA-F0-9]{40}$/.test(text)) {
        setAddress(text);
      }
    } catch {
      // Clipboard access denied
    }
  };

  const selectedChainData = CHAINS.find((c) => c.id === selectedChain);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-20"
    >
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          className="text-3xl font-bold text-text-primary mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Contract Scanner
        </motion.h1>
        <motion.p
          className="text-text-secondary"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Analyze any token contract for scams, honeypots, and rug pull risks
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        {/* Main content */}
        <div className="space-y-6">
          {/* Search box */}
          <motion.div
            className="p-4 rounded-2xl bg-bg-secondary/50 border border-border-primary/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Chain selector */}
              <div className="relative">
                <button
                  onClick={() => setShowChainDropdown(!showChainDropdown)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-bg-tertiary border border-border-primary/30 hover:border-border-primary/50 transition-colors min-w-[140px]"
                >
                  <span className="text-lg">{selectedChainData?.icon}</span>
                  <span className="text-text-primary">{selectedChainData?.name}</span>
                  <ChevronDown className="w-4 h-4 text-text-muted ml-auto" />
                </button>

                <AnimatePresence>
                  {showChainDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-2 w-full bg-bg-secondary border border-border-primary/30 rounded-xl overflow-hidden z-10 shadow-xl"
                    >
                      {CHAINS.map((chain) => (
                        <button
                          key={chain.id}
                          onClick={() => {
                            setSelectedChain(chain.id);
                            setShowChainDropdown(false);
                          }}
                          className={`w-full flex items-center gap-2 px-4 py-2 hover:bg-bg-tertiary transition-colors ${
                            chain.id === selectedChain
                              ? "bg-accent-cyan/10 text-accent-cyan"
                              : "text-text-primary"
                          }`}
                        >
                          <span>{chain.icon}</span>
                          <span>{chain.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Address input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleScan()}
                  placeholder="Enter contract address (0x...)"
                  className="w-full px-4 py-3 pr-20 rounded-xl bg-bg-tertiary border border-border-primary/30 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-cyan/50 font-mono text-sm"
                />
                <button
                  onClick={handlePaste}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-accent-cyan hover:bg-accent-cyan/10 rounded transition-colors"
                >
                  Paste
                </button>
              </div>

              {/* Scan button */}
              <motion.button
                onClick={handleScan}
                disabled={isLoading || !address || !/^0x[a-fA-F0-9]{40}$/.test(address)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-purple text-bg-primary font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Scan
                  </>
                )}
              </motion.button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 rounded-lg bg-nova-red/20 border border-nova-red/30 text-nova-red text-sm"
              >
                {error.message}
              </motion.div>
            )}
          </motion.div>

          {/* Results or placeholder */}
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result">
                {isFromCache && (
                  <div className="mb-4 flex items-center justify-between p-3 rounded-lg bg-accent-purple/10 border border-accent-purple/20">
                    <span className="text-sm text-text-secondary">
                      Showing cached result from {new Date(result.analyzedAt).toLocaleTimeString()}
                    </span>
                    <button
                      onClick={() => scanContract(address, selectedChain)}
                      className="flex items-center gap-1 text-sm text-accent-purple hover:underline"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                  </div>
                )}
                <AnalysisResult result={result} />
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 flex items-center justify-center">
                  <Shield className="w-10 h-10 text-accent-cyan" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Ready to Scan
                </h3>
                <p className="text-text-secondary max-w-md mx-auto">
                  Enter a contract address above to analyze it for potential scams, honeypots, and
                  other security risks.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="lg:order-last">
          <motion.div
            className="sticky top-4 p-4 rounded-2xl bg-bg-secondary/50 border border-border-primary/30"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ScanHistorySidebar onSelect={handleHistorySelect} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
