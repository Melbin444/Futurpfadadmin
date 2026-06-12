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
        const result = await db.prepare("SELECT * FROM testimonials WHERE id = ?").bind(id).first<any>();
        if (!result) {
          return new Response(JSON.stringify({ error: "Testimonial not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify(result), {
          headers: { "Content-Type": "application/json" },
        });
      }

      const result = await db.prepare("SELECT * FROM testimonials").all();
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

  // POST: Create testimonial
  if (request.method === "POST") {
    try {
      const data = (await request.json()) as TestimonialData;
      if (!data.id || !data.name || !data.origin) {
        return new Response(JSON.stringify({ error: "Missing required fields (id, name, origin)" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Check duplicates
      const existing = await db.prepare("SELECT id FROM testimonials WHERE id = ?").bind(data.id).first();
      if (existing) {
        return new Response(JSON.stringify({ error: "A testimonial with this ID already exists" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      await db
        .prepare(
          `INSERT INTO testimonials (
            id, name, origin, flag, role_en, role_de, destination, 
            sector_en, sector_de, quote_en, quote_de, employer_name, 
            employer_role_en, employer_role_de, employer_company, 
            employer_city, img_url, video_url, milestones_en, milestones_de
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
          data.img_url || null,
          data.video_url || null,
          stringifyMilestones(data.milestones_en),
          stringifyMilestones(data.milestones_de)
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

  // PUT: Update testimonial
  if (request.method === "PUT") {
    try {
      const data = (await request.json()) as TestimonialData;
      if (!data.id) {
        return new Response(JSON.stringify({ error: "Missing testimonial id" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      await db
        .prepare(
          `UPDATE testimonials SET 
            name = ?, origin = ?, flag = ?, role_en = ?, role_de = ?, destination = ?, 
            sector_en = ?, sector_de = ?, quote_en = ?, quote_de = ?, employer_name = ?, 
            employer_role_en = ?, employer_role_de = ?, employer_company = ?, 
            employer_city = ?, img_url = ?, video_url = ?, milestones_en = ?, milestones_de = ?
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
          data.img_url || null,
          data.video_url || null,
          stringifyMilestones(data.milestones_en),
          stringifyMilestones(data.milestones_de),
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

  // DELETE: Delete testimonial
  if (request.method === "DELETE") {
    try {
      const url = new URL(request.url);
      const id = url.searchParams.get("id");
      if (!id) {
        return new Response(JSON.stringify({ error: "Missing testimonial id" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      await db.prepare("DELETE FROM testimonials WHERE id = ?").bind(id).run();
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
