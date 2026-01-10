import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

export function OfflineIndicator() {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowBackOnline(true);
      const timer = setTimeout(() => {
        setShowBackOnline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  return (
    <AnimatePresence>
      {/* Offline Banner */}
      {!isOnline && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-[60]"
          style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
        >
          <div className="bg-nova-red/95 backdrop-blur-sm py-2.5 px-4">
            <div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <WifiOff className="w-4 h-4 text-white" />
              </motion.div>
              <span className="text-white text-sm font-medium">
                You're offline
              </span>
              <span className="text-white/70 text-sm hidden sm:inline">
                — Some features may be limited
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Back Online Banner */}
      {showBackOnline && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-[60]"
          style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
        >
          <div className="bg-quantum-green/95 backdrop-blur-sm py-2.5 px-4">
            <div className="flex items-center justify-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
              >
                <Wifi className="w-4 h-4 text-white" />
              </motion.div>
              <span className="text-white text-sm font-medium">
                Back online
              </span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: 1 }}
              >
                <RefreshCw className="w-3.5 h-3.5 text-white/70" />
              </motion.div>
              <span className="text-white/70 text-sm hidden sm:inline">
                Syncing data...
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
