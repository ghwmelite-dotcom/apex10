import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Download,
  Share2,
  X,
  Mail,
  CheckCircle,
  Shield,
  Trophy,
  Star,
  Loader2,
  Sparkles,
  Wallet,
} from "lucide-react";
import { toPng } from "html-to-image";
import { MintCredential } from "./web3/MintCredential";

// Certificate tier based on accuracy
export type CertificateTier = "bronze" | "silver" | "gold";

export interface CertificateData {
  id: string;
  completedAt: Date;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  timeSpent: number; // seconds
  tier: CertificateTier;
  trainingType: "quiz" | "phishing" | "mixed";
}

interface CertificateProps {
  data: CertificateData;
  isOpen: boolean;
  onClose: () => void;
}

// Tier configuration
const TIER_CONFIG = {
  bronze: {
    label: "Bronze",
    color: "from-amber-700 to-amber-500",
    textColor: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    icon: Shield,
    minAccuracy: 70,
  },
  silver: {
    label: "Silver",
    color: "from-slate-400 to-slate-300",
    textColor: "text-slate-300",
    bgColor: "bg-slate-300/10",
    borderColor: "border-slate-300/30",
    icon: Star,
    minAccuracy: 85,
  },
  gold: {
    label: "Gold",
    color: "from-yellow-500 to-yellow-300",
    textColor: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/30",
    icon: Trophy,
    minAccuracy: 95,
  },
};

// Get tier based on accuracy
export function getTier(accuracy: number): CertificateTier {
  if (accuracy >= 95) return "gold";
  if (accuracy >= 85) return "silver";
  return "bronze";
}

// Format time as MM:SS
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// The actual certificate design (for rendering and export)
function CertificateDesign({
  data,
  innerRef,
}: {
  data: CertificateData;
  innerRef?: React.RefObject<HTMLDivElement>;
}) {
  const tier = TIER_CONFIG[data.tier];
  const TierIcon = tier.icon;
  const dateStr = data.completedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      ref={innerRef}
      className="relative w-full max-w-2xl aspect-[1.4/1] bg-bg-primary rounded-2xl overflow-hidden"
      style={{ minWidth: "600px" }}
    >
      {/* Background layers */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 209, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 209, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "30px 30px",
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-accent-cyan/10 blur-[80px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-accent-purple/10 blur-[80px]" />

        {/* Tier accent glow */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 rounded-full bg-gradient-to-r ${tier.color} opacity-5 blur-[60px]`}
        />
      </div>

      {/* Border frame */}
      <div className="absolute inset-3 rounded-xl border border-border-primary/30" />
      <div className="absolute inset-4 rounded-lg border border-border-primary/20" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-between p-8 pt-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-accent-cyan/50" />
            <span className="text-xs uppercase tracking-[0.3em] text-text-muted">
              Certificate of Completion
            </span>
            <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-accent-cyan/50" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-cyan via-white to-accent-purple bg-clip-text text-transparent">
            Apex10 Security Training
          </h1>
        </div>

        {/* Tier badge */}
        <div className="flex flex-col items-center -my-2">
          <div
            className={`p-4 rounded-2xl ${tier.bgColor} border ${tier.borderColor} mb-3`}
          >
            <TierIcon className={`w-12 h-12 ${tier.textColor}`} />
          </div>
          <div
            className={`px-4 py-1 rounded-full bg-gradient-to-r ${tier.color} text-bg-primary text-sm font-bold uppercase tracking-wider`}
          >
            {tier.label} Tier
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary">
              {data.accuracy}%
            </div>
            <div className="text-xs text-text-muted uppercase tracking-wider">
              Accuracy
            </div>
          </div>
          <div className="w-[1px] h-10 bg-border-primary/30" />
          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary">
              {data.correctAnswers}/{data.questionsAnswered}
            </div>
            <div className="text-xs text-text-muted uppercase tracking-wider">
              Correct
            </div>
          </div>
          <div className="w-[1px] h-10 bg-border-primary/30" />
          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary">
              {formatTime(data.timeSpent)}
            </div>
            <div className="text-xs text-text-muted uppercase tracking-wider">
              Time
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="text-sm text-text-secondary mb-1">{dateStr}</div>
          <div className="text-xs text-text-muted font-mono">
            ID: {data.id.slice(0, 8).toUpperCase()}
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-6 left-6 w-4 h-4 border-l-2 border-t-2 border-accent-cyan/30 rounded-tl" />
        <div className="absolute top-6 right-6 w-4 h-4 border-r-2 border-t-2 border-accent-cyan/30 rounded-tr" />
        <div className="absolute bottom-6 left-6 w-4 h-4 border-l-2 border-b-2 border-accent-purple/30 rounded-bl" />
        <div className="absolute bottom-6 right-6 w-4 h-4 border-r-2 border-b-2 border-accent-purple/30 rounded-br" />
      </div>
    </div>
  );
}

// Email capture form
function EmailCaptureForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (email: string) => void;
  isLoading: boolean;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-text-secondary mb-2"
        >
          Enter your email to unlock download & share
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-tertiary border border-border-primary focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/50 text-text-primary placeholder:text-text-muted outline-none transition-colors"
            disabled={isLoading}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-400">{error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-purple text-bg-primary font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            Unlock Certificate
          </>
        )}
      </button>
      <p className="text-xs text-text-muted text-center">
        We'll send you security tips and updates. Unsubscribe anytime.
      </p>
    </form>
  );
}

// Main Certificate Modal
export function CertificateModal({ data, isOpen, onClose }: CertificateProps) {
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showMinting, setShowMinting] = useState(false);
  const [credentialMinted, setCredentialMinted] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  const tier = TIER_CONFIG[data.tier];

  const handleEmailSubmit = useCallback(async (email: string) => {
    setIsSubmitting(true);
    try {
      // Submit email to API
      const response = await fetch("/api/security/certificate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          certificateId: data.id,
          tier: data.tier,
          accuracy: data.accuracy,
          completedAt: data.completedAt.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit email");
      }

      setUserEmail(email);
      setEmailSubmitted(true);
    } catch (error) {
      console.error("Email submission error:", error);
      // Still allow access even if API fails (graceful degradation)
      setUserEmail(email);
      setEmailSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [data]);

  const handleDownload = useCallback(async () => {
    if (!certificateRef.current) return;

    setIsDownloading(true);
    try {
      const dataUrl = await toPng(certificateRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#030712",
      });

      const link = document.createElement("a");
      link.download = `apex10-certificate-${data.tier}-${data.id.slice(0, 8)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setIsDownloading(false);
    }
  }, [data]);

  const handleShare = useCallback(async () => {
    if (!certificateRef.current) return;

    try {
      const dataUrl = await toPng(certificateRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#030712",
      });

      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `apex10-certificate.png`, { type: "image/png" });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Apex10 Security Training - ${tier.label} Certificate`,
          text: `I just earned a ${tier.label} tier certificate with ${data.accuracy}% accuracy on Apex10 Security Training!`,
          files: [file],
        });
      } else {
        // Fallback: copy to clipboard or open share dialog
        const shareUrl = `https://apex10-cryptodiscover.ghwmelite.workers.dev/security`;
        const shareText = `I just earned a ${tier.label} tier certificate with ${data.accuracy}% accuracy on Apex10 Security Training! ${shareUrl}`;

        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareText);
          alert("Share text copied to clipboard!");
        }
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  }, [data, tier]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-bg-primary/90 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative w-full max-w-3xl bg-bg-secondary rounded-2xl border border-border-primary/50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-lg hover:bg-bg-tertiary text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header celebration */}
            <div className="relative px-6 pt-6 pb-4 text-center border-b border-border-primary/30">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-cyan/20 to-accent-purple/20 border border-accent-cyan/30 mb-3"
              >
                <Sparkles className="w-4 h-4 text-accent-cyan" />
                <span className="text-sm font-medium text-text-primary">
                  Congratulations!
                </span>
                <Sparkles className="w-4 h-4 text-accent-purple" />
              </motion.div>
              <h2 className="text-2xl font-bold text-text-primary">
                You've Earned a Certificate!
              </h2>
              <p className="text-text-secondary mt-1">
                {tier.label} tier with {data.accuracy}% accuracy
              </p>
            </div>

            {/* Certificate preview */}
            <div className="p-6 flex justify-center overflow-x-auto">
              <CertificateDesign data={data} innerRef={certificateRef} />
            </div>

            {/* Action area */}
            <div className="px-6 pb-6">
              {!emailSubmitted ? (
                <div className="max-w-md mx-auto">
                  <EmailCaptureForm
                    onSubmit={handleEmailSubmit}
                    isLoading={isSubmitting}
                  />
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-center gap-2 text-sm text-quantum-green">
                    <CheckCircle className="w-4 h-4" />
                    <span>Email verified: {userEmail}</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-blue text-bg-primary font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {isDownloading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Download className="w-5 h-5" />
                      )}
                      Download PNG
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleShare}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Share2 className="w-5 h-5" />
                      Share
                    </motion.button>
                  </div>

                  {/* Blockchain verification option */}
                  {!showMinting && !credentialMinted && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowMinting(true)}
                      className="w-full py-3 rounded-xl bg-accent-purple/10 border border-accent-purple/30 text-accent-purple font-medium flex items-center justify-center gap-2 hover:bg-accent-purple/20 transition-colors"
                    >
                      <Wallet className="w-5 h-5" />
                      Add Blockchain Verification
                    </motion.button>
                  )}

                  {showMinting && (
                    <MintCredential
                      certificateData={data}
                      userEmail={userEmail}
                      onMinted={(tokenId, txHash) => {
                        setCredentialMinted(true);
                        setShowMinting(false);
                      }}
                      onSkip={() => setShowMinting(false)}
                    />
                  )}

                  {credentialMinted && (
                    <div className="flex items-center justify-center gap-2 text-sm text-accent-purple">
                      <Shield className="w-4 h-4" />
                      <span>On-chain credential minted</span>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook to manage certificate state
export function useCertificate() {
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const awardCertificate = useCallback((stats: {
    questionsAnswered: number;
    correctAnswers: number;
    timeSpent: number;
    trainingType: "quiz" | "phishing" | "mixed";
  }) => {
    const accuracy = Math.round((stats.correctAnswers / stats.questionsAnswered) * 100);
    const tier = getTier(accuracy);

    const data: CertificateData = {
      id: crypto.randomUUID(),
      completedAt: new Date(),
      questionsAnswered: stats.questionsAnswered,
      correctAnswers: stats.correctAnswers,
      accuracy,
      timeSpent: stats.timeSpent,
      tier,
      trainingType: stats.trainingType,
    };

    setCertificateData(data);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    certificateData,
    isModalOpen,
    awardCertificate,
    closeModal,
  };
}

export default CertificateModal;
