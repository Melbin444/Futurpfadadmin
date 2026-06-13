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

    // Convert the streaming File object into an ArrayBuffer and then a standard Blob
    // This resolves issues in the Cloudflare Pages/workerd production environment
    // where passing a streaming File object directly into FormData stringifies it
    let fileBlob: Blob;
    let fileName = "upload.bin";
    if (file && typeof file === "object" && "arrayBuffer" in file) {
      const arrayBuffer = await (file as any).arrayBuffer();
      fileBlob = new Blob([arrayBuffer], { type: (file as any).type });
      fileName = (file as any).name || "upload.bin";
    } else {
      console.warn("[Admin Upload API] Upload rejected: Invalid file format");
      return new Response(JSON.stringify({ error: "Invalid file uploaded" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Helper to sanitize environment variables (strip quotes and spaces)
    const cleanValue = (val?: string) => {
      if (!val) return "";
      let s = val.trim();
      if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
        s = s.slice(1, -1);
      }
      return s.trim();
    };

    const cloudName = cleanValue(env.CLOUDINARY_CLOUD_NAME);
    const apiKey = cleanValue(env.CLOUDINARY_API_KEY);
    const apiSecret = cleanValue(env.CLOUDINARY_API_SECRET);

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
    cloudinaryFormData.append("file", fileBlob, fileName);
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
      
      const obscuredSecret = apiSecret.length > 4 
        ? `${apiSecret.slice(0, 2)}...${apiSecret.slice(-2)} (len: ${apiSecret.length})` 
        : `len: ${apiSecret.length}`;
      const obscuredKey = apiKey.length > 4
        ? `${apiKey.slice(0, 2)}...${apiKey.slice(-2)} (len: ${apiKey.length})`
        : `len: ${apiKey.length}`;

      const debugMsg = `Cloudinary Error: ${resData.error?.message || "Cloudinary upload failed"}. ` +
                       `Debug config: cloud=${cloudName}, key=${obscuredKey}, secret=${obscuredSecret}, ` +
                       `stringToSign length=${stringToSign.length}`;

      return new Response(JSON.stringify({ error: debugMsg }), {
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
