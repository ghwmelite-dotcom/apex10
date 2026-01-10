import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  Shield,
  TrendingUp,
  Layers,
  Image,
  ChevronDown,
} from "lucide-react";
import { useSound } from "@/lib/sounds";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

type Context = "general" | "security" | "trading" | "defi" | "nft";

const CONTEXT_OPTIONS: { value: Context; label: string; icon: typeof Shield; color: string }[] = [
  { value: "general", label: "General", icon: Sparkles, color: "text-aurora-cyan" },
  { value: "security", label: "Security", icon: Shield, color: "text-quantum-green" },
  { value: "trading", label: "Markets", icon: TrendingUp, color: "text-solar-gold" },
  { value: "defi", label: "DeFi", icon: Layers, color: "text-aurora-purple" },
  { value: "nft", label: "NFTs", icon: Image, color: "text-aurora-pink" },
];

const QUICK_PROMPTS = [
  "What is Bitcoin?",
  "How do I stay safe?",
  "What's a wallet?",
  "Explain DeFi",
];

export function AIMentor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<Context>("general");
  const [showContextMenu, setShowContextMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { playClick, playNotification } = useSound();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          context,
        }),
      });

      const data = await response.json();

      if (data.response) {
        playNotification();
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("AI Chat error:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => {
          playClick();
          setIsOpen(true);
        }}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-aurora-cyan to-aurora-purple shadow-glow ${
          isOpen ? "hidden" : "flex"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 1 }}
      >
        <Bot className="w-6 h-6 text-bg-primary" />
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-quantum-green rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] max-h-[80vh] bg-bg-secondary rounded-2xl border border-border-default shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-aurora-cyan/10 to-aurora-purple/10 border-b border-border-default">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-aurora-cyan to-aurora-purple">
                    <Bot className="w-5 h-5 text-bg-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">Apex AI Mentor</h3>
                    <p className="text-xs text-text-muted">Powered by Llama 3</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors"
                >
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>

              {/* Context selector */}
              <div className="mt-3 relative">
                <button
                  onClick={() => setShowContextMenu(!showContextMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-tertiary text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  {(() => {
                    const ctx = CONTEXT_OPTIONS.find((c) => c.value === context);
                    const Icon = ctx?.icon || Sparkles;
                    return (
                      <>
                        <Icon className={`w-4 h-4 ${ctx?.color}`} />
                        <span>{ctx?.label} Mode</span>
                        <ChevronDown className="w-3 h-3" />
                      </>
                    );
                  })()}
                </button>

                <AnimatePresence>
                  {showContextMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-1 p-1 bg-bg-tertiary rounded-lg border border-border-default shadow-lg z-10"
                    >
                      {CONTEXT_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => {
                              setContext(option.value);
                              setShowContextMenu(false);
                            }}
                            className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-colors ${
                              context === option.value
                                ? "bg-aurora-cyan/20 text-aurora-cyan"
                                : "text-text-secondary hover:bg-bg-secondary"
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${option.color}`} />
                            <span>{option.label}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="p-4 rounded-2xl bg-gradient-to-r from-aurora-cyan/20 to-aurora-purple/20 mb-4"
                  >
                    <Sparkles className="w-8 h-8 text-aurora-cyan" />
                  </motion.div>
                  <h4 className="font-semibold text-text-primary mb-2">
                    Welcome to Apex AI
                  </h4>
                  <p className="text-sm text-text-muted mb-4 max-w-[280px]">
                    I'm your crypto education mentor. Ask me anything about
                    blockchain, security, or getting started!
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => sendMessage(prompt)}
                        className="px-3 py-1.5 text-xs rounded-full bg-bg-tertiary text-text-secondary hover:text-aurora-cyan hover:border-aurora-cyan/50 border border-border-default transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r from-aurora-cyan to-aurora-purple flex items-center justify-center">
                        <Bot className="w-4 h-4 text-bg-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        message.role === "user"
                          ? "bg-aurora-cyan/20 text-text-primary rounded-br-md"
                          : "bg-bg-tertiary text-text-primary rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center">
                        <User className="w-4 h-4 text-text-muted" />
                      </div>
                    )}
                  </motion.div>
                ))
              )}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-aurora-cyan to-aurora-purple flex items-center justify-center">
                    <Bot className="w-4 h-4 text-bg-primary" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-bg-tertiary">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-aurora-cyan animate-spin" />
                      <span className="text-sm text-text-muted">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border-default">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about crypto..."
                  rows={1}
                  className="flex-1 px-4 py-3 bg-bg-tertiary rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-aurora-cyan/50 resize-none"
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl bg-gradient-to-r from-aurora-cyan to-aurora-purple text-bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
              <p className="mt-2 text-xs text-text-muted text-center">
                AI responses are educational only, not financial advice.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Quick info component for inline explanations
export function QuickExplain({ concept }: { concept: string }) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchExplanation = async () => {
    if (explanation || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/ai/eli5/${encodeURIComponent(concept)}`);
      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      console.error("Failed to fetch explanation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <span
      className="relative inline-flex items-center gap-1 text-aurora-cyan cursor-help border-b border-dashed border-aurora-cyan/50"
      onMouseEnter={fetchExplanation}
    >
      {concept}
      <Sparkles className="w-3 h-3" />
      {(explanation || isLoading) && (
        <span className="absolute bottom-full left-0 mb-2 p-3 w-64 bg-bg-tertiary rounded-lg border border-border-default shadow-lg text-sm text-text-primary z-50">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </span>
          ) : (
            explanation
          )}
        </span>
      )}
    </span>
  );
}
