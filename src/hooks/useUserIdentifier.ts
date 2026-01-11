import { useAccount } from "wagmi";
import { useState, useEffect } from "react";

const DEVICE_ID_KEY = "apex10-device-id";

/**
 * Generates a unique device ID using crypto.randomUUID or fallback
 */
function generateDeviceId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `device-${crypto.randomUUID()}`;
  }
  // Fallback for older browsers
  return `device-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Gets or creates a persistent device ID stored in localStorage
 */
function getOrCreateDeviceId(): string {
  try {
    const existing = localStorage.getItem(DEVICE_ID_KEY);
    if (existing) {
      return existing;
    }
    const newId = generateDeviceId();
    localStorage.setItem(DEVICE_ID_KEY, newId);
    return newId;
  } catch {
    // localStorage not available, generate temporary ID
    return generateDeviceId();
  }
}

interface UseUserIdentifierReturn {
  /** The user identifier (wallet address or device ID) */
  userId: string;
  /** Whether the user is connected with a wallet */
  isWalletConnected: boolean;
  /** The wallet address if connected */
  walletAddress: string | undefined;
  /** The device ID (always available) */
  deviceId: string;
  /** Whether the identifier is ready to use */
  isReady: boolean;
}

/**
 * Hook that provides a unique user identifier
 * - Uses wallet address if connected (0x...)
 * - Falls back to device ID if not connected
 */
export function useUserIdentifier(): UseUserIdentifierReturn {
  const { address, isConnected } = useAccount();
  const [deviceId, setDeviceId] = useState<string>("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Get or create device ID on mount
    const id = getOrCreateDeviceId();
    setDeviceId(id);
    setIsReady(true);
  }, []);

  // Use wallet address if connected, otherwise device ID
  const userId = isConnected && address ? address.toLowerCase() : deviceId;

  return {
    userId,
    isWalletConnected: isConnected,
    walletAddress: address,
    deviceId,
    isReady: isReady && userId.length > 0,
  };
}

export default useUserIdentifier;
