import { Hono } from "hono";
import type { Env } from "../types";

export const adminRoutes = new Hono<{ Bindings: Env }>();

// ============================================
// ADMIN AUTHENTICATION MIDDLEWARE
// Uses API key from header or query param
// ============================================
adminRoutes.use("*", async (c, next) => {
  const apiKey = c.req.header("X-Admin-Key") || c.req.query("key");
  const validKey = c.env.ADMIN_API_KEY;

  // If no admin key is configured, allow access in development
  if (!validKey && c.env.ENVIRONMENT === "development") {
    return next();
  }

  if (!apiKey || apiKey !== validKey) {
    return c.json({ error: "Unauthorized", message: "Invalid or missing admin key" }, 401);
  }

  return next();
});

// ============================================
// GET /api/admin/leads
// Returns all captured certificate leads
// ============================================
adminRoutes.get("/leads", async (c) => {
  try {
    // Get the list of all emails
    const emailList = await c.env.CACHE.get("leads:certificates:list", "json") as string[] || [];

    // Get detailed info for each lead
    const leads = await Promise.all(
      emailList.map(async (email) => {
        // Find the lead by listing keys with prefix
        const keys = await c.env.CACHE.list({ prefix: "lead:certificate:" });

        for (const key of keys.keys) {
          const data = await c.env.CACHE.get(key.name, "json") as Record<string, unknown>;
          if (data && data.email === email) {
            return data;
          }
        }
        return { email, incomplete: true };
      })
    );

    // Sort by captured date (newest first)
    const sortedLeads = leads.sort((a, b) => {
      const dateA = new Date((a as any).capturedAt || 0).getTime();
      const dateB = new Date((b as any).capturedAt || 0).getTime();
      return dateB - dateA;
    });

    return c.json({
      success: true,
      count: sortedLeads.length,
      leads: sortedLeads,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return c.json({ error: "Failed to fetch leads" }, 500);
  }
});

// ============================================
// GET /api/admin/leads/export
// Exports leads as CSV
// ============================================
adminRoutes.get("/leads/export", async (c) => {
  try {
    const format = c.req.query("format") || "csv";

    // Get the list of all emails
    const emailList = await c.env.CACHE.get("leads:certificates:list", "json") as string[] || [];

    // Get detailed info for each lead
    const leads: Record<string, unknown>[] = [];
    const keys = await c.env.CACHE.list({ prefix: "lead:certificate:" });

    for (const key of keys.keys) {
      const data = await c.env.CACHE.get(key.name, "json") as Record<string, unknown>;
      if (data) {
        leads.push(data);
      }
    }

    // Sort by captured date (newest first)
    leads.sort((a, b) => {
      const dateA = new Date((a.capturedAt as string) || 0).getTime();
      const dateB = new Date((b.capturedAt as string) || 0).getTime();
      return dateB - dateA;
    });

    if (format === "json") {
      return c.json(leads);
    }

    // Generate CSV
    const headers = ["email", "tier", "accuracy", "certificateId", "completedAt", "capturedAt", "source"];
    const csvRows = [headers.join(",")];

    for (const lead of leads) {
      const row = headers.map((header) => {
        const value = lead[header];
        // Escape commas and quotes in values
        if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? "";
      });
      csvRows.push(row.join(","));
    }

    const csv = csvRows.join("\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="apex10-leads-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting leads:", error);
    return c.json({ error: "Failed to export leads" }, 500);
  }
});

// ============================================
// GET /api/admin/leads/stats
// Returns lead statistics
// ============================================
adminRoutes.get("/leads/stats", async (c) => {
  try {
    const keys = await c.env.CACHE.list({ prefix: "lead:certificate:" });
    const leads: Record<string, unknown>[] = [];

    for (const key of keys.keys) {
      const data = await c.env.CACHE.get(key.name, "json") as Record<string, unknown>;
      if (data) {
        leads.push(data);
      }
    }

    // Calculate stats
    const tierCounts = { gold: 0, silver: 0, bronze: 0 };
    let totalAccuracy = 0;

    for (const lead of leads) {
      const tier = lead.tier as string;
      if (tier in tierCounts) {
        tierCounts[tier as keyof typeof tierCounts]++;
      }
      totalAccuracy += (lead.accuracy as number) || 0;
    }

    const avgAccuracy = leads.length > 0 ? Math.round(totalAccuracy / leads.length) : 0;

    // Get leads by day (last 7 days)
    const now = new Date();
    const leadsByDay: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      leadsByDay[dateStr] = 0;
    }

    for (const lead of leads) {
      const capturedAt = lead.capturedAt as string;
      if (capturedAt) {
        const dateStr = capturedAt.split("T")[0];
        if (dateStr in leadsByDay) {
          leadsByDay[dateStr]++;
        }
      }
    }

    return c.json({
      success: true,
      stats: {
        totalLeads: leads.length,
        tierBreakdown: tierCounts,
        averageAccuracy: avgAccuracy,
        leadsByDay,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return c.json({ error: "Failed to fetch stats" }, 500);
  }
});

// ============================================
// DELETE /api/admin/leads/:id
// Delete a specific lead
// ============================================
adminRoutes.delete("/leads/:id", async (c) => {
  try {
    const certificateId = c.req.param("id");
    const key = `lead:certificate:${certificateId}`;

    // Get lead data first
    const lead = await c.env.CACHE.get(key, "json") as Record<string, unknown>;
    if (!lead) {
      return c.json({ error: "Lead not found" }, 404);
    }

    // Remove from list
    const emailList = await c.env.CACHE.get("leads:certificates:list", "json") as string[] || [];
    const updatedList = emailList.filter((email) => email !== lead.email);
    await c.env.CACHE.put("leads:certificates:list", JSON.stringify(updatedList));

    // Delete the lead
    await c.env.CACHE.delete(key);

    return c.json({
      success: true,
      message: "Lead deleted",
      deletedEmail: lead.email,
    });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return c.json({ error: "Failed to delete lead" }, 500);
  }
});
