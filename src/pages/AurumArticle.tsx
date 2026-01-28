import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Calculator,
  Building2,
  Bot,
  CreditCard,
  Shield,
  Globe,
  Users,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Clock,
  Star,
  Zap,
  Target,
  Award,
  CheckCircle,
  Play,
  ChevronDown,
  ExternalLink,
  Send,
  Rocket,
  Gift,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FloatingOrbs } from "@/components/ParticleBackground";

// Interactive Rule of 72 Calculator
function RuleOf72Calculator() {
  const [rate, setRate] = useState(17.5);
  const [principal, setPrincipal] = useState(10000);
  const doublingTime = 72 / (rate * 12); // Convert to years based on monthly rate

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative p-6 md:p-8 rounded-3xl bg-gradient-to-br from-aurora-cyan/10 via-bg-secondary to-aurora-purple/10 border border-aurora-cyan/30 shadow-glow overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-mesh-subtle opacity-50" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-aurora-cyan/20 border border-aurora-cyan/30">
            <Calculator className="w-6 h-6 text-aurora-cyan" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Power of 72 Calculator</h3>
            <p className="text-sm text-text-muted">See how fast your money doubles</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Monthly Return Rate: <span className="text-aurora-cyan">{rate}%</span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-bg-tertiary rounded-lg appearance-none cursor-pointer slider-aurora"
              />
              <div className="flex justify-between text-xs text-text-muted mt-1">
                <span>1%</span>
                <span>20%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Initial Investment (USDT)
              </label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl bg-bg-tertiary border border-border-default focus:border-aurora-cyan focus:outline-none text-text-primary"
              />
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col justify-center">
            <div className="p-6 rounded-2xl bg-bg-primary/50 border border-border-default">
              <div className="text-center">
                <p className="text-sm text-text-muted mb-1">Time to Double</p>
                <p className="text-4xl font-bold text-aurora-cyan mb-2">
                  {doublingTime.toFixed(1)} <span className="text-lg">months</span>
                </p>
                <p className="text-sm text-text-muted">
                  ~{(doublingTime / 12).toFixed(2)} years
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-border-default">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">After 1 year:</span>
                  <span className="text-success-green font-semibold">
                    ${(principal * Math.pow(1 + rate/100, 12)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Animated counter component
function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const end = value;
          const duration = 2000;
          const increment = end / (duration / 16);

          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-aurora-cyan">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

// Stats card component
function StatCard({ icon: Icon, value, label, suffix = "", prefix = "" }: {
  icon: React.ElementType;
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-2xl bg-bg-secondary/80 border border-border-default hover:border-aurora-cyan/30 transition-all group"
    >
      <div className="p-3 rounded-xl bg-aurora-cyan/10 w-fit mb-4 group-hover:bg-aurora-cyan/20 transition-colors">
        <Icon className="w-6 h-6 text-aurora-cyan" />
      </div>
      <AnimatedCounter value={value} suffix={suffix} prefix={prefix} />
      <p className="text-text-muted mt-2">{label}</p>
    </motion.div>
  );
}

// Table of contents
function TableOfContents({ activeSection }: { activeSection: string }) {
  const sections = [
    { id: "intro", label: "Introduction" },
    { id: "power-of-72", label: "The Power of 72" },
    { id: "trading-bots", label: "AI Trading Bots" },
    { id: "ecosystem", label: "The Ecosystem" },
    { id: "projections", label: "Wealth Projections" },
    { id: "why-2026", label: "Why 2026" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden xl:block fixed left-8 top-1/2 -translate-y-1/2 z-40"
    >
      <div className="p-4 rounded-2xl bg-bg-secondary/90 backdrop-blur-sm border border-border-default">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Contents</p>
        <nav className="space-y-2">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                "block text-sm py-1 px-3 rounded-lg transition-all",
                activeSection === section.id
                  ? "text-aurora-cyan bg-aurora-cyan/10"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              {section.label}
            </a>
          ))}
        </nav>
      </div>
    </motion.div>
  );
}

// Tier card for investment tiers
function TierCard({ tier, rate, share, min, max, featured = false }: {
  tier: string;
  rate: string;
  share: string;
  min: string;
  max: string;
  featured?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className={cn(
        "relative p-6 rounded-2xl border transition-all",
        featured
          ? "bg-gradient-to-br from-aurora-cyan/20 to-aurora-purple/20 border-aurora-cyan/50 shadow-glow"
          : "bg-bg-secondary/80 border-border-default hover:border-aurora-cyan/30"
      )}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-aurora-cyan text-bg-primary text-xs font-semibold">
          Most Popular
        </div>
      )}

      <h4 className={cn(
        "text-lg font-bold mb-2",
        featured ? "text-aurora-cyan" : "text-text-primary"
      )}>
        {tier}
      </h4>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-text-muted">Monthly Return</span>
          <span className="text-success-green font-semibold">{rate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Your Share</span>
          <span className="text-text-primary font-medium">{share}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Investment</span>
          <span className="text-text-secondary">{min} - {max}</span>
        </div>
      </div>
    </motion.div>
  );
}

// Floating CTA Bar Component
function FloatingCTABar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              layout
              className={cn(
                "relative rounded-2xl border backdrop-blur-xl overflow-hidden",
                "bg-gradient-to-r from-bg-secondary/95 via-aurora-cyan/5 to-bg-secondary/95",
                "border-aurora-cyan/40 shadow-glow"
              )}
            >
              {/* Animated border glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-aurora-cyan/20 via-aurora-purple/20 to-aurora-cyan/20 animate-aurora opacity-50" />

              <div className="relative p-4 md:p-5">
                {!isMinimized ? (
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    {/* Text */}
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                        <Gift className="w-5 h-5 text-nova-gold animate-bounce-subtle" />
                        <span className="text-sm font-semibold text-nova-gold">Exclusive Invitation</span>
                      </div>
                      <p className="text-text-primary font-medium">
                        Ready to start your wealth journey with AURUM?
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <motion.a
                        href="https://backoffice.aurum.foundation/u/XHM02H"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="group relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-bg-primary overflow-hidden"
                      >
                        {/* Animated gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-aurora-cyan via-aurora-blue to-aurora-cyan bg-[length:200%_100%] animate-shimmer" />
                        <span className="relative flex items-center gap-2">
                          <Rocket className="w-5 h-5" />
                          Join AURUM Now
                          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </motion.a>

                      <motion.a
                        href="https://t.me/+2Dh6dm4nZMsxZTg8"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0088cc] hover:bg-[#0099dd] text-white font-bold transition-colors"
                      >
                        <Send className="w-5 h-5" />
                        Join Telegram
                      </motion.a>
                    </div>

                    {/* Minimize button */}
                    <button
                      onClick={() => setIsMinimized(true)}
                      className="absolute top-2 right-2 p-1 text-text-muted hover:text-text-primary transition-colors"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsMinimized(false)}
                    className="w-full flex items-center justify-center gap-2 py-1 text-aurora-cyan hover:text-aurora-blue transition-colors"
                  >
                    <Gift className="w-4 h-4" />
                    <span className="text-sm font-medium">Show Invitation</span>
                    <ChevronRight className="w-4 h-4 rotate-[-90deg]" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Prominent CTA Section Component
function ProminentCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-16"
    >
      <div className="relative overflow-hidden rounded-3xl">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-aurora-cyan/30 via-aurora-purple/20 to-nova-gold/30" />
        <div className="absolute inset-0 bg-mesh-gradient opacity-50" />

        {/* Glowing orbs */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-aurora-cyan/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-aurora-purple/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />

        {/* Content */}
        <div className="relative p-8 md:p-12 lg:p-16">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nova-gold/20 border border-nova-gold/50 mb-6"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nova-gold opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-nova-gold" />
              </span>
              <span className="text-sm font-bold text-nova-gold">Limited Time Invitation</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              Your Seat at the Table is{" "}
              <span className="bg-gradient-to-r from-aurora-cyan via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
                Waiting
              </span>
            </h2>

            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Join thousands of forward-thinking investors who are already building wealth with AURUM's
              AI-powered trading ecosystem. Don't just watch the future - be part of it.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Primary CTA - Join AURUM */}
              <motion.a
                href="https://backoffice.aurum.foundation/u/XHM02H"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(0, 255, 209, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg overflow-hidden"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-aurora-cyan via-aurora-blue to-aurora-cyan bg-[length:200%_100%] animate-shimmer" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                <span className="relative flex items-center gap-3 text-bg-primary">
                  <Rocket className="w-6 h-6 group-hover:animate-bounce" />
                  <span>Start Your AURUM Journey</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </motion.a>

              {/* Secondary CTA - Telegram */}
              <motion.a
                href="https://t.me/+2Dh6dm4nZMsxZTg8"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#0088cc] hover:bg-[#00aaee] text-white font-bold text-lg transition-all shadow-lg hover:shadow-[0_0_30px_rgba(0,136,204,0.5)]"
              >
                <Send className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                <span>Connect on Telegram</span>
                <MessageCircle className="w-5 h-5" />
              </motion.a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-text-muted">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success-green" />
                15,000+ Active Users
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success-green" />
                $50M+ Trading Volume
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success-green" />
                24/7 Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default function AurumArticle() {
  const [activeSection, setActiveSection] = useState("intro");
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  // Track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen pb-32">
      <FloatingOrbs />
      <TableOfContents activeSection={activeSection} />
      <FloatingCTABar />

      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative pt-8 pb-20 overflow-hidden"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-mesh-gradient opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/50 to-bg-primary" />

        <div className="container-custom relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nova-gold/10 border border-nova-gold/30">
              <Award className="w-4 h-4 text-nova-gold" />
              <span className="text-sm font-medium text-nova-gold">Top 10 Companies to Watch in 2026</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6"
          >
            <span className="bg-gradient-to-r from-aurora-cyan via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
              AURUM
            </span>
            <br />
            <span className="text-text-primary text-3xl md:text-4xl lg:text-5xl">
              The Decentralized Fintech Giant
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-text-muted text-center max-w-3xl mx-auto mb-8"
          >
            How AI-powered trading bots and the Rule of 72 are creating a new paradigm
            for wealth generation in 2026
          </motion.p>

          {/* Meta info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-6 text-sm text-text-muted"
          >
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              15 min read
            </span>
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 text-nova-gold" />
              Featured Article
            </span>
          </motion.div>

          {/* Hero CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10"
          >
            <motion.a
              href="https://backoffice.aurum.foundation/u/XHM02H"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0, 255, 209, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg overflow-hidden shadow-glow"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-aurora-cyan via-aurora-blue to-aurora-cyan bg-[length:200%_100%] animate-shimmer" />
              <span className="relative flex items-center gap-2 text-bg-primary">
                <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                Join AURUM Now
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.a>

            <motion.a
              href="https://t.me/+2Dh6dm4nZMsxZTg8"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#0088cc] hover:bg-[#0099dd] text-white font-bold text-lg transition-all shadow-lg hover:shadow-[0_0_30px_rgba(0,136,204,0.5)]"
            >
              <Send className="w-5 h-5" />
              Join Telegram
            </motion.a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center mt-10"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="p-2 rounded-full border border-border-default"
            >
              <ChevronDown className="w-5 h-5 text-text-muted" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container-custom pb-20">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20 -mt-10"
        >
          <StatCard icon={TrendingUp} value={50} suffix="M+" label="USDT Trading Volume" prefix="$" />
          <StatCard icon={Bot} value={14} suffix="M+" label="AI Arbitrage Trades" prefix="$" />
          <StatCard icon={Users} value={15000} suffix="+" label="Active Users" />
          <StatCard icon={Zap} value={17.5} suffix="%" label="Avg Monthly Return" />
        </motion.div>

        {/* Introduction Section */}
        <section id="intro" className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-invert prose-lg max-w-4xl mx-auto"
          >
            <p className="text-xl text-text-secondary leading-relaxed">
              In a financial landscape cluttered with promises and riddled with complexity,
              one company has emerged from the noise with a proposition so compelling that
              institutional veterans from <span className="text-aurora-cyan font-semibold">Binance</span>,
              <span className="text-aurora-purple font-semibold"> Morgan Stanley</span>, and
              <span className="text-aurora-blue font-semibold"> IBM</span> have abandoned their
              corner offices to build it.
            </p>

            <p className="text-text-muted">
              That company is <strong className="text-aurora-cyan">AURUM</strong> - and if you
              haven't heard of it yet, 2026 will make sure you never forget it.
            </p>

            <p className="text-text-muted">
              AURUM isn't just another fintech startup chasing venture capital validation.
              It's a decentralized financial ecosystem that has already processed over
              <strong className="text-success-green"> 50 million USDT</strong> in trading volume,
              generated <strong className="text-success-green">14 million USDT</strong> through
              AI-powered arbitrage, and attracted more than <strong className="text-aurora-cyan">15,000 users</strong>.
            </p>
          </motion.div>
        </section>

        {/* First Prominent CTA */}
        <ProminentCTA />

        {/* Power of 72 Section */}
        <section id="power-of-72" className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aurora-purple/10 border border-aurora-purple/30 mb-4">
              <Sparkles className="w-4 h-4 text-aurora-purple" />
              <span className="text-sm font-medium text-aurora-purple">Financial Wisdom</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              The Power of <span className="text-aurora-cyan">72</span>
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              The mathematical secret Einstein called "the eighth wonder of the world" -
              and how AURUM supercharges it
            </p>
          </motion.div>

          {/* Calculator */}
          <div className="max-w-4xl mx-auto mb-12">
            <RuleOf72Calculator />
          </div>

          {/* Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="p-6 md:p-8 rounded-3xl bg-bg-secondary/80 border border-border-default">
              <h3 className="text-xl font-bold text-text-primary mb-4">Understanding the Rule</h3>
              <p className="text-text-muted mb-6">
                The Rule of 72 is elegantly simple: <strong className="text-text-primary">divide 72 by your
                interest rate</strong> to find how many years it takes to double your money.
              </p>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-default">
                      <th className="text-left py-3 px-4 text-text-secondary font-semibold">Investment Type</th>
                      <th className="text-center py-3 px-4 text-text-secondary font-semibold">Annual Return</th>
                      <th className="text-center py-3 px-4 text-text-secondary font-semibold">Years to Double</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border-default/50">
                      <td className="py-3 px-4 text-text-muted">Savings Account</td>
                      <td className="text-center py-3 px-4 text-text-muted">2%</td>
                      <td className="text-center py-3 px-4 text-nova-red">36 years</td>
                    </tr>
                    <tr className="border-b border-border-default/50">
                      <td className="py-3 px-4 text-text-muted">S&P 500 Average</td>
                      <td className="text-center py-3 px-4 text-text-muted">10%</td>
                      <td className="text-center py-3 px-4 text-plasma-orange">7.2 years</td>
                    </tr>
                    <tr className="bg-aurora-cyan/5 border-b border-aurora-cyan/20">
                      <td className="py-3 px-4 text-aurora-cyan font-semibold">AURUM EX-AI Bot</td>
                      <td className="text-center py-3 px-4 text-aurora-cyan font-semibold">~210%*</td>
                      <td className="text-center py-3 px-4 text-success-green font-bold">~47 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-text-muted mt-4">
                *Based on 17.5% average monthly returns compounded. Actual results may vary.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Trading Bots Section */}
        <section id="trading-bots" className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success-green/10 border border-success-green/30 mb-4">
              <Bot className="w-4 h-4 text-success-green" />
              <span className="text-sm font-medium text-success-green">AI-Powered Trading</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              The Three Pillars of AURUM's <span className="text-aurora-cyan">AI Empire</span>
            </h2>
          </motion.div>

          {/* Bot Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* EX-AI Bot */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative p-6 rounded-3xl bg-gradient-to-br from-aurora-cyan/10 to-bg-secondary border border-aurora-cyan/30 overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-aurora-cyan/10 rounded-full blur-3xl group-hover:bg-aurora-cyan/20 transition-all" />

              <div className="relative z-10">
                <div className="p-3 rounded-xl bg-aurora-cyan/20 w-fit mb-4">
                  <Bot className="w-8 h-8 text-aurora-cyan" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-2">EX-AI Bot</h3>
                <p className="text-3xl font-bold text-aurora-cyan mb-4">17.5% <span className="text-lg text-text-muted">monthly</span></p>
                <ul className="space-y-2 text-sm text-text-muted">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success-green" />
                    Fully autonomous 24/7 trading
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success-green" />
                    Multi-pair optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success-green" />
                    2.5 years proven track record
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* EX-AI Pro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative p-6 rounded-3xl bg-gradient-to-br from-aurora-purple/10 to-bg-secondary border border-aurora-purple/30 overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-aurora-purple/10 rounded-full blur-3xl group-hover:bg-aurora-purple/20 transition-all" />

              <div className="relative z-10">
                <div className="p-3 rounded-xl bg-aurora-purple/20 w-fit mb-4">
                  <Zap className="w-8 h-8 text-aurora-purple" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-2">EX-AI Pro Bot</h3>
                <p className="text-3xl font-bold text-aurora-purple mb-4">10% <span className="text-lg text-text-muted">monthly</span></p>
                <ul className="space-y-2 text-sm text-text-muted">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success-green" />
                    Full real-time transparency
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success-green" />
                    No lock-up on principal
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success-green" />
                    Adaptive strategy management
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Zeus AI Bot */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative p-6 rounded-3xl bg-gradient-to-br from-nova-gold/10 to-bg-secondary border border-nova-gold/30 overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-nova-gold/10 rounded-full blur-3xl group-hover:bg-nova-gold/20 transition-all" />

              <div className="relative z-10">
                <div className="p-3 rounded-xl bg-nova-gold/20 w-fit mb-4">
                  <Target className="w-8 h-8 text-nova-gold" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-2">Zeus AI Bot</h3>
                <p className="text-3xl font-bold text-nova-gold mb-4">15% <span className="text-lg text-text-muted">monthly</span></p>
                <ul className="space-y-2 text-sm text-text-muted">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success-green" />
                    Direct Telegram integration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success-green" />
                    BTC, ETH, BNB, DOGE trading
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success-green" />
                    24/7 transparent monitoring
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Investment Tiers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-text-primary text-center mb-8">
              EX-AI Bot Investment Tiers
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <TierCard tier="Basic" rate="10.49%" share="60%" min="$100" max="$249" />
              <TierCard tier="Standard" rate="11.37%" share="65%" min="$250" max="$999" />
              <TierCard tier="Comfort" rate="12.24%" share="70%" min="$1,000" max="$2,499" />
              <TierCard tier="VIP" rate="14.87%" share="85%" min="$10,000" max="$24,999" featured />
            </div>
          </motion.div>
        </section>

        {/* Ecosystem Section */}
        <section id="ecosystem" className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aurora-blue/10 border border-aurora-blue/30 mb-4">
              <Globe className="w-4 h-4 text-aurora-blue" />
              <span className="text-sm font-medium text-aurora-blue">Complete Ecosystem</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              More Than Just Trading Bots
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Building2, title: "AURUM Exchange", desc: "100+ digital assets with institutional-grade security", color: "aurora-cyan" },
              { icon: CreditCard, title: "AURUM Cards", desc: "Crypto debit cards with Apple Pay & Google Pay", color: "aurora-purple" },
              { icon: Shield, title: "AURUM NeoBank", desc: "Web 3.0 banking bridging traditional & digital finance", color: "aurora-blue" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-bg-secondary/80 border border-border-default hover:border-aurora-cyan/30 transition-all group"
              >
                <div className={`p-3 rounded-xl bg-${item.color}/10 w-fit mb-4 group-hover:bg-${item.color}/20 transition-colors`}>
                  <item.icon className={`w-6 h-6 text-${item.color}`} />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-muted">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Projections Section */}
        <section id="projections" className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                The Mathematics of <span className="text-aurora-cyan">Financial Freedom</span>
              </h2>
            </div>

            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-success-green/10 to-bg-secondary border border-success-green/30">
              <h3 className="text-xl font-bold text-text-primary mb-6">
                $10,000 Investment Growth (VIP Tier - 14.87% Monthly)
              </h3>

              <div className="space-y-4">
                {[
                  { month: "Month 1", value: "$11,487", growth: "+14.87%" },
                  { month: "Month 3", value: "$15,157", growth: "+51.57%" },
                  { month: "Month 6", value: "$22,974", growth: "+129.74%" },
                  { month: "Month 12", value: "$52,781", growth: "+427.81%" },
                ].map((item, i) => (
                  <motion.div
                    key={item.month}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-bg-primary/50 border border-border-default"
                  >
                    <span className="text-text-muted">{item.month}</span>
                    <div className="text-right">
                      <span className="text-xl font-bold text-text-primary">{item.value}</span>
                      <span className="ml-3 text-sm text-success-green">{item.growth}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="text-xs text-text-muted mt-6">
                *Projections based on historical performance. Actual returns may vary.
                This is not financial advice.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Why 2026 Section */}
        <section id="why-2026" className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-8">
              Why AURUM is a <span className="text-nova-gold">Top 10</span> Company for 2026
            </h2>

            <div className="grid md:grid-cols-2 gap-6 text-left">
              {[
                { title: "Veteran Leadership", desc: "CEO Bryan Benson brings 27 years of Web3 experience, including Director of Latin America for Binance" },
                { title: "Proven Results", desc: "$50M+ in trading volume and 14M+ USDT generated through AI arbitrage" },
                { title: "Complete Ecosystem", desc: "Exchange, NeoBank, Cards, RWA - a full financial infrastructure" },
                { title: "Global Community", desc: "15,000+ users across 20+ countries with regular global events" },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 p-6 rounded-2xl bg-bg-secondary/80 border border-border-default"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-nova-gold/20 flex items-center justify-center text-nova-gold font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary mb-1">{item.title}</h3>
                    <p className="text-sm text-text-muted">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Final CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative p-8 md:p-12 lg:p-16 rounded-3xl overflow-hidden"
        >
          {/* Multi-layered background */}
          <div className="absolute inset-0 bg-gradient-to-br from-aurora-cyan/20 via-aurora-purple/15 to-nova-gold/20" />
          <div className="absolute inset-0 bg-mesh-gradient opacity-40" />

          {/* Animated particles */}
          <div className="absolute top-10 left-10 w-4 h-4 bg-aurora-cyan rounded-full animate-float opacity-60" />
          <div className="absolute top-20 right-20 w-3 h-3 bg-aurora-purple rounded-full animate-float-slow opacity-60" />
          <div className="absolute bottom-10 left-1/4 w-5 h-5 bg-nova-gold rounded-full animate-float opacity-40" />
          <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-aurora-blue rounded-full animate-float-slow opacity-50" />

          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-3xl border-2 border-aurora-cyan/30 animate-pulse-glow" />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-nova-gold/20 to-aurora-cyan/20 border border-nova-gold/40 mb-6"
              >
                <Sparkles className="w-5 h-5 text-nova-gold animate-pulse" />
                <span className="text-sm font-bold bg-gradient-to-r from-nova-gold to-aurora-cyan bg-clip-text text-transparent">
                  EXCLUSIVE INVITATION
                </span>
                <Sparkles className="w-5 h-5 text-aurora-cyan animate-pulse" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
                The Future Starts{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-aurora-cyan via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
                    Here
                  </span>
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-aurora-cyan to-aurora-purple rounded-full"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  />
                </span>
              </h2>

              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                The question isn't whether you've heard of AURUM. The question is whether
                you'll be telling the story of how you found them <strong className="text-aurora-cyan">before the rest of the world caught on.</strong>
              </p>
            </div>

            {/* CTA Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
              {/* Join AURUM Card */}
              <motion.a
                href="https://backoffice.aurum.foundation/u/XHM02H"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="group relative p-6 md:p-8 rounded-2xl overflow-hidden cursor-pointer"
              >
                {/* Card background */}
                <div className="absolute inset-0 bg-gradient-to-br from-aurora-cyan/20 to-aurora-blue/10 group-hover:from-aurora-cyan/30 group-hover:to-aurora-blue/20 transition-all" />
                <div className="absolute inset-0 border-2 border-aurora-cyan/50 rounded-2xl group-hover:border-aurora-cyan group-hover:shadow-glow-lg transition-all" />

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-aurora-cyan/20 group-hover:bg-aurora-cyan/30 transition-colors">
                      <Rocket className="w-8 h-8 text-aurora-cyan group-hover:animate-bounce" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-text-primary">Join AURUM Now</h3>
                      <p className="text-sm text-text-muted">Start your wealth journey today</p>
                    </div>
                    <ExternalLink className="w-6 h-6 text-aurora-cyan group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>

                  <div className="p-4 rounded-xl bg-bg-primary/50 border border-border-default">
                    <p className="text-xs text-text-muted mb-2">Your Invitation Link:</p>
                    <p className="text-sm font-mono text-aurora-cyan break-all">
                      backoffice.aurum.foundation/u/XHM02H
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-aurora-cyan text-bg-primary font-bold group-hover:shadow-glow transition-all">
                    <span>Create Your Account</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.a>

              {/* Telegram Card */}
              <motion.a
                href="https://t.me/+2Dh6dm4nZMsxZTg8"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="group relative p-6 md:p-8 rounded-2xl overflow-hidden cursor-pointer"
              >
                {/* Card background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0088cc]/20 to-[#0099dd]/10 group-hover:from-[#0088cc]/30 group-hover:to-[#0099dd]/20 transition-all" />
                <div className="absolute inset-0 border-2 border-[#0088cc]/50 rounded-2xl group-hover:border-[#0088cc] group-hover:shadow-[0_0_30px_rgba(0,136,204,0.4)] transition-all" />

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-[#0088cc]/20 group-hover:bg-[#0088cc]/30 transition-colors">
                      <Send className="w-8 h-8 text-[#0088cc] group-hover:rotate-12 transition-transform" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-text-primary">Join Our Community</h3>
                      <p className="text-sm text-text-muted">Connect with us on Telegram</p>
                    </div>
                    <MessageCircle className="w-6 h-6 text-[#0088cc]" />
                  </div>

                  <div className="p-4 rounded-xl bg-bg-primary/50 border border-border-default">
                    <p className="text-xs text-text-muted mb-2">Telegram Group:</p>
                    <p className="text-sm font-mono text-[#0088cc]">
                      t.me/+2Dh6dm4nZMsxZTg8
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0088cc] text-white font-bold group-hover:bg-[#0099dd] group-hover:shadow-[0_0_20px_rgba(0,136,204,0.4)] transition-all">
                    <span>Join Telegram Group</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.a>
            </div>

            {/* Trust badges */}
            <div className="text-center">
              <p className="text-sm text-text-muted mb-4">Trusted by investors worldwide</p>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { icon: Users, text: "15,000+ Users" },
                  { icon: Globe, text: "20+ Countries" },
                  { icon: Shield, text: "Secure Platform" },
                  { icon: Zap, text: "24/7 Trading" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-bg-secondary/80 border border-border-default"
                  >
                    <item.icon className="w-4 h-4 text-aurora-cyan" />
                    <span className="text-sm text-text-secondary">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 p-6 rounded-2xl bg-bg-secondary/50 border border-border-default"
        >
          <p className="text-xs text-text-muted text-center">
            <strong>Disclaimer:</strong> This article is for informational purposes only and does not
            constitute financial advice. All investments carry risk, and past performance does not
            guarantee future results. Before making any financial decisions, conduct your own research
            and consider consulting with a qualified financial advisor. Never invest more than you can afford to lose.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
