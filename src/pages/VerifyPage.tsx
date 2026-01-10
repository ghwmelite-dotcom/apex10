import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, CheckCircle, ExternalLink, Award, Calendar, User, Loader2 } from "lucide-react";

// Placeholder component for credential verification
// Will be fully implemented when SBT contract is deployed
export default function VerifyPage() {
  const { tokenId } = useParams<{ tokenId: string }>();

  // Mock verification data - will be replaced with on-chain verification
  const mockCredential = {
    valid: true,
    tokenId,
    owner: "0x1234...5678",
    tier: "Gold",
    accuracy: 98,
    mintedAt: new Date().toISOString(),
    certificateId: "cert-abc123",
    contractAddress: "0x0000000000000000000000000000000000000000",
    chain: "polygon",
  };

  const tierColors: Record<string, { bg: string; text: string; border: string }> = {
    Bronze: { bg: "bg-amber-700/20", text: "text-amber-500", border: "border-amber-500" },
    Silver: { bg: "bg-slate-400/20", text: "text-slate-300", border: "border-slate-300" },
    Gold: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-400" },
  };

  const colors = tierColors[mockCredential.tier] || tierColors.Bronze;

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-quantum-green/20 border border-quantum-green/30 text-quantum-green mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Verified On-Chain</span>
          </motion.div>
          <h1 className="text-2xl font-bold text-text-primary">Security Credential</h1>
          <p className="text-text-secondary mt-1">Apex10 CryptoDiscover</p>
        </div>

        {/* Credential Card */}
        <motion.div
          className={`rounded-2xl border-2 ${colors.border}/50 overflow-hidden`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Top gradient bar */}
          <div className={`h-2 ${colors.bg}`} style={{ background: `linear-gradient(90deg, ${colors.text.replace('text-', '')} 0%, transparent 100%)` }} />

          <div className="p-6 bg-bg-secondary/50">
            {/* Badge */}
            <div className="flex items-center justify-center mb-6">
              <motion.div
                className={`w-24 h-24 rounded-full ${colors.bg} border-4 ${colors.border}/50 flex items-center justify-center`}
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
              >
                <Award className={`w-12 h-12 ${colors.text}`} />
              </motion.div>
            </div>

            {/* Tier */}
            <div className="text-center mb-6">
              <span className={`text-3xl font-bold ${colors.text}`}>
                {mockCredential.tier} Tier
              </span>
              <p className="text-text-secondary mt-1">Security Training Certification</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-bg-tertiary/50 text-center">
                <div className="text-2xl font-bold text-text-primary">{mockCredential.accuracy}%</div>
                <div className="text-sm text-text-muted">Accuracy Score</div>
              </div>
              <div className="p-4 rounded-xl bg-bg-tertiary/50 text-center">
                <div className="text-2xl font-bold text-text-primary">#{tokenId}</div>
                <div className="text-sm text-text-muted">Token ID</div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 rounded-lg bg-bg-tertiary/30">
                <div className="flex items-center gap-2 text-text-muted">
                  <User className="w-4 h-4" />
                  <span>Owner</span>
                </div>
                <span className="font-mono text-text-primary">{mockCredential.owner}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-bg-tertiary/30">
                <div className="flex items-center gap-2 text-text-muted">
                  <Calendar className="w-4 h-4" />
                  <span>Minted</span>
                </div>
                <span className="text-text-primary">
                  {new Date(mockCredential.mintedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-bg-tertiary/30">
                <div className="flex items-center gap-2 text-text-muted">
                  <Shield className="w-4 h-4" />
                  <span>Chain</span>
                </div>
                <span className="text-text-primary capitalize">{mockCredential.chain}</span>
              </div>
            </div>

            {/* Blockchain verification notice */}
            <div className="mt-6 p-4 rounded-xl bg-accent-purple/10 border border-accent-purple/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-accent-purple/20">
                  <Shield className="w-5 h-5 text-accent-purple" />
                </div>
                <div>
                  <h4 className="font-medium text-text-primary mb-1">Soulbound Token (SBT)</h4>
                  <p className="text-sm text-text-secondary">
                    This credential is a non-transferable token on the Polygon blockchain,
                    permanently linked to the holder's wallet.
                  </p>
                </div>
              </div>
            </div>

            {/* View on explorer button */}
            <a
              href={`https://polygonscan.com/token/${mockCredential.contractAddress}?a=${tokenId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View on PolygonScan
            </a>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-accent-cyan hover:underline"
          >
            Learn about Apex10 Security Training
          </a>
        </div>
      </motion.div>
    </div>
  );
}
