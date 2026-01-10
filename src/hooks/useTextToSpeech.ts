import { useState, useEffect, useCallback, useRef } from "react";

// ============================================
// TYPES
// ============================================
interface UseTextToSpeechOptions {
  onSentenceChange?: (index: number) => void;
  onWordChange?: (wordIndex: number, sentenceIndex: number) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

interface UseTextToSpeechReturn {
  // State
  isPlaying: boolean;
  isPaused: boolean;
  isSupported: boolean;
  currentSentence: number;
  progress: number;

  // Controls
  speak: (text: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  skipForward: () => void;
  skipBackward: () => void;

  // Settings
  rate: number;
  setRate: (rate: number) => void;
  pitch: number;
  setPitch: (pitch: number) => void;
  voice: SpeechSynthesisVoice | null;
  setVoice: (voice: SpeechSynthesisVoice) => void;
  availableVoices: SpeechSynthesisVoice[];

  // Utilities
  sentences: string[];
  totalSentences: number;
}

// ============================================
// UTILITIES
// ============================================
function splitIntoSentences(text: string): string[] {
  // Split by sentence-ending punctuation, keeping the punctuation
  const sentences = text
    .replace(/([.!?])\s+/g, "$1|SPLIT|")
    .split("|SPLIT|")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return sentences;
}

function getStoredSettings(): { rate: number; pitch: number; voiceURI: string | null } {
  try {
    const stored = localStorage.getItem("tts-settings");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore errors
  }
  return { rate: 1, pitch: 1, voiceURI: null };
}

function storeSettings(rate: number, pitch: number, voiceURI: string | null): void {
  try {
    localStorage.setItem("tts-settings", JSON.stringify({ rate, pitch, voiceURI }));
  } catch {
    // Ignore errors
  }
}

// ============================================
// HOOK
// ============================================
export function useTextToSpeech(options: UseTextToSpeechOptions = {}): UseTextToSpeechReturn {
  const { onSentenceChange, onWordChange, onComplete, onError } = options;

  // Check for browser support
  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [progress, setProgress] = useState(0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [sentences, setSentences] = useState<string[]>([]);

  // Settings with persistence
  const storedSettings = getStoredSettings();
  const [rate, setRateState] = useState(storedSettings.rate);
  const [pitch, setPitchState] = useState(storedSettings.pitch);
  const [voice, setVoiceState] = useState<SpeechSynthesisVoice | null>(null);

  // Refs
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const sentencesRef = useRef<string[]>([]);
  const currentIndexRef = useRef(0);
  const isStoppedRef = useRef(false);

  // Load available voices
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      // Filter to English voices and prioritize high-quality ones
      const englishVoices = voices.filter(
        (v) => v.lang.startsWith("en") || v.lang === ""
      );
      setAvailableVoices(englishVoices.length > 0 ? englishVoices : voices);

      // Restore stored voice preference
      if (storedSettings.voiceURI) {
        const storedVoice = voices.find((v) => v.voiceURI === storedSettings.voiceURI);
        if (storedVoice) {
          setVoiceState(storedVoice);
        }
      }
    };

    loadVoices();

    // Chrome requires this event listener
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, [isSupported]);

  // Settings setters with persistence
  const setRate = useCallback((newRate: number) => {
    const clampedRate = Math.max(0.5, Math.min(2, newRate));
    setRateState(clampedRate);
    storeSettings(clampedRate, pitch, voice?.voiceURI || null);
  }, [pitch, voice]);

  const setPitch = useCallback((newPitch: number) => {
    const clampedPitch = Math.max(0.5, Math.min(2, newPitch));
    setPitchState(clampedPitch);
    storeSettings(rate, clampedPitch, voice?.voiceURI || null);
  }, [rate, voice]);

  const setVoice = useCallback((newVoice: SpeechSynthesisVoice) => {
    setVoiceState(newVoice);
    storeSettings(rate, pitch, newVoice.voiceURI);
  }, [rate, pitch]);

  // Speak a single sentence
  const speakSentence = useCallback((text: string, index: number) => {
    if (!isSupported) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      setCurrentSentence(index);
      onSentenceChange?.(index);
      setProgress(((index + 1) / sentencesRef.current.length) * 100);
    };

    utterance.onboundary = (event) => {
      if (event.name === "word") {
        onWordChange?.(event.charIndex, index);
      }
    };

    utterance.onend = () => {
      // Check if stopped
      if (isStoppedRef.current) {
        return;
      }

      // Move to next sentence
      const nextIndex = index + 1;
      if (nextIndex < sentencesRef.current.length) {
        currentIndexRef.current = nextIndex;
        speakSentence(sentencesRef.current[nextIndex], nextIndex);
      } else {
        // Completed all sentences
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(100);
        onComplete?.();
      }
    };

    utterance.onerror = (event) => {
      if (event.error !== "interrupted" && event.error !== "canceled") {
        console.error("TTS Error:", event.error);
        onError?.(event.error);
        setIsPlaying(false);
        setIsPaused(false);
      }
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [isSupported, rate, pitch, voice, onSentenceChange, onWordChange, onComplete, onError]);

  // Main speak function
  const speak = useCallback((text: string) => {
    if (!isSupported) {
      onError?.("Speech synthesis not supported");
      return;
    }

    // Stop any current speech
    speechSynthesis.cancel();
    isStoppedRef.current = false;

    // Split into sentences
    const newSentences = splitIntoSentences(text);
    setSentences(newSentences);
    sentencesRef.current = newSentences;
    currentIndexRef.current = 0;

    if (newSentences.length === 0) {
      onError?.("No text to speak");
      return;
    }

    setIsPlaying(true);
    setIsPaused(false);
    setCurrentSentence(0);
    setProgress(0);

    // Start speaking
    speakSentence(newSentences[0], 0);
  }, [isSupported, speakSentence, onError]);

  // Pause
  const pause = useCallback(() => {
    if (!isSupported || !isPlaying) return;
    speechSynthesis.pause();
    setIsPaused(true);
  }, [isSupported, isPlaying]);

  // Resume
  const resume = useCallback(() => {
    if (!isSupported || !isPaused) return;
    speechSynthesis.resume();
    setIsPaused(false);
  }, [isSupported, isPaused]);

  // Stop
  const stop = useCallback(() => {
    if (!isSupported) return;
    isStoppedRef.current = true;
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentence(0);
    setProgress(0);
  }, [isSupported]);

  // Skip forward (next sentence)
  const skipForward = useCallback(() => {
    if (!isSupported || !isPlaying) return;

    const nextIndex = currentIndexRef.current + 1;
    if (nextIndex < sentencesRef.current.length) {
      speechSynthesis.cancel();
      isStoppedRef.current = false;
      currentIndexRef.current = nextIndex;
      speakSentence(sentencesRef.current[nextIndex], nextIndex);
    }
  }, [isSupported, isPlaying, speakSentence]);

  // Skip backward (previous sentence)
  const skipBackward = useCallback(() => {
    if (!isSupported || !isPlaying) return;

    const prevIndex = Math.max(0, currentIndexRef.current - 1);
    speechSynthesis.cancel();
    isStoppedRef.current = false;
    currentIndexRef.current = prevIndex;
    speakSentence(sentencesRef.current[prevIndex], prevIndex);
  }, [isSupported, isPlaying, speakSentence]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return {
    // State
    isPlaying,
    isPaused,
    isSupported,
    currentSentence,
    progress,

    // Controls
    speak,
    pause,
    resume,
    stop,
    skipForward,
    skipBackward,

    // Settings
    rate,
    setRate,
    pitch,
    setPitch,
    voice,
    setVoice,
    availableVoices,

    // Utilities
    sentences,
    totalSentences: sentences.length,
  };
}

// ============================================
// PRESET RATES
// ============================================
export const TTS_SPEED_PRESETS = [
  { label: "0.5x", value: 0.5 },
  { label: "0.75x", value: 0.75 },
  { label: "1x", value: 1 },
  { label: "1.25x", value: 1.25 },
  { label: "1.5x", value: 1.5 },
  { label: "2x", value: 2 },
] as const;

export type TTSSpeedPreset = typeof TTS_SPEED_PRESETS[number];
