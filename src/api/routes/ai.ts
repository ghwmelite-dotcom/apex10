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

// Phishing simulation generator
ai.get("/security/phishing-test", async (c) => {
  const type = c.req.query("type") || "email";

  const prompt = `Generate a realistic ${type === "email" ? "phishing email" : "suspicious message"} example for educational purposes. This is to train users to identify scams.

  Return ONLY valid JSON:
  {
    "content": "the fake ${type} content with realistic but obviously fake details",
    "isPhishing": true,
    "redFlags": ["list", "of", "warning", "signs"],
    "explanation": "educational explanation of why this is suspicious"
  }

  Use fake company names like "CryptoSafe" or "BlockSecure" - never real companies.
  Include subtle red flags that trained users should spot.`;

  try {
    const response = await c.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: "You are creating educational phishing examples. Return ONLY valid JSON." },
        { role: "user", content: prompt },
      ],
      max_tokens: 400,
      temperature: 0.9,
    });

    const responseText = (response as { response: string }).response;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const simulation = JSON.parse(jsonMatch[0]);
      return c.json({
        ...simulation,
        id: crypto.randomUUID(),
        type,
      });
    }

    return c.json({ error: "Failed to generate simulation" }, 500);
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
