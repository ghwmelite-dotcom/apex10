import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  TrendingUp, Shield, Gem, Music, Gamepad2, Zap, Building2,
  Dog, Link2, Coins, ExternalLink, Sparkles, Award, Crown,
  ChevronRight, Star, Flame, Trophy, ArrowUpRight
} from "lucide-react";

// Featured cryptos data from IBTimes "10 Crypto Companies to Invest in 2026"
const FEATURED_CRYPTOS = [
  {
    id: 1,
    name: "Ripple",
    symbol: "XRP",
    tagline: "Global Payments Leader",
    description: "300+ banking partners across 45 countries, $15B annual payments",
    icon: Building2,
    gradient: "from-[#00AAE4] to-[#00C2C7]",
    glowColor: "rgba(0, 170, 228, 0.4)",
    borderColor: "border-[#00AAE4]/30",
    hoverBorder: "hover:border-[#00AAE4]/60",
    iconBg: "bg-[#00AAE4]/10",
    textColor: "text-[#00AAE4]",
    rank: 1,
    category: "Payments",
    featured: true,
    url: "https://ripple.com/",
  },
  {
    id: 2,
    name: "Binance Coin",
    symbol: "BNB",
    tagline: "Exchange Ecosystem Powerhouse",
    description: "World's largest crypto exchange ecosystem with DeFi integration",
    icon: Coins,
    gradient: "from-[#F0B90B] to-[#F8D12F]",
    glowColor: "rgba(240, 185, 11, 0.4)",
    borderColor: "border-[#F0B90B]/30",
    hoverBorder: "hover:border-[#F0B90B]/60",
    iconBg: "bg-[#F0B90B]/10",
    textColor: "text-[#F0B90B]",
    rank: 2,
    category: "Exchange",
    featured: true,
    url: "https://www.binance.com/",
  },
  {
    id: 3,
    name: "Chainlink",
    symbol: "LINK",
    tagline: "Oracle Network Infrastructure",
    description: "Powering smart contracts with real-world data across chains",
    icon: Link2,
    gradient: "from-[#375BD2] to-[#2A5ADA]",
    glowColor: "rgba(55, 91, 210, 0.4)",
    borderColor: "border-[#375BD2]/30",
    hoverBorder: "hover:border-[#375BD2]/60",
    iconBg: "bg-[#375BD2]/10",
    textColor: "text-[#375BD2]",
    rank: 3,
    category: "Infrastructure",
    featured: false,
    url: "https://chain.link/",
  },
  {
    id: 4,
    name: "Tron",
    symbol: "TRX",
    tagline: "Stablecoin Transaction Leader",
    description: "Dominant in stablecoin transfers with high on-chain activity",
    icon: Zap,
    gradient: "from-[#FF0013] to-[#FF4D5A]",
    glowColor: "rgba(255, 0, 19, 0.3)",
    borderColor: "border-[#FF0013]/30",
    hoverBorder: "hover:border-[#FF0013]/60",
    iconBg: "bg-[#FF0013]/10",
    textColor: "text-[#FF0013]",
    rank: 4,
    category: "Blockchain",
    featured: false,
    url: "https://tron.network/",
  },
  {
    id: 5,
    name: "Dogecoin",
    symbol: "DOGE",
    tagline: "Community-Driven Movement",
    description: "The original memecoin with massive community support",
    icon: Dog,
    gradient: "from-[#C2A633] to-[#BA9F33]",
    glowColor: "rgba(194, 166, 51, 0.4)",
    borderColor: "border-[#C2A633]/30",
    hoverBorder: "hover:border-[#C2A633]/60",
    iconBg: "bg-[#C2A633]/10",
    textColor: "text-[#C2A633]",
    rank: 5,
    category: "Community",
    featured: false,
    url: "https://dogecoin.com/",
  },
  {
    id: 6,
    name: "Serenity",
    symbol: "SERSH",
    tagline: "MiCA-Compliant Digital Security",
    description: "Biometric-first infrastructure for secure digital asset access",
    icon: Shield,
    gradient: "from-[#8B5CF6] to-[#A78BFA]",
    glowColor: "rgba(139, 92, 246, 0.4)",
    borderColor: "border-[#8B5CF6]/30",
    hoverBorder: "hover:border-[#8B5CF6]/60",
    iconBg: "bg-[#8B5CF6]/10",
    textColor: "text-[#8B5CF6]",
    rank: 6,
    category: "Security",
    emerging: true,
    url: "https://s.technology/",
  },
  {
    id: 7,
    name: "MetaSpace",
    symbol: "MLD",
    tagline: "Web3 Gaming Revolution",
    description: "100K+ downloads, 2nd place Blockchain Game Awards 2025",
    icon: Gamepad2,
    gradient: "from-[#EC4899] to-[#F472B6]",
    glowColor: "rgba(236, 72, 153, 0.4)",
    borderColor: "border-[#EC4899]/30",
    hoverBorder: "hover:border-[#EC4899]/60",
    iconBg: "bg-[#EC4899]/10",
    textColor: "text-[#EC4899]",
    rank: 7,
    category: "Gaming",
    emerging: true,
    url: "https://metaspacechain.com/",
  },
  {
    id: 8,
    name: "FunHi",
    symbol: "FUNHI",
    tagline: "People-First Tokenization",
    description: "No-code anti-scam platform by Ray Youssef for Global South",
    icon: Gem,
    gradient: "from-[#10B981] to-[#34D399]",
    glowColor: "rgba(16, 185, 129, 0.4)",
    borderColor: "border-[#10B981]/30",
    hoverBorder: "hover:border-[#10B981]/60",
    iconBg: "bg-[#10B981]/10",
    textColor: "text-[#10B981]",
    rank: 8,
    category: "DeFi",
    emerging: true,
    url: "https://noones.com/",
  },
  {
    id: 9,
    name: "AURUM",
    symbol: "AUR",
    tagline: "AI-Powered Web3 Neobank",
    description: "$12M funding at $100M valuation, led by Binance pioneer",
    icon: Crown,
    gradient: "from-[#FFD700] to-[#FFA500]",
    glowColor: "rgba(255, 215, 0, 0.4)",
    borderColor: "border-[#FFD700]/30",
    hoverBorder: "hover:border-[#FFD700]/60",
    iconBg: "bg-[#FFD700]/10",
    textColor: "text-[#FFD700]",
    rank: 9,
    category: "Platform",
    emerging: true,
    url: "https://aurum-foundation.com/",
  },
  {
    id: 10,
    name: "BeatSwap",
    symbol: "BTX",
    tagline: "Music Meets Blockchain",
    description: "90%+ revenue to creators vs 12% industry avg via smart contracts",
    icon: Music,
    gradient: "from-[#00D4FF] to-[#00FFD1]",
    glowColor: "rgba(0, 212, 255, 0.4)",
    borderColor: "border-[#00D4FF]/30",
    hoverBorder: "hover:border-[#00D4FF]/60",
    iconBg: "bg-[#00D4FF]/10",
    textColor: "text-[#00D4FF]",
    rank: 10,
    category: "Entertainment",
    emerging: true,
    url: "https://x.com/BeatXswap",
  },
];

// Animated background orbs
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-aurora-purple/10 blur-[100px]"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-aurora-cyan/10 blur-[120px]"
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-solar-gold/5 blur-[80px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// Individual crypto card
function CryptoCard({ crypto, index }: { crypto: typeof FEATURED_CRYPTOS[0]; index: number }) {
  const Icon = crypto.icon;

  return (
    <motion.a
      href={crypto.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative block"
    >
      <div
        className={`relative h-full p-5 rounded-2xl bg-bg-secondary/60 backdrop-blur-sm border ${crypto.borderColor} ${crypto.hoverBorder} transition-all duration-300 overflow-hidden`}
      >
        {/* Hover glow effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${crypto.glowColor}, transparent 70%)`,
          }}
        />

        {/* Rank badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          {crypto.featured && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.05, type: "spring" }}
              className="px-2 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30"
            >
              <div className="flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] font-bold text-amber-400">TOP</span>
              </div>
            </motion.div>
          )}
          {crypto.emerging && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.05, type: "spring" }}
              className="px-2 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30"
            >
              <div className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-400">NEW</span>
              </div>
            </motion.div>
          )}
          <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="text-xs font-bold text-white/60">#{crypto.rank}</span>
          </div>
        </div>

        {/* Icon and header */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`relative w-14 h-14 rounded-xl ${crypto.iconBg} flex items-center justify-center overflow-hidden`}
          >
            {/* Icon glow */}
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background: `radial-gradient(circle, ${crypto.glowColor}, transparent 70%)`,
              }}
            />
            <Icon className={`w-7 h-7 ${crypto.textColor} relative z-10`} />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-lg truncate">{crypto.name}</h3>
              <span className={`text-sm font-medium ${crypto.textColor}`}>${crypto.symbol}</span>
            </div>
            <p className={`text-xs ${crypto.textColor} font-medium mt-0.5`}>{crypto.tagline}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2">
          {crypto.description}
        </p>

        {/* Category tag and action */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-gray-400 border border-white/5">
            {crypto.category}
          </span>
          <motion.div
            className={`flex items-center gap-1 ${crypto.textColor} text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity`}
            whileHover={{ x: 4 }}
          >
            <span>Visit Platform</span>
            <ExternalLink className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Bottom gradient line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent, ${crypto.glowColor}, transparent)`,
          }}
        />
      </div>
    </motion.a>
  );
}

// Main component
export function FeaturedCryptos2026() {
  return (
    <section className="relative py-12 sm:py-16 overflow-hidden">
      {/* Background effects */}
      <FloatingOrbs />

      <div className="relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-aurora-purple/10 via-aurora-cyan/10 to-aurora-purple/10 border border-aurora-purple/20 mb-4"
          >
            <Sparkles className="w-4 h-4 text-aurora-purple" />
            <span className="text-sm font-semibold text-aurora-purple">Featured for 2026</span>
            <Award className="w-4 h-4 text-aurora-cyan" />
          </motion.div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Top 10 Crypto{" "}
            <span className="bg-gradient-to-r from-aurora-cyan via-aurora-purple to-aurora-pink bg-clip-text text-transparent">
              Companies to Watch
            </span>
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Curated selection of the most promising crypto projects for 2026, from established leaders to emerging innovators
          </p>

          {/* Source attribution */}
          <motion.a
            href="https://www.ibtimes.com/10-crypto-companies-invest-2026-3795693"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Source: IBTimes</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.a>
        </motion.div>

        {/* Featured heroes (top 2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {FEATURED_CRYPTOS.slice(0, 2).map((crypto, index) => (
            <motion.a
              key={crypto.id}
              href={crypto.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group relative block"
            >
              <div
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${crypto.gradient} overflow-hidden cursor-pointer`}
                style={{ boxShadow: `0 20px 60px ${crypto.glowColor}` }}
              >
                {/* Animated shine */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-black/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <crypto.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-2xl font-bold text-white">{crypto.name}</h3>
                          <span className="text-white/70 font-medium">${crypto.symbol}</span>
                        </div>
                        <p className="text-white/80 text-sm font-medium">{crypto.tagline}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm">
                        <div className="flex items-center gap-1.5">
                          <Trophy className="w-4 h-4 text-white" />
                          <span className="text-sm font-bold text-white">#{crypto.rank}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-white/90 mb-4">{crypto.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1.5 rounded-full bg-black/20 text-sm font-medium text-white/80">
                      {crypto.category}
                    </span>
                    <motion.div
                      className="flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all"
                      whileHover={{ x: 4 }}
                    >
                      <span>Visit Platform</span>
                      <ExternalLink className="w-5 h-5" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Grid of remaining cryptos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED_CRYPTOS.slice(2).map((crypto, index) => (
            <CryptoCard key={crypto.id} crypto={crypto} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link
            to="/rankings"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-aurora-cyan to-aurora-purple text-black font-semibold hover:shadow-lg hover:shadow-aurora-cyan/30 transition-all"
          >
            <TrendingUp className="w-5 h-5" />
            View Full Rankings
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedCryptos2026;
