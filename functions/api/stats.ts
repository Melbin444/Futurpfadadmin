import { verifyAuth } from "./auth";

interface Env {
  DB: any;
  ADMIN_PASSWORD?: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // 1. Verify authentication
  const authenticated = await verifyAuth(request, env);
  if (!authenticated) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const db = env.DB;
    if (!db) {
      console.error("[Admin Stats API] Database connection error: D1 DB not bound to context");
      throw new Error("D1 Database connection (DB) not bound");
    }

    console.log("[Admin Stats API] Fetching metrics from database tables...");
    // Run queries in parallel or batch
    const leadsRes = await db.prepare("SELECT COUNT(*) as count FROM leads").first<{ count: number }>();
    const newLeadsRes = await db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'new'").first<{ count: number }>();
    const blogsRes = await db.prepare("SELECT COUNT(*) as count FROM blogs").first<{ count: number }>();
    const testimonialsRes = await db.prepare("SELECT COUNT(*) as count FROM testimonials").first<{ count: number }>();

    console.log(
      `[Admin Stats API] Metrics retrieved - Leads: ${leadsRes?.count ?? 0} (New: ${newLeadsRes?.count ?? 0}), ` +
      `Blogs: ${blogsRes?.count ?? 0}, Testimonials: ${testimonialsRes?.count ?? 0}`
    );

    return new Response(
      JSON.stringify({
        leadsCount: leadsRes?.count ?? 0,
        newLeadsCount: newLeadsRes?.count ?? 0,
        blogsCount: blogsRes?.count ?? 0,
        testimonialsCount: testimonialsRes?.count ?? 0,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[Admin Stats API] Error fetching metrics:", error);
    return new Response(
      JSON.stringify({ error: "Database error: " + (error as Error).message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
