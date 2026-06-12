import { verifyAuth } from "./auth";

interface Env {
  DB: any;
  ADMIN_PASSWORD?: string;
}

interface BlogData {
  id: string;
  category_en: string;
  category_de: string;
  title_en: string;
  title_de: string;
  summary_en: string;
  summary_de: string;
  content_en: string;
  content_de: string;
  author: string;
  date: string;
  read_time_en: string;
  read_time_de: string;
  img_url?: string;
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

  // GET: Retrieve blogs
  if (request.method === "GET") {
    try {
      const url = new URL(request.url);
      const id = url.searchParams.get("id");

      if (id) {
        // Single blog details
        const result = await db.prepare("SELECT * FROM blogs WHERE id = ?").bind(id).first<BlogData>();
        if (!result) {
          return new Response(JSON.stringify({ error: "Blog not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify(result), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // List all blogs
      const result = await db.prepare("SELECT * FROM blogs ORDER BY date DESC").all();
      return new Response(JSON.stringify(result.results || []), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: (e as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // POST: Create a blog
  if (request.method === "POST") {
    try {
      const data = (await request.json()) as BlogData;
      if (!data.id || !data.title_en || !data.title_de) {
        return new Response(JSON.stringify({ error: "Missing required fields (id, title_en, title_de)" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Check duplicate ID
      const existing = await db.prepare("SELECT id FROM blogs WHERE id = ?").bind(data.id).first();
      if (existing) {
        return new Response(JSON.stringify({ error: "A blog post with this ID (slug) already exists" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      await db
        .prepare(
          `INSERT INTO blogs (
            id, category_en, category_de, title_en, title_de, 
            summary_en, summary_de, content_en, content_de, 
            author, date, read_time_en, read_time_de, img_url
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          data.id,
          data.category_en || "General",
          data.category_de || "Allgemein",
          data.title_en,
          data.title_de,
          data.summary_en || "",
          data.summary_de || "",
          data.content_en || "",
          data.content_de || "",
          data.author || "Futurpfad Team",
          data.date || new Date().toISOString().split("T")[0],
          data.read_time_en || "5 min read",
          data.read_time_de || "5 Min. Lesezeit",
          data.img_url || null
        )
        .run();

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: (e as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // PUT: Update an existing blog
  if (request.method === "PUT") {
    try {
      const data = (await request.json()) as BlogData;
      if (!data.id) {
        return new Response(JSON.stringify({ error: "Missing blog id" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      await db
        .prepare(
          `UPDATE blogs SET 
            category_en = ?, category_de = ?, title_en = ?, title_de = ?, 
            summary_en = ?, summary_de = ?, content_en = ?, content_de = ?, 
            author = ?, date = ?, read_time_en = ?, read_time_de = ?, img_url = ?
          WHERE id = ?`
        )
        .bind(
          data.category_en,
          data.category_de,
          data.title_en,
          data.title_de,
          data.summary_en,
          data.summary_de,
          data.content_en,
          data.content_de,
          data.author,
          data.date,
          data.read_time_en,
          data.read_time_de,
          data.img_url || null,
          data.id
        )
        .run();

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: (e as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // DELETE: Delete a blog
  if (request.method === "DELETE") {
    try {
      const url = new URL(request.url);
      const id = url.searchParams.get("id");
      if (!id) {
        return new Response(JSON.stringify({ error: "Missing blog id" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      await db.prepare("DELETE FROM blogs WHERE id = ?").bind(id).run();
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: (e as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
};
