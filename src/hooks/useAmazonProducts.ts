import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AmazonProduct {
  asin: string;
  title: string;
  detailPageURL: string;
  imageUrl: string;
  price: string;
  originalPrice: string;
  features: string[];
  brand: string;
}

function parseProducts(data: any): AmazonProduct[] {
  const items = data?.searchResult?.items || data?.itemsResult?.items || [];
  return items.map((item: any) => ({
    asin: item.asin,
    title: item.itemInfo?.title?.displayValue || "Unknown Product",
    detailPageURL: item.detailPageURL || "",
    imageUrl:
      item.images?.primary?.large?.url ||
      item.images?.primary?.medium?.url ||
      item.images?.primary?.small?.url ||
      "/placeholder.svg",
    price: formatPrice(item.offersV2?.listings?.[0]?.price),
    originalPrice: formatPrice(
      item.offersV2?.listings?.[0]?.savingBasis || item.offersV2?.listings?.[0]?.price
    ),
    features:
      item.itemInfo?.features?.displayValues?.slice(0, 2) || [],
    brand:
      item.itemInfo?.byLineInfo?.brand?.displayValue || "Amazon",
  }));
}

function formatPrice(priceObj: any): string {
  if (!priceObj) return "";
  if (priceObj.displayAmount) return priceObj.displayAmount;
  if (priceObj.amount) return `$${priceObj.amount}`;
  return "";
}

export function useAmazonSearch(keywords: string, searchIndex?: string, totalItems: number = 10) {
  return useQuery({
    queryKey: ["amazon-search", keywords, searchIndex, totalItems],
    queryFn: async () => {
      const pages = Math.min(Math.ceil(totalItems / 10), 10); // max 10 pages
      const requests = Array.from({ length: pages }, (_, i) =>
        supabase.functions.invoke("amazon-products", {
          body: {
            action: "search",
            keywords,
            searchIndex: searchIndex || "All",
            itemCount: 10,
            itemPage: i + 1,
          },
        })
      );
      const results = await Promise.allSettled(requests);
      const allProducts: AmazonProduct[] = [];
      for (const result of results) {
        if (result.status === "fulfilled") {
          const { data, error } = result.value;
          if (!error && !data?.error) {
            allProducts.push(...parseProducts(data));
          }
        }
      }
      if (allProducts.length === 0) {
        throw new Error("No products found");
      }
      return allProducts;
    },
    enabled: keywords.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAmazonGetItems(itemIds: string[]) {
  return useQuery({
    queryKey: ["amazon-items", itemIds],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke(
        "amazon-products",
        {
          body: {
            action: "getItems",
            itemIds,
          },
        }
      );
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return parseProducts(data);
    },
    enabled: itemIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
