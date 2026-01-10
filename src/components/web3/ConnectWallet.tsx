import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { Wallet, ChevronDown } from "lucide-react";

interface ConnectWalletProps {
  variant?: "full" | "compact" | "icon";
  className?: string;
}

export function ConnectWallet({ variant = "full", className = "" }: ConnectWalletProps) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
            className={className}
          >
            {(() => {
              if (!connected) {
                return (
                  <motion.button
                    onClick={openConnectModal}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex items-center justify-center gap-2 font-medium
                      bg-gradient-to-r from-accent-cyan/20 to-accent-purple/20
                      border border-accent-cyan/30 hover:border-accent-cyan/50
                      text-accent-cyan transition-all duration-200
                      ${variant === "icon" ? "p-2 rounded-lg" : "px-4 py-2 rounded-xl"}
                    `}
                  >
                    <Wallet className="w-5 h-5" />
                    {variant !== "icon" && (
                      <span>{variant === "compact" ? "Connect" : "Connect Wallet"}</span>
                    )}
                  </motion.button>
                );
              }

              if (chain.unsupported) {
                return (
                  <motion.button
                    onClick={openChainModal}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium
                      bg-nova-red/20 border border-nova-red/50 text-nova-red"
                  >
                    Wrong Network
                    <ChevronDown className="w-4 h-4" />
                  </motion.button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  {variant === "full" && (
                    <motion.button
                      onClick={openChainModal}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg
                        bg-bg-tertiary/50 border border-border-primary/30
                        hover:border-border-primary/50 transition-all duration-200"
                    >
                      {chain.hasIcon && (
                        <div
                          className="w-5 h-5 rounded-full overflow-hidden"
                          style={{ background: chain.iconBackground }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              className="w-5 h-5"
                            />
                          )}
                        </div>
                      )}
                      <span className="text-sm text-text-secondary hidden sm:block">
                        {chain.name}
                      </span>
                      <ChevronDown className="w-4 h-4 text-text-muted" />
                    </motion.button>
                  )}

                  <motion.button
                    onClick={openAccountModal}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex items-center gap-2 font-medium
                      bg-gradient-to-r from-accent-cyan/10 to-accent-purple/10
                      border border-accent-cyan/20 hover:border-accent-cyan/40
                      text-text-primary transition-all duration-200
                      ${variant === "icon" ? "p-2 rounded-lg" : "px-4 py-2 rounded-xl"}
                    `}
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple" />
                    {variant !== "icon" && (
                      <span className="text-sm">
                        {account.displayName}
                        {account.displayBalance && variant === "full" && (
                          <span className="text-text-muted ml-2">
                            ({account.displayBalance})
                          </span>
                        )}
                      </span>
                    )}
                  </motion.button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

export default ConnectWallet;
