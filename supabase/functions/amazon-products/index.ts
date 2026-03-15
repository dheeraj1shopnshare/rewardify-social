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
let pendingTokenRequest: Promise<string> | null = null;

async function requestOAuthToken(
  url: string,
  headers: Record<string, string>,
  body: string,
  label: string
): Promise<{ access_token: string; expires_in?: number }> {
  const response = await fetch(url, {
    method: "POST",
    headers,
    body,
  });

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(`${label} failed [${response.status}]: ${raw}`);
  }

  let data: { access_token?: string; expires_in?: number };
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`${label} returned non-JSON response: ${raw}`);
  }

  if (!data.access_token) {
    throw new Error(`${label} response missing access_token`);
  }

  return { access_token: data.access_token, expires_in: data.expires_in };
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  if (pendingTokenRequest) {
    return pendingTokenRequest;
  }

  const clientId = Deno.env.get("AMAZON_CLIENT_ID");
  const clientSecret = Deno.env.get("AMAZON_CLIENT_SECRET");

  if (!clientId || !clientSecret) {
    throw new Error("Amazon API credentials not configured");
  }

  pendingTokenRequest = (async () => {
    const attemptErrors: string[] = [];

    const attempts: Array<{
      url: string;
      headers: Record<string, string>;
      body: string;
      label: string;
    }> = [
      {
        label: "v3.x LwA (form credentials)",
        url: "https://api.amazon.com/auth/o2/token",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: clientId,
          client_secret: clientSecret,
          scope: "creatorsapi::default",
        }).toString(),
      },
      {
        label: "v3.x LwA (basic auth)",
        url: "https://api.amazon.com/auth/o2/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          scope: "creatorsapi::default",
        }).toString(),
      },
      {
        label: "v2.x Cognito",
        url: "https://creatorsapi.auth.us-east-1.amazoncognito.com/oauth2/token",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: clientId,
          client_secret: clientSecret,
          scope: "creatorsapi/default",
        }).toString(),
      },
    ];

    for (const attempt of attempts) {
      try {
        const tokenResponse = await requestOAuthToken(
          attempt.url,
          attempt.headers,
          attempt.body,
          attempt.label
        );

        cachedToken = tokenResponse.access_token;
        const expiresIn = Number(tokenResponse.expires_in ?? 3600);
        tokenExpiresAt = Date.now() + Math.max(expiresIn - 300, 60) * 1000;

        return cachedToken;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        attemptErrors.push(message);
      }
    }

    throw new Error(`Token request failed: ${attemptErrors.join(" | ")}`);
  })();

  try {
    return await pendingTokenRequest;
  } finally {
    pendingTokenRequest = null;
  }
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
    const { action, keywords, searchIndex, itemIds, itemCount, itemPage } =
      await req.json();

    const partnerTag = Deno.env.get("AMAZON_ASSOCIATE_TAG");
    if (!partnerTag) {
      throw new Error("Amazon Associate Tag not configured");
    }

    let result;

    if (action === "search") {
      const searchPayload: Record<string, unknown> = {
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
      };
      if (itemPage && itemPage > 1) {
        searchPayload.itemPage = itemPage;
      }
      result = await callCreatorsApi("searchItems", searchPayload);
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
