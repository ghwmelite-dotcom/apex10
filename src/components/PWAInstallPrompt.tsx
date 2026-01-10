import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Share, Plus, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;

  useEffect(() => {
    // Don't show if already installed
    if (isStandalone) return;

    // Check if user previously dismissed
    const dismissedAt = localStorage.getItem("pwa-install-dismissed");
    if (dismissedAt) {
      const daysSince = (Date.now() - new Date(dismissedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return; // Don't show for 7 days after dismissal
    }

    // Listen for beforeinstallprompt (Android/Desktop Chrome)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show prompt after user engagement
      setTimeout(() => setShowPrompt(true), 15000); // 15 seconds
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // For iOS, show after engagement
    if (isIOS && !isStandalone) {
      setTimeout(() => setShowPrompt(true), 20000); // 20 seconds for iOS
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, [isIOS, isStandalone]);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      setShowPrompt(false);
      return;
    }

    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setShowPrompt(false);
      }
    } catch {
      // User dismissed or error
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = (permanent = false) => {
    setShowPrompt(false);
    if (permanent) {
      localStorage.setItem("pwa-install-dismissed", new Date().toISOString());
    }
  };

  const handleCloseIOSModal = () => {
    setShowIOSModal(false);
    localStorage.setItem("pwa-install-dismissed", new Date().toISOString());
  };

  // Don't render if already installed
  if (isStandalone) return null;

  return (
    <>
      {/* Install Banner */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50"
          >
            <div className="relative p-4 rounded-2xl bg-bg-secondary/95 backdrop-blur-xl border border-aurora-cyan/30 shadow-lg shadow-aurora-cyan/10">
              {/* Gradient border effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-aurora-cyan/20 via-aurora-blue/10 to-aurora-purple/20 opacity-50" />

              <div className="relative flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-aurora-cyan/20 to-aurora-purple/20 border border-aurora-cyan/30">
                  <Download className="w-6 h-6 text-aurora-cyan" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary text-base">
                    Install Apex10
                  </h3>
                  <p className="mt-1 text-sm text-text-muted leading-snug">
                    Add to home screen for quick access and offline support
                  </p>

                  {/* Actions */}
                  <div className="mt-3 flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleInstall}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-aurora-cyan to-aurora-blue text-bg-primary font-medium text-sm shadow-lg shadow-aurora-cyan/20 hover:shadow-aurora-cyan/30 transition-shadow"
                    >
                      Install
                    </motion.button>
                    <button
                      onClick={() => handleDismiss(false)}
                      className="px-3 py-2 text-sm text-text-muted hover:text-text-secondary transition-colors"
                    >
                      Not now
                    </button>
                  </div>

                  {/* Don't show again */}
                  <button
                    onClick={() => handleDismiss(true)}
                    className="mt-2 text-xs text-text-disabled hover:text-text-muted transition-colors"
                  >
                    Don't show again
                  </button>
                </div>

                {/* Close button */}
                <button
                  onClick={() => handleDismiss(false)}
                  className="flex-shrink-0 p-1.5 rounded-lg hover:bg-bg-tertiary transition-colors"
                >
                  <X className="w-4 h-4 text-text-muted" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Instructions Modal */}
      <AnimatePresence>
        {showIOSModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={handleCloseIOSModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm"
            >
              <div className="relative p-6 rounded-2xl bg-bg-secondary border border-border-default overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-aurora-cyan/5 to-aurora-purple/5" />

                {/* Content */}
                <div className="relative">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-aurora-cyan/20 to-aurora-blue/20 border border-aurora-cyan/30">
                      <Smartphone className="w-6 h-6 text-aurora-cyan" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">
                        Install on iOS
                      </h3>
                      <p className="text-sm text-text-muted">
                        Add Apex10 to your home screen
                      </p>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-4">
                    {/* Step 1 */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-aurora-cyan/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-aurora-cyan">1</span>
                      </div>
                      <div className="pt-0.5">
                        <p className="text-sm text-text-secondary">
                          Tap the{" "}
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-bg-tertiary">
                            <Share className="w-3.5 h-3.5 text-aurora-blue" />
                            <span className="text-aurora-blue font-medium">Share</span>
                          </span>{" "}
                          button in Safari
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-aurora-cyan/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-aurora-cyan">2</span>
                      </div>
                      <div className="pt-0.5">
                        <p className="text-sm text-text-secondary">
                          Scroll down and tap{" "}
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-bg-tertiary">
                            <Plus className="w-3.5 h-3.5 text-aurora-cyan" />
                            <span className="text-aurora-cyan font-medium">Add to Home Screen</span>
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-aurora-cyan/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-aurora-cyan">3</span>
                      </div>
                      <div className="pt-0.5">
                        <p className="text-sm text-text-secondary">
                          Tap{" "}
                          <span className="px-1.5 py-0.5 rounded bg-aurora-cyan/20 text-aurora-cyan font-medium">
                            Add
                          </span>{" "}
                          to install Apex10
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Got it button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCloseIOSModal}
                    className="mt-6 w-full py-3 rounded-xl bg-bg-tertiary hover:bg-bg-elevated text-text-primary font-medium transition-colors"
                  >
                    Got it
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
