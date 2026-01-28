import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Star, Trophy, Rocket, Heart, Shield, Zap, Gift,
  ChevronRight, ChevronLeft, CheckCircle2, Circle, Lock,
  Coins, Wallet, BookOpen, Brain, Target, Gem, Crown,
  PartyPopper, Flame, ArrowRight, Play, RotateCcw,
  HelpCircle, Lightbulb, ThumbsUp, X, Volume2, VolumeX
} from "lucide-react";

// ============================================
// TUTORIAL CONTENT - Kid-Friendly Crypto Lessons
// ============================================

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface TutorialStep {
  id: string;
  title: string;
  emoji: string;
  content: string;
  analogy?: string;
  funFact?: string;
  quiz?: QuizQuestion;
  animation?: "coins" | "rocket" | "shield" | "wallet" | "chain";
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  icon: typeof Coins;
  color: string;
  gradient: string;
  glowColor: string;
  xpReward: number;
  difficulty: "Easy" | "Medium" | "Fun Challenge";
  timeMinutes: number;
  steps: TutorialStep[];
  badge: {
    name: string;
    emoji: string;
  };
}

const BEGINNER_TUTORIALS: Tutorial[] = [
  {
    id: "what-is-crypto",
    title: "What is Cryptocurrency?",
    description: "Discover the magic of digital money!",
    icon: Coins,
    color: "#FFD700",
    gradient: "from-amber-400 to-orange-500",
    glowColor: "rgba(255, 215, 0, 0.4)",
    xpReward: 100,
    difficulty: "Easy",
    timeMinutes: 5,
    badge: { name: "Crypto Explorer", emoji: "🔍" },
    steps: [
      {
        id: "intro",
        title: "Welcome, Future Crypto Expert!",
        emoji: "👋",
        content: "Have you ever played a video game where you collect coins or gems? Cryptocurrency is kind of like that, but it's REAL digital money that people use all around the world!",
        analogy: "Think of cryptocurrency like the coins in your favorite video game - except you can use them to buy real things!",
        animation: "coins",
      },
      {
        id: "what-is-money",
        title: "First, Let's Talk About Money",
        emoji: "💵",
        content: "Regular money (like dollars or euros) is made by governments and stored in banks. You can hold it in your hand as paper bills or coins. But what if money could live on the internet?",
        funFact: "The first known coins were made over 2,600 years ago in ancient Turkey!",
      },
      {
        id: "digital-money",
        title: "Money Goes Digital!",
        emoji: "✨",
        content: "Cryptocurrency is special digital money that lives on computers all around the world. No single person or government controls it - it belongs to everyone who uses it!",
        analogy: "Imagine if your whole class shared one big notebook where everyone writes down who has how many gold stars. That's kind of how crypto works - everyone keeps track together!",
        animation: "chain",
      },
      {
        id: "why-special",
        title: "What Makes Crypto Special?",
        emoji: "🌟",
        content: "Crypto can be sent to anyone, anywhere in the world, in just minutes! It's like sending a text message, but you're sending money instead. No banks needed!",
        funFact: "The first real purchase with Bitcoin was 2 pizzas for 10,000 Bitcoin. Today, that would be worth hundreds of millions of dollars! 🍕",
        quiz: {
          question: "What is cryptocurrency?",
          options: [
            "Regular coins you find on the ground",
            "Digital money that lives on computers",
            "Money only banks can use",
            "Pretend money from video games"
          ],
          correctIndex: 1,
          explanation: "Cryptocurrency is real digital money stored on computers all around the world!"
        }
      },
      {
        id: "complete",
        title: "You Did It!",
        emoji: "🎉",
        content: "Congratulations! You now know what cryptocurrency is! You're on your way to becoming a crypto expert. Ready for the next adventure?",
        animation: "rocket",
      }
    ]
  },
  {
    id: "what-is-bitcoin",
    title: "Meet Bitcoin!",
    description: "Learn about the world's first cryptocurrency",
    icon: Gem,
    color: "#F7931A",
    gradient: "from-orange-400 to-amber-600",
    glowColor: "rgba(247, 147, 26, 0.4)",
    xpReward: 150,
    difficulty: "Easy",
    timeMinutes: 6,
    badge: { name: "Bitcoin Buddy", emoji: "₿" },
    steps: [
      {
        id: "intro",
        title: "The King of Crypto",
        emoji: "👑",
        content: "Bitcoin is like the superhero that started it all! It was the very first cryptocurrency ever created, and it's still the most famous one today.",
        analogy: "If cryptocurrencies were a royal family, Bitcoin would be the King! 👑",
        animation: "coins",
      },
      {
        id: "who-made",
        title: "A Mysterious Beginning",
        emoji: "🕵️",
        content: "Bitcoin was created in 2009 by someone using the name 'Satoshi Nakamoto.' Nobody knows who this person really is - it's one of the biggest mysteries in technology!",
        funFact: "There will only ever be 21 million Bitcoins. That's fewer than the number of millionaires in the world!",
      },
      {
        id: "digital-gold",
        title: "Digital Gold",
        emoji: "🥇",
        content: "People call Bitcoin 'digital gold' because it's rare and valuable. Just like gold has to be mined from the earth, Bitcoin has to be 'mined' using powerful computers!",
        analogy: "Imagine a treasure hunt where computers solve super hard puzzles. When they solve a puzzle, they find Bitcoin treasure! This is called 'mining.'",
        animation: "rocket",
      },
      {
        id: "how-it-works",
        title: "How Bitcoin Works",
        emoji: "⚙️",
        content: "When you send Bitcoin, computers all around the world check to make sure the transaction is real. It's like having millions of referees watching to keep everything fair!",
        quiz: {
          question: "Why do people call Bitcoin 'digital gold'?",
          options: [
            "Because it's yellow colored",
            "Because it's rare and valuable",
            "Because you can eat it",
            "Because banks made it"
          ],
          correctIndex: 1,
          explanation: "Bitcoin is called digital gold because, like gold, it's rare (only 21 million will ever exist) and valuable!"
        }
      },
      {
        id: "complete",
        title: "Bitcoin Expert!",
        emoji: "🏆",
        content: "Amazing! You now know about Bitcoin - the first and most famous cryptocurrency! You're becoming a real crypto pro!",
        animation: "rocket",
      }
    ]
  },
  {
    id: "crypto-wallet",
    title: "Your Crypto Wallet",
    description: "Where your digital treasure is kept safe!",
    icon: Wallet,
    color: "#8B5CF6",
    gradient: "from-purple-400 to-indigo-600",
    glowColor: "rgba(139, 92, 246, 0.4)",
    xpReward: 175,
    difficulty: "Easy",
    timeMinutes: 7,
    badge: { name: "Wallet Wizard", emoji: "🧙" },
    steps: [
      {
        id: "intro",
        title: "Where Does Crypto Live?",
        emoji: "🏠",
        content: "Just like you keep your toys in a toy box and your clothes in a closet, cryptocurrency needs a special home too. That home is called a WALLET!",
        analogy: "A crypto wallet is like a magical backpack that holds your digital coins - but only YOU have the secret password to open it!",
        animation: "wallet",
      },
      {
        id: "not-regular-wallet",
        title: "Not Like Your Regular Wallet",
        emoji: "👛",
        content: "A crypto wallet doesn't actually hold coins inside it. Instead, it holds special SECRET KEYS that prove the crypto belongs to you. Think of it like a key to a treasure chest!",
        funFact: "Your wallet has two keys: a public one you can share (like your address) and a private one you must keep secret (like your house key)!",
      },
      {
        id: "types",
        title: "Types of Wallets",
        emoji: "📱",
        content: "There are different types of crypto wallets: Apps on your phone, programs on your computer, or even special USB devices! Some people even write their keys on paper!",
        analogy: "Hot wallets (on your phone/computer) are like your everyday backpack. Cold wallets (USB devices) are like a super secure safe at home!",
        animation: "shield",
      },
      {
        id: "keep-safe",
        title: "Keeping Your Wallet Safe",
        emoji: "🔐",
        content: "Your secret key is like a super important password. If someone else learns it, they could take your crypto! Never share your private key or secret words with ANYONE.",
        quiz: {
          question: "Should you share your wallet's secret key with others?",
          options: [
            "Yes, with everyone!",
            "Only with friends",
            "Never share it with anyone",
            "Post it on social media"
          ],
          correctIndex: 2,
          explanation: "NEVER share your private key! It's like giving away the key to your treasure chest. Keep it secret, keep it safe!"
        }
      },
      {
        id: "complete",
        title: "Wallet Master!",
        emoji: "🎒",
        content: "Excellent work! You now understand how crypto wallets work. You know the most important rule: keep your secret key... SECRET! 🤫",
        animation: "rocket",
      }
    ]
  },
  {
    id: "blockchain-basics",
    title: "The Magic of Blockchain",
    description: "Discover the technology behind crypto!",
    icon: BookOpen,
    color: "#00D4FF",
    gradient: "from-cyan-400 to-blue-600",
    glowColor: "rgba(0, 212, 255, 0.4)",
    xpReward: 200,
    difficulty: "Medium",
    timeMinutes: 8,
    badge: { name: "Chain Champion", emoji: "⛓️" },
    steps: [
      {
        id: "intro",
        title: "A Special Kind of Notebook",
        emoji: "📓",
        content: "Imagine a magical notebook that remembers EVERYTHING and can NEVER be erased. That's basically what a blockchain is!",
        analogy: "Think of blockchain like a diary that the whole world shares. Everyone can read it, everyone has a copy, and once something is written, it stays forever!",
        animation: "chain",
      },
      {
        id: "blocks",
        title: "What Are Blocks?",
        emoji: "🧱",
        content: "A blockchain is made of 'blocks' - like pages in a notebook. Each block holds information about crypto transactions. When a page fills up, a new one starts!",
        funFact: "The Bitcoin blockchain adds a new block about every 10 minutes. That's like turning to a new page in our magical notebook!",
      },
      {
        id: "chain",
        title: "Why 'Chain'?",
        emoji: "🔗",
        content: "Each new block is connected to the block before it, like links in a chain! This connection uses special math codes that make it impossible to cheat.",
        analogy: "Imagine building with LEGO blocks, but once you attach a piece, it's stuck FOREVER. You can only add new pieces on top, never change the ones below!",
        animation: "chain",
      },
      {
        id: "copies",
        title: "Millions of Copies",
        emoji: "📋",
        content: "Here's the coolest part: the blockchain isn't stored in just one place. MILLIONS of computers around the world all have the same copy! If someone tries to cheat, everyone else will notice.",
        quiz: {
          question: "Why is blockchain hard to cheat?",
          options: [
            "Because it's invisible",
            "Millions of computers all have the same copy",
            "Only one person controls it",
            "It deletes itself every day"
          ],
          correctIndex: 1,
          explanation: "Because millions of computers all have the same copy, if someone tries to change something, everyone else will see it doesn't match!"
        }
      },
      {
        id: "complete",
        title: "Blockchain Genius!",
        emoji: "🧠",
        content: "Incredible! You now understand blockchain - the amazing technology that makes cryptocurrency possible! Most adults don't even know this stuff!",
        animation: "rocket",
      }
    ]
  },
  {
    id: "staying-safe",
    title: "Crypto Safety Rules",
    description: "Learn to protect your digital treasure!",
    icon: Shield,
    color: "#10B981",
    gradient: "from-emerald-400 to-green-600",
    glowColor: "rgba(16, 185, 129, 0.4)",
    xpReward: 250,
    difficulty: "Fun Challenge",
    timeMinutes: 8,
    badge: { name: "Safety Star", emoji: "⭐" },
    steps: [
      {
        id: "intro",
        title: "Be a Crypto Guardian!",
        emoji: "🦸",
        content: "Just like you look both ways before crossing the street, there are safety rules for crypto too! Let's learn how to be a smart and safe crypto user.",
        analogy: "Think of yourself as a superhero protecting your treasure. These are your superpowers!",
        animation: "shield",
      },
      {
        id: "rule1",
        title: "Rule #1: Secret Words Stay Secret",
        emoji: "🤐",
        content: "Your wallet has special secret words (called a 'seed phrase'). NEVER tell anyone these words - not friends, not online 'helpers,' not even people who say they're from a crypto company!",
        funFact: "Real crypto companies will NEVER ask for your secret words. Anyone who asks is trying to trick you!",
      },
      {
        id: "rule2",
        title: "Rule #2: If It Sounds Too Good...",
        emoji: "🎁",
        content: "If someone promises to give you free crypto or double your money, it's almost always a TRICK! There's no magic way to get free money.",
        analogy: "It's like if a stranger offered you a million candy bars for free. Your brain should say 'That's weird!' - the same goes for crypto promises!",
        animation: "coins",
      },
      {
        id: "rule3",
        title: "Rule #3: Check Before You Click",
        emoji: "🔍",
        content: "Bad guys create fake websites that look real to steal your crypto. Always double-check that you're on the real website before entering any information!",
        quiz: {
          question: "Someone online promises to double your Bitcoin for free. What should you do?",
          options: [
            "Send them all your Bitcoin!",
            "Tell your friends to do it too",
            "It's a scam - ignore them!",
            "Ask them how they do it"
          ],
          correctIndex: 2,
          explanation: "This is always a SCAM! Nobody can magically double your money. Real crypto experts never make promises like this."
        }
      },
      {
        id: "rule4",
        title: "Rule #4: Use Strong Passwords",
        emoji: "💪",
        content: "Use long, unique passwords for your crypto accounts. Mix letters, numbers, and symbols. Never use the same password twice!",
        funFact: "A password like 'PurpleDinosaur$Eats42Pizzas!' is way harder to guess than 'password123'!",
        animation: "shield",
      },
      {
        id: "complete",
        title: "Safety Superstar!",
        emoji: "🌟",
        content: "You've learned the most important crypto safety rules! Remember: Be suspicious of 'free money' offers, keep your secrets SECRET, and always think before you click!",
        animation: "rocket",
      }
    ]
  }
];

// ============================================
// ANIMATION COMPONENTS
// ============================================

function FloatingCoins() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl"
          initial={{
            x: `${Math.random() * 100}%`,
            y: "110%",
            rotate: 0,
            opacity: 0.8
          }}
          animate={{
            y: "-10%",
            rotate: 360,
            opacity: [0.8, 1, 0.8, 0]
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "linear"
          }}
        >
          {["🪙", "💰", "✨", "💎"][i % 4]}
        </motion.div>
      ))}
    </div>
  );
}

function RocketAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        className="text-6xl"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        🚀
      </motion.div>
      {/* Exhaust particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{ bottom: "30%", left: "48%" }}
          initial={{ y: 0, opacity: 1, scale: 1 }}
          animate={{
            y: [0, 60],
            opacity: [1, 0],
            scale: [1, 0.3]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeOut"
          }}
        >
          🔥
        </motion.div>
      ))}
    </div>
  );
}

function ShieldAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        className="relative"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-6xl">🛡️</div>
        {/* Shield glow rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-emerald-400"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: [1, 1.5 + i * 0.3], opacity: [0.5, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.4
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

function WalletAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        className="text-6xl"
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        👛
      </motion.div>
      {/* Coins going into wallet */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl"
          initial={{ x: -100 + i * 50, y: -50, opacity: 1 }}
          animate={{
            x: 0,
            y: 0,
            opacity: [1, 1, 0],
            scale: [1, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.5
          }}
        >
          🪙
        </motion.div>
      ))}
    </div>
  );
}

function ChainAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="flex items-center gap-1">
        {["📦", "🔗", "📦", "🔗", "📦"].map((emoji, i) => (
          <motion.div
            key={i}
            className="text-4xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.2, type: "spring" }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AnimationDisplay({ type }: { type?: string }) {
  switch (type) {
    case "coins": return <FloatingCoins />;
    case "rocket": return <RocketAnimation />;
    case "shield": return <ShieldAnimation />;
    case "wallet": return <WalletAnimation />;
    case "chain": return <ChainAnimation />;
    default: return null;
  }
}

// ============================================
// QUIZ COMPONENT
// ============================================

function QuizComponent({
  quiz,
  onComplete
}: {
  quiz: QuizQuestion;
  onComplete: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    setTimeout(() => {
      onComplete(index === quiz.correctIndex);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
    >
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-purple-400" />
        <h4 className="font-bold text-purple-400">Quick Quiz!</h4>
      </div>

      <p className="text-white font-medium mb-4">{quiz.question}</p>

      <div className="space-y-2">
        {quiz.options.map((option, index) => {
          const isCorrect = index === quiz.correctIndex;
          const isSelected = index === selected;

          return (
            <motion.button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={showResult}
              whileHover={{ scale: showResult ? 1 : 1.02 }}
              whileTap={{ scale: showResult ? 1 : 0.98 }}
              className={`w-full p-3 rounded-xl text-left transition-all ${
                showResult
                  ? isCorrect
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                    : isSelected
                    ? "bg-red-500/20 border-red-500/50 text-red-300"
                    : "bg-white/5 border-white/10 text-gray-400"
                  : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20"
              } border`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                  showResult && isCorrect
                    ? "bg-emerald-500 text-black"
                    : showResult && isSelected
                    ? "bg-red-500 text-white"
                    : "bg-white/10 text-white/60"
                }`}>
                  {showResult && isCorrect ? "✓" : showResult && isSelected ? "✗" : String.fromCharCode(65 + index)}
                </div>
                <span>{option}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className={`mt-4 p-4 rounded-xl ${
              selected === quiz.correctIndex
                ? "bg-emerald-500/20 border border-emerald-500/30"
                : "bg-amber-500/20 border border-amber-500/30"
            }`}
          >
            <div className="flex items-start gap-2">
              <Lightbulb className={`w-5 h-5 mt-0.5 ${
                selected === quiz.correctIndex ? "text-emerald-400" : "text-amber-400"
              }`} />
              <div>
                <p className={`font-medium ${
                  selected === quiz.correctIndex ? "text-emerald-300" : "text-amber-300"
                }`}>
                  {selected === quiz.correctIndex ? "Correct! 🎉" : "Not quite, but now you know! 💡"}
                </p>
                <p className="text-sm text-gray-300 mt-1">{quiz.explanation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================
// PROGRESS & XP SYSTEM
// ============================================

function getProgress() {
  try {
    const data = localStorage.getItem("beginner-tutorial-progress");
    return data ? JSON.parse(data) : { completedTutorials: [], totalXP: 0, badges: [] };
  } catch {
    return { completedTutorials: [], totalXP: 0, badges: [] };
  }
}

function saveProgress(progress: { completedTutorials: string[]; totalXP: number; badges: string[] }) {
  localStorage.setItem("beginner-tutorial-progress", JSON.stringify(progress));
}

// ============================================
// TUTORIAL CARD COMPONENT
// ============================================

function TutorialCard({
  tutorial,
  isCompleted,
  isLocked,
  onStart
}: {
  tutorial: Tutorial;
  isCompleted: boolean;
  isLocked: boolean;
  onStart: () => void;
}) {
  const Icon = tutorial.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: isLocked ? 0 : -4 }}
      className={`relative ${isLocked ? "opacity-60" : ""}`}
    >
      <div
        className={`relative p-5 rounded-2xl border transition-all overflow-hidden ${
          isCompleted
            ? "bg-emerald-500/10 border-emerald-500/30"
            : isLocked
            ? "bg-gray-800/50 border-gray-700/50"
            : `bg-gradient-to-br ${tutorial.gradient}/10 border-white/10 hover:border-white/20`
        }`}
        style={!isCompleted && !isLocked ? { boxShadow: `0 10px 40px ${tutorial.glowColor}` } : {}}
      >
        {/* Completion badge */}
        {isCompleted && (
          <div className="absolute top-3 right-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"
            >
              <CheckCircle2 className="w-5 h-5 text-black" />
            </motion.div>
          </div>
        )}

        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute top-3 right-3">
            <Lock className="w-5 h-5 text-gray-500" />
          </div>
        )}

        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
            isCompleted
              ? "bg-emerald-500/20"
              : isLocked
              ? "bg-gray-700/50"
              : `bg-gradient-to-br ${tutorial.gradient}`
          }`}
          style={!isCompleted && !isLocked ? { boxShadow: `0 8px 24px ${tutorial.glowColor}` } : {}}
        >
          <Icon className={`w-7 h-7 ${isCompleted ? "text-emerald-400" : isLocked ? "text-gray-500" : "text-white"}`} />
        </div>

        {/* Content */}
        <h3 className={`text-lg font-bold mb-1 ${isLocked ? "text-gray-500" : "text-white"}`}>
          {tutorial.title}
        </h3>
        <p className={`text-sm mb-4 ${isLocked ? "text-gray-600" : "text-gray-400"}`}>
          {tutorial.description}
        </p>

        {/* Meta info */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            tutorial.difficulty === "Easy"
              ? "bg-emerald-500/20 text-emerald-400"
              : tutorial.difficulty === "Medium"
              ? "bg-amber-500/20 text-amber-400"
              : "bg-purple-500/20 text-purple-400"
          }`}>
            {tutorial.difficulty}
          </span>
          <span className="px-2 py-1 rounded-full bg-white/5 text-xs text-gray-400">
            {tutorial.timeMinutes} min
          </span>
          <span className="px-2 py-1 rounded-full bg-amber-500/10 text-xs text-amber-400 font-medium">
            +{tutorial.xpReward} XP
          </span>
        </div>

        {/* Start button */}
        <motion.button
          onClick={onStart}
          disabled={isLocked}
          whileHover={{ scale: isLocked ? 1 : 1.02 }}
          whileTap={{ scale: isLocked ? 1 : 0.98 }}
          className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            isCompleted
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : isLocked
              ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
              : `bg-gradient-to-r ${tutorial.gradient} text-white shadow-lg`
          }`}
          style={!isCompleted && !isLocked ? { boxShadow: `0 4px 20px ${tutorial.glowColor}` } : {}}
        >
          {isCompleted ? (
            <>
              <RotateCcw className="w-4 h-4" />
              <span>Review</span>
            </>
          ) : isLocked ? (
            <>
              <Lock className="w-4 h-4" />
              <span>Locked</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Start Learning</span>
            </>
          )}
        </motion.button>

        {/* Badge preview */}
        {isCompleted && (
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>Badge earned: {tutorial.badge.emoji} {tutorial.badge.name}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// ACTIVE TUTORIAL VIEW
// ============================================

function ActiveTutorial({
  tutorial,
  onClose,
  onComplete
}: {
  tutorial: Tutorial;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const step = tutorial.steps[currentStep];
  const isLastStep = currentStep === tutorial.steps.length - 1;
  const progress = ((currentStep + 1) / tutorial.steps.length) * 100;

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, step.id]));
    setQuizAnswered(false);

    if (isLastStep) {
      setShowCelebration(true);
      setTimeout(() => {
        onComplete();
      }, 3000);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleQuizComplete = (correct: boolean) => {
    setQuizAnswered(true);
    // Award bonus XP for correct answers could be added here
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95"
    >
      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center"
          >
            {/* Confetti */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl"
                initial={{
                  x: "50%",
                  y: "50%",
                  scale: 0
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: [0, 1.5, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.05
                }}
              >
                {["🎉", "⭐", "🎊", "✨", "🏆"][i % 5]}
              </motion.div>
            ))}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-8xl mb-4"
              >
                {tutorial.badge.emoji}
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Badge Unlocked!
              </h2>
              <p className="text-xl text-amber-400 font-medium">
                {tutorial.badge.name}
              </p>
              <p className="text-lg text-emerald-400 mt-2">
                +{tutorial.xpReward} XP
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-2xl bg-gradient-to-br from-[#1a1a25] to-[#0f0f15] rounded-3xl border border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tutorial.gradient} flex items-center justify-center`}
              >
                <tutorial.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white">{tutorial.title}</h2>
                <p className="text-xs text-gray-400">
                  Step {currentStep + 1} of {tutorial.steps.length}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${tutorial.gradient}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Step header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{step.emoji}</span>
                <h3 className="text-2xl font-bold text-white">{step.title}</h3>
              </div>

              {/* Animation area */}
              {step.animation && (
                <div className="relative h-32 mb-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 overflow-hidden">
                  <AnimationDisplay type={step.animation} />
                </div>
              )}

              {/* Main content */}
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                {step.content}
              </p>

              {/* Analogy box */}
              {step.analogy && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-400 mb-1">Think of it like this:</p>
                      <p className="text-sm text-amber-200">{step.analogy}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Fun fact */}
              {step.funFact && (
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-purple-400 mb-1">Fun Fact!</p>
                      <p className="text-sm text-purple-200">{step.funFact}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quiz */}
              {step.quiz && !quizAnswered && (
                <QuizComponent quiz={step.quiz} onComplete={handleQuizComplete} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            {tutorial.steps.map((s, i) => (
              <motion.div
                key={s.id}
                className={`w-2 h-2 rounded-full ${
                  i === currentStep
                    ? `bg-gradient-to-r ${tutorial.gradient}`
                    : completedSteps.has(s.id)
                    ? "bg-emerald-500"
                    : "bg-white/20"
                }`}
                animate={i === currentStep ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              />
            ))}
          </div>

          <motion.button
            onClick={handleNext}
            disabled={step.quiz && !quizAnswered}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold transition-all ${
              step.quiz && !quizAnswered
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : `bg-gradient-to-r ${tutorial.gradient} text-white`
            }`}
          >
            <span>{isLastStep ? "Complete!" : "Next"}</span>
            {isLastStep ? <Trophy className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function BeginnerTutorials() {
  const [progress, setProgress] = useState(getProgress);
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);

  const handleStartTutorial = (tutorial: Tutorial) => {
    setActiveTutorial(tutorial);
  };

  const handleCompleteTutorial = () => {
    if (!activeTutorial) return;

    const newProgress = {
      ...progress,
      completedTutorials: [...new Set([...progress.completedTutorials, activeTutorial.id])],
      totalXP: progress.totalXP + activeTutorial.xpReward,
      badges: [...new Set([...progress.badges, activeTutorial.badge.name])]
    };

    setProgress(newProgress);
    saveProgress(newProgress);
    setActiveTutorial(null);
  };

  const isTutorialCompleted = (id: string) => progress.completedTutorials.includes(id);

  // First tutorial is always unlocked, others unlock after previous is completed
  const isTutorialLocked = (index: number) => {
    if (index === 0) return false;
    return !isTutorialCompleted(BEGINNER_TUTORIALS[index - 1].id);
  };

  return (
    <section className="relative py-12">
      {/* Active tutorial modal */}
      <AnimatePresence>
        {activeTutorial && (
          <ActiveTutorial
            tutorial={activeTutorial}
            onClose={() => setActiveTutorial(null)}
            onComplete={handleCompleteTutorial}
          />
        )}
      </AnimatePresence>

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        {/* XP Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-4"
        >
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="font-bold text-amber-400">{progress.totalXP} XP</span>
          </div>
          <div className="w-px h-5 bg-amber-500/30" />
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="font-medium text-amber-400">{progress.badges.length} Badges</span>
          </div>
        </motion.div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Crypto Academy for{" "}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
            Beginners
          </span>
        </h2>

        <p className="text-gray-400 max-w-xl mx-auto">
          Fun, interactive lessons that make cryptocurrency easy to understand!
          Perfect for anyone just starting their crypto journey. 🚀
        </p>
      </motion.div>

      {/* Tutorial grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BEGINNER_TUTORIALS.map((tutorial, index) => (
          <TutorialCard
            key={tutorial.id}
            tutorial={tutorial}
            isCompleted={isTutorialCompleted(tutorial.id)}
            isLocked={isTutorialLocked(index)}
            onStart={() => handleStartTutorial(tutorial)}
          />
        ))}
      </div>

      {/* Encouragement message */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-10 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
          <Heart className="w-4 h-4 text-pink-400" />
          <p className="text-sm text-gray-400">
            {progress.completedTutorials.length === 0
              ? "Start your first lesson and begin earning XP!"
              : progress.completedTutorials.length === BEGINNER_TUTORIALS.length
              ? "Amazing! You've completed all beginner tutorials! 🎉"
              : `${BEGINNER_TUTORIALS.length - progress.completedTutorials.length} more lessons to go. You're doing great!`}
          </p>
        </div>
      </motion.div>
    </section>
  );
}

export default BeginnerTutorials;
