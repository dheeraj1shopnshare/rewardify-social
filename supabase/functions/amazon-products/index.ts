import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function hmacSHA256(key: Uint8Array, data: string): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data));
  return new Uint8Array(sig);
}

async function sha256Hex(data: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data));
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function toHex(buf: Uint8Array): string {
  return Array.from(buf).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function getSignatureKey(key: string, dateStamp: string, region: string, service: string): Promise<Uint8Array> {
  const kDate = await hmacSHA256(new TextEncoder().encode(`AWS4${key}`), dateStamp);
  const kRegion = await hmacSHA256(kDate, region);
  const kService = await hmacSHA256(kRegion, service);
  const kSigning = await hmacSHA256(kService, "aws4_request");
  return kSigning;
}

async function signRequest(
  accessKey: string, secretKey: string, host: string, region: string,
  path: string, payload: string, amzDate: string, dateStamp: string,
) {
  const service = "ProductAdvertisingAPI";
  const contentType = "application/json; charset=UTF-8";
  const target = "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems";
  const canonicalHeaders = `content-encoding:amz-1.0\ncontent-type:${contentType}\nhost:${host}\nx-amz-date:${amzDate}\nx-amz-target:${target}\n`;
  const signedHeaders = "content-encoding;content-type;host;x-amz-date;x-amz-target";
  const payloadHash = await sha256Hex(payload);
  const canonicalRequest = `POST\n${path}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  const algorithm = "AWS4-HMAC-SHA256";
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const canonicalRequestHash = await sha256Hex(canonicalRequest);
  const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${canonicalRequestHash}`;
  const signingKey = await getSignatureKey(secretKey, dateStamp, region, service);
  const signature = toHex(await hmacSHA256(signingKey, stringToSign));
  return `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
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
      ],
      ItemCount: 10,
      ItemPage: page || 1,
    });

    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateStamp = amzDate.slice(0, 8);

    const authorization = await signRequest(accessKey, secretKey, host, region, path, payload, amzDate, dateStamp);

    const response = await fetch(`https://${host}${path}`, {
      method: "POST",
      headers: {
        "content-encoding": "amz-1.0",
        "content-type": "application/json; charset=UTF-8",
        "host": host,
        "x-amz-date": amzDate,
        "x-amz-target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems",
        "Authorization": authorization,
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
