import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq, and, asc } from "drizzle-orm";
import { securityContent } from "../../../db/schema";
import type { Env } from "../types";
import { CACHE_KEYS, CACHE_TTL } from "../types";

export const securityRoutes = new Hono<{ Bindings: Env }>();

// ============================================
// GET /api/security/best-practices
// Returns security tips and best practices
// ============================================
securityRoutes.get("/best-practices", async (c) => {
  const cacheKey = CACHE_KEYS.SECURITY_CONTENT("tips");

  const cached = await c.env.CACHE.get(cacheKey, "json");
  if (cached) {
    return c.json({ data: cached, meta: { cached: true } });
  }

  const db = drizzle(c.env.DB);
  const results = await db
    .select()
    .from(securityContent)
    .where(and(eq(securityContent.type, "tip"), eq(securityContent.isActive, true)))
    .orderBy(asc(securityContent.order));

  // Group by category
  const grouped = results.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof results>
  );

  await c.env.CACHE.put(cacheKey, JSON.stringify(grouped), {
    expirationTtl: CACHE_TTL.SECURITY_CONTENT,
  });

  return c.json({ data: grouped, meta: { cached: false } });
});

// ============================================
// GET /api/security/threats
// Returns common threats and how to avoid them
// ============================================
securityRoutes.get("/threats", async (c) => {
  const cacheKey = CACHE_KEYS.SECURITY_CONTENT("threats");

  const cached = await c.env.CACHE.get(cacheKey, "json");
  if (cached) {
    return c.json({ data: cached, meta: { cached: true } });
  }

  const db = drizzle(c.env.DB);
  const results = await db
    .select()
    .from(securityContent)
    .where(and(eq(securityContent.type, "threat"), eq(securityContent.isActive, true)))
    .orderBy(asc(securityContent.order));

  // Group by category
  const grouped = results.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof results>
  );

  await c.env.CACHE.put(cacheKey, JSON.stringify(grouped), {
    expirationTtl: CACHE_TTL.SECURITY_CONTENT,
  });

  return c.json({ data: grouped, meta: { cached: false } });
});

// ============================================
// GET /api/security/wallets
// Returns wallet comparison and guides
// ============================================
securityRoutes.get("/wallets", async (c) => {
  const cacheKey = CACHE_KEYS.SECURITY_CONTENT("wallets");

  const cached = await c.env.CACHE.get(cacheKey, "json");
  if (cached) {
    return c.json({ data: cached, meta: { cached: true } });
  }

  const db = drizzle(c.env.DB);
  const results = await db
    .select()
    .from(securityContent)
    .where(and(eq(securityContent.type, "wallet_guide"), eq(securityContent.isActive, true)))
    .orderBy(asc(securityContent.order));

  // Group by wallet type
  const grouped = results.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof results>
  );

  await c.env.CACHE.put(cacheKey, JSON.stringify(grouped), {
    expirationTtl: CACHE_TTL.SECURITY_CONTENT,
  });

  return c.json({ data: grouped, meta: { cached: false } });
});

// ============================================
// GET /api/security/acquisition-guide
// Returns crypto acquisition guides
// ============================================
securityRoutes.get("/acquisition-guide", async (c) => {
  const cacheKey = CACHE_KEYS.SECURITY_CONTENT("acquisition");

  const cached = await c.env.CACHE.get(cacheKey, "json");
  if (cached) {
    return c.json({ data: cached, meta: { cached: true } });
  }

  const db = drizzle(c.env.DB);
  const results = await db
    .select()
    .from(securityContent)
    .where(
      and(eq(securityContent.type, "acquisition_guide"), eq(securityContent.isActive, true))
    )
    .orderBy(asc(securityContent.order));

  await c.env.CACHE.put(cacheKey, JSON.stringify(results), {
    expirationTtl: CACHE_TTL.SECURITY_CONTENT,
  });

  return c.json({ data: results, meta: { cached: false } });
});

// ============================================
// GET /api/security/checklist
// Returns interactive security checklist
// ============================================
securityRoutes.get("/checklist", async (c) => {
  const checklist = {
    categories: [
      {
        name: "Wallet Security",
        items: [
          { id: "hw-wallet", label: "Use a hardware wallet for significant holdings", priority: "critical" },
          { id: "seed-offline", label: "Store seed phrase offline on paper or metal", priority: "critical" },
          { id: "seed-multiple", label: "Keep seed phrase backups in multiple locations", priority: "high" },
          { id: "test-recovery", label: "Test wallet recovery process", priority: "high" },
        ],
      },
      {
        name: "Exchange Security",
        items: [
          { id: "2fa-enabled", label: "Enable 2FA with authenticator app (not SMS)", priority: "critical" },
          { id: "unique-password", label: "Use unique, strong password", priority: "critical" },
          { id: "withdrawal-whitelist", label: "Enable address whitelisting", priority: "high" },
          { id: "api-restrictions", label: "Restrict API key permissions if used", priority: "medium" },
        ],
      },
      {
        name: "Transaction Safety",
        items: [
          { id: "verify-addresses", label: "Always verify full addresses before sending", priority: "critical" },
          { id: "test-transactions", label: "Send test transactions for large amounts", priority: "high" },
          { id: "check-gas", label: "Understand gas fees before confirming", priority: "medium" },
          { id: "revoke-approvals", label: "Regularly check and revoke token approvals", priority: "high" },
        ],
      },
      {
        name: "General Hygiene",
        items: [
          { id: "bookmarks", label: "Only access sites through bookmarks", priority: "high" },
          { id: "no-dm-links", label: "Never click links in DMs or emails", priority: "critical" },
          { id: "verify-contracts", label: "Verify smart contract addresses", priority: "high" },
          { id: "research-projects", label: "Research projects before investing", priority: "high" },
        ],
      },
    ],
  };

  return c.json({ data: checklist });
});

// ============================================
// POST /api/security/certificate-email
// Captures email for certificate download
// ============================================
securityRoutes.post("/certificate-email", async (c) => {
  try {
    const body = await c.req.json<{
      email: string;
      certificateId: string;
      tier: string;
      accuracy: number;
      completedAt: string;
    }>();

    const { email, certificateId, tier, accuracy, completedAt } = body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return c.json({ error: "Invalid email address" }, 400);
    }

    // Store in KV for lead capture
    const leadData = {
      email,
      certificateId,
      tier,
      accuracy,
      completedAt,
      capturedAt: new Date().toISOString(),
      source: "certificate",
    };

    // Store individual lead
    await c.env.CACHE.put(
      `lead:certificate:${certificateId}`,
      JSON.stringify(leadData),
      { expirationTtl: 60 * 60 * 24 * 365 } // 1 year
    );

    // Also append to a list of all certificate leads
    const leadsListKey = "leads:certificates:list";
    const existingLeads = await c.env.CACHE.get(leadsListKey, "json") as string[] || [];
    if (!existingLeads.includes(email)) {
      existingLeads.push(email);
      await c.env.CACHE.put(leadsListKey, JSON.stringify(existingLeads), {
        expirationTtl: 60 * 60 * 24 * 365,
      });
    }

    return c.json({
      success: true,
      message: "Email captured successfully",
      certificateId,
    });
  } catch (error) {
    console.error("Certificate email capture error:", error);
    return c.json({ error: "Failed to capture email" }, 500);
  }
});
