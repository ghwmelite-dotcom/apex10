import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { assetsRoutes } from "./routes/assets";
import { rankingsRoutes } from "./routes/rankings";
import { securityRoutes } from "./routes/security";
import { pricesRoutes } from "./routes/prices";
import type { Env } from "./types";

const api = new Hono<{ Bindings: Env }>().basePath("/api");

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

// Mount API routes
app.route("/", api);

// Serve static assets for SPA
app.get("*", async (c) => {
  // Try to serve from assets binding
  if (c.env.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw);
  }
  return c.text("Not Found", 404);
});

export default app;
