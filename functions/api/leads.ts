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

  const db = env.DB;
  if (!db) {
    return new Response(JSON.stringify({ error: "D1 Database connection (DB) not bound" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Log D1 access mode
  const url = new URL(request.url);
  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  const dbSource = isLocal ? "Local D1 simulation" : "Cloud D1";
  console.log(`[Admin D1 API] Accessing ${dbSource} database for request: ${request.method} ${url.pathname}`);

  // GET: List all leads
  if (request.method === "GET") {
    try {
      console.log("[Admin Leads API] Listing all leads from database");
      const result = await db.prepare("SELECT * FROM leads ORDER BY created_at DESC").all();
      console.log(`[Admin Leads API] Successfully fetched ${result.results?.length ?? 0} leads`);
      return new Response(JSON.stringify(result.results || []), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("[Admin Leads API] GET Error:", e);
      return new Response(JSON.stringify({ error: (e as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // PUT: Update lead status
  if (request.method === "PUT") {
    try {
      const { id, status } = (await request.json()) as { id: string; status: string };
      console.log(`[Admin Leads API] Updating lead "${id}" status to "${status}"`);
      if (!id || !status) {
        console.warn("[Admin Leads API] Update failed: Missing id or status");
        return new Response(JSON.stringify({ error: "Missing id or status" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const updateResult = await db
        .prepare("UPDATE leads SET status = ? WHERE id = ?")
        .bind(status, id)
        .run();

      console.log(`[Admin Leads API] Successfully updated lead "${id}" to "${status}". success: ${updateResult.success}`);
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("[Admin Leads API] PUT Error:", e);
      return new Response(JSON.stringify({ error: (e as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // DELETE: Delete a lead
  if (request.method === "DELETE") {
    try {
      const url = new URL(request.url);
      const id = url.searchParams.get("id");
      console.log(`[Admin Leads API] Deleting lead: "${id}"`);
      if (!id) {
        console.warn("[Admin Leads API] Delete failed: Missing lead id");
        return new Response(JSON.stringify({ error: "Missing lead id" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const deleteResult = await db.prepare("DELETE FROM leads WHERE id = ?").bind(id).run();
      console.log(`[Admin Leads API] Successfully deleted lead "${id}". success: ${deleteResult.success}`);
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("[Admin Leads API] DELETE Error:", e);
      return new Response(JSON.stringify({ error: (e as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  console.warn(`[Admin Leads API] Method not allowed: ${request.method}`);
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
};
