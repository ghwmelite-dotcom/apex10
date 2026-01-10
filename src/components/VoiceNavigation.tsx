import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Home,
  Shield,
  BookOpen,
  Search,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { useSound } from "@/lib/sounds";

// Voice commands configuration
const VOICE_COMMANDS = [
  { phrases: ["go home", "go to home", "dashboard", "home"], action: "navigate", path: "/" },
  { phrases: ["security", "security hub", "go to security"], action: "navigate", path: "/security" },
  { phrases: ["learn", "learning", "learn center", "go to learn"], action: "navigate", path: "/learn" },
  { phrases: ["search", "find", "look for"], action: "search", path: null },
  { phrases: ["help", "what can i say", "commands"], action: "help", path: null },
  { phrases: ["discovery", "discover", "discovery mode"], action: "discovery", path: null },
  { phrases: ["scroll up", "go up"], action: "scroll", direction: "up" },
  { phrases: ["scroll down", "go down"], action: "scroll", direction: "down" },
];

interface VoiceNavigationProps {
  onDiscoveryTrigger?: () => void;
}

export function VoiceNavigation({ onDiscoveryTrigger }: VoiceNavigationProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const navigate = useNavigate();
  const { playClick, playSuccess, playNotification } = useSound();

  // Check for browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
      playNotification();
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const text = result[0].transcript.toLowerCase();
      setTranscript(text);

      if (result.isFinal) {
        processCommand(text);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === "not-allowed") {
        setFeedback("Microphone access denied");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  const processCommand = useCallback((text: string) => {
    let commandFound = false;

    for (const command of VOICE_COMMANDS) {
      const matched = command.phrases.some((phrase) => text.includes(phrase));

      if (matched) {
        commandFound = true;
        playSuccess();

        switch (command.action) {
          case "navigate":
            setFeedback(`Navigating to ${command.path === "/" ? "home" : command.path?.slice(1)}`);
            setTimeout(() => navigate(command.path!), 500);
            break;

          case "search":
            setFeedback("Opening search...");
            setTimeout(() => {
              const event = new KeyboardEvent("keydown", { key: "k", metaKey: true });
              document.dispatchEvent(event);
            }, 500);
            break;

          case "help":
            setShowHelp(true);
            setFeedback("Showing available commands");
            break;

          case "discovery":
            setFeedback("Opening Discovery Mode");
            setTimeout(() => onDiscoveryTrigger?.(), 500);
            break;

          case "scroll":
            if (command.direction === "up") {
              window.scrollBy({ top: -300, behavior: "smooth" });
            } else {
              window.scrollBy({ top: 300, behavior: "smooth" });
            }
            setFeedback(`Scrolling ${command.direction}`);
            break;
        }
        break;
      }
    }

    if (!commandFound) {
      setFeedback("Command not recognized. Say 'help' for options.");
    }

    // Clear feedback after delay
    setTimeout(() => setFeedback(null), 3000);
  }, [navigate, onDiscoveryTrigger, playSuccess]);

  const toggleListening = () => {
    if (!isSupported || !recognitionRef.current) return;

    playClick();

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Failed to start recognition:", error);
      }
    }
  };

  if (!isSupported) {
    return null; // Don't render if not supported
  }

  return (
    <>
      {/* Voice control button */}
      <motion.button
        onClick={toggleListening}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 left-6 z-50 p-4 rounded-full shadow-lg transition-colors ${
          isListening
            ? "bg-nova-red shadow-nova-red/50"
            : "bg-gradient-to-r from-aurora-purple to-aurora-cyan shadow-aurora-cyan/30"
        }`}
      >
        {isListening ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}

        {/* Listening pulse animation */}
        {isListening && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-nova-red"
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-nova-red"
              animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
            />
          </>
        )}
      </motion.button>

      {/* Listening overlay */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 pointer-events-none"
          >
            {/* Top bar with transcript */}
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-bg-primary to-transparent pointer-events-auto"
            >
              <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-bg-secondary/90 backdrop-blur-xl border border-border-default">
                  <div className="relative">
                    <Volume2 className="w-6 h-6 text-aurora-cyan" />
                    <motion.div
                      className="absolute inset-0"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <Volume2 className="w-6 h-6 text-aurora-cyan opacity-50" />
                    </motion.div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-muted">Listening...</p>
                    <p className="text-lg text-text-primary font-medium min-h-[28px]">
                      {transcript || "Say a command..."}
                    </p>
                  </div>
                  <button
                    onClick={toggleListening}
                    className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors"
                  >
                    <X className="w-5 h-5 text-text-muted" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback toast */}
      <AnimatePresence>
        {feedback && !isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-6 z-50 px-4 py-3 rounded-xl bg-bg-secondary border border-border-default shadow-lg"
          >
            <p className="text-sm text-text-primary">{feedback}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/80 backdrop-blur-sm"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-6 rounded-2xl bg-bg-secondary border border-border-default shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-aurora-purple/20">
                  <HelpCircle className="w-6 h-6 text-aurora-purple" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">Voice Commands</h3>
                  <p className="text-sm text-text-muted">Say any of these to navigate</p>
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  className="ml-auto p-2 rounded-lg hover:bg-bg-tertiary"
                >
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>

              <div className="space-y-3">
                <CommandHelp icon={Home} command="Go home" description="Navigate to dashboard" />
                <CommandHelp icon={Shield} command="Security" description="Open Security Hub" />
                <CommandHelp icon={BookOpen} command="Learn" description="Open Learn Center" />
                <CommandHelp icon={Search} command="Search" description="Open search palette" />
                <CommandHelp icon={Sparkles} command="Discovery" description="Open Discovery Mode" />
                <CommandHelp icon={Volume2} command="Scroll up/down" description="Scroll the page" />
              </div>

              <p className="mt-6 text-xs text-text-muted text-center">
                Press the microphone button or say "help" anytime
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function CommandHelp({
  icon: Icon,
  command,
  description,
}: {
  icon: typeof Home;
  command: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-tertiary/50">
      <Icon className="w-5 h-5 text-aurora-cyan" />
      <div className="flex-1">
        <p className="text-sm font-medium text-text-primary">"{command}"</p>
        <p className="text-xs text-text-muted">{description}</p>
      </div>
    </div>
  );
}

// Add TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
