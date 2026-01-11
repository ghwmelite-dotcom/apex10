import { Hono } from "hono";
import type { Env } from "../types";

export const preferencesRoutes = new Hono<{ Bindings: Env }>();

// Preference types
interface UserPreferences {
  tts?: {
    rate: number;
    pitch: number;
    voiceURI: string | null;
  };
  theme?: string;
  updatedAt: string;
}

const CACHE_TTL = 86400 * 30; // 30 days

// ============================================
// GET /api/preferences/:userId
// Returns user preferences from KV storage
// ============================================
preferencesRoutes.get("/:userId", async (c) => {
  const userId = c.req.param("userId");

  if (!userId || userId.length < 10) {
    return c.json({ error: "Invalid user ID" }, 400);
  }

  const cacheKey = `prefs:${userId}`;

  try {
    const cached = await c.env.CACHE.get(cacheKey, "json");

    if (cached) {
      return c.json({ data: cached, meta: { cached: true } });
    }

    // No preferences found - return defaults
    return c.json({
      data: {
        tts: { rate: 1, pitch: 1, voiceURI: null },
        theme: "dark",
        updatedAt: new Date().toISOString(),
      },
      meta: { cached: false, isDefault: true },
    });
  } catch (error) {
    console.error("Preferences fetch error:", error);
    return c.json({ error: "Failed to fetch preferences" }, 500);
  }
});

// ============================================
// POST /api/preferences/:userId
// Saves user preferences to KV storage
// ============================================
preferencesRoutes.post("/:userId", async (c) => {
  const userId = c.req.param("userId");

  if (!userId || userId.length < 10) {
    return c.json({ error: "Invalid user ID" }, 400);
  }

  try {
    const body = await c.req.json<Partial<UserPreferences>>();
    const cacheKey = `prefs:${userId}`;

    // Get existing preferences
    const existing = await c.env.CACHE.get(cacheKey, "json") as UserPreferences | null;

    // Merge with existing
    const updated: UserPreferences = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    // Validate TTS settings if provided
    if (updated.tts) {
      updated.tts.rate = Math.max(0.5, Math.min(2, updated.tts.rate || 1));
      updated.tts.pitch = Math.max(0.5, Math.min(2, updated.tts.pitch || 1));
    }

    // Save to KV
    await c.env.CACHE.put(cacheKey, JSON.stringify(updated), {
      expirationTtl: CACHE_TTL,
    });

    return c.json({ data: updated, meta: { saved: true } });
  } catch (error) {
    console.error("Preferences save error:", error);
    return c.json({ error: "Failed to save preferences" }, 500);
  }
});

// ============================================
// DELETE /api/preferences/:userId
// Deletes user preferences from KV storage
// ============================================
preferencesRoutes.delete("/:userId", async (c) => {
  const userId = c.req.param("userId");

  if (!userId || userId.length < 10) {
    return c.json({ error: "Invalid user ID" }, 400);
  }

  try {
    const cacheKey = `prefs:${userId}`;
    await c.env.CACHE.delete(cacheKey);

    return c.json({ data: { deleted: true } });
  } catch (error) {
    console.error("Preferences delete error:", error);
    return c.json({ error: "Failed to delete preferences" }, 500);
  }
});
