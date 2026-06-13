import { verifyAuth } from "./auth";

interface Env {
  DB: any;
  ADMIN_PASSWORD?: string;
}

interface TestimonialData {
  id: string;
  name: string;
  origin: string;
  flag: string;
  role_en: string;
  role_de: string;
  destination: string;
  sector_en: string;
  sector_de: string;
  quote_en: string;
  quote_de: string;
  employer_name: string;
  employer_role_en: string;
  employer_role_de: string;
  employer_company: string;
  employer_city: string;
  employer_img_url?: string;
  img_url?: string;
  video_url?: string;
  milestones_en?: string | any[];
  milestones_de?: string | any[];
}

function stringifyMilestones(val: any): string {
  if (!val) return JSON.stringify([]);
  if (typeof val === "string") {
    try {
      JSON.parse(val);
      return val;
    } catch {
      return JSON.stringify([val]);
    }
  }
  return JSON.stringify(val);
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

  // GET: Retrieve testimonials
  if (request.method === "GET") {
    try {
      const url = new URL(request.url);
      const id = url.searchParams.get("id");

      if (id) {
        console.log(`[Admin Testimonials API] Fetching single testimonial with ID: "${id}"`);
        const result = await db.prepare("SELECT * FROM testimonials WHERE id = ?").bind(id).first<any>();
        if (!result) {
          console.warn(`[Admin Testimonials API] Testimonial not found: "${id}"`);
          return new Response(JSON.stringify({ error: "Testimonial not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
        console.log(`[Admin Testimonials API] Successfully retrieved testimonial: "${id}"`);
        return new Response(JSON.stringify(result), {
          headers: { "Content-Type": "application/json" },
        });
      }

      console.log("[Admin Testimonials API] Listing all testimonials");
      const result = await db.prepare("SELECT * FROM testimonials").all();
      console.log(`[Admin Testimonials API] Successfully fetched ${result.results?.length ?? 0} testimonials`);
      return new Response(JSON.stringify(result.results || []), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("[Admin Testimonials API] GET Error:", e);
      return new Response(JSON.stringify({ error: (e as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // POST: Create testimonial
  if (request.method === "POST") {
    try {
      const data = (await request.json()) as TestimonialData;
      console.log("[Admin Testimonials API] Creating new testimonial:", JSON.stringify(data));
      if (!data.id || !data.name || !data.origin) {
        console.warn("[Admin Testimonials API] Creation failed: Missing required fields (id, name, origin)");
        return new Response(JSON.stringify({ error: "Missing required fields (id, name, origin)" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Check duplicates
      const existing = await db.prepare("SELECT id FROM testimonials WHERE id = ?").bind(data.id).first();
      if (existing) {
        console.warn(`[Admin Testimonials API] Creation failed: Testimonial with ID "${data.id}" already exists`);
        return new Response(JSON.stringify({ error: "A testimonial with this ID already exists" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const insertResult = await db
        .prepare(
          `INSERT INTO testimonials (
            id, name, origin, flag, role_en, role_de, destination, 
            sector_en, sector_de, quote_en, quote_de, employer_name, 
            employer_role_en, employer_role_de, employer_company, 
            employer_city, employer_img_url, img_url, video_url, milestones_en, milestones_de
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          data.id,
          data.name,
          data.origin,
          data.flag || "🇩🇪",
          data.role_en || "",
          data.role_de || "",
          data.destination || "Germany",
          data.sector_en || "Healthcare",
          data.sector_de || "Pflege",
          data.quote_en || "",
          data.quote_de || "",
          data.employer_name || "",
          data.employer_role_en || "",
          data.employer_role_de || "",
          data.employer_company || "",
          data.employer_city || "",
          data.employer_img_url || null,
          data.img_url || null,
          data.video_url || null,
          stringifyMilestones(data.milestones_en),
          stringifyMilestones(data.milestones_de)
        )
        .run();

      console.log(`[Admin Testimonials API] Successfully created testimonial: "${data.id}". success: ${insertResult.success}`);
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("[Admin Testimonials API] POST Error:", e);
      return new Response(JSON.stringify({ error: (e as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // PUT: Update testimonial
  if (request.method === "PUT") {
    try {
      const data = (await request.json()) as TestimonialData;
      console.log(`[Admin Testimonials API] Updating testimonial: "${data.id}"`, JSON.stringify(data));
      if (!data.id) {
        console.warn("[Admin Testimonials API] Update failed: Missing testimonial id");
        return new Response(JSON.stringify({ error: "Missing testimonial id" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const updateResult = await db
        .prepare(
          `UPDATE testimonials SET 
            name = ?, origin = ?, flag = ?, role_en = ?, role_de = ?, destination = ?, 
            sector_en = ?, sector_de = ?, quote_en = ?, quote_de = ?, employer_name = ?, 
            employer_role_en = ?, employer_role_de = ?, employer_company = ?, 
            employer_city = ?, employer_img_url = ?, img_url = ?, video_url = ?, milestones_en = ?, milestones_de = ?
          WHERE id = ?`
        )
        .bind(
          data.name,
          data.origin,
          data.flag,
          data.role_en,
          data.role_de,
          data.destination,
          data.sector_en,
          data.sector_de,
          data.quote_en,
          data.quote_de,
          data.employer_name,
          data.employer_role_en,
          data.employer_role_de,
          data.employer_company,
          data.employer_city,
          data.employer_img_url || null,
          data.img_url || null,
          data.video_url || null,
          stringifyMilestones(data.milestones_en),
          stringifyMilestones(data.milestones_de),
          data.id
        )
        .run();

      console.log(`[Admin Testimonials API] Successfully updated testimonial: "${data.id}". success: ${updateResult.success}`);
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("[Admin Testimonials API] PUT Error:", e);
      return new Response(JSON.stringify({ error: (e as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // DELETE: Delete testimonial
  if (request.method === "DELETE") {
    try {
      const url = new URL(request.url);
      const id = url.searchParams.get("id");
      console.log(`[Admin Testimonials API] Deleting testimonial with ID: "${id}"`);
      if (!id) {
        console.warn("[Admin Testimonials API] Delete failed: Missing testimonial id");
        return new Response(JSON.stringify({ error: "Missing testimonial id" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const deleteResult = await db.prepare("DELETE FROM testimonials WHERE id = ?").bind(id).run();
      console.log(`[Admin Testimonials API] Successfully deleted testimonial: "${id}". success: ${deleteResult.success}`);
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("[Admin Testimonials API] DELETE Error:", e);
      return new Response(JSON.stringify({ error: (e as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  console.warn(`[Admin Testimonials API] Method not allowed: ${request.method}`);
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
};
