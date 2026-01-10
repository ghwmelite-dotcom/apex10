import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trophy,
  Zap,
  Mail,
  MessageSquare,
  Globe,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useCelebration } from "./Confetti";
import { useSound } from "@/lib/sounds";
import { useAchievements } from "./AchievementSystem";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
  category: string;
}

interface PhishingTest {
  id: string;
  type: string;
  content: string;
  isPhishing: boolean;
  redFlags: string[];
  explanation: string;
}

// Security Quiz Component
export function SecurityQuiz() {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [perfectStreak, setPerfectStreak] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const { triggerConfetti, triggerEmoji } = useCelebration();
  const { playSuccess, playError } = useSound();
  const { addXP, unlockAchievement, hasAchievement } = useAchievements();

  const fetchQuestion = async () => {
    setIsLoading(true);
    setSelectedAnswer(null);
    setShowResult(false);

    try {
      const response = await fetch(`/api/ai/security/quiz?difficulty=${difficulty}`);
      const data = await response.json();
      setQuestion(data);
    } catch (error) {
      console.error("Failed to fetch question:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null || !question) return;

    setShowResult(true);
    const isCorrect = selectedAnswer === question.correctAnswer;

    if (isCorrect) {
      playSuccess();
      triggerEmoji("🎉");
      setScore((prev) => ({ correct: prev.correct + 1, total: prev.total + 1 }));
      setPerfectStreak((prev) => prev + 1);

      // Award XP based on difficulty
      const xpReward = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 30;
      addXP(xpReward);

      // Check for quiz master achievement (3 perfect in a row)
      if (perfectStreak + 1 >= 3 && !hasAchievement("quiz_master")) {
        unlockAchievement("quiz_master");
      }

      if (score.correct > 0 && (score.correct + 1) % 5 === 0) {
        triggerConfetti();
      }
    } else {
      playError();
      setPerfectStreak(0);
      setScore((prev) => ({ ...prev, total: prev.total + 1 }));
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-quantum-green/20">
            <Shield className="w-6 h-6 text-quantum-green" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Security Quiz</h3>
            <p className="text-sm text-text-muted">Test your crypto security knowledge</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-solar-gold" />
          <span className="text-sm font-medium text-text-primary">
            {score.correct}/{score.total}
          </span>
        </div>
      </div>

      {/* Difficulty selector */}
      <div className="flex gap-2 mb-6">
        {(["easy", "medium", "hard"] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
              difficulty === d
                ? "bg-aurora-cyan/20 text-aurora-cyan"
                : "bg-bg-tertiary text-text-muted hover:text-text-primary"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {!question && !isLoading && (
        <motion.button
          onClick={fetchQuestion}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-aurora-cyan to-aurora-purple text-bg-primary font-semibold flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" />
          Start Quiz
        </motion.button>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-aurora-cyan animate-spin" />
        </div>
      )}

      {question && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="p-4 bg-bg-tertiary rounded-xl">
            <p className="text-text-primary font-medium">{question.question}</p>
          </div>

          <div className="space-y-2">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                whileHover={!showResult ? { scale: 1.01 } : {}}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  showResult
                    ? index === question.correctAnswer
                      ? "bg-quantum-green/20 border-2 border-quantum-green"
                      : selectedAnswer === index
                      ? "bg-nova-red/20 border-2 border-nova-red"
                      : "bg-bg-tertiary"
                    : selectedAnswer === index
                    ? "bg-aurora-cyan/20 border-2 border-aurora-cyan"
                    : "bg-bg-tertiary hover:bg-bg-secondary"
                } ${!showResult && "cursor-pointer"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-bg-primary flex items-center justify-center text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-text-primary">{option}</span>
                  {showResult && index === question.correctAnswer && (
                    <CheckCircle className="w-5 h-5 text-quantum-green ml-auto" />
                  )}
                  {showResult && selectedAnswer === index && index !== question.correctAnswer && (
                    <XCircle className="w-5 h-5 text-nova-red ml-auto" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {!showResult && selectedAnswer !== null && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={checkAnswer}
              className="w-full py-3 rounded-xl bg-aurora-cyan text-bg-primary font-semibold"
            >
              Check Answer
            </motion.button>
          )}

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-xl bg-bg-tertiary">
                <p className="text-sm text-text-muted mb-2">Explanation:</p>
                <p className="text-text-primary">{question.explanation}</p>
              </div>
              <button
                onClick={fetchQuestion}
                className="w-full py-3 rounded-xl bg-aurora-purple/20 text-aurora-purple font-semibold flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Next Question
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// Phishing Simulator Component
export function PhishingSimulator() {
  const [test, setTest] = useState<PhishingTest | null>(null);
  const [userGuess, setUserGuess] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testType, setTestType] = useState<"email" | "message">("email");
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [phishingCaught, setPhishingCaught] = useState(0);
  const { triggerEmoji } = useCelebration();
  const { playSuccess, playError } = useSound();
  const { addXP, unlockAchievement, hasAchievement } = useAchievements();

  const fetchTest = async () => {
    setIsLoading(true);
    setUserGuess(null);
    setShowResult(false);

    try {
      const response = await fetch(`/api/ai/security/phishing-test?type=${testType}`);
      const data = await response.json();
      setTest(data);
    } catch (error) {
      console.error("Failed to fetch phishing test:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuess = (guess: boolean) => {
    if (showResult || !test) return;
    setUserGuess(guess);
  };

  const checkGuess = () => {
    if (userGuess === null || !test) return;

    setShowResult(true);
    const isCorrect = userGuess === test.isPhishing;

    if (isCorrect) {
      playSuccess();
      triggerEmoji("🛡️");
      setStats((prev) => ({ correct: prev.correct + 1, total: prev.total + 1 }));
      addXP(25);

      // Track phishing caught
      if (test.isPhishing && userGuess === true) {
        const newCount = phishingCaught + 1;
        setPhishingCaught(newCount);

        // Check for phishing hunter achievement (5 phishing attempts caught)
        if (newCount >= 5 && !hasAchievement("phishing_hunter")) {
          unlockAchievement("phishing_hunter");
        }
      }
    } else {
      playError();
      setStats((prev) => ({ ...prev, total: prev.total + 1 }));
    }
  };

  const TypeIcon = testType === "email" ? Mail : MessageSquare;

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-nova-red/20">
            <AlertTriangle className="w-6 h-6 text-nova-red" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Spot the Scam</h3>
            <p className="text-sm text-text-muted">Can you identify phishing attempts?</p>
          </div>
        </div>
        <div className="text-sm text-text-muted">
          Accuracy: {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
        </div>
      </div>

      {/* Type selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTestType("email")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            testType === "email"
              ? "bg-aurora-cyan/20 text-aurora-cyan"
              : "bg-bg-tertiary text-text-muted"
          }`}
        >
          <Mail className="w-4 h-4" />
          Email
        </button>
        <button
          onClick={() => setTestType("message")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            testType === "message"
              ? "bg-aurora-cyan/20 text-aurora-cyan"
              : "bg-bg-tertiary text-text-muted"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Message
        </button>
      </div>

      {!test && !isLoading && (
        <motion.button
          onClick={fetchTest}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-nova-red to-plasma-orange text-white font-semibold flex items-center justify-center gap-2"
        >
          <Shield className="w-5 h-5" />
          Start Training
        </motion.button>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-aurora-cyan animate-spin" />
        </div>
      )}

      {test && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Simulated content */}
          <div className="p-4 bg-bg-tertiary rounded-xl">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border-default">
              <TypeIcon className="w-4 h-4 text-text-muted" />
              <span className="text-sm text-text-muted capitalize">{test.type}</span>
            </div>
            <div className="text-text-primary whitespace-pre-wrap text-sm">
              {test.content}
            </div>
          </div>

          {/* Guess buttons */}
          {!showResult && (
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                onClick={() => handleGuess(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                  userGuess === true
                    ? "bg-nova-red/20 border-2 border-nova-red text-nova-red"
                    : "bg-bg-tertiary text-text-primary hover:bg-nova-red/10"
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
                Phishing!
              </motion.button>
              <motion.button
                onClick={() => handleGuess(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                  userGuess === false
                    ? "bg-quantum-green/20 border-2 border-quantum-green text-quantum-green"
                    : "bg-bg-tertiary text-text-primary hover:bg-quantum-green/10"
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                Legitimate
              </motion.button>
            </div>
          )}

          {userGuess !== null && !showResult && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={checkGuess}
              className="w-full py-3 rounded-xl bg-aurora-cyan text-bg-primary font-semibold"
            >
              Submit Answer
            </motion.button>
          )}

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div
                className={`p-4 rounded-xl ${
                  userGuess === test.isPhishing
                    ? "bg-quantum-green/20 border border-quantum-green"
                    : "bg-nova-red/20 border border-nova-red"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {userGuess === test.isPhishing ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-quantum-green" />
                      <span className="font-semibold text-quantum-green">Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-nova-red" />
                      <span className="font-semibold text-nova-red">Incorrect</span>
                    </>
                  )}
                </div>
                <p className="text-text-primary text-sm">{test.explanation}</p>
              </div>

              {test.isPhishing && test.redFlags.length > 0 && (
                <div className="p-4 rounded-xl bg-bg-tertiary">
                  <p className="text-sm text-text-muted mb-2">Red flags to watch for:</p>
                  <ul className="space-y-1">
                    {test.redFlags.map((flag, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                        <AlertTriangle className="w-4 h-4 text-nova-red flex-shrink-0 mt-0.5" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={fetchTest}
                className="w-full py-3 rounded-xl bg-aurora-purple/20 text-aurora-purple font-semibold flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Next Challenge
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// Combined Security Training Page Component
export function SecurityTrainingHub() {
  const [activeTab, setActiveTab] = useState<"quiz" | "phishing">("quiz");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab("quiz")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === "quiz"
              ? "bg-gradient-to-r from-aurora-cyan/20 to-aurora-purple/20 text-aurora-cyan border border-aurora-cyan/30"
              : "bg-bg-tertiary text-text-muted hover:text-text-primary"
          }`}
        >
          <Shield className="w-5 h-5" />
          Security Quiz
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => setActiveTab("phishing")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === "phishing"
              ? "bg-gradient-to-r from-nova-red/20 to-plasma-orange/20 text-nova-red border border-nova-red/30"
              : "bg-bg-tertiary text-text-muted hover:text-text-primary"
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
          Spot the Scam
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {activeTab === "quiz" ? <SecurityQuiz /> : <PhishingSimulator />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
