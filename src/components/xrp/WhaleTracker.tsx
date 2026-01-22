import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

interface WhaleTransaction {
  id: string;
  type: "in" | "out";
  amount: number;
  wallet: string;
  label?: string;
  timestamp: Date;
}

// Placeholder data - in production this would come from an API
const PLACEHOLDER_WHALES: WhaleTransaction[] = [
  { id: "1", type: "in", amount: 50000000, wallet: "rN7n3...Xu2B", label: "Unknown Whale", timestamp: new Date(Date.now() - 3600000) },
  { id: "2", type: "out", amount: 25000000, wallet: "rPT1A...9sXz", label: "Binance", timestamp: new Date(Date.now() - 7200000) },
  { id: "3", type: "in", amount: 100000000, wallet: "rGbH2...mK4P", label: "Unknown Whale", timestamp: new Date(Date.now() - 10800000) },
  { id: "4", type: "out", amount: 15000000, wallet: "rKLpX...7tYn", label: "Bitstamp", timestamp: new Date(Date.now() - 14400000) },
  { id: "5", type: "in", amount: 75000000, wallet: "rQ9Xm...Fp3L", label: "Ripple", timestamp: new Date(Date.now() - 18000000) },
];

interface WhaleTrackerProps {
  transactions?: WhaleTransaction[];
  isLoading?: boolean;
  compact?: boolean;
}

export function WhaleTracker({
  transactions = PLACEHOLDER_WHALES,
  isLoading,
  compact = false,
}: WhaleTrackerProps) {
  const formatTime = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / 3600000);
    if (hours < 1) return "< 1h ago";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="rounded-2xl bg-bg-secondary/50 border border-xrp-cyan/10 overflow-hidden">
      <div className="p-4 border-b border-border-default">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-xrp-cyan/10">
            <Wallet className="w-4 h-4 text-xrp-cyan" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Whale Tracker</h3>
            <p className="text-xs text-text-muted">Large XRP movements</p>
          </div>
        </div>
      </div>

      <div className={cn("divide-y divide-border-default", compact ? "max-h-64" : "max-h-96", "overflow-y-auto")}>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 animate-pulse">
              <div className="h-4 bg-bg-tertiary rounded w-3/4 mb-2" />
              <div className="h-3 bg-bg-tertiary rounded w-1/2" />
            </div>
          ))
        ) : (
          transactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-bg-tertiary/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-1.5 rounded-lg",
                      tx.type === "in"
                        ? "bg-quantum-green/10 text-quantum-green"
                        : "bg-nova-red/10 text-nova-red"
                    )}
                  >
                    {tx.type === "in" ? (
                      <ArrowDownRight className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-text-primary">
                        {tx.wallet}
                      </span>
                      {tx.label && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-bg-tertiary text-text-muted">
                          {tx.label}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
                      <Clock className="w-3 h-3" />
                      {formatTime(tx.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={cn(
                      "font-semibold",
                      tx.type === "in" ? "text-quantum-green" : "text-nova-red"
                    )}
                  >
                    {tx.type === "in" ? "+" : "-"}{formatNumber(tx.amount)}
                  </span>
                  <span className="text-xs text-text-muted ml-1">XRP</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-border-default bg-bg-tertiary/30">
        <p className="text-xs text-text-muted text-center">
          Tracking transactions {">"} 10M XRP
        </p>
      </div>
    </div>
  );
}
