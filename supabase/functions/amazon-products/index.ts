import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createHmac } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// PA-API 5.0 request signing
function getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string): Uint8Array {
  const kDate = hmacSHA256(`AWS4${key}`, dateStamp);
  const kRegion = hmacSHA256(kDate, regionName);
  const kService = hmacSHA256(kRegion, serviceName);
  const kSigning = hmacSHA256(kService, "aws4_request");
  return kSigning;
}

function hmacSHA256(key: string | Uint8Array, data: string): Uint8Array {
  const hmac = createHmac("sha256", typeof key === "string" ? new TextEncoder().encode(key) : key);
  hmac.update(new TextEncoder().encode(data));
  return new Uint8Array(hmac.digest());
}

function sha256Hex(data: string): string {
  const hash = new Uint8Array(
    // @ts-ignore Deno crypto
    crypto.subtle ? [] : []
  );
  // Use Web Crypto API
  return "";
}

async function sha256(data: string): Promise<string> {
  const encoded = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function signRequest(
  accessKey: string,
  secretKey: string,
  host: string,
  region: string,
  path: string,
  payload: string,
  amzDate: string,
  dateStamp: string,
) {
  const service = "ProductAdvertisingAPI";
  const method = "POST";
  const contentType = "application/json; charset=UTF-8";
  const canonicalHeaders = `content-encoding:amz-1.0\ncontent-type:${contentType}\nhost:${host}\nx-amz-date:${amzDate}\nx-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems\n`;
  const signedHeaders = "content-encoding;content-type;host;x-amz-date;x-amz-target";
  const payloadHash = await sha256(payload);
  const canonicalRequest = `${method}\n${path}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  const algorithm = "AWS4-HMAC-SHA256";
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const canonicalRequestHash = await sha256(canonicalRequest);
  const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${canonicalRequestHash}`;
  const signingKey = getSignatureKey(secretKey, dateStamp, region, service);
  const signatureBytes = hmacSHA256(signingKey, stringToSign);
  const signature = Array.from(signatureBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const authorization = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  return authorization;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { keywords, category, page } = await req.json();
    
    const accessKey = Deno.env.get("AMAZON_CLIENT_ID")!;
    const secretKey = Deno.env.get("AMAZON_CLIENT_SECRET")!;
    const partnerTag = Deno.env.get("AMAZON_ASSOCIATE_TAG")!;

    const host = "webservices.amazon.com";
    const region = "us-east-1";
    const path = "/paapi5/searchitems";

    const payload = JSON.stringify({
      Keywords: keywords || "beauty skincare",
      SearchIndex: category || "Beauty",
      PartnerTag: partnerTag,
      PartnerType: "Associates",
      Marketplace: "www.amazon.com",
      Resources: [
        "Images.Primary.Large",
        "ItemInfo.Title",
        "ItemInfo.Features",
        "Offers.Listings.Price",
        "ItemInfo.ByLineInfo",
        "BrowseNodeInfo.BrowseNodes",
      ],
      ItemCount: 10,
      ItemPage: page || 1,
    });

    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateStamp = amzDate.slice(0, 8);

    const authorization = await signRequest(
      accessKey,
      secretKey,
      host,
      region,
      path,
      payload,
      amzDate,
      dateStamp,
    );

    const response = await fetch(`https://${host}${path}`, {
      method: "POST",
      headers: {
        "content-encoding": "amz-1.0",
        "content-type": "application/json; charset=UTF-8",
        host: host,
        "x-amz-date": amzDate,
        "x-amz-target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems",
        Authorization: authorization,
      },
      body: payload,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Amazon PA-API error:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "Failed to fetch products", details: data }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Transform response into a simpler format
    const products = (data.SearchResult?.Items || []).map((item: any) => ({
      asin: item.ASIN,
      title: item.ItemInfo?.Title?.DisplayValue || "Unknown Product",
      image: item.Images?.Primary?.Large?.URL || "",
      price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount || "N/A",
      priceValue: item.Offers?.Listings?.[0]?.Price?.Amount || 0,
      url: item.DetailPageURL,
      brand: item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || "",
      features: item.ItemInfo?.Features?.DisplayValues || [],
    }));

    return new Response(JSON.stringify({ products, totalResults: data.SearchResult?.TotalResultCount || 0 }), {
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
