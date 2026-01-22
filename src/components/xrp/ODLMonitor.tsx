import { motion } from "framer-motion";
import { Globe, Activity, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ODLCorridor {
  id: string;
  from: string;
  to: string;
  fromFlag: string;
  toFlag: string;
  status: "active" | "moderate" | "low";
  volume24h: string;
  provider: string;
}

// Placeholder ODL corridors - in production this would come from an API
const PLACEHOLDER_CORRIDORS: ODLCorridor[] = [
  { id: "1", from: "Mexico", to: "USA", fromFlag: "🇲🇽", toFlag: "🇺🇸", status: "active", volume24h: "$45M", provider: "Bitso" },
  { id: "2", from: "Philippines", to: "USA", fromFlag: "🇵🇭", toFlag: "🇺🇸", status: "active", volume24h: "$32M", provider: "Coins.ph" },
  { id: "3", from: "Japan", to: "Philippines", fromFlag: "🇯🇵", toFlag: "🇵🇭", status: "moderate", volume24h: "$18M", provider: "SBI" },
  { id: "4", from: "Australia", to: "Thailand", fromFlag: "🇦🇺", toFlag: "🇹🇭", status: "moderate", volume24h: "$12M", provider: "Flash FX" },
  { id: "5", from: "UK", to: "Mexico", fromFlag: "🇬🇧", toFlag: "🇲🇽", status: "low", volume24h: "$5M", provider: "Various" },
  { id: "6", from: "Brazil", to: "USA", fromFlag: "🇧🇷", toFlag: "🇺🇸", status: "active", volume24h: "$28M", provider: "Mercado" },
];

interface ODLMonitorProps {
  corridors?: ODLCorridor[];
  isLoading?: boolean;
  compact?: boolean;
}

export function ODLMonitor({
  corridors = PLACEHOLDER_CORRIDORS,
  isLoading,
  compact = false,
}: ODLMonitorProps) {
  const statusConfig = {
    active: { color: "text-quantum-green", bg: "bg-quantum-green/10", label: "High" },
    moderate: { color: "text-solar-gold", bg: "bg-solar-gold/10", label: "Med" },
    low: { color: "text-text-muted", bg: "bg-bg-tertiary", label: "Low" },
  };

  const displayCorridors = compact ? corridors.slice(0, 4) : corridors;

  return (
    <div className="rounded-2xl bg-bg-secondary/50 border border-xrp-cyan/10 overflow-hidden">
      <div className="p-4 border-b border-border-default">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-xrp-cyan/10">
            <Globe className="w-4 h-4 text-xrp-cyan" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">ODL Corridors</h3>
            <p className="text-xs text-text-muted">On-Demand Liquidity activity</p>
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
          displayCorridors.map((corridor, index) => (
            <motion.div
              key={corridor.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-bg-tertiary/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Corridor visualization */}
                  <div className="flex items-center gap-1">
                    <span className="text-lg">{corridor.fromFlag}</span>
                    <ArrowRight className="w-3 h-3 text-text-muted" />
                    <span className="text-lg">{corridor.toFlag}</span>
                  </div>

                  <div>
                    <div className="text-sm text-text-primary">
                      {corridor.from} → {corridor.to}
                    </div>
                    <div className="text-xs text-text-muted">
                      via {corridor.provider}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-text-primary">
                    {corridor.volume24h}
                  </div>
                  <div
                    className={cn(
                      "inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded",
                      statusConfig[corridor.status].bg,
                      statusConfig[corridor.status].color
                    )}
                  >
                    <Activity className="w-3 h-3" />
                    {statusConfig[corridor.status].label}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-border-default bg-bg-tertiary/30">
        <p className="text-xs text-text-muted text-center">
          ODL enables instant cross-border payments
        </p>
      </div>
    </div>
  );
}
