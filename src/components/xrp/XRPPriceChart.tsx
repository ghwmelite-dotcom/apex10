import { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatUsd, cn } from "@/lib/utils";
import { usePriceHistory } from "@/hooks/useAssets";

type Period = "24h" | "7d" | "30d" | "1y";

interface XRPPriceChartProps {
  currentPrice?: number;
  change24h?: number;
}

export function XRPPriceChart({ currentPrice, change24h }: XRPPriceChartProps) {
  const [period, setPeriod] = useState<Period>("7d");
  const { data: historyData, isLoading } = usePriceHistory("XRP", period);

  const periods: { value: Period; label: string }[] = [
    { value: "24h", label: "24H" },
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "1y", label: "1Y" },
  ];

  const chartData = historyData?.prices.map((p) => ({
    time: p.timestamp,
    price: p.price,
  })) || [];

  const isPositive = (change24h ?? 0) >= 0;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg-elevated border border-xrp-cyan/20 rounded-lg px-3 py-2 shadow-lg">
          <p className="text-text-primary font-semibold">
            {formatUsd(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-bg-secondary/50 border border-xrp-cyan/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border-default">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-text-primary">XRP Price Chart</h3>
            {currentPrice && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-text-primary">
                  {formatUsd(currentPrice)}
                </span>
                <div
                  className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded text-sm font-medium",
                    isPositive
                      ? "bg-quantum-green/10 text-quantum-green"
                      : "bg-nova-red/10 text-nova-red"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {isPositive ? "+" : ""}{(change24h ?? 0).toFixed(2)}%
                </div>
              </div>
            )}
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-1 bg-bg-tertiary rounded-lg p-1">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  period === p.value
                    ? "bg-xrp-cyan text-xrp-navy"
                    : "text-text-muted hover:text-text-primary"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72 p-4">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-xrp-cyan border-t-transparent rounded-full animate-spin" />
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="xrpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00AAE4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00AAE4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  if (period === "24h") {
                    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                  }
                  return date.toLocaleDateString([], { month: "short", day: "numeric" });
                }}
                minTickGap={50}
              />
              <YAxis
                domain={["auto", "auto"]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#00AAE4"
                strokeWidth={2}
                fill="url(#xrpGradient)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-text-muted">
            No price data available
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="px-4 py-3 border-t border-border-default bg-bg-tertiary/30 grid grid-cols-4 gap-4">
        <ChartStat label="High" value={chartData.length ? formatUsd(Math.max(...chartData.map(d => d.price))) : "--"} />
        <ChartStat label="Low" value={chartData.length ? formatUsd(Math.min(...chartData.map(d => d.price))) : "--"} />
        <ChartStat label="Avg" value={chartData.length ? formatUsd(chartData.reduce((s, d) => s + d.price, 0) / chartData.length) : "--"} />
        <ChartStat label="Range" value={chartData.length ? `${(((Math.max(...chartData.map(d => d.price)) - Math.min(...chartData.map(d => d.price))) / Math.min(...chartData.map(d => d.price))) * 100).toFixed(1)}%` : "--"} />
      </div>
    </div>
  );
}

function ChartStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-xs text-text-muted">{label}</div>
      <div className="font-medium text-text-primary text-sm">{value}</div>
    </div>
  );
}
