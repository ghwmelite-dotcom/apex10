import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { assetsRoutes } from "./routes/assets";
import { rankingsRoutes } from "./routes/rankings";
import { securityRoutes } from "./routes/security";
import { pricesRoutes } from "./routes/prices";
import { adminRoutes } from "./routes/admin";
import { scannerRoutes } from "./routes/scanner";
import { walletGuardianRoutes } from "./routes/walletGuardian";
import { credentialsRoutes } from "./routes/credentials";
import { newsRoutes } from "./routes/news";
import aiRoutes from "./routes/ai";
import type { Env } from "./types";

const api = new Hono<{ Bindings: Env }>();

// ============================================
// MIDDLEWARE
// ============================================
api.use("*", logger());
api.use("*", secureHeaders());
api.use(
  "*",
  cors({
    origin: ["http://localhost:5173", "https://apex10.pages.dev"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["X-Request-Id"],
    maxAge: 86400,
    credentials: true,
  })
);

// ============================================
// HEALTH CHECK
// ============================================
api.get("/health", (c) => {
  return c.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: c.env.ENVIRONMENT || "development",
  });
});

// ============================================
// ROUTES
// ============================================
api.route("/assets", assetsRoutes);
api.route("/rankings", rankingsRoutes);
api.route("/security", securityRoutes);
api.route("/prices", pricesRoutes);
api.route("/ai", aiRoutes);
api.route("/admin", adminRoutes);
api.route("/scanner", scannerRoutes);
api.route("/wallet-guardian", walletGuardianRoutes);
api.route("/credentials", credentialsRoutes);
api.route("/news", newsRoutes);

// ============================================
// ERROR HANDLING
// ============================================
api.onError((err, c) => {
  console.error(`[API Error] ${err.message}`, err.stack);
  return c.json(
    {
      error: "Internal Server Error",
      message: c.env.ENVIRONMENT === "development" ? err.message : undefined,
    },
    500
  );
});

api.notFound((c) => {
  return c.json({ error: "Not Found", path: c.req.path }, 404);
});

// ============================================
// MAIN APP WITH STATIC ASSETS
// ============================================
const app = new Hono<{ Bindings: Env }>();

// Mount API routes at /api
app.route("/api", api);

// Serve static assets and SPA fallback for all other routes
app.get("*", async (c) => {
  if (!c.env.ASSETS) {
    return c.text("Not Found", 404);
  }

  const url = new URL(c.req.url);
  const pathname = url.pathname;

  // Check if this is a static asset request (has file extension)
  const hasExtension = /\.[a-zA-Z0-9]+$/.test(pathname);

  if (hasExtension) {
    // Serve static file directly
    return c.env.ASSETS.fetch(c.req.raw);
  }

  // For SPA client-side routes (no extension), always serve index.html
  // This handles routes like /security, /learn, /asset/:slug
  const indexUrl = new URL("/index.html", url.origin);
  const indexRequest = new Request(indexUrl.toString(), {
    method: "GET",
    headers: c.req.raw.headers,
  });
  return c.env.ASSETS.fetch(indexRequest);
});

export default app;
