import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Token cache
let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  const response = await fetch("https://api.amazon.com/auth/o2/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "creatorsapi::default",
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.access_token) {
    console.error("Token error:", JSON.stringify(data));
    throw new Error(`Failed to get access token: ${data.error_description || data.error || "Unknown error"}`);
  }

  cachedToken = data.access_token;
  tokenExpiry = now + (data.expires_in - 60) * 1000; // refresh 60s before expiry
  return cachedToken!;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { keywords, category, page } = await req.json();

    const clientId = Deno.env.get("AMAZON_CLIENT_ID")!;
    const clientSecret = Deno.env.get("AMAZON_CLIENT_SECRET")!;
    const partnerTag = Deno.env.get("AMAZON_ASSOCIATE_TAG")!;

    if (!clientId || !clientSecret || !partnerTag) {
      throw new Error("Amazon credentials not configured");
    }

    // Get OAuth token
    const accessToken = await getAccessToken(clientId, clientSecret);

    // Call Creators API
    const payload = {
      keywords: keywords || "beauty skincare",
      searchIndex: category || "Beauty",
      partnerTag: partnerTag,
      partnerType: "Associates",
      marketplace: "www.amazon.com",
      resources: [
        "images.primary.large",
        "itemInfo.title",
        "itemInfo.features",
        "offersV2.listings.price",
        "itemInfo.byLineInfo",
      ],
      itemCount: 10,
      itemPage: page || 1,
    };

    const apiResponse = await fetch("https://creatorsapi.amazon/catalog/v1/searchItems?marketplace=www.amazon.com", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "x-marketplace": "www.amazon.com",
      },
      body: JSON.stringify(payload),
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      console.error("Creators API error:", JSON.stringify(data));
      // Clear token cache if auth error
      if (apiResponse.status === 401) {
        cachedToken = null;
        tokenExpiry = 0;
      }
      return new Response(JSON.stringify({ error: "Failed to fetch products", details: data }), {
        status: apiResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Transform response
    const searchResult = data.searchResult || data.SearchResult;
    const items = searchResult?.items || searchResult?.Items || [];

    // Debug: log first item's full structure
    if (items.length > 0) {
      console.log("RAW ITEM KEYS:", JSON.stringify(Object.keys(items[0])));
      console.log("RAW ITEM OFFERS:", JSON.stringify(items[0].offersV2 || items[0].offers || items[0].Offers || "NO_OFFERS_KEY"));
      console.log("RAW ITEM FULL:", JSON.stringify(items[0]));
    }

    const products = items.map((item: any) => {
      const itemInfo = item.itemInfo || item.ItemInfo;
      const images = item.images || item.Images;
      const offers = item.offersV2 || item.offers || item.Offers;

      return {
        asin: item.asin || item.ASIN,
        title: itemInfo?.title?.displayValue || itemInfo?.Title?.DisplayValue || "Unknown Product",
        image: images?.primary?.large?.url || images?.Primary?.Large?.URL || "",
        price: offers?.listings?.[0]?.price?.displayAmount || offers?.Listings?.[0]?.Price?.DisplayAmount || "N/A",
        priceValue: offers?.listings?.[0]?.price?.amount || offers?.Listings?.[0]?.Price?.Amount || 0,
        url: item.detailPageURL || item.DetailPageURL,
        brand: itemInfo?.byLineInfo?.brand?.displayValue || itemInfo?.ByLineInfo?.Brand?.DisplayValue || "",
        features: itemInfo?.features?.displayValues || itemInfo?.Features?.DisplayValues || [],
      };
    });

    const totalResults = searchResult?.totalResultCount || searchResult?.TotalResultCount || 0;

    return new Response(JSON.stringify({ products, totalResults }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
