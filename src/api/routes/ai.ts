import { Hono } from "hono";
import type { Env, ChatMessage, AIChatRequest } from "../types";

const ai = new Hono<{ Bindings: Env }>();

// System prompts for different contexts
const SYSTEM_PROMPTS = {
  general: `You are Apex, an expert AI crypto mentor for the Apex10 platform. Your role is to educate newcomers about cryptocurrency in a friendly, approachable way.

Key guidelines:
- Always prioritize security and safety in your advice
- Never give financial advice or recommend specific investments
- Explain complex concepts in simple terms
- Use analogies to make crypto concepts relatable
- Be encouraging but realistic about risks
- If unsure, acknowledge it and suggest reliable resources
- Keep responses concise but informative (under 200 words unless detailed explanation needed)

You have knowledge about:
- Blockchain fundamentals
- Cryptocurrency basics (Bitcoin, Ethereum, etc.)
- Wallet security and best practices
- Common scams and how to avoid them
- DeFi, NFTs, and Web3 concepts
- Safe crypto acquisition methods`,

  security: `You are Apex Security, a cybersecurity expert specializing in cryptocurrency protection. Your mission is to help users stay safe.

Focus areas:
- Wallet security (hardware vs software, seed phrases)
- Identifying phishing attempts and scams
- Safe transaction practices
- Exchange security
- Social engineering awareness
- Recovery procedures

Always emphasize: "Not your keys, not your crypto" and the importance of verifying everything.`,

  trading: `You are Apex Educator, helping users understand crypto markets. You DO NOT give trading advice or predictions.

You can explain:
- How markets work (order books, liquidity)
- What price charts show (not predictions)
- Risk management concepts
- Dollar-cost averaging
- The dangers of leverage and FOMO

Always include disclaimers about risk and volatility.`,

  defi: `You are Apex DeFi Guide, explaining decentralized finance concepts to beginners.

Topics you cover:
- What is DeFi and how it differs from traditional finance
- Liquidity pools and AMMs (simplified)
- Yield farming basics and risks
- Smart contract risks
- Impermanent loss explained simply
- Popular protocols and their purposes

Always emphasize the risks: smart contract bugs, rug pulls, and complexity.`,

  nft: `You are Apex NFT Educator, helping users understand non-fungible tokens.

You explain:
- What NFTs actually are (and aren't)
- How ownership and provenance work
- Use cases beyond art (gaming, identity, etc.)
- Risks and considerations
- How to evaluate NFT projects
- Environmental concerns and solutions

Be balanced - acknowledge both potential and current limitations.`,
};

// AI Chat endpoint - main mentor functionality
ai.post("/chat", async (c) => {
  try {
    const body = await c.req.json<AIChatRequest>();
    const { messages, context = "general" } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return c.json({ error: "Messages array is required" }, 400);
    }

    const systemPrompt = SYSTEM_PROMPTS[context] || SYSTEM_PROMPTS.general;

    // Prepare messages with system prompt
    const aiMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages.slice(-10), // Keep last 10 messages for context
    ];

    // Call Llama 3 via Workers AI
    const response = await c.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: aiMessages,
      max_tokens: 512,
      temperature: 0.7,
    });

    return c.json({
      response: (response as { response: string }).response,
      model: "llama-3.1-8b-instruct",
      context,
    });
  } catch (error) {
    console.error("AI Chat error:", error);
    return c.json({ error: "Failed to get AI response" }, 500);
  }
});

// Quick answers for common questions
ai.get("/quick/:topic", async (c) => {
  const topic = c.req.param("topic");

  const quickTopics: Record<string, string> = {
    "what-is-bitcoin": "Explain what Bitcoin is in 3 simple sentences for a complete beginner.",
    "what-is-ethereum": "Explain what Ethereum is and how it differs from Bitcoin in 3 sentences.",
    "what-is-wallet": "Explain what a crypto wallet is using a simple analogy.",
    "what-is-seed-phrase": "Explain what a seed phrase is and why it's critically important to protect.",
    "what-is-defi": "Explain DeFi in simple terms a beginner would understand.",
    "what-is-nft": "Explain what an NFT is without using technical jargon.",
    "how-to-stay-safe": "Give 3 essential safety tips for crypto beginners.",
    "common-scams": "List 3 most common crypto scams and how to avoid them.",
  };

  const prompt = quickTopics[topic];
  if (!prompt) {
    return c.json({ error: "Unknown topic" }, 404);
  }

  try {
    const response = await c.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.general },
        { role: "user", content: prompt },
      ],
      max_tokens: 256,
      temperature: 0.5,
    });

    return c.json({
      topic,
      answer: (response as { response: string }).response,
    });
  } catch (error) {
    console.error("Quick answer error:", error);
    return c.json({ error: "Failed to get answer" }, 500);
  }
});

// Security quiz generator
ai.get("/security/quiz", async (c) => {
  const difficulty = c.req.query("difficulty") || "medium";
  const category = c.req.query("category") || "general";

  const prompt = `Generate a ${difficulty} difficulty multiple-choice security quiz question about ${category} in crypto.

  Return ONLY valid JSON in this exact format:
  {
    "question": "the question text",
    "options": ["option A", "option B", "option C", "option D"],
    "correctAnswer": 0,
    "explanation": "why this is the correct answer"
  }

  Make the question educational and relevant to real-world crypto security.`;

  try {
    const response = await c.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: "You are a crypto security educator. Return ONLY valid JSON, no other text." },
        { role: "user", content: prompt },
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    const responseText = (response as { response: string }).response;

    // Try to parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const quiz = JSON.parse(jsonMatch[0]);
      return c.json({
        ...quiz,
        id: crypto.randomUUID(),
        difficulty,
        category,
      });
    }

    return c.json({ error: "Failed to generate quiz" }, 500);
  } catch (error) {
    console.error("Quiz generation error:", error);
    return c.json({ error: "Failed to generate quiz" }, 500);
  }
});

// Security awareness training - scam identification scenarios
ai.get("/security/phishing-test", async (c) => {
  const type = c.req.query("type") || "email";

  // Pre-built educational scenarios to avoid AI content filter issues
  const emailScenarios = [
    {
      content: `From: support@crypt0-wallet-security.com\nSubject: URGENT: Your wallet has been compromised!\n\nDear Valued Customer,\n\nWe have detected suspicious activity on your CryptoSafe wallet. Your account will be suspended in 24 hours unless you verify your identity.\n\nClick here to verify: http://cryptosafe-verify.suspicious-link.com/login\n\nYou must enter your seed phrase to confirm ownership.\n\nBest regards,\nCryptoSafe Security Team`,
      isPhishing: true,
      redFlags: [
        "Misspelled domain (crypt0 with zero)",
        "Creates false urgency with 24-hour deadline",
        "Suspicious link URL doesn't match company",
        "Asks for seed phrase - legitimate services NEVER do this",
        "Generic greeting instead of your name"
      ],
      explanation: "This is a classic phishing attempt. Legitimate crypto services will NEVER ask for your seed phrase. The urgency tactics and suspicious domain are major red flags."
    },
    {
      content: `From: noreply@blockchainrewards.net\nSubject: Congratulations! You've won 2.5 BTC!\n\nHello Winner!\n\nYour wallet address was randomly selected in our blockchain anniversary giveaway!\n\nPrize: 2.5 BTC (≈$150,000)\n\nTo claim, simply send 0.01 BTC processing fee to:\nbc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh\n\nOnce received, your 2.5 BTC will be sent within 1 hour!\n\nAct fast - offer expires in 48 hours!`,
      isPhishing: true,
      redFlags: [
        "Unsolicited prize notification",
        "Requires payment to receive prize (advance fee scam)",
        "Too good to be true amount",
        "Time pressure tactics",
        "Random wallet selection is not how crypto works"
      ],
      explanation: "This is an advance fee scam. You should never send crypto to receive crypto. Legitimate giveaways don't require upfront payment."
    },
    {
      content: `From: admin@metamask-support.io\nSubject: Action Required: Wallet Synchronization\n\nDear User,\n\nDue to our recent upgrade, all wallets must be re-synchronized.\n\nFailure to complete this within 12 hours will result in loss of funds.\n\nSynchronize now: metamask-sync.com/wallet\n\nYou will need to import your wallet using your recovery phrase.\n\nMetaMask Support`,
      isPhishing: true,
      redFlags: [
        "Fake domain (metamask-support.io, not metamask.io)",
        "Wallets don't need 'synchronization'",
        "Threatens fund loss",
        "Asks for recovery phrase",
        "Link goes to unofficial domain"
      ],
      explanation: "MetaMask and other wallets never require 're-synchronization'. This is attempting to steal your seed phrase through a fake website."
    }
  ];

  const messageScenarios = [
    {
      content: `Hey! I'm a developer from Uniswap. We noticed your wallet qualifies for our exclusive airdrop of 5000 UNI tokens. DM me your wallet address and seed phrase to verify eligibility. This is time-sensitive - only 50 spots left! 🚀`,
      isPhishing: true,
      redFlags: [
        "Unsolicited DM about free tokens",
        "Claims to be from official team via DM",
        "Asks for seed phrase",
        "Creates artificial scarcity",
        "Uses urgency tactics"
      ],
      explanation: "Official teams never DM first about airdrops or ask for seed phrases. Airdrops are claimed through official websites, not private messages."
    },
    {
      content: `ATTENTION: Your Trust Wallet needs immediate verification due to new KYC regulations. Visit trustwallet-verify.com within 24 hours or your assets will be frozen. Enter your 12-word phrase to complete verification.`,
      isPhishing: true,
      redFlags: [
        "Fake regulatory claims",
        "Non-official domain",
        "Asks for 12-word phrase",
        "Threatens to freeze assets",
        "Urgency tactics"
      ],
      explanation: "Trust Wallet is a non-custodial wallet - there's no central authority to 'freeze' your assets. They would never ask for your seed phrase."
    },
    {
      content: `🎁 CONGRATS! You've been selected for the Binance Mystery Box event! Connect your wallet at binance-rewards.xyz to claim your FREE NFT worth up to $10,000! Only 100 boxes remaining! ⏰`,
      isPhishing: true,
      redFlags: [
        "Unofficial domain (.xyz not binance.com)",
        "Unsolicited reward notification",
        "Too-good-to-be-true value",
        "Artificial scarcity (100 remaining)",
        "Asks to connect wallet to unknown site"
      ],
      explanation: "This fake giveaway tries to get you to connect your wallet to a malicious site that could drain your funds through a malicious smart contract approval."
    }
  ];

  try {
    const scenarios = type === "email" ? emailScenarios : messageScenarios;
    const randomIndex = Math.floor(Math.random() * scenarios.length);
    const scenario = scenarios[randomIndex];

    return c.json({
      ...scenario,
      id: crypto.randomUUID(),
      type,
    });
  } catch (error) {
    console.error("Phishing simulation error:", error);
    return c.json({ error: "Failed to generate simulation" }, 500);
  }
});

// Asset analysis - AI-powered insights
ai.post("/analyze/asset", async (c) => {
  try {
    const { symbol, data } = await c.req.json<{ symbol: string; data: Record<string, unknown> }>();

    const prompt = `As a crypto educator (NOT financial advisor), provide educational context about ${symbol}:

Asset data: ${JSON.stringify(data)}

Provide:
1. A brief explanation of what this project does
2. Key technology or features
3. General market context (not predictions)
4. Potential risks to be aware of

Keep it educational, balanced, and under 200 words. Include a disclaimer that this is not financial advice.`;

    const response = await c.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.general },
        { role: "user", content: prompt },
      ],
      max_tokens: 400,
      temperature: 0.6,
    });

    return c.json({
      symbol,
      analysis: (response as { response: string }).response,
      disclaimer: "This is educational content only, not financial advice.",
    });
  } catch (error) {
    console.error("Asset analysis error:", error);
    return c.json({ error: "Failed to analyze asset" }, 500);
  }
});

// Learning path generator
ai.post("/learning/path", async (c) => {
  try {
    const { level, interests, timePerDay } = await c.req.json<{
      level: "beginner" | "intermediate" | "advanced";
      interests: string[];
      timePerDay: number;
    }>();

    const prompt = `Create a personalized crypto learning path for a ${level} who is interested in: ${interests.join(", ")}.
They have ${timePerDay} minutes per day to learn.

Return ONLY valid JSON:
{
  "path": [
    {
      "week": 1,
      "topic": "topic name",
      "description": "what they'll learn",
      "dailyTasks": ["task 1", "task 2"],
      "resources": ["suggested resource"]
    }
  ],
  "estimatedDuration": "X weeks",
  "difficulty": "${level}"
}

Create 4 weeks of structured learning.`;

    const response = await c.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: "You are a crypto education curriculum designer. Return ONLY valid JSON." },
        { role: "user", content: prompt },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const responseText = (response as { response: string }).response;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return c.json(JSON.parse(jsonMatch[0]));
    }

    return c.json({ error: "Failed to generate learning path" }, 500);
  } catch (error) {
    console.error("Learning path error:", error);
    return c.json({ error: "Failed to generate learning path" }, 500);
  }
});

// Explain like I'm 5 (ELI5)
ai.get("/eli5/:concept", async (c) => {
  const concept = c.req.param("concept").replace(/-/g, " ");

  try {
    const response = await c.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "system",
          content: "You explain crypto concepts like you're talking to a 5-year-old. Use simple words, fun analogies, and short sentences. Be playful but accurate."
        },
        { role: "user", content: `Explain "${concept}" like I'm 5 years old.` },
      ],
      max_tokens: 200,
      temperature: 0.8,
    });

    return c.json({
      concept,
      explanation: (response as { response: string }).response,
    });
  } catch (error) {
    console.error("ELI5 error:", error);
    return c.json({ error: "Failed to explain concept" }, 500);
  }
});

// Market sentiment summary (educational, not predictive)
ai.get("/market/context", async (c) => {
  try {
    const response = await c.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "system",
          content: "You provide educational market context. Never make predictions. Focus on explaining what's happening and why, not what will happen."
        },
        {
          role: "user",
          content: "Provide a brief educational overview of the current crypto market context. Explain common terms and concepts newcomers might see in news. Do not make any predictions or give investment advice."
        },
      ],
      max_tokens: 300,
      temperature: 0.5,
    });

    return c.json({
      context: (response as { response: string }).response,
      disclaimer: "This is educational content only, not financial advice or predictions.",
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Market context error:", error);
    return c.json({ error: "Failed to get market context" }, 500);
  }
});

export default ai;
