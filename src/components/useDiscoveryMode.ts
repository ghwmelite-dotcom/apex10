import { useState, useEffect } from "react";

// Hook to manage discovery mode state
export function useDiscoveryMode() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem("apex10-discovery-completed");
    setHasCompleted(completed === "true");
  }, []);

  const openDiscovery = () => setIsOpen(true);
  const closeDiscovery = () => setIsOpen(false);
  const completeDiscovery = () => {
    setHasCompleted(true);
    setIsOpen(false);
  };

  // Auto-open for new users (optional)
  useEffect(() => {
    if (!hasCompleted) {
      const timer = setTimeout(() => {
        // Uncomment to auto-open for new users:
        // setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasCompleted]);

  return {
    isOpen,
    hasCompleted,
    openDiscovery,
    closeDiscovery,
    completeDiscovery,
  };
}
