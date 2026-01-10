import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";

interface Activity {
  id: string;
  type: "buy" | "sell" | "alert";
  symbol: string;
  amount: string;
  price: string;
  time: Date;
}

const SYMBOLS = ["BTC", "ETH", "SOL", "AVAX", "LINK", "AAVE", "UNI", "ARB", "OP", "MATIC"];
const AMOUNTS = ["0.5", "1.2", "2.5", "0.8", "3.0", "1.5", "0.3", "5.0", "10", "0.1"];

function generateActivity(): Activity {
  const type = Math.random() > 0.7 ? "alert" : Math.random() > 0.5 ? "buy" : "sell";
  const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  const amount = AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)];
  const price = (Math.random() * 50000 + 100).toFixed(2);

  return {
    id: Math.random().toString(36).substring(7),
    type,
    symbol,
    amount,
    price,
    time: new Date(),
  };
}

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Generate initial activities
    const initial = Array.from({ length: 5 }, generateActivity);
    setActivities(initial);

    // Add new activity every 2-4 seconds
    const interval = setInterval(() => {
      if (!isPaused) {
        setActivities((prev) => {
          const newActivity = generateActivity();
          return [newActivity, ...prev.slice(0, 9)];
        });
      }
    }, 2000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      className="glass-card p-4 rounded-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Zap className="w-4 h-4 text-aurora-cyan" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-quantum-green rounded-full animate-pulse" />
          </div>
          <span className="text-sm font-medium text-text-primary">Live Activity</span>
        </div>
        <span className="text-xs text-text-muted">
          {isPaused ? "Paused" : "Live"}
        </span>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-hidden">
        <AnimatePresence mode="popLayout">
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center justify-between p-2 rounded-lg ${
                activity.type === "buy"
                  ? "bg-quantum-green/10"
                  : activity.type === "sell"
                  ? "bg-nova-red/10"
                  : "bg-aurora-cyan/10"
              }`}
            >
              <div className="flex items-center gap-2">
                {activity.type === "buy" ? (
                  <ArrowUpRight className="w-4 h-4 text-quantum-green" />
                ) : activity.type === "sell" ? (
                  <ArrowDownRight className="w-4 h-4 text-nova-red" />
                ) : (
                  <Zap className="w-4 h-4 text-aurora-cyan" />
                )}
                <span className="font-mono text-sm font-medium text-text-primary">
                  {activity.symbol}
                </span>
                <span className="text-xs text-text-muted">
                  {activity.type === "alert" ? "Price Alert" : `${activity.amount}`}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-text-secondary">
                  ${parseFloat(activity.price).toLocaleString()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Compact version for sidebar/header
export function LiveActivityTicker() {
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivity(generateActivity());
    }, 3000);

    setActivity(generateActivity());
    return () => clearInterval(interval);
  }, []);

  if (!activity) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activity.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-secondary/50 border border-border-default"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-quantum-green opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-quantum-green" />
        </span>
        <span className="text-xs text-text-muted">
          {activity.type === "buy" ? "+" : activity.type === "sell" ? "-" : "!"}
        </span>
        <span className="text-xs font-medium text-text-primary">
          {activity.symbol}
        </span>
        <span className={`text-xs ${
          activity.type === "buy" ? "text-quantum-green" :
          activity.type === "sell" ? "text-nova-red" : "text-aurora-cyan"
        }`}>
          ${parseFloat(activity.price).toLocaleString()}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
