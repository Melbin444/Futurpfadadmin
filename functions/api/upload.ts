import { verifyAuth } from "./auth";

interface Env {
  DB: any;
  ADMIN_PASSWORD?: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
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

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    console.log(`[Admin Upload API] Received upload request. File present: ${!!file}`);

    if (!file) {
      console.warn("[Admin Upload API] Upload rejected: No file provided in form data");
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const cloudName = env.CLOUDINARY_CLOUD_NAME;
    const apiKey = env.CLOUDINARY_API_KEY;
    const apiSecret = env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("[Admin Upload API] Upload failed: Cloudinary environment variables not configured in Pages project dashboard");
      return new Response(JSON.stringify({ error: "Cloudinary environment variables not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    const folder = "futurpfad";

    const timestamp = Math.round(Date.now() / 1000).toString();
    
    // Create signature: folder=futurpfad&timestamp=<timestamp><api_secret>
    const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

    // Hash using SHA-1
    const encoder = new TextEncoder();
    const data = encoder.encode(stringToSign);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Prepare multipart payload to send to Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", file);
    cloudinaryFormData.append("api_key", apiKey);
    cloudinaryFormData.append("timestamp", timestamp);
    cloudinaryFormData.append("signature", signature);
    cloudinaryFormData.append("folder", folder);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    console.log(`[Admin Upload API] Forwarding image payload to Cloudinary: ${cloudinaryUrl}`);
    
    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: cloudinaryFormData
    });

    const resData: any = await response.json();
    console.log(`[Admin Upload API] Cloudinary response received. Status: ${response.status}`);
    
    if (!response.ok) {
      console.error("[Admin Upload API] Cloudinary API returned error:", JSON.stringify(resData.error));
      return new Response(JSON.stringify({ error: resData.error?.message || "Cloudinary upload failed" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log(`[Admin Upload API] Image uploaded successfully. URL: ${resData.secure_url}`);
    return new Response(JSON.stringify({ url: resData.secure_url }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: any) {
    console.error("[Admin Upload API] Fatal error in upload handler:", error);
    return new Response(JSON.stringify({ error: "Upload handler error: " + error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
