import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useSignMessage } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Wallet,
  Shield,
  CheckCircle,
  ExternalLink,
  Loader2,
  Sparkles,
  Link as LinkIcon,
  AlertCircle,
} from "lucide-react";
import type { CertificateData, CertificateTier } from "../Certificate";

interface MintCredentialProps {
  certificateData: CertificateData;
  userEmail: string;
  onMinted?: (tokenId: string, txHash: string) => void;
  onSkip?: () => void;
}

const TIER_COLORS: Record<CertificateTier, string> = {
  bronze: "from-amber-700 to-amber-500",
  silver: "from-slate-400 to-slate-300",
  gold: "from-yellow-500 to-yellow-300",
};

export function MintCredential({
  certificateData,
  userEmail,
  onMinted,
  onSkip,
}: MintCredentialProps) {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [mintSuccess, setMintSuccess] = useState<{
    tokenId: string;
    txHash: string;
    demo?: boolean;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleMint = async () => {
    if (!address) return;

    setIsMinting(true);
    setMintError(null);

    try {
      // Sign message to prove wallet ownership
      const timestamp = Date.now();
      const message = `Mint Apex10 Security Credential\nCertificate: ${certificateData.id}\nWallet: ${address}\nTimestamp: ${timestamp}`;
      const signature = await signMessageAsync({ message });

      // Call backend API to mint via relayer
      const response = await fetch("/api/credentials/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          certificateId: certificateData.id,
          tier: certificateData.tier,
          accuracy: certificateData.accuracy,
          email: userEmail,
          signature,
          message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Failed to mint credential");
      }

      if (result.success) {
        setMintSuccess({
          tokenId: result.tokenId,
          txHash: result.transactionHash,
          demo: result.demo,
        });
        onMinted?.(result.tokenId, result.transactionHash);
      } else {
        throw new Error(result.error || result.message || "Minting failed");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to mint credential";
      setMintError(errorMessage);
    } finally {
      setIsMinting(false);
    }
  };

  const copyVerifyLink = () => {
    if (!mintSuccess) return;
    const verifyUrl = `${window.location.origin}/verify/${mintSuccess.tokenId}`;
    navigator.clipboard.writeText(verifyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-5 rounded-xl bg-gradient-to-br from-accent-purple/10 to-accent-cyan/5 border border-accent-purple/20"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-accent-purple/20">
          <Wallet className="w-5 h-5 text-accent-purple" />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">Mint On-Chain Credential</h3>
          <p className="text-sm text-text-secondary">Verify your achievement on the blockchain</p>
        </div>
      </div>

      {/* Benefits list */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        {[
          { icon: Shield, text: "Permanently verifiable" },
          { icon: LinkIcon, text: "Shareable proof" },
          { icon: Sparkles, text: "Free to mint" },
          { icon: CheckCircle, text: "Non-transferable (SBT)" },
        ].map((benefit, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-sm text-text-secondary"
          >
            <benefit.icon className="w-4 h-4 text-accent-cyan" />
            {benefit.text}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!isConnected ? (
          <motion.div
            key="connect"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button
                  onClick={openConnectModal}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Wallet className="w-5 h-5" />
                  Connect Wallet
                </button>
              )}
            </ConnectButton.Custom>
          </motion.div>
        ) : mintSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-quantum-green/20 mb-3">
              <CheckCircle className="w-7 h-7 text-quantum-green" />
            </div>
            <h4 className="text-lg font-semibold text-text-primary mb-1">
              {mintSuccess.demo ? "Credential Saved!" : "Credential Minted!"}
            </h4>
            <p className="text-sm text-text-secondary mb-4">
              {mintSuccess.demo
                ? "Demo mode - blockchain minting coming soon"
                : `Token ID: #${mintSuccess.tokenId}`}
            </p>
            <div className="flex gap-2 justify-center">
              {!mintSuccess.demo && (
                <a
                  href={`https://polygonscan.com/tx/${mintSuccess.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-tertiary text-text-primary text-sm hover:bg-bg-tertiary/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View TX
                </a>
              )}
              <button
                onClick={copyVerifyLink}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-cyan/20 text-accent-cyan text-sm hover:bg-accent-cyan/30 transition-colors"
              >
                {copiedLink ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-4 h-4" />
                    Copy Verify Link
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="mint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between p-3 rounded-lg bg-bg-primary/50">
              <span className="text-sm text-text-secondary">Connected:</span>
              <span className="text-sm font-mono text-text-primary">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>

            {mintError && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-nova-red/10 border border-nova-red/20 text-nova-red text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{mintError}</span>
              </div>
            )}

            <button
              onClick={handleMint}
              disabled={isMinting}
              className={`w-full py-3 rounded-xl bg-gradient-to-r ${TIER_COLORS[certificateData.tier]} text-bg-primary font-semibold flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-opacity`}
            >
              {isMinting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Minting...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Mint {certificateData.tier.charAt(0).toUpperCase() + certificateData.tier.slice(1)} Credential
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip option */}
      {!mintSuccess && onSkip && (
        <button
          onClick={onSkip}
          className="w-full mt-3 py-2 text-sm text-text-muted hover:text-text-secondary transition-colors"
        >
          Skip for now
        </button>
      )}
    </motion.div>
  );
}

export default MintCredential;
