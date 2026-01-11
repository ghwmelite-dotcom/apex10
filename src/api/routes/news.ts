import { Hono } from "hono";
import type { Env, NewsCategory, NewsSource, NewsFeedResponse } from "../types";
import { CACHE_KEYS, CACHE_TTL } from "../types";
import {
  fetchAllFeeds,
  fetchFeedBySource,
  filterArticles,
  getAvailableSources,
  generateArticleSummary,
} from "../services/newsService";

export const newsRoutes = new Hono<{ Bindings: Env }>();

// ============================================
// GET /api/news/feed
// Returns paginated news articles from all sources
// Query params: category, source, limit, page
// ============================================
newsRoutes.get("/feed", async (c) => {
  const category = (c.req.query("category") || "all") as NewsCategory;
  const source = (c.req.query("source") || "all") as NewsSource;
  const limit = Math.min(parseInt(c.req.query("limit") || "20"), 50);
  const page = Math.max(parseInt(c.req.query("page") || "1"), 1);
  const offset = (page - 1) * limit;

  const cacheKey = CACHE_KEYS.NEWS_FEED(category, source);

  // Check cache for the full feed (source-specific or all)
  let articles;
  const cachedFeed = await c.env.CACHE.get(cacheKey, "json");

  if (cachedFeed) {
    articles = cachedFeed;
  } else {
    // Fetch fresh data
    if (source !== "all") {
      articles = await fetchFeedBySource(source as Exclude<NewsSource, "all">);
    } else {
      articles = await fetchAllFeeds();
    }

    // Cache the fetched articles with short TTL for fresh news
    if (articles.length > 0) {
      await c.env.CACHE.put(cacheKey, JSON.stringify(articles), {
        expirationTtl: CACHE_TTL.NEWS_FEED,
      });
    }
  }

  // Filter and paginate
  const result = filterArticles(articles, {
    category,
    source,
    limit,
    offset,
  });

  const response: NewsFeedResponse = {
    articles: result.articles,
    total: result.total,
    page,
    limit,
    hasMore: result.hasMore,
  };

  return c.json({
    data: response,
    meta: {
      cached: !!cachedFeed,
      category,
      source,
    },
  });
});

// ============================================
// GET /api/news/article/:id
// Returns a single article by ID with full content
// ============================================
newsRoutes.get("/article/:id", async (c) => {
  const articleId = c.req.param("id");
  const cacheKey = CACHE_KEYS.NEWS_ARTICLE(articleId);

  // Check article cache
  const cached = await c.env.CACHE.get(cacheKey, "json");
  if (cached) {
    return c.json({ data: cached, meta: { cached: true } });
  }

  // Fetch all feeds to find the article
  const allArticles = await fetchAllFeeds();
  const article = allArticles.find((a) => a.id === articleId);

  if (!article) {
    return c.json({ error: "Article not found" }, 404);
  }

  // Cache the article with moderate TTL
  await c.env.CACHE.put(cacheKey, JSON.stringify(article), {
    expirationTtl: CACHE_TTL.NEWS_ARTICLE,
  });

  return c.json({ data: article, meta: { cached: false } });
});

// ============================================
// GET /api/news/sources
// Returns list of available news sources
// ============================================
newsRoutes.get("/sources", async (c) => {
  const cacheKey = CACHE_KEYS.NEWS_SOURCES;

  const cached = await c.env.CACHE.get(cacheKey, "json");
  if (cached) {
    return c.json({ data: cached, meta: { cached: true } });
  }

  const sources = getAvailableSources();

  await c.env.CACHE.put(cacheKey, JSON.stringify(sources), {
    expirationTtl: CACHE_TTL.NEWS_SOURCES,
  });

  return c.json({ data: sources, meta: { cached: false } });
});

// ============================================
// POST /api/news/summarize
// Returns AI-generated summary for an article
// ============================================
newsRoutes.post("/summarize", async (c) => {
  try {
    const body = await c.req.json<{ articleId: string }>();
    const { articleId } = body;

    if (!articleId) {
      return c.json({ error: "articleId is required" }, 400);
    }

    // Check for cached summary
    const summaryCacheKey = `news:summary:${articleId}`;
    const cachedSummary = await c.env.CACHE.get(summaryCacheKey);
    if (cachedSummary) {
      return c.json({ data: { summary: cachedSummary }, meta: { cached: true } });
    }

    // Find the article
    const allArticles = await fetchAllFeeds();
    const article = allArticles.find((a) => a.id === articleId);

    if (!article) {
      return c.json({ error: "Article not found" }, 404);
    }

    // Generate AI summary
    const summary = await generateArticleSummary(article, c.env);

    // Cache the summary
    await c.env.CACHE.put(summaryCacheKey, summary, {
      expirationTtl: CACHE_TTL.NEWS_SUMMARY,
    });

    return c.json({ data: { summary }, meta: { cached: false } });
  } catch (error) {
    console.error("Summarize error:", error);
    return c.json({ error: "Failed to generate summary" }, 500);
  }
});

// ============================================
// GET /api/news/categories
// Returns available categories with article counts
// ============================================
newsRoutes.get("/categories", async (c) => {
  const allArticles = await fetchAllFeeds();

  const categoryCounts: Record<string, number> = {
    all: allArticles.length,
    market: 0,
    defi: 0,
    nft: 0,
    regulation: 0,
    technology: 0,
    analysis: 0,
  };

  for (const article of allArticles) {
    if (article.category in categoryCounts) {
      categoryCounts[article.category]++;
    }
  }

  const categories = Object.entries(categoryCounts).map(([id, count]) => ({
    id,
    name: id === "all" ? "All" : id.charAt(0).toUpperCase() + id.slice(1),
    count,
  }));

  return c.json({ data: categories });
});

// ============================================
// GET /api/news/trending
// Returns trending/featured articles
// ============================================
newsRoutes.get("/trending", async (c) => {
  const limit = Math.min(parseInt(c.req.query("limit") || "5"), 10);

  // Get recent articles and pick diverse sources
  const allArticles = await fetchAllFeeds();

  // Get the most recent article from each source for diversity
  const sourceMap = new Map<string, typeof allArticles[0]>();
  for (const article of allArticles) {
    if (!sourceMap.has(article.source)) {
      sourceMap.set(article.source, article);
    }
  }

  // Get trending articles (diverse sources, sorted by date)
  const trending = Array.from(sourceMap.values())
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);

  return c.json({ data: trending });
});
