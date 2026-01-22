-- ============================================
-- APEX10 SEED DATA
-- Initial data for development
-- ============================================

-- Clear existing data
DELETE FROM watchlists;
DELETE FROM price_snapshots;
DELETE FROM rankings;
DELETE FROM security_content;
DELETE FROM assets;
DELETE FROM users;

-- ============================================
-- ASSETS: Top 10 Crypto Assets (XRP as flagship)
-- ============================================
INSERT INTO assets (symbol, name, slug, category, description, short_description, website, coingecko_id) VALUES
('XRP', 'XRP', 'xrp', 'Payment',
 'XRP is the native digital asset of the XRP Ledger, designed for fast, low-cost cross-border payments. Created by Ripple Labs, XRP enables On-Demand Liquidity (ODL) for financial institutions worldwide. The XRP Ledger processes transactions in 3-5 seconds with minimal fees, making it ideal for international remittances and enterprise payments. With strategic partnerships across major banks and payment providers, XRP continues to expand its utility in the global financial system. Monthly escrow releases of 1 billion XRP ensure predictable supply management.',
 'Fast cross-border payments and enterprise liquidity',
 'https://xrpl.org', 'ripple'),

('BTC', 'Bitcoin', 'bitcoin', 'L1',
 'Bitcoin is the first decentralized cryptocurrency, created in 2009 by an anonymous entity known as Satoshi Nakamoto. It operates on a peer-to-peer network using blockchain technology, enabling secure, transparent transactions without intermediaries.',
 'The original cryptocurrency and digital gold standard',
 'https://bitcoin.org', 'bitcoin'),

('ETH', 'Ethereum', 'ethereum', 'L1',
 'Ethereum is a decentralized platform that enables smart contracts and decentralized applications (dApps). Founded by Vitalik Buterin, it introduced programmable blockchain technology and hosts the largest ecosystem of Web3 applications.',
 'Programmable blockchain powering Web3',
 'https://ethereum.org', 'ethereum'),

('SOL', 'Solana', 'solana', 'L1',
 'Solana is a high-performance blockchain supporting fast, low-cost transactions. Using Proof of History consensus combined with Proof of Stake, it achieves exceptional throughput while maintaining decentralization.',
 'High-speed blockchain for scalable dApps',
 'https://solana.com', 'solana'),

('AVAX', 'Avalanche', 'avalanche', 'L1',
 'Avalanche is a layer-1 blockchain platform known for its speed and low transaction costs. It features a unique subnet architecture allowing custom blockchain deployments and supports Ethereum-compatible smart contracts.',
 'Blazingly fast, eco-friendly blockchain',
 'https://avax.network', 'avalanche-2'),

('LINK', 'Chainlink', 'chainlink', 'Infrastructure',
 'Chainlink is a decentralized oracle network that enables smart contracts to securely access off-chain data feeds, web APIs, and traditional bank payments. It is essential infrastructure for DeFi and cross-chain applications.',
 'Decentralized oracle network for smart contracts',
 'https://chain.link', 'chainlink'),

('AAVE', 'Aave', 'aave', 'DeFi',
 'Aave is a decentralized lending protocol allowing users to lend, borrow, and earn interest on crypto assets. It pioneered flash loans and operates across multiple chains with innovative features like credit delegation.',
 'Leading decentralized lending protocol',
 'https://aave.com', 'aave'),

('UNI', 'Uniswap', 'uniswap', 'DeFi',
 'Uniswap is the largest decentralized exchange (DEX) using an automated market maker (AMM) model. It enables trustless token swaps and has been instrumental in the growth of decentralized finance.',
 'Premier decentralized exchange protocol',
 'https://uniswap.org', 'uniswap'),

('ARB', 'Arbitrum', 'arbitrum', 'L2',
 'Arbitrum is a Layer 2 scaling solution for Ethereum using optimistic rollups. It offers faster, cheaper transactions while inheriting Ethereum security, and hosts a thriving ecosystem of DeFi applications.',
 'Leading Ethereum Layer 2 scaling solution',
 'https://arbitrum.io', 'arbitrum'),

('OP', 'Optimism', 'optimism', 'L2',
 'Optimism is an Ethereum Layer 2 using optimistic rollups to scale transactions. It is known for its commitment to public goods funding and operates the OP Stack, which powers multiple L2 networks.',
 'Ethereum L2 focused on public goods',
 'https://optimism.io', 'optimism'),

('MATIC', 'Polygon', 'polygon', 'L2',
 'Polygon is a multi-chain scaling platform for Ethereum, offering various scaling solutions including PoS sidechains and zkEVM. It has broad adoption among enterprises and Web3 applications.',
 'Multi-chain Ethereum scaling ecosystem',
 'https://polygon.technology', 'matic-network');

-- ============================================
-- RANKINGS: Asset Scores (XRP is flagship, separate from numbered rankings)
-- ============================================
INSERT INTO rankings (asset_id, rank, overall_score, potential_score, utility_score, developer_score, adoption_score, risk_level, strengths, weaknesses) VALUES
(1, 0, 90, 88, 94, 82, 86, 'medium',
 '["Fast 3-5 second transactions", "Enterprise partnerships", "ODL adoption growing", "Regulatory clarity improving", "Escrow provides supply predictability"]',
 '["Centralization concerns", "Regulatory uncertainty in some regions", "Competition from CBDCs"]'),

(2, 1, 95, 90, 85, 92, 98, 'low',
 '["Strongest network effect", "Institutional adoption", "Proven security track record", "Digital gold narrative"]',
 '["Limited programmability", "Slow transaction speed", "Energy consumption concerns"]'),

(3, 2, 92, 88, 95, 96, 94, 'low',
 '["Largest developer ecosystem", "Smart contract pioneer", "Strong institutional interest", "DeFi dominance"]',
 '["High gas fees during congestion", "Scaling challenges", "Competition from alt-L1s"]'),

(4, 3, 88, 92, 88, 85, 82, 'medium',
 '["Exceptional throughput", "Low transaction costs", "Growing DeFi ecosystem", "NFT market presence"]',
 '["Network outage history", "Centralization concerns", "Validator requirements"]'),

(5, 4, 85, 88, 84, 82, 78, 'medium',
 '["Subnet architecture", "EVM compatibility", "Fast finality", "Enterprise adoption"]',
 '["Smaller ecosystem than competitors", "Marketing challenges", "Complex tokenomics"]'),

(6, 5, 84, 85, 92, 88, 80, 'medium',
 '["Essential DeFi infrastructure", "Cross-chain capabilities", "Strong partnerships", "Revenue generating"]',
 '["Token utility debates", "Competition emerging", "Centralization concerns"]'),

(7, 6, 82, 84, 88, 85, 78, 'medium',
 '["DeFi lending pioneer", "Multi-chain presence", "Flash loan innovation", "Strong governance"]',
 '["Regulatory uncertainty", "Smart contract risks", "Competition from new protocols"]'),

(8, 7, 80, 82, 86, 84, 76, 'medium',
 '["DEX market leader", "AMM innovation", "Strong brand recognition", "Consistent development"]',
 '["Fee switch debates", "V4 adoption uncertainty", "Competition from aggregators"]'),

(9, 8, 79, 85, 82, 80, 72, 'medium',
 '["Leading L2 by TVL", "Strong DeFi ecosystem", "Ethereum security inheritance", "Developer friendly"]',
 '["Token distribution concerns", "Sequencer centralization", "Competition from other L2s"]'),

(10, 9, 77, 82, 78, 82, 70, 'medium',
 '["Public goods focus", "OP Stack adoption", "Superchain vision", "Strong team"]',
 '["Smaller ecosystem than Arbitrum", "Token utility questions", "Governance complexity"]'),

(11, 10, 75, 78, 80, 76, 74, 'medium',
 '["Enterprise adoption", "zkEVM development", "Broad scaling solutions", "Brand recognition"]',
 '["Token inflation concerns", "Complex product lineup", "Competition on all fronts"]');

-- ============================================
-- SECURITY CONTENT: Tips
-- ============================================
INSERT INTO security_content (type, category, title, content, severity, "order") VALUES
('tip', 'wallet', 'Use a Hardware Wallet',
 'Store significant holdings in a hardware wallet like Ledger or Trezor. Hardware wallets keep your private keys offline, protecting them from online attacks and malware.',
 'info', 1),

('tip', 'wallet', 'Secure Your Seed Phrase',
 'Write your seed phrase on paper or metal, never digitally. Store it in multiple secure locations. Never share it with anyone—no legitimate service will ever ask for it.',
 'critical', 2),

('tip', 'wallet', 'Use Unique Passwords',
 'Create strong, unique passwords for each exchange and wallet. Use a password manager like Bitwarden or 1Password to generate and store them securely.',
 'warning', 3),

('tip', 'transactions', 'Verify Addresses Carefully',
 'Always double-check recipient addresses before sending. Use address whitelisting where available. Send a small test transaction first for large transfers.',
 'warning', 4),

('tip', 'transactions', 'Understand Gas Fees',
 'Learn how gas fees work on each network. Use gas trackers to time transactions during low-fee periods. Set appropriate gas limits to avoid failed transactions.',
 'info', 5),

('tip', 'security', 'Enable Two-Factor Authentication',
 'Use authenticator apps (Google Authenticator, Authy) instead of SMS for 2FA. Store backup codes securely. Consider hardware security keys for maximum protection.',
 'critical', 6),

('tip', 'security', 'Beware of Phishing',
 'Bookmark official websites and only access them through bookmarks. Never click links in emails or messages claiming to be from exchanges or wallets.',
 'critical', 7),

('tip', 'defi', 'Research Before Interacting',
 'Only interact with audited smart contracts. Check audit reports, team backgrounds, and community sentiment before using any DeFi protocol.',
 'warning', 8);

-- ============================================
-- SECURITY CONTENT: Threats
-- ============================================
INSERT INTO security_content (type, category, title, content, severity, "order") VALUES
('threat', 'social', 'Phishing Attacks',
 'Attackers create fake websites, emails, and social media accounts impersonating legitimate services. They trick users into revealing private keys or seed phrases. Always verify URLs and never enter sensitive information from clicked links.',
 'critical', 1),

('threat', 'social', 'Social Engineering',
 'Scammers pose as support staff, influencers, or fellow community members. They build trust before requesting funds or sensitive information. Remember: no legitimate entity will ever ask for your private keys.',
 'critical', 2),

('threat', 'technical', 'Clipboard Hijacking',
 'Malware monitors your clipboard and replaces copied crypto addresses with attacker-controlled addresses. Always verify the full address after pasting, especially the first and last characters.',
 'warning', 3),

('threat', 'technical', 'Malicious Smart Contracts',
 'Some contracts contain hidden functions that can drain your wallet. Use token approval checkers regularly and revoke unnecessary approvals. Only interact with verified, audited contracts.',
 'critical', 4),

('threat', 'scam', 'Rug Pulls',
 'Project creators abandon a project after collecting investor funds. Warning signs include anonymous teams, unrealistic promises, and locked liquidity that can be unlocked. Research thoroughly before investing.',
 'warning', 5),

('threat', 'scam', 'Pump and Dump Schemes',
 'Coordinated groups artificially inflate token prices before selling, leaving later buyers with worthless tokens. Be skeptical of sudden price spikes and social media hype.',
 'warning', 6);

-- ============================================
-- SECURITY CONTENT: Wallet Guides
-- ============================================
INSERT INTO security_content (type, category, title, content, severity, "order", metadata) VALUES
('wallet_guide', 'hardware', 'Ledger Hardware Wallets',
 'Ledger devices store private keys in a secure chip, isolated from internet-connected devices. They support thousands of cryptocurrencies and integrate with popular software wallets. Best for long-term storage of significant holdings.',
 'info', 1, '{"pros": ["Industry-leading security", "Wide asset support", "Mobile app available"], "cons": ["Cost of device", "Learning curve", "Past data breach concerns"], "priceRange": "$79-$149"}'),

('wallet_guide', 'hardware', 'Trezor Hardware Wallets',
 'Trezor pioneered hardware wallets with open-source firmware. They offer transparent security and support major cryptocurrencies. The Trezor Suite provides a clean interface for managing assets.',
 'info', 2, '{"pros": ["Open-source firmware", "Proven track record", "Easy to use"], "cons": ["Fewer supported assets", "No Bluetooth option", "Plastic build"], "priceRange": "$69-$219"}'),

('wallet_guide', 'software', 'MetaMask',
 'The most popular Ethereum wallet, available as browser extension and mobile app. Essential for interacting with DeFi and NFT platforms. Supports multiple networks including L2s.',
 'info', 3, '{"pros": ["Widely supported", "Easy DeFi access", "Multi-network"], "cons": ["Hot wallet risks", "Phishing targets", "Browser dependency"], "priceRange": "Free"}'),

('wallet_guide', 'software', 'Phantom',
 'Leading wallet for Solana ecosystem, with clean UI and fast transactions. Also supports Ethereum and Polygon. Popular for NFT collectors and DeFi users.',
 'info', 4, '{"pros": ["Excellent UX", "Fast transactions", "Multi-chain support"], "cons": ["Newer than competitors", "Limited hardware wallet support"], "priceRange": "Free"}');

-- ============================================
-- SECURITY CONTENT: Acquisition Guides
-- ============================================
INSERT INTO security_content (type, category, title, content, severity, "order") VALUES
('acquisition_guide', 'centralized', 'Buying on Centralized Exchanges',
 'Centralized exchanges (CEXs) like Coinbase, Kraken, and Binance offer the easiest on-ramp for beginners. Create an account, complete identity verification (KYC), link a payment method, and purchase crypto. Remember to withdraw to your own wallet for long-term storage.',
 'info', 1),

('acquisition_guide', 'decentralized', 'Using Decentralized Exchanges',
 'DEXs like Uniswap allow direct wallet-to-wallet trading without intermediaries. Connect your wallet, ensure you have native tokens for gas fees, and swap tokens directly. Higher learning curve but greater privacy and control.',
 'info', 2),

('acquisition_guide', 'onramp', 'Fiat On-Ramps',
 'Services like MoonPay, Ramp, and Transak allow direct crypto purchases with cards or bank transfers. Often integrated into wallets and dApps for convenience. Compare fees as they vary significantly between providers.',
 'info', 3);
