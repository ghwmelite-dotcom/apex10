import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Wallet,
  Newspaper,
  Lock,
  Scale,
  Activity,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DeepDiveCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  metric?: string;
  metricLabel?: string;
  status?: "positive" | "neutral" | "warning";
  link: string;
  delay?: number;
}

function DeepDiveCard({
  icon,
  title,
  description,
  metric,
  metricLabel,
  status = "neutral",
  link,
  delay = 0,
}: DeepDiveCardProps) {
  const statusColors = {
    positive: "text-quantum-green",
    neutral: "text-xrp-cyan",
    warning: "text-solar-gold",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link
        to={link}
        className="block p-5 rounded-2xl bg-bg-secondary/50 border border-xrp-cyan/10 hover:border-xrp-cyan/30 hover:shadow-xrp-glow-sm transition-all group"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="p-2.5 rounded-xl bg-xrp-cyan/10 text-xrp-cyan">
            {icon}
          </div>
          <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-xrp-cyan group-hover:translate-x-1 transition-all" />
        </div>

        <h3 className="font-semibold text-text-primary mb-1">{title}</h3>
        <p className="text-sm text-text-muted mb-3">{description}</p>

        {metric && (
          <div className="flex items-baseline gap-2">
            <span className={cn("text-2xl font-bold", statusColors[status])}>
              {metric}
            </span>
            {metricLabel && (
              <span className="text-xs text-text-muted">{metricLabel}</span>
            )}
          </div>
        )}
      </Link>
    </motion.div>
  );
}

export function XRPDeepDive() {
  const cards = [
    {
      icon: <Wallet className="w-5 h-5" />,
      title: "Whale Activity",
      description: "Track top wallet movements and accumulation patterns",
      metric: "12",
      metricLabel: "large txns today",
      status: "positive" as const,
      link: "/xrp#whales",
    },
    {
      icon: <Newspaper className="w-5 h-5" />,
      title: "Ripple News",
      description: "Latest headlines from Ripple and XRP ecosystem",
      metric: "5",
      metricLabel: "new articles",
      status: "neutral" as const,
      link: "/xrp#news",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "Escrow Tracker",
      description: "Monthly XRP releases from Ripple's escrow",
      metric: "1B",
      metricLabel: "XRP released monthly",
      status: "neutral" as const,
      link: "/xrp#escrow",
    },
    {
      icon: <Scale className="w-5 h-5" />,
      title: "Regulatory Status",
      description: "SEC case updates and global regulatory clarity",
      metric: "Settled",
      metricLabel: "",
      status: "positive" as const,
      link: "/xrp#regulatory",
    },
    {
      icon: <Activity className="w-5 h-5" />,
      title: "XRPL Stats",
      description: "Network transactions, accounts, and activity metrics",
      metric: "1.2M",
      metricLabel: "daily txns",
      status: "positive" as const,
      link: "/xrp#stats",
    },
  ];

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <span className="w-1 h-6 bg-xrp-gradient rounded-full" />
            XRP Deep Dive
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Intelligence and analytics for serious XRP holders
          </p>
        </div>
        <Link
          to="/xrp"
          className="flex items-center gap-1 text-sm text-xrp-cyan hover:underline"
        >
          Full XRP Hub
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card, index) => (
          <DeepDiveCard key={card.title} {...card} delay={index * 0.05} />
        ))}
      </div>
    </section>
  );
}
