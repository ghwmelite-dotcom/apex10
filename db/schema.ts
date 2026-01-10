import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ============================================
// ASSETS TABLE
// Core cryptocurrency asset information
// ============================================
export const assets = sqliteTable("assets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(), // L1, L2, DeFi, Infrastructure, etc.
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  website: text("website"),
  whitepaper: text("whitepaper"),
  coingeckoId: text("coingecko_id"),
  logoUrl: text("logo_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================
// RANKINGS TABLE
// Asset ranking scores and analysis
// ============================================
export const rankings = sqliteTable("rankings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  assetId: integer("asset_id")
    .notNull()
    .references(() => assets.id, { onDelete: "cascade" }),
  rank: integer("rank").notNull(),
  overallScore: real("overall_score").notNull(),
  potentialScore: real("potential_score").notNull(),
  utilityScore: real("utility_score").notNull(),
  developerScore: real("developer_score").notNull(),
  adoptionScore: real("adoption_score").notNull(),
  riskLevel: text("risk_level").notNull(), // low, medium, high
  strengths: text("strengths", { mode: "json" }).$type<string[]>(),
  weaknesses: text("weaknesses", { mode: "json" }).$type<string[]>(),
  analysisNotes: text("analysis_notes"),
  rankedAt: integer("ranked_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================
// SECURITY CONTENT TABLE
// Educational security content
// ============================================
export const securityContent = sqliteTable("security_content", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(), // tip, threat, wallet_guide, acquisition_guide
  category: text("category").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  severity: text("severity"), // info, warning, critical (for threats)
  order: integer("order").default(0),
  metadata: text("metadata", { mode: "json" }).$type<Record<string, unknown>>(),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================
// USERS TABLE
// User accounts (Phase 2)
// ============================================
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").unique(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  preferences: text("preferences", { mode: "json" }).$type<Record<string, unknown>>(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
});

// ============================================
// WATCHLISTS TABLE
// User watchlist items
// ============================================
export const watchlists = sqliteTable("watchlists", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  assetId: integer("asset_id")
    .notNull()
    .references(() => assets.id, { onDelete: "cascade" }),
  notes: text("notes"),
  alertPrice: real("alert_price"),
  addedAt: integer("added_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================
// PRICE SNAPSHOTS TABLE
// Historical price data cache
// ============================================
export const priceSnapshots = sqliteTable("price_snapshots", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  assetId: integer("asset_id")
    .notNull()
    .references(() => assets.id, { onDelete: "cascade" }),
  priceUsd: real("price_usd").notNull(),
  marketCap: real("market_cap"),
  volume24h: real("volume_24h"),
  change24h: real("change_24h"),
  change7d: real("change_7d"),
  snapshotAt: integer("snapshot_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================
// RELATIONS
// ============================================
export const assetsRelations = relations(assets, ({ many }) => ({
  rankings: many(rankings),
  watchlists: many(watchlists),
  priceSnapshots: many(priceSnapshots),
}));

export const rankingsRelations = relations(rankings, ({ one }) => ({
  asset: one(assets, {
    fields: [rankings.assetId],
    references: [assets.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  watchlists: many(watchlists),
}));

export const watchlistsRelations = relations(watchlists, ({ one }) => ({
  user: one(users, {
    fields: [watchlists.userId],
    references: [users.id],
  }),
  asset: one(assets, {
    fields: [watchlists.assetId],
    references: [assets.id],
  }),
}));

export const priceSnapshotsRelations = relations(priceSnapshots, ({ one }) => ({
  asset: one(assets, {
    fields: [priceSnapshots.assetId],
    references: [assets.id],
  }),
}));

// ============================================
// TYPE EXPORTS
// ============================================
export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
export type Ranking = typeof rankings.$inferSelect;
export type NewRanking = typeof rankings.$inferInsert;
export type SecurityContent = typeof securityContent.$inferSelect;
export type NewSecurityContent = typeof securityContent.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Watchlist = typeof watchlists.$inferSelect;
export type NewWatchlist = typeof watchlists.$inferInsert;
export type PriceSnapshot = typeof priceSnapshots.$inferSelect;
export type NewPriceSnapshot = typeof priceSnapshots.$inferInsert;
