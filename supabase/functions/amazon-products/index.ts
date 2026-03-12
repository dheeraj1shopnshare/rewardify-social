import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CREATORS_API_BASE = "https://creatorsapi.amazon";

// Token cache
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const clientId = Deno.env.get("AMAZON_CLIENT_ID");
  const clientSecret = Deno.env.get("AMAZON_CLIENT_SECRET");

  if (!clientId || !clientSecret) {
    throw new Error("Amazon API credentials not configured");
  }

  // Try v3.x (LwA) first, fall back to v2.x (Cognito)
  let tokenUrl: string;
  let requestInit: RequestInit;

  // Attempt v3.x LwA auth
  tokenUrl = "https://api.amazon.com/auth/o2/token";
  requestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "creatorsapi::default",
    }),
  };

  let response = await fetch(tokenUrl, requestInit);

  // If v3.x fails, try v2.x Cognito (NA)
  if (!response.ok) {
    console.log("v3.x auth failed, trying v2.x Cognito...");
    tokenUrl =
      "https://creatorsapi.auth.us-east-1.amazoncognito.com/oauth2/token";
    requestInit = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&scope=creatorsapi/default`,
    };
    response = await fetch(tokenUrl, requestInit);
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Token request failed [${response.status}]: ${errorBody}`
    );
  }

  const data = await response.json();
  cachedToken = data.access_token;
  // Expire 5 minutes early to be safe
  tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000;

  return cachedToken!;
}

async function callCreatorsApi(
  operation: string,
  payload: Record<string, unknown>
) {
  const token = await getAccessToken();

  const response = await fetch(
    `${CREATORS_API_BASE}/catalog/v1/${operation}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-marketplace": "www.amazon.com",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Creators API ${operation} failed [${response.status}]: ${errorBody}`
    );
  }

  return response.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, keywords, searchIndex, itemIds, itemCount } =
      await req.json();

    const partnerTag = Deno.env.get("AMAZON_ASSOCIATE_TAG");
    if (!partnerTag) {
      throw new Error("Amazon Associate Tag not configured");
    }

    let result;

    if (action === "search") {
      result = await callCreatorsApi("searchItems", {
        keywords: keywords || "health beauty",
        searchIndex: searchIndex || "All",
        itemCount: itemCount || 10,
        partnerTag,
        marketplace: "www.amazon.com",
        resources: [
          "images.primary.large",
          "itemInfo.title",
          "itemInfo.features",
          "itemInfo.byLineInfo",
          "offersV2.listings.price",
          "offersV2.listings.savingBasis",
        ],
      });
    } else if (action === "getItems") {
      if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
        throw new Error("itemIds array is required for getItems action");
      }
      result = await callCreatorsApi("getItems", {
        itemIds,
        itemIdType: "ASIN",
        partnerTag,
        marketplace: "www.amazon.com",
        resources: [
          "images.primary.large",
          "itemInfo.title",
          "itemInfo.features",
          "itemInfo.byLineInfo",
          "offersV2.listings.price",
          "offersV2.listings.savingBasis",
        ],
      });
    } else {
      throw new Error('Invalid action. Use "search" or "getItems".');
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Amazon Products API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
