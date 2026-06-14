interface Env {
  ADMIN_PASSWORD?: string;
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyAuth(request: Request, env: Env): Promise<boolean> {
  const adminPassword = env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const expectedSessionHash = await sha256(adminPassword);

  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [name, ...rest] = cookie.split("=");
    if (name) acc[name.trim()] = rest.join("=").trim();
    return acc;
  }, {} as Record<string, string>);

  return cookies["admin_session"] === expectedSessionHash;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  // GET: Check Auth Status
  if (request.method === "GET") {
    const authenticated = await verifyAuth(request, env);
    return new Response(JSON.stringify({ authenticated }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // POST: Login / Logout
  if (request.method === "POST") {
    try {
      const { action, password } = (await request.json()) as {
        action: string;
        password?: string;
      };

      if (action === "logout") {
        return new Response(JSON.stringify({ success: true }), {
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": "admin_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0",
          },
        });
      }

      if (action === "login") {
        const adminPassword = env.ADMIN_PASSWORD;
        if (!adminPassword) {
          return new Response(
            JSON.stringify({ success: false, error: "Admin password not set in environment variables" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
        const expectedHash = await sha256(adminPassword);
        const inputHash = await sha256(password ?? "");
        if (inputHash === expectedHash) {
          return new Response(JSON.stringify({ success: true }), {
            headers: {
              "Content-Type": "application/json",
              "Set-Cookie": `admin_session=${expectedHash}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`, // 1 week
            },
          });
        } else {
          return new Response(
            JSON.stringify({ success: false, error: "Invalid password" }),
            {
              status: 401,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      }

      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "Invalid request body: " + (e as Error).message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
};
