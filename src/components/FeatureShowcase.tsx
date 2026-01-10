import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield,
  ScanLine,
  Wallet,
  Award,
  Sparkles,
  ArrowRight,
  Zap,
  Lock,
  Eye,
  Newspaper,
  Headphones,
} from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  gradient: string;
  glowColor: string;
  badge?: string;
  stats?: string;
}

const features: Feature[] = [
  {
    title: "Crypto News",
    description: "Real-time aggregated news from top crypto sources with AI-powered text-to-speech reader for hands-free consumption",
    icon: Newspaper,
    path: "/news",
    gradient: "from-pink-500 to-rose-500",
    glowColor: "rgba(236, 72, 153, 0.4)",
    badge: "AI Reader",
    stats: "6 top sources",
  },
  {
    title: "Wallet Guardian",
    description: "Scan token approvals, detect risky permissions, and revoke unlimited allowances to protect your assets",
    icon: Wallet,
    path: "/wallet-guardian",
    gradient: "from-emerald-500 to-cyan-500",
    glowColor: "rgba(16, 185, 129, 0.4)",
    badge: "Web3",
    stats: "3 chains supported",
  },
  {
    title: "Contract Scanner",
    description: "AI-powered smart contract security analysis. Detect honeypots, rugpulls, and malicious patterns instantly",
    icon: ScanLine,
    path: "/scanner",
    gradient: "from-violet-500 to-purple-500",
    glowColor: "rgba(139, 92, 246, 0.4)",
    badge: "AI Powered",
    stats: "Multi-chain",
  },
  {
    title: "Security Training",
    description: "Test your crypto security knowledge with AI quizzes and realistic phishing simulations",
    icon: Shield,
    path: "/security",
    gradient: "from-amber-500 to-orange-500",
    glowColor: "rgba(245, 158, 11, 0.4)",
    badge: "Interactive",
    stats: "Earn certificates",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export function FeatureShowcase() {
  return (
    <section className="mb-10">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="relative">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-aurora-purple/20 to-aurora-cyan/20 border border-aurora-purple/30">
            <Sparkles className="w-5 h-5 text-aurora-purple" />
          </div>
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-aurora-cyan rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            Security Tools
            <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-aurora-cyan/20 to-aurora-purple/20 text-aurora-cyan rounded-full border border-aurora-cyan/30">
              NEW
            </span>
          </h2>
          <p className="text-sm text-text-muted">
            Powerful tools to protect your crypto journey
          </p>
        </div>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {features.map((feature, index) => (
          <FeatureCard key={feature.path} feature={feature} index={index} />
        ))}
      </motion.div>
    </section>
  );
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;

  return (
    <motion.div variants={itemVariants}>
      <Link to={feature.path} className="block group">
        <motion.div
          className="relative h-full p-5 rounded-2xl bg-bg-secondary/80 backdrop-blur-sm border border-border-default overflow-hidden transition-all duration-300 group-hover:border-transparent"
          whileHover={{
            scale: 1.02,
            boxShadow: `0 20px 40px -15px ${feature.glowColor}`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Gradient overlay on hover */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
          />

          {/* Animated border gradient */}
          <motion.div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            style={{ padding: "1px" }}
            initial={false}
          >
            <div className="absolute inset-[1px] rounded-2xl bg-bg-secondary/95" />
          </motion.div>

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <motion.div
                className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Icon className="w-5 h-5 text-white" />
              </motion.div>

              {feature.badge && (
                <span className="px-2 py-1 text-xs font-medium bg-bg-tertiary/80 text-text-muted rounded-lg border border-border-default group-hover:border-aurora-cyan/30 group-hover:text-aurora-cyan transition-all">
                  {feature.badge}
                </span>
              )}
            </div>

            {/* Title & Description */}
            <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:aurora-text transition-all duration-300">
              {feature.title}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed mb-4">
              {feature.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-border-default/50">
              {feature.stats && (
                <span className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Zap className="w-3 h-3 text-aurora-cyan" />
                  {feature.stats}
                </span>
              )}

              <motion.span
                className="flex items-center gap-1 text-sm font-medium text-aurora-cyan opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                Explore
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.span>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2" />
        </motion.div>
      </Link>
    </motion.div>
  );
}

// Compact version for sidebar or smaller spaces
export function FeatureShowcaseCompact() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-aurora-purple" />
        <span className="text-sm font-medium text-text-primary">New Features</span>
      </div>

      {features.map((feature) => {
        const Icon = feature.icon;
        return (
          <Link
            key={feature.path}
            to={feature.path}
            className="flex items-center gap-3 p-3 rounded-xl bg-bg-tertiary/50 border border-border-default hover:border-aurora-cyan/30 hover:bg-bg-tertiary transition-all group"
          >
            <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.gradient}`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-text-primary group-hover:text-aurora-cyan transition-colors">
                {feature.title}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-aurora-cyan group-hover:translate-x-1 transition-all" />
          </Link>
        );
      })}
    </div>
  );
}
