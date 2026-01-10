import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SecuritySystem {
  id: string;
  name: string;
  status: "armed" | "partial" | "warning" | "offline";
  progress: number;
  items: SecurityItem[];
}

interface SecurityItem {
  id: string;
  label: string;
  completed: boolean;
  priority: "critical" | "high" | "medium";
}

interface MissionControlProps {
  systems: SecuritySystem[];
  onItemToggle: (systemId: string, itemId: string) => void;
  className?: string;
}

export function MissionControl({ systems, onItemToggle, className }: MissionControlProps) {
  const [activeSystem, setActiveSystem] = useState<string | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);

  // Calculate overall progress
  useEffect(() => {
    const totalItems = systems.reduce((acc, sys) => acc + sys.items.length, 0);
    const completedItems = systems.reduce(
      (acc, sys) => acc + sys.items.filter((i) => i.completed).length,
      0
    );
    setOverallProgress(Math.round((completedItems / totalItems) * 100));
  }, [systems]);

  const statusConfig = {
    armed: {
      color: "text-quantum-green",
      bg: "bg-quantum-green/20",
      border: "border-quantum-green/50",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
      label: "ARMED",
      icon: CheckCircle2,
    },
    partial: {
      color: "text-plasma-orange",
      bg: "bg-plasma-orange/20",
      border: "border-plasma-orange/50",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.3)]",
      label: "PARTIAL",
      icon: AlertTriangle,
    },
    warning: {
      color: "text-nova-red",
      bg: "bg-nova-red/20",
      border: "border-nova-red/50",
      glow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]",
      label: "WARNING",
      icon: AlertTriangle,
    },
    offline: {
      color: "text-text-muted",
      bg: "bg-bg-tertiary",
      border: "border-border-default",
      glow: "",
      label: "OFFLINE",
      icon: Radio,
    },
  };

  return (
    <div className={cn("relative", className)}>
      {/* Header Panel */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-6 p-6 rounded-2xl bg-bg-secondary border border-border-default overflow-hidden"
      >
        {/* Scan line effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-aurora-cyan/5 to-transparent"
          animate={{ y: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ height: "200%" }}
        />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-3 rounded-xl bg-gradient-to-br from-aurora-cyan/20 to-aurora-purple/20 border border-aurora-cyan/30"
            >
              <Shield className="w-8 h-8 text-aurora-cyan" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">SECURITY SYSTEMS</h2>
              <p className="text-sm text-text-muted">Mission Control Dashboard</p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-4xl font-bold aurora-text">{overallProgress}%</span>
              <span className="text-text-muted">OPERATIONAL</span>
            </div>
            <div className="w-48 h-2 bg-bg-tertiary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-aurora-cyan to-aurora-purple"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* System Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systems.map((system, index) => {
          const config = statusConfig[system.status];
          const StatusIcon = config.icon;
          const isActive = activeSystem === system.id;

          return (
            <motion.div
              key={system.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.button
                onClick={() => setActiveSystem(isActive ? null : system.id)}
                className={cn(
                  "w-full p-4 rounded-xl border text-left transition-all duration-300",
                  config.bg,
                  config.border,
                  isActive && config.glow
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* System Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={system.status === "armed" ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={cn("p-2 rounded-lg", config.bg)}
                    >
                      <StatusIcon className={cn("w-5 h-5", config.color)} />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-text-primary">{system.name}</h3>
                      <span className={cn("text-xs font-mono", config.color)}>
                        [{config.label}]
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={cn(
                      "w-5 h-5 text-text-muted transition-transform",
                      isActive && "rotate-90"
                    )}
                  />
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                  <motion.div
                    className={cn("h-full rounded-full", {
                      "bg-quantum-green": system.status === "armed",
                      "bg-plasma-orange": system.status === "partial",
                      "bg-nova-red": system.status === "warning",
                      "bg-text-muted": system.status === "offline",
                    })}
                    initial={{ width: 0 }}
                    animate={{ width: `${system.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-text-muted">
                  <span>
                    {system.items.filter((i) => i.completed).length}/{system.items.length} secured
                  </span>
                  <span>{system.progress}%</span>
                </div>
              </motion.button>

              {/* Expanded Items */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 p-3 space-y-2 bg-bg-secondary rounded-xl border border-border-default">
                      {system.items.map((item) => (
                        <SecurityItemRow
                          key={item.id}
                          item={item}
                          onToggle={() => onItemToggle(system.id, item.id)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Status Indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 flex items-center justify-center gap-6"
      >
        {Object.entries(statusConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", config.bg)} />
            <span className={cn("text-xs font-mono", config.color)}>{config.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// Security Item Row Component
function SecurityItemRow({
  item,
  onToggle,
}: {
  item: SecurityItem;
  onToggle: () => void;
}) {
  const priorityConfig = {
    critical: { color: "text-nova-red", bg: "bg-nova-red/20", label: "CRIT" },
    high: { color: "text-plasma-orange", bg: "bg-plasma-orange/20", label: "HIGH" },
    medium: { color: "text-aurora-cyan", bg: "bg-aurora-cyan/20", label: "MED" },
  };

  const config = priorityConfig[item.priority];

  return (
    <motion.button
      onClick={onToggle}
      className={cn(
        "w-full flex items-center gap-3 p-2 rounded-lg transition-all",
        "hover:bg-bg-tertiary/50",
        item.completed && "opacity-60"
      )}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className={cn(
          "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
          item.completed
            ? "bg-quantum-green border-quantum-green"
            : "border-border-default"
        )}
        animate={item.completed ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {item.completed && <CheckCircle2 className="w-3 h-3 text-bg-primary" />}
      </motion.div>

      <span
        className={cn(
          "flex-1 text-left text-sm",
          item.completed ? "line-through text-text-muted" : "text-text-primary"
        )}
      >
        {item.label}
      </span>

      <span className={cn("px-1.5 py-0.5 text-2xs font-mono rounded", config.bg, config.color)}>
        {config.label}
      </span>

      {item.completed ? (
        <Lock className="w-4 h-4 text-quantum-green" />
      ) : (
        <Unlock className="w-4 h-4 text-text-muted" />
      )}
    </motion.button>
  );
}
