import type { Env, NewsArticle, NewsCategory, NewsSource, NewsSourceInfo } from "../types";

// ============================================
// RSS FEED CONFIGURATION
// ============================================
const RSS_FEEDS: Record<Exclude<NewsSource, "all">, { url: string; name: string; icon: string; description: string }> = {
  coindesk: {
    url: "https://www.coindesk.com/arc/outboundfeeds/rss/",
    name: "CoinDesk",
    icon: "https://www.coindesk.com/favicon.ico",
    description: "Leading digital media, events and information services company for the crypto asset and blockchain technology community.",
  },
  cointelegraph: {
    url: "https://cointelegraph.com/rss",
    name: "Cointelegraph",
    icon: "https://cointelegraph.com/favicon.ico",
    description: "The leading independent digital media resource covering cryptocurrency, blockchain and fintech news.",
  },
  theblock: {
    url: "https://www.theblock.co/rss.xml",
    name: "The Block",
    icon: "https://www.theblock.co/favicon.ico",
    description: "The Block is a leading source of crypto and digital asset analysis, blockchain and Web3 news.",
  },
  decrypt: {
    url: "https://decrypt.co/feed",
    name: "Decrypt",
    icon: "https://decrypt.co/favicon.ico",
    description: "Decrypt makes blockchain and cryptocurrency accessible through our media, events and educational resources.",
  },
  cryptoslate: {
    url: "https://cryptoslate.com/feed/",
    name: "CryptoSlate",
    icon: "https://cryptoslate.com/favicon.ico",
    description: "CryptoSlate provides a comprehensive resource for cryptocurrency research, data and news.",
  },
  bitcoinmagazine: {
    url: "https://bitcoinmagazine.com/.rss/full/",
    name: "Bitcoin Magazine",
    icon: "https://bitcoinmagazine.com/favicon.ico",
    description: "The first and longest-standing publication devoted to the digital currency Bitcoin and its impact.",
  },
};

// Fallback images for articles without thumbnails (high-quality Unsplash images)
const CATEGORY_FALLBACK_IMAGES: Record<Exclude<NewsCategory, "all">, string[]> = {
  market: [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80", // Trading charts
    "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80", // Bitcoin gold
    "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80", // Crypto coins
    "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80", // Stock market
  ],
  defi: [
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80", // Ethereum
    "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&q=80", // DeFi abstract
    "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&q=80", // Blockchain
    "https://images.unsplash.com/photo-1516245834210-c4c142787335?w=800&q=80", // Network
  ],
  nft: [
    "https://images.unsplash.com/photo-1646463535616-6fe0b503fb0c?w=800&q=80", // NFT art
    "https://images.unsplash.com/photo-1637611331620-51149c7ceb94?w=800&q=80", // Digital art
    "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=800&q=80", // Metaverse
    "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80", // Abstract digital
  ],
  regulation: [
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80", // Gavel/law
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80", // Business suit
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80", // Documents
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80", // Office work
  ],
  technology: [
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80", // Server room
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80", // Code matrix
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80", // Cybersecurity
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80", // Tech globe
  ],
  analysis: [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", // Analytics dashboard
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", // Data analysis
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80", // Charts
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80", // Strategy
  ],
};

// Get a consistent fallback image based on article ID (so same article always gets same image)
function getFallbackImage(articleId: string, category: Exclude<NewsCategory, "all">): string {
  const images = CATEGORY_FALLBACK_IMAGES[category] || CATEGORY_FALLBACK_IMAGES.market;
  // Use article ID hash to pick a consistent image
  let hash = 0;
  for (let i = 0; i < articleId.length; i++) {
    hash = ((hash << 5) - hash) + articleId.charCodeAt(i);
    hash = hash & hash;
  }
  return images[Math.abs(hash) % images.length];
}

// Category keywords for AI-free categorization
const CATEGORY_KEYWORDS: Record<Exclude<NewsCategory, "all">, string[]> = {
  market: ["price", "bitcoin", "ethereum", "btc", "eth", "market", "trading", "rally", "crash", "bull", "bear", "ath", "dump", "pump", "whale", "volume", "liquidation"],
  defi: ["defi", "lending", "yield", "staking", "liquidity", "pool", "swap", "dex", "aave", "uniswap", "compound", "maker", "dao", "governance", "tvl"],
  nft: ["nft", "opensea", "blur", "collectible", "digital art", "metaverse", "gaming", "play-to-earn", "p2e", "avatar", "pfp", "mint"],
  regulation: ["regulation", "sec", "cftc", "law", "legal", "ban", "compliance", "government", "congress", "senate", "court", "lawsuit", "investigation", "enforcement"],
  technology: ["layer 2", "l2", "scaling", "upgrade", "fork", "consensus", "proof of", "zk", "rollup", "shard", "protocol", "mainnet", "testnet", "developer"],
  analysis: ["analysis", "report", "research", "outlook", "prediction", "forecast", "review", "deep dive", "explained", "guide", "tutorial"],
};

// ============================================
// RSS PARSING
// ============================================

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  content?: string;
  creator?: string;
  thumbnail?: string;
  categories?: string[];
}

// Parse RSS XML using regex (lightweight, no XML parser needed)
function parseRSSXML(xml: string, source: Exclude<NewsSource, "all">): RSSItem[] {
  const items: RSSItem[] = [];

  // Match all <item> elements
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let itemMatch;

  while ((itemMatch = itemRegex.exec(xml)) !== null) {
    const itemXml = itemMatch[1];

    // Extract fields with various tag formats
    const title = extractTag(itemXml, "title");
    const link = extractTag(itemXml, "link");
    const description = extractTag(itemXml, "description");
    const pubDate = extractTag(itemXml, "pubDate") || extractTag(itemXml, "dc:date");
    const content = extractTag(itemXml, "content:encoded") || extractTag(itemXml, "content");
    const creator = extractTag(itemXml, "dc:creator") || extractTag(itemXml, "author");

    // Extract thumbnail from various formats
    let thumbnail = extractMediaThumbnail(itemXml) ||
                    extractEnclosure(itemXml) ||
                    extractImageFromContent(description || content || "");

    // Extract categories
    const categories = extractCategories(itemXml);

    if (title && link) {
      items.push({
        title: cleanHTML(title),
        description: cleanHTML(description || ""),
        link,
        pubDate: pubDate || new Date().toISOString(),
        content: cleanHTML(content || description || ""),
        creator: cleanHTML(creator || ""),
        thumbnail,
        categories,
      });
    }
  }

  return items;
}

function extractTag(xml: string, tagName: string): string | null {
  // Try CDATA first
  const cdataRegex = new RegExp(`<${tagName}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tagName}>`, "i");
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  // Try regular tag
  const tagRegex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, "i");
  const tagMatch = xml.match(tagRegex);
  if (tagMatch) return tagMatch[1].trim();

  return null;
}

function extractMediaThumbnail(xml: string): string | null {
  // media:thumbnail
  const mediaMatch = xml.match(/<media:thumbnail[^>]*url=["']([^"']+)["']/i);
  if (mediaMatch) return mediaMatch[1];

  // media:content
  const contentMatch = xml.match(/<media:content[^>]*url=["']([^"']+)["'][^>]*type=["']image/i);
  if (contentMatch) return contentMatch[1];

  return null;
}

function extractEnclosure(xml: string): string | null {
  const match = xml.match(/<enclosure[^>]*url=["']([^"']+)["'][^>]*type=["']image/i);
  return match ? match[1] : null;
}

function extractImageFromContent(content: string): string | null {
  const match = content.match(/<img[^>]*src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function extractCategories(xml: string): string[] {
  const categories: string[] = [];
  const regex = /<category[^>]*>([^<]+)<\/category>/gi;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    categories.push(cleanHTML(match[1]));
  }
  return categories;
}

function cleanHTML(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// ============================================
// CATEGORIZATION
// ============================================

function categorizeArticle(article: RSSItem): Exclude<NewsCategory, "all"> {
  const text = `${article.title} ${article.description} ${article.categories?.join(" ") || ""}`.toLowerCase();

  const scores: Record<Exclude<NewsCategory, "all">, number> = {
    market: 0,
    defi: 0,
    nft: 0,
    regulation: 0,
    technology: 0,
    analysis: 0,
  };

  // Score each category based on keyword matches
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        scores[category as Exclude<NewsCategory, "all">] += 1;
      }
    }
  }

  // Find highest scoring category
  let maxCategory: Exclude<NewsCategory, "all"> = "market"; // default
  let maxScore = 0;

  for (const [category, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxCategory = category as Exclude<NewsCategory, "all">;
    }
  }

  return maxCategory;
}

// ============================================
// ARTICLE PROCESSING
// ============================================

function generateArticleId(source: string, link: string): string {
  // Create a simple hash-like ID from source and link
  const str = `${source}:${link}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `${source}-${Math.abs(hash).toString(36)}`;
}

function calculateReadingTime(content: string): number {
  const words = content.split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

function rssItemToArticle(item: RSSItem, source: Exclude<NewsSource, "all">): NewsArticle {
  const sourceInfo = RSS_FEEDS[source];
  const articleId = generateArticleId(source, item.link);
  const category = categorizeArticle(item);

  // Use original thumbnail or fallback to category-based image
  const image = item.thumbnail || getFallbackImage(articleId, category);

  return {
    id: articleId,
    title: item.title,
    description: item.description.slice(0, 300) + (item.description.length > 300 ? "..." : ""),
    content: item.content || item.description,
    url: item.link,
    image,
    source,
    sourceName: sourceInfo.name,
    sourceIcon: sourceInfo.icon,
    author: item.creator || undefined,
    publishedAt: new Date(item.pubDate).toISOString(),
    category,
    tags: item.categories,
    readingTime: calculateReadingTime(item.content || item.description),
  };
}

// ============================================
// FEED FETCHING
// ============================================

async function fetchSingleFeed(source: Exclude<NewsSource, "all">): Promise<NewsArticle[]> {
  const feedConfig = RSS_FEEDS[source];

  try {
    const response = await fetch(feedConfig.url, {
      headers: {
        "User-Agent": "Apex10 News Aggregator/1.0",
        "Accept": "application/rss+xml, application/xml, text/xml",
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${source} feed: ${response.status}`);
      return [];
    }

    const xml = await response.text();
    const items = parseRSSXML(xml, source);

    return items.map((item) => rssItemToArticle(item, source));
  } catch (error) {
    console.error(`Error fetching ${source} feed:`, error);
    return [];
  }
}

// ============================================
// PUBLIC API
// ============================================

export async function fetchAllFeeds(): Promise<NewsArticle[]> {
  const sources = Object.keys(RSS_FEEDS) as Array<Exclude<NewsSource, "all">>;

  // Fetch all feeds in parallel
  const results = await Promise.all(
    sources.map((source) => fetchSingleFeed(source))
  );

  // Flatten and sort by date
  const allArticles = results
    .flat()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return allArticles;
}

export async function fetchFeedBySource(source: Exclude<NewsSource, "all">): Promise<NewsArticle[]> {
  return fetchSingleFeed(source);
}

export function filterArticles(
  articles: NewsArticle[],
  options: {
    category?: NewsCategory;
    source?: NewsSource;
    limit?: number;
    offset?: number;
  }
): { articles: NewsArticle[]; total: number; hasMore: boolean } {
  let filtered = [...articles];

  // Filter by category
  if (options.category && options.category !== "all") {
    filtered = filtered.filter((a) => a.category === options.category);
  }

  // Filter by source
  if (options.source && options.source !== "all") {
    filtered = filtered.filter((a) => a.source === options.source);
  }

  const total = filtered.length;

  // Pagination
  const offset = options.offset || 0;
  const limit = options.limit || 20;
  filtered = filtered.slice(offset, offset + limit);

  return {
    articles: filtered,
    total,
    hasMore: offset + limit < total,
  };
}

export function getAvailableSources(): NewsSourceInfo[] {
  return Object.entries(RSS_FEEDS).map(([id, info]) => ({
    id: id as NewsSource,
    name: info.name,
    icon: info.icon,
    url: info.url.replace(/\/rss.*$/, "").replace(/\/feed.*$/, ""),
    description: info.description,
  }));
}

// ============================================
// AI ENHANCEMENT (Optional)
// ============================================

export async function generateArticleSummary(
  article: NewsArticle,
  env: Env
): Promise<string> {
  try {
    const prompt = `Summarize this crypto news article in 2-3 concise sentences for a busy reader:

Title: ${article.title}

Content: ${article.content.slice(0, 2000)}

Provide only the summary, no preamble.`;

    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "system",
          content: "You are a concise crypto news summarizer. Provide brief, factual summaries.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
    });

    return (response as { response?: string }).response || article.description;
  } catch (error) {
    console.error("AI summary error:", error);
    return article.description;
  }
}

export async function categorizeWithAI(
  article: NewsArticle,
  env: Env
): Promise<Exclude<NewsCategory, "all">> {
  try {
    const prompt = `Categorize this crypto news article into exactly ONE of these categories: market, defi, nft, regulation, technology, analysis

Title: ${article.title}
Description: ${article.description}

Reply with only the category name, nothing else.`;

    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "system",
          content: "You are a news categorizer. Reply with exactly one word: the category name.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 10,
    });

    const result = ((response as { response?: string }).response || "market").toLowerCase().trim();
    const validCategories: Array<Exclude<NewsCategory, "all">> = ["market", "defi", "nft", "regulation", "technology", "analysis"];

    if (validCategories.includes(result as Exclude<NewsCategory, "all">)) {
      return result as Exclude<NewsCategory, "all">;
    }

    return categorizeArticle({
      title: article.title,
      description: article.description,
      link: article.url,
      pubDate: article.publishedAt,
    });
  } catch (error) {
    console.error("AI categorization error:", error);
    return categorizeArticle({
      title: article.title,
      description: article.description,
      link: article.url,
      pubDate: article.publishedAt,
    });
  }
}
