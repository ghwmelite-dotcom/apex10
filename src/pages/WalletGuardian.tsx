import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useChainId, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  Wallet,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Clock,
  Trash2,
  Info,
  Sparkles,
  TrendingUp,
  Lock,
  Unlock,
} from "lucide-react";
import { ConnectWallet } from "../components/web3/ConnectWallet";
import type { TokenApproval, ApprovalRisk, WalletSecurityScore } from "../api/types";

// Chain configuration
const CHAINS = [
  { id: "ethereum", name: "Ethereum", chainId: 1 },
  { id: "polygon", name: "Polygon", chainId: 137 },
  { id: "bsc", name: "BNB Chain", chainId: 56 },
];

// Risk colors
const RISK_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  critical: { bg: "bg-nova-red/20", text: "text-nova-red", border: "border-nova-red" },
  high: { bg: "bg-plasma-orange/20", text: "text-plasma-orange", border: "border-plasma-orange" },
  medium: { bg: "bg-solar-gold/20", text: "text-solar-gold", border: "border-solar-gold" },
  low: { bg: "bg-aurora-cyan/20", text: "text-aurora-cyan", border: "border-aurora-cyan" },
};

// Grade colors
const GRADE_COLORS: Record<string, string> = {
  A: "text-quantum-green",
  B: "text-aurora-cyan",
  C: "text-solar-gold",
  D: "text-plasma-orange",
  F: "text-nova-red",
};

// Security grade card
function SecurityGradeCard({ score }: { score: WalletSecurityScore }) {
  const gradeColor = GRADE_COLORS[score.grade] || "text-text-primary";

  return (
    <motion.div
      className="p-6 rounded-2xl bg-gradient-to-br from-bg-secondary/80 to-bg-tertiary/50 border border-border-primary/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent-cyan" />
          Security Score
        </h3>
        <motion.span
          className={`text-5xl font-bold ${gradeColor}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        >
          {score.grade}
        </motion.span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-text-muted">Score</span>
          <span className="text-sm font-medium text-text-primary">{score.numericScore}/100</span>
        </div>
        <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${score.grade === "A" ? "bg-quantum-green" : score.grade === "B" ? "bg-aurora-cyan" : score.grade === "C" ? "bg-solar-gold" : score.grade === "D" ? "bg-plasma-orange" : "bg-nova-red"}`}
            initial={{ width: 0 }}
            animate={{ width: `${score.numericScore}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-2 rounded-lg bg-nova-red/10">
          <div className="text-xl font-bold text-nova-red">{score.breakdown.criticalIssues}</div>
          <div className="text-xs text-text-muted">Critical</div>
        </div>
        <div className="p-2 rounded-lg bg-plasma-orange/10">
          <div className="text-xl font-bold text-plasma-orange">{score.breakdown.highIssues}</div>
          <div className="text-xs text-text-muted">High</div>
        </div>
        <div className="p-2 rounded-lg bg-solar-gold/10">
          <div className="text-xl font-bold text-solar-gold">{score.breakdown.mediumIssues}</div>
          <div className="text-xs text-text-muted">Medium</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border-primary/20 text-center">
        <span className="text-sm text-text-muted">
          {score.breakdown.totalApprovals} total approvals scanned
        </span>
      </div>
    </motion.div>
  );
}

// Approval card
function ApprovalCard({
  approval,
  risk,
  onRevoke,
  isRevoking,
}: {
  approval: TokenApproval;
  risk: ApprovalRisk;
  onRevoke: () => void;
  isRevoking: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = RISK_COLORS[risk.riskLevel] || RISK_COLORS.medium;
  const isUnlimited = approval.approvalAmount.length > 30;
  const approvalDate = new Date(approval.approvalTimestamp).toLocaleDateString();

  return (
    <motion.div
      className={`rounded-xl border ${colors.border}/30 ${colors.bg} overflow-hidden`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={`w-10 h-10 rounded-full ${colors.bg} border ${colors.border}/50 flex items-center justify-center flex-shrink-0`}
          >
            <span className="text-lg font-bold">{approval.tokenSymbol.charAt(0)}</span>
          </div>
          <div className="text-left min-w-0">
            <div className="font-medium text-text-primary truncate">
              {approval.tokenName} ({approval.tokenSymbol})
            </div>
            <div className="text-sm text-text-muted truncate">
              {approval.spenderName || `${approval.spenderAddress.slice(0, 8)}...${approval.spenderAddress.slice(-6)}`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {isUnlimited && (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-nova-red/20 text-nova-red border border-nova-red/30">
              UNLIMITED
            </span>
          )}
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}/50`}
          >
            {risk.riskLevel.toUpperCase()}
          </span>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-text-muted" />
          ) : (
            <ChevronRight className="w-5 h-5 text-text-muted" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border-primary/20"
          >
            <div className="p-4 space-y-4">
              {/* Risk explanation */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-bg-primary/50">
                <Sparkles className="w-4 h-4 text-accent-purple mt-0.5 flex-shrink-0" />
                <p className="text-sm text-text-secondary">{risk.aiExplanation}</p>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-text-muted" />
                  <span className="text-text-secondary">Approved: {approvalDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  {risk.factors.isContractVerified ? (
                    <CheckCircle className="w-4 h-4 text-quantum-green" />
                  ) : (
                    <XCircle className="w-4 h-4 text-nova-red" />
                  )}
                  <span className="text-text-secondary">
                    {risk.factors.isContractVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {risk.factors.spenderReputation === "trusted" ? (
                    <Lock className="w-4 h-4 text-quantum-green" />
                  ) : risk.factors.spenderReputation === "malicious" ? (
                    <AlertTriangle className="w-4 h-4 text-nova-red" />
                  ) : (
                    <Unlock className="w-4 h-4 text-solar-gold" />
                  )}
                  <span className="text-text-secondary capitalize">
                    {risk.factors.spenderReputation} protocol
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-text-muted" />
                  <span className="text-text-secondary">
                    {risk.factors.approvalAgeDays} days old
                  </span>
                </div>
              </div>

              {/* Revoke button */}
              {risk.recommendation !== "safe" && (
                <motion.button
                  onClick={onRevoke}
                  disabled={isRevoking}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
                    risk.recommendation === "revoke_immediately"
                      ? "bg-nova-red text-white"
                      : "bg-plasma-orange/20 text-plasma-orange border border-plasma-orange/30"
                  } disabled:opacity-50`}
                >
                  {isRevoking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Revoking...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      {risk.recommendation === "revoke_immediately"
                        ? "Revoke Immediately"
                        : "Revoke Approval"}
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Main component
export default function WalletGuardian() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [selectedChain, setSelectedChain] = useState("ethereum");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    approvals: TokenApproval[];
    risks: ApprovalRisk[];
    securityScore: WalletSecurityScore;
    scannedAt: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  // Transaction hooks
  const { sendTransaction, data: txHash } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Auto-scan on wallet connect
  useEffect(() => {
    if (isConnected && address) {
      handleScan();
    }
  }, [isConnected, address, selectedChain]);

  // Handle revoke confirmation
  useEffect(() => {
    if (isConfirmed && revokingId) {
      // Remove the revoked approval from the list
      setScanResult((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          approvals: prev.approvals.filter((a) => a.id !== revokingId),
          risks: prev.risks.filter((r) => r.approvalId !== revokingId),
        };
      });
      setRevokingId(null);
    }
  }, [isConfirmed, revokingId]);

  const handleScan = async () => {
    if (!address) return;

    setIsScanning(true);
    setError(null);

    try {
      const response = await fetch(`/api/wallet-guardian/scan/${address}?chain=${selectedChain}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Scan failed");
      }

      setScanResult(data.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to scan wallet");
    } finally {
      setIsScanning(false);
    }
  };

  const handleRevoke = async (approval: TokenApproval) => {
    if (!address) return;

    setRevokingId(approval.id);

    try {
      // Get revoke transaction data
      const response = await fetch("/api/wallet-guardian/revoke-tx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenAddress: approval.tokenAddress,
          spenderAddress: approval.spenderAddress,
          tokenType: approval.type,
          chain: selectedChain,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate revoke transaction");
      }

      // Send the transaction
      sendTransaction({
        to: data.to as `0x${string}`,
        data: data.data as `0x${string}`,
      });
    } catch (err) {
      console.error("Revoke error:", err);
      setRevokingId(null);
    }
  };

  // Not connected state
  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center pb-20"
      >
        <div className="text-center max-w-md mx-auto px-4">
          <motion.div
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Shield className="w-12 h-12 text-accent-cyan" />
          </motion.div>

          <h1 className="text-2xl font-bold text-text-primary mb-2">Wallet Security Guardian</h1>
          <p className="text-text-secondary mb-6">
            Connect your wallet to scan for dangerous token approvals, detect risks, and protect
            your assets.
          </p>

          <ConnectWallet variant="full" />

          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[
              { icon: Shield, label: "Scan Approvals" },
              { icon: AlertTriangle, label: "Detect Risks" },
              { icon: Trash2, label: "Revoke Dangers" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="p-3 rounded-xl bg-bg-secondary/50 border border-border-primary/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <item.icon className="w-6 h-6 mx-auto mb-2 text-accent-cyan" />
                <span className="text-xs text-text-muted">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-20"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Wallet Guardian</h1>
          <p className="text-text-secondary">
            Scan and manage your token approvals
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value)}
            className="px-3 py-2 rounded-lg bg-bg-secondary border border-border-primary/30 text-text-primary text-sm"
          >
            {CHAINS.map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
          <motion.button
            onClick={handleScan}
            disabled={isScanning}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Rescan
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-nova-red/20 border border-nova-red/30 text-nova-red"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </motion.div>
      )}

      {/* Loading state */}
      {isScanning && !scanResult && (
        <div className="text-center py-16">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-accent-cyan animate-spin" />
          <p className="text-text-secondary">Scanning your wallet for approvals...</p>
        </div>
      )}

      {/* Results */}
      {scanResult && (
        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar - Security Score */}
          <div className="lg:order-first">
            <SecurityGradeCard score={scanResult.securityScore} />

            <div className="mt-4 p-4 rounded-xl bg-bg-secondary/50 border border-border-primary/30">
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Clock className="w-4 h-4" />
                Last scanned: {new Date(scanResult.scannedAt).toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Main content - Approvals */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">
                Token Approvals ({scanResult.approvals.length})
              </h2>
            </div>

            {scanResult.approvals.length === 0 ? (
              <div className="text-center py-12 rounded-xl bg-bg-secondary/50 border border-border-primary/30">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-quantum-green" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">All Clear!</h3>
                <p className="text-text-secondary">No token approvals found for this wallet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {scanResult.approvals.map((approval) => {
                  const risk = scanResult.risks.find((r) => r.approvalId === approval.id);
                  if (!risk) return null;

                  return (
                    <ApprovalCard
                      key={approval.id}
                      approval={approval}
                      risk={risk}
                      onRevoke={() => handleRevoke(approval)}
                      isRevoking={revokingId === approval.id || (isConfirming && revokingId === approval.id)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
