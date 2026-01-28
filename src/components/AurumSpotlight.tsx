import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  Bot,
  Calculator,
  ArrowRight,
  Crown,
  Zap,
  Users,
  DollarSign,
  Clock,
  ChevronRight,
  Star,
  ExternalLink,
} from "lucide-react";

// Animated counter for stats
const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

// Key highlight cards data
const highlights = [
  {
    icon: Bot,
    title: "AI Trading Bots",
    stat: "17.5%",
    label: "Monthly Returns",
    gradient: "from-aurora-cyan to-aurora-blue",
  },
  {
    icon: Calculator,
    title: "Power of 72",
    stat: "47",
    label: "Days to Double",
    gradient: "from-aurora-purple to-aurora-pink",
  },
  {
    icon: DollarSign,
    title: "Trading Volume",
    stat: "$50M+",
    label: "USDT Processed",
    gradient: "from-solar-gold to-plasma-orange",
  },
  {
    icon: Users,
    title: "Global Community",
    stat: "15K+",
    label: "Active Users",
    gradient: "from-quantum-green to-aurora-cyan",
  },
];

// Article snippets for carousel
const snippets = [
  {
    quote: "When artificial intelligence meets decentralized finance, the result isn't just innovation — it's a paradigm shift in how ordinary people build extraordinary wealth.",
    section: "Introduction",
  },
  {
    quote: "The Rule of 72 reveals what traditional finance doesn't want you to see: the rate of return matters exponentially more than the amount you start with.",
    section: "The Power of 72",
  },
  {
    quote: "While traditional investors wait 7 years to double their money in the stock market, AURUM's AI-driven trading bot can potentially achieve the same result in under two months.",
    section: "AURUM Calculation",
  },
];

export function AurumSpotlight() {
  const [activeSnippet, setActiveSnippet] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotate snippets
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setActiveSnippet((prev) => (prev + 1) % snippets.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isHovered]);

  return (
    <section className="relative py-12 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-solar-gold/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-aurora-purple/10 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      {/* Section Header */}
      <div className="relative z-10 text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-solar-gold/20 border border-solar-gold/30 mb-4"
        >
          <Crown className="w-4 h-4 text-solar-gold" />
          <span className="text-sm font-medium text-solar-gold">Featured Investment Opportunity</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold mb-3"
        >
          <span className="bg-gradient-to-r from-solar-gold via-plasma-orange to-solar-gold bg-clip-text text-transparent">
            AURUM
          </span>
          <span className="text-text-primary"> — Top 10 Company 2026</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-text-muted max-w-2xl mx-auto"
        >
          Discover how AI-powered trading and the Rule of 72 are revolutionizing wealth creation
        </motion.p>
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 grid lg:grid-cols-3 gap-6">
        {/* Left Column - Stats Grid */}
        <div className="lg:col-span-1 grid grid-cols-2 gap-4">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative"
            >
              <div className="glass-card p-4 h-full border border-border-default hover:border-solar-gold/50 transition-all duration-300">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} p-2 mb-3 group-hover:shadow-glow transition-shadow`}>
                  <item.icon className="w-full h-full text-white" />
                </div>

                {/* Stats */}
                <div className="text-2xl font-bold text-text-primary mb-1">
                  {item.stat}
                </div>
                <div className="text-xs text-text-muted">{item.label}</div>

                {/* Hover glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Center Column - Quote Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="glass-card p-6 h-full border border-solar-gold/30 relative overflow-hidden">
            {/* Gold accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-solar-gold via-plasma-orange to-solar-gold" />

            {/* Quote icon */}
            <div className="text-solar-gold/30 text-6xl font-serif leading-none mb-4">"</div>

            {/* Animated quotes */}
            <div className="min-h-[120px] relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSnippet}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-text-secondary text-sm md:text-base leading-relaxed italic mb-4">
                    {snippets[activeSnippet].quote}
                  </p>
                  <p className="text-solar-gold text-xs font-medium">
                    — {snippets[activeSnippet].section}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {snippets.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSnippet(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeSnippet
                      ? "bg-solar-gold w-6"
                      : "bg-text-muted/30 hover:bg-text-muted/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Rule of 72 Preview + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1 flex flex-col gap-4"
        >
          {/* Rule of 72 Mini Calculator Preview */}
          <div className="glass-card p-5 border border-aurora-purple/30 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-aurora-purple" />
              <h3 className="font-semibold text-text-primary">The Power of 72</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-muted">Traditional Savings (2%)</span>
                <span className="text-nova-red font-mono">36 years</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-muted">Stock Market (10%)</span>
                <span className="text-plasma-orange font-mono">7.2 years</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-muted font-medium">AURUM AI Bot</span>
                <span className="text-quantum-green font-mono font-bold">~47 days</span>
              </div>

              {/* Visual bar comparison */}
              <div className="pt-3 space-y-2">
                <div className="h-2 rounded-full bg-bg-tertiary overflow-hidden">
                  <div className="h-full w-full bg-nova-red/50 rounded-full" />
                </div>
                <div className="h-2 rounded-full bg-bg-tertiary overflow-hidden">
                  <div className="h-full w-1/5 bg-plasma-orange rounded-full" />
                </div>
                <div className="h-2 rounded-full bg-bg-tertiary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "3.5%" }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="h-full bg-gradient-to-r from-quantum-green to-aurora-cyan rounded-full shadow-glow"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link to="/aurum" className="block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-solar-gold via-plasma-orange to-solar-gold text-bg-primary font-semibold flex items-center justify-center gap-2 shadow-glow-gold hover:shadow-lg transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Read Full Article
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>

            <a
              href="https://backoffice.aurum.foundation/u/XHM02H"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-6 rounded-xl border-2 border-solar-gold/50 text-solar-gold font-medium flex items-center justify-center gap-2 hover:bg-solar-gold/10 transition-all"
              >
                <Zap className="w-4 h-4" />
                Join AURUM Today
                <ExternalLink className="w-4 h-4" />
              </motion.button>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom Feature Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="relative z-10 mt-8"
      >
        <div className="glass-card p-4 border border-border-default">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-quantum-green animate-pulse" />
              <span className="text-text-muted">AI-Powered Trading</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-solar-gold" />
              <span className="text-text-muted">Ex-Binance Leadership</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-aurora-cyan" />
              <span className="text-text-muted">24/7 Automated</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-aurora-purple" />
              <span className="text-text-muted">35+ Expert Team</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
