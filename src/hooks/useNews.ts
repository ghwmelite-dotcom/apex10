import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  NewsArticle,
  NewsCategory,
  NewsSource,
  NewsFeedResponse,
  NewsSourceInfo,
} from "@/api/types";

const API_BASE = "/api";

// ============================================
// FETCH HELPERS
// ============================================
async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  const json = (await response.json()) as { data: T };
  return json.data;
}

async function postApi<T, B>(endpoint: string, body: B): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  const json = (await response.json()) as { data: T };
  return json.data;
}

// ============================================
// NEWS FEED
// ============================================
interface UseNewsFeedOptions {
  category?: NewsCategory;
  source?: NewsSource;
  limit?: number;
  page?: number;
}

export function useNewsFeed(options: UseNewsFeedOptions = {}) {
  const { category = "all", source = "all", limit = 20, page = 1 } = options;

  return useQuery<NewsFeedResponse>({
    queryKey: ["news", "feed", category, source, page, limit],
    queryFn: () =>
      fetchApi<NewsFeedResponse>(
        `/news/feed?category=${category}&source=${source}&limit=${limit}&page=${page}`
      ),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============================================
// INFINITE NEWS FEED (for load more)
// ============================================
export function useInfiniteNewsFeed(options: Omit<UseNewsFeedOptions, "page"> = {}) {
  const { category = "all", source = "all", limit = 20 } = options;
  const queryClient = useQueryClient();

  // Track current page in state
  const getNextPage = (currentPage: number) => {
    return useQuery<NewsFeedResponse>({
      queryKey: ["news", "feed", category, source, currentPage, limit],
      queryFn: () =>
        fetchApi<NewsFeedResponse>(
          `/news/feed?category=${category}&source=${source}&limit=${limit}&page=${currentPage}`
        ),
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    getNextPage,
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: ["news", "feed"] });
    },
  };
}

// ============================================
// SINGLE ARTICLE
// ============================================
export function useNewsArticle(articleId: string | undefined) {
  return useQuery<NewsArticle>({
    queryKey: ["news", "article", articleId],
    queryFn: () => fetchApi<NewsArticle>(`/news/article/${articleId}`),
    enabled: !!articleId,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// ============================================
// NEWS SOURCES
// ============================================
export function useNewsSources() {
  return useQuery<NewsSourceInfo[]>({
    queryKey: ["news", "sources"],
    queryFn: () => fetchApi<NewsSourceInfo[]>("/news/sources"),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

// ============================================
// NEWS CATEGORIES WITH COUNTS
// ============================================
interface CategoryWithCount {
  id: string;
  name: string;
  count: number;
}

export function useNewsCategories() {
  return useQuery<CategoryWithCount[]>({
    queryKey: ["news", "categories"],
    queryFn: () => fetchApi<CategoryWithCount[]>("/news/categories"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============================================
// TRENDING ARTICLES
// ============================================
export function useTrendingNews(limit: number = 5) {
  return useQuery<NewsArticle[]>({
    queryKey: ["news", "trending", limit],
    queryFn: () => fetchApi<NewsArticle[]>(`/news/trending?limit=${limit}`),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============================================
// AI SUMMARY
// ============================================
export function useArticleSummary() {
  return useMutation<{ summary: string }, Error, string>({
    mutationFn: (articleId: string) =>
      postApi<{ summary: string }, { articleId: string }>("/news/summarize", {
        articleId,
      }),
  });
}

// ============================================
// PREFETCH UTILITIES
// ============================================
export function usePrefetchArticle() {
  const queryClient = useQueryClient();

  return (articleId: string) => {
    queryClient.prefetchQuery({
      queryKey: ["news", "article", articleId],
      queryFn: () => fetchApi<NewsArticle>(`/news/article/${articleId}`),
      staleTime: 60 * 60 * 1000,
    });
  };
}
