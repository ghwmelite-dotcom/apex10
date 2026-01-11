import { useState, useEffect, useCallback, useRef } from "react";
import { useUserIdentifier } from "./useUserIdentifier";

const API_BASE = "/api/preferences";
const DEBOUNCE_MS = 1000; // Debounce saves by 1 second

// ============================================
// TYPES
// ============================================
export interface TTSPreferences {
  rate: number;
  pitch: number;
  voiceURI: string | null;
}

export interface UserPreferences {
  tts?: TTSPreferences;
  theme?: string;
  updatedAt?: string;
}

interface UseCloudPreferencesReturn {
  /** Current preferences */
  preferences: UserPreferences;
  /** Update preferences (auto-syncs to cloud) */
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  /** Update only TTS preferences */
  updateTTSPreferences: (tts: Partial<TTSPreferences>) => void;
  /** Whether preferences are loading */
  isLoading: boolean;
  /** Whether preferences are syncing to cloud */
  isSyncing: boolean;
  /** Any error that occurred */
  error: string | null;
  /** Force refresh from cloud */
  refresh: () => Promise<void>;
  /** User identifier being used */
  userId: string;
  /** Whether using wallet or device ID */
  isWalletConnected: boolean;
}

// Default preferences
const DEFAULT_PREFERENCES: UserPreferences = {
  tts: {
    rate: 1,
    pitch: 1,
    voiceURI: null,
  },
  theme: "dark",
};

// Local storage key for offline fallback
const LOCAL_STORAGE_KEY = "apex10-preferences";

/**
 * Get preferences from localStorage as fallback
 */
function getLocalPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
    }
  } catch {
    // Ignore errors
  }
  return DEFAULT_PREFERENCES;
}

/**
 * Save preferences to localStorage as fallback
 */
function setLocalPreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore errors
  }
}

/**
 * Hook for managing user preferences with cloud sync
 * - Fetches preferences from cloud on mount
 * - Syncs changes to cloud with debouncing
 * - Falls back to localStorage if cloud fails
 */
export function useCloudPreferences(): UseCloudPreferencesReturn {
  const { userId, isWalletConnected, isReady } = useUserIdentifier();

  const [preferences, setPreferences] = useState<UserPreferences>(getLocalPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for debouncing
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingUpdatesRef = useRef<Partial<UserPreferences> | null>(null);

  // Fetch preferences from cloud
  const fetchPreferences = useCallback(async () => {
    if (!isReady || !userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch preferences: ${response.status}`);
      }

      const data = await response.json();
      const cloudPrefs = data.data as UserPreferences;

      // Merge with defaults
      const merged = {
        ...DEFAULT_PREFERENCES,
        ...cloudPrefs,
        tts: { ...DEFAULT_PREFERENCES.tts, ...cloudPrefs?.tts },
      };

      setPreferences(merged);
      setLocalPreferences(merged);
    } catch (err) {
      console.error("Failed to fetch cloud preferences:", err);
      setError(err instanceof Error ? err.message : "Failed to load preferences");
      // Use local preferences as fallback
      setPreferences(getLocalPreferences());
    } finally {
      setIsLoading(false);
    }
  }, [userId, isReady]);

  // Save preferences to cloud
  const saveToCloud = useCallback(async (prefs: UserPreferences) => {
    if (!isReady || !userId) return;

    setIsSyncing(true);

    try {
      const response = await fetch(`${API_BASE}/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });

      if (!response.ok) {
        throw new Error(`Failed to save preferences: ${response.status}`);
      }

      setError(null);
    } catch (err) {
      console.error("Failed to save cloud preferences:", err);
      setError(err instanceof Error ? err.message : "Failed to save preferences");
      // Local storage is already updated, so user won't lose data
    } finally {
      setIsSyncing(false);
    }
  }, [userId, isReady]);

  // Debounced save function
  const debouncedSave = useCallback((newPrefs: UserPreferences) => {
    // Clear any pending save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Schedule new save
    saveTimeoutRef.current = setTimeout(() => {
      saveToCloud(newPrefs);
      saveTimeoutRef.current = null;
    }, DEBOUNCE_MS);
  }, [saveToCloud]);

  // Update preferences
  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const updated = {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      // Save locally immediately
      setLocalPreferences(updated);

      // Debounce cloud save
      debouncedSave(updated);

      return updated;
    });
  }, [debouncedSave]);

  // Update TTS preferences specifically
  const updateTTSPreferences = useCallback((ttsUpdates: Partial<TTSPreferences>) => {
    setPreferences((prev) => {
      const updated = {
        ...prev,
        tts: { ...prev.tts, ...ttsUpdates } as TTSPreferences,
        updatedAt: new Date().toISOString(),
      };

      // Save locally immediately
      setLocalPreferences(updated);

      // Debounce cloud save
      debouncedSave(updated);

      return updated;
    });
  }, [debouncedSave]);

  // Fetch on mount and when userId changes
  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    preferences,
    updatePreferences,
    updateTTSPreferences,
    isLoading,
    isSyncing,
    error,
    refresh: fetchPreferences,
    userId,
    isWalletConnected,
  };
}

export default useCloudPreferences;
