import { motion } from "framer-motion";
import { Lock, Unlock, Calendar, TrendingUp } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

interface EscrowRelease {
  id: string;
  month: string;
  year: number;
  released: number;
  returned: number;
  netReleased: number;
  status: "completed" | "upcoming";
}

// Placeholder escrow data - in production this would come from an API
const PLACEHOLDER_ESCROW: EscrowRelease[] = [
  { id: "1", month: "January", year: 2026, released: 1000000000, returned: 800000000, netReleased: 200000000, status: "completed" },
  { id: "2", month: "February", year: 2026, released: 1000000000, returned: 0, netReleased: 0, status: "upcoming" },
  { id: "3", month: "December", year: 2025, released: 1000000000, returned: 850000000, netReleased: 150000000, status: "completed" },
  { id: "4", month: "November", year: 2025, released: 1000000000, returned: 900000000, netReleased: 100000000, status: "completed" },
  { id: "5", month: "October", year: 2025, released: 1000000000, returned: 750000000, netReleased: 250000000, status: "completed" },
];

interface EscrowTrackerProps {
  releases?: EscrowRelease[];
  isLoading?: boolean;
  compact?: boolean;
}

export function EscrowTracker({
  releases = PLACEHOLDER_ESCROW,
  isLoading,
  compact = false,
}: EscrowTrackerProps) {
  const displayReleases = compact ? releases.slice(0, 4) : releases;

  // Calculate total stats
  const totalReleased = releases
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + r.netReleased, 0);

  return (
    <div className="rounded-2xl bg-bg-secondary/50 border border-xrp-cyan/10 overflow-hidden">
      <div className="p-4 border-b border-border-default">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-xrp-cyan/10">
              <Lock className="w-4 h-4 text-xrp-cyan" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Escrow Tracker</h3>
              <p className="text-xs text-text-muted">Monthly XRP releases</p>
            </div>
          </div>
          {!compact && (
            <div className="text-right">
              <div className="text-xs text-text-muted">Net Released (YTD)</div>
              <div className="font-semibold text-xrp-cyan">
                {formatNumber(totalReleased)} XRP
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary bar */}
      <div className="p-4 bg-xrp-navy/30 border-b border-border-default">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-text-muted mb-1">Monthly Release</div>
            <div className="font-bold text-text-primary">1B XRP</div>
          </div>
          <div>
            <div className="text-xs text-text-muted mb-1">Avg. Returned</div>
            <div className="font-bold text-quantum-green">~80%</div>
          </div>
          <div>
            <div className="text-xs text-text-muted mb-1">Remaining</div>
            <div className="font-bold text-text-primary">~40B XRP</div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border-default">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 animate-pulse">
              <div className="h-4 bg-bg-tertiary rounded w-3/4 mb-2" />
              <div className="h-3 bg-bg-tertiary rounded w-1/2" />
            </div>
          ))
        ) : (
          displayReleases.map((release, index) => (
            <motion.div
              key={release.id}
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
                      release.status === "completed"
                        ? "bg-quantum-green/10 text-quantum-green"
                        : "bg-solar-gold/10 text-solar-gold"
                    )}
                  >
                    {release.status === "completed" ? (
                      <Unlock className="w-4 h-4" />
                    ) : (
                      <Calendar className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-text-primary">
                      {release.month} {release.year}
                    </div>
                    <div className="text-xs text-text-muted">
                      {release.status === "completed" ? "Released" : "Scheduled"}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {release.status === "completed" ? (
                    <>
                      <div className="text-sm">
                        <span className="text-text-muted">Net: </span>
                        <span className="font-semibold text-xrp-cyan">
                          {formatNumber(release.netReleased)}
                        </span>
                      </div>
                      <div className="text-xs text-quantum-green">
                        {formatNumber(release.returned)} returned
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-1 text-solar-gold text-sm">
                      <Calendar className="w-3 h-3" />
                      Pending
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-border-default bg-bg-tertiary/30">
        <p className="text-xs text-text-muted text-center">
          Ripple releases 1B XRP monthly, unused returns to escrow
        </p>
      </div>
    </div>
  );
}
