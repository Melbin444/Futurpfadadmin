import { verifyAuth } from "./auth";

interface Env {
  DB: any;
  ADMIN_PASSWORD?: string;
}

interface FaqData {
  id: string;
  question_en: string;
  question_de: string;
  answer_en: string;
  answer_de: string;
  order_index?: number;
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

  // GET: Retrieve FAQs
  if (request.method === "GET") {
    try {
      const url = new URL(request.url);
      const id = url.searchParams.get("id");

      if (id) {
        console.log(`[Admin FAQs API] Fetching single FAQ with ID: "${id}"`);
        const result = await db.prepare("SELECT * FROM faqs WHERE id = ?").bind(id).first<FaqData>();
        if (!result) {
          console.warn(`[Admin FAQs API] FAQ not found: "${id}"`);
          return new Response(JSON.stringify({ error: "FAQ not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
        console.log(`[Admin FAQs API] Successfully retrieved FAQ: "${id}"`);
        return new Response(JSON.stringify(result), {
          headers: { "Content-Type": "application/json" },
        });
      }

      console.log("[Admin FAQs API] Listing all FAQs");
      const result = await db.prepare("SELECT * FROM faqs ORDER BY order_index ASC").all();
      console.log(`[Admin FAQs API] Successfully fetched ${result.results?.length ?? 0} FAQs`);
      return new Response(JSON.stringify(result.results || []), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("[Admin FAQs API] GET Error:", e);
      return new Response(JSON.stringify({ error: (e as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // POST: Create FAQ
  if (request.method === "POST") {
    try {
      const data = (await request.json()) as FaqData;
      console.log("[Admin FAQs API] Creating new FAQ:", JSON.stringify(data));
      if (!data.id || !data.question_en || !data.question_de) {
        console.warn("[Admin FAQs API] Creation failed: Missing required fields (id, question_en, question_de)");
        return new Response(
          JSON.stringify({ error: "Missing required fields (id, question_en, question_de)" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Check duplicates
      const existing = await db.prepare("SELECT id FROM faqs WHERE id = ?").bind(data.id).first();
      if (existing) {
        console.warn(`[Admin FAQs API] Creation failed: FAQ with ID "${data.id}" already exists`);
        return new Response(JSON.stringify({ error: "An FAQ with this ID already exists" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const insertResult = await db
        .prepare(
          `INSERT INTO faqs (id, question_en, question_de, answer_en, answer_de, order_index)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .bind(
          data.id,
          data.question_en,
          data.question_de,
          data.answer_en || "",
          data.answer_de || "",
          data.order_index || 0
        )
        .run();

      console.log(`[Admin FAQs API] Successfully created FAQ: "${data.id}". success: ${insertResult.success}`);
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("[Admin FAQs API] POST Error:", e);
      return new Response(JSON.stringify({ error: (e as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // PUT: Update FAQ
  if (request.method === "PUT") {
    try {
      const data = (await request.json()) as FaqData;
      console.log(`[Admin FAQs API] Updating FAQ: "${data.id}"`, JSON.stringify(data));
      if (!data.id) {
        console.warn("[Admin FAQs API] Update failed: Missing FAQ id");
        return new Response(JSON.stringify({ error: "Missing FAQ id" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const updateResult = await db
        .prepare(
          `UPDATE faqs SET 
            question_en = ?, question_de = ?, answer_en = ?, answer_de = ?, order_index = ?
          WHERE id = ?`
        )
        .bind(
          data.question_en,
          data.question_de,
          data.answer_en,
          data.answer_de,
          data.order_index || 0,
          data.id
        )
        .run();

      console.log(`[Admin FAQs API] Successfully updated FAQ: "${data.id}". success: ${updateResult.success}`);
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("[Admin FAQs API] PUT Error:", e);
      return new Response(JSON.stringify({ error: (e as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // DELETE: Delete FAQ
  if (request.method === "DELETE") {
    try {
      const url = new URL(request.url);
      const id = url.searchParams.get("id");
      console.log(`[Admin FAQs API] Deleting FAQ: "${id}"`);
      if (!id) {
        console.warn("[Admin FAQs API] Delete failed: Missing FAQ id");
        return new Response(JSON.stringify({ error: "Missing FAQ id" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const deleteResult = await db.prepare("DELETE FROM faqs WHERE id = ?").bind(id).run();
      console.log(`[Admin FAQs API] Successfully deleted FAQ: "${id}". success: ${deleteResult.success}`);
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("[Admin FAQs API] DELETE Error:", e);
      return new Response(JSON.stringify({ error: (e as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  console.warn(`[Admin FAQs API] Method not allowed: ${request.method}`);
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
};
