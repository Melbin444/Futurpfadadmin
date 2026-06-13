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

  // Define a debug log collector
  const debugLogs: string[] = [];
  const logDebug = (msg: string) => {
    debugLogs.push(msg);
    console.log(msg);
  };

  try {
    logDebug("[1] Parsing formData");
    const formData = await request.formData();
    const file = formData.get("file");
    logDebug(`[2] File parsed from formData. Present: ${!!file}`);

    if (!file) {
      logDebug("[2-Err] No file found in form data");
      return new Response(JSON.stringify({ 
        error: "No file uploaded", 
        debugLogs 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    logDebug(`[3] File type: ${typeof file}`);
    if (file && typeof file === "object") {
      logDebug(`[4] File constructor name: ${file.constructor?.name}`);
      logDebug(`[5] File has arrayBuffer: ${"arrayBuffer" in file}`);
      logDebug(`[6] File name: ${(file as any).name}, size: ${(file as any).size}, type: ${(file as any).type}`);
    }

    // Convert the streaming File object into a Base64 Data URI
    // This bypasses any limitations or bugs in the Cloudflare Workers runtime
    // regarding binary Blob serialization inside FormData fetch requests
    let dataUri = "";
    if (file && typeof file === "object" && "arrayBuffer" in file) {
      try {
        logDebug("[7] Reading arrayBuffer");
        const arrayBuffer = await (file as any).arrayBuffer();
        logDebug(`[8] arrayBuffer byteLength: ${arrayBuffer.byteLength}`);
        const uint8 = new Uint8Array(arrayBuffer);
        let binary = "";
        const chunk_size = 0x8000; // 32KB chunks
        for (let i = 0; i < uint8.length; i += chunk_size) {
          const chunk = uint8.subarray(i, i + chunk_size);
          binary += String.fromCharCode.apply(null, chunk as any);
        }
        const base64 = btoa(binary);
        const mimeType = (file as any).type || "image/png";
        dataUri = `data:${mimeType};base64,${base64}`;
        logDebug(`[9] Base64 conversion successful. dataUri length: ${dataUri.length}`);
      } catch (err: any) {
        logDebug(`[7-Err] ArrayBuffer conversion failed: ${err.message}`);
        return new Response(JSON.stringify({ 
          error: "Failed to process binary data: " + err.message, 
          debugLogs 
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    } else {
      logDebug("[7-Err] File is not an object or does not contain arrayBuffer");
      return new Response(JSON.stringify({ 
        error: "Invalid file format: file must be a binary File/Blob object", 
        debugLogs 
      }), {
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

    const rawCloudName = env.CLOUDINARY_CLOUD_NAME;
    const rawApiKey = env.CLOUDINARY_API_KEY;
    const rawApiSecret = env.CLOUDINARY_API_SECRET;

    const cloudName = cleanValue(rawCloudName);
    const apiKey = cleanValue(rawApiKey);
    const apiSecret = cleanValue(rawApiSecret);

    logDebug(`[10] Cloudinary settings:`);
    logDebug(`- rawCloudName: ${rawCloudName ? "configured" : "MISSING"}`);
    logDebug(`- rawApiKey: ${rawApiKey ? `configured (len: ${rawApiKey.length})` : "MISSING"}`);
    logDebug(`- rawApiSecret: ${rawApiSecret ? `configured (len: ${rawApiSecret.length})` : "MISSING"}`);
    logDebug(`- cleanCloudName: ${cloudName}`);
    logDebug(`- cleanApiKey: ${apiKey}`);
    logDebug(`- cleanApiSecret: ${apiSecret ? `${apiSecret.slice(0, 2)}...${apiSecret.slice(-2)} (len: ${apiSecret.length})` : "MISSING"}`);

    if (!cloudName || !apiKey || !apiSecret) {
      logDebug("[10-Err] One or more environment variables are missing");
      return new Response(JSON.stringify({ 
        error: "Cloudinary environment variables not configured in Pages project dashboard", 
        debugLogs 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    const folder = "futurpfad";

    const timestamp = Math.round(Date.now() / 1000).toString();
    
    // Create signature: folder=futurpfad&timestamp=<timestamp><api_secret>
    const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const obscuredStringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret.slice(0, 2)}...${apiSecret.slice(-2)}`;
    logDebug(`[11] stringToSign: ${obscuredStringToSign}`);

    // Hash using SHA-1
    const encoder = new TextEncoder();
    const data = encoder.encode(stringToSign);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    logDebug(`[12] Generated signature: ${signature}`);

    // Prepare multipart payload to send to Cloudinary
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", dataUri);
    cloudinaryFormData.append("api_key", apiKey);
    cloudinaryFormData.append("timestamp", timestamp);
    cloudinaryFormData.append("signature", signature);
    cloudinaryFormData.append("folder", folder);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    logDebug(`[13] Forwarding image payload to Cloudinary: ${cloudinaryUrl}`);
    
    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: cloudinaryFormData
    });

    logDebug(`[14] Cloudinary status: ${response.status} ${response.statusText}`);
    const resData: any = await response.json();
    logDebug(`[15] Cloudinary response body: ${JSON.stringify(resData)}`);
    
    if (!response.ok) {
      logDebug("[15-Err] Cloudinary API returned error status");
      return new Response(JSON.stringify({ 
        error: resData.error?.message || "Cloudinary upload failed",
        cloudinaryError: resData.error,
        debugLogs
      }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    logDebug("[16] Image uploaded successfully!");
    return new Response(JSON.stringify({ 
      url: resData.secure_url,
      debugLogs
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: any) {
    logDebug(`[Fatal Err] Catch block: ${error.message}`);
    return new Response(JSON.stringify({ 
      error: "Upload handler error: " + error.message, 
      debugLogs 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
