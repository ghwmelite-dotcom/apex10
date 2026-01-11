import { useEffect, useCallback } from "react";
import { useTextToSpeech, TTS_SPEED_PRESETS } from "./useTextToSpeech";
import { useCloudPreferences } from "./useCloudPreferences";

interface UseCloudTTSOptions {
  onSentenceChange?: (index: number) => void;
  onWordChange?: (wordIndex: number, sentenceIndex: number) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

/**
 * TTS hook with cloud-synced preferences
 * Combines useTextToSpeech with useCloudPreferences for persistence
 */
export function useCloudTTS(options: UseCloudTTSOptions = {}) {
  const tts = useTextToSpeech(options);
  const { preferences, updateTTSPreferences, isLoading, isSyncing, isWalletConnected, userId } = useCloudPreferences();

  // Sync cloud preferences to TTS on load
  useEffect(() => {
    if (!isLoading && preferences.tts) {
      // Only update if different to avoid loops
      if (preferences.tts.rate !== tts.rate) {
        tts.setRate(preferences.tts.rate);
      }
      if (preferences.tts.pitch !== tts.pitch) {
        tts.setPitch(preferences.tts.pitch);
      }
      // Voice matching would need to happen after voices are loaded
      if (preferences.tts.voiceURI && tts.availableVoices.length > 0) {
        const matchingVoice = tts.availableVoices.find(
          v => v.voiceURI === preferences.tts?.voiceURI
        );
        if (matchingVoice && matchingVoice.voiceURI !== tts.voice?.voiceURI) {
          tts.setVoice(matchingVoice);
        }
      }
    }
  }, [isLoading, preferences.tts, tts.availableVoices]);

  // Wrapped setters that sync to cloud
  const setRate = useCallback((rate: number) => {
    tts.setRate(rate);
    updateTTSPreferences({ rate });
  }, [tts, updateTTSPreferences]);

  const setPitch = useCallback((pitch: number) => {
    tts.setPitch(pitch);
    updateTTSPreferences({ pitch });
  }, [tts, updateTTSPreferences]);

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    tts.setVoice(voice);
    updateTTSPreferences({ voiceURI: voice.voiceURI });
  }, [tts, updateTTSPreferences]);

  return {
    // All TTS state and controls
    ...tts,

    // Override setters with cloud-synced versions
    setRate,
    setPitch,
    setVoice,

    // Cloud sync status
    isLoadingPreferences: isLoading,
    isSyncingPreferences: isSyncing,
    isWalletConnected,
    userId,
  };
}

export { TTS_SPEED_PRESETS };
export default useCloudTTS;
