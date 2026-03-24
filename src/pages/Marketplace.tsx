import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ExternalLink, Star, ShoppingCart } from "lucide-react";

const CATEGORIES = [
  { label: "Beauty", value: "Beauty" },
  { label: "Skincare", value: "Beauty", keywords: "skincare" },
  { label: "Haircare", value: "Beauty", keywords: "hair care" },
  { label: "Wellness", value: "HealthPersonalCare", keywords: "wellness supplements" },
  { label: "Fashion", value: "Fashion" },
  { label: "Electronics", value: "Electronics" },
];

interface Product {
  asin: string;
  title: string;
  image: string;
  price: string;
  priceValue: number;
  listPrice?: string | null;
  savings?: number | null;
  url: string;
  brand: string;
  features: string[];
}

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("beauty skincare");
  const [activeCategory, setActiveCategory] = useState("Beauty");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["amazon-products", searchQuery, activeCategory],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("amazon-products", {
        body: { keywords: searchQuery, category: activeCategory },
      });
      if (error) throw error;
      return data as { products: Product[]; totalResults: number };
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
    }
  };

  const handleCategoryClick = (cat: (typeof CATEGORIES)[0]) => {
    setActiveCategory(cat.value);
    setSearchQuery(cat.keywords || cat.label.toLowerCase());
    setSearchInput("");
  };

  return (
    <div className="min-h-screen bg-background font-['Inter']">
      <Navigation />
      <div className="pt-32 px-4 sm:px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-foreground mb-3">
              How Berry Rewards Works
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Shop, Share and earn in 3 steps
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <Badge
                key={cat.label}
                variant={activeCategory === cat.value && searchQuery === (cat.keywords || cat.label.toLowerCase()) ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleCategoryClick(cat)}
              >
                {cat.label}
              </Badge>
            ))}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl border bg-card p-4 space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-16">
              <p className="text-destructive mb-2">Failed to load products</p>
              <p className="text-sm text-muted-foreground">Please try again later.</p>
            </div>
          )}

          {/* Products Grid */}
          {data?.products && data.products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.products.map((product) => (
                <a
                  key={product.asin}
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border bg-card hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="aspect-square bg-muted flex items-center justify-center p-4 overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <ShoppingCart className="h-16 w-16 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    {product.brand && (
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        {product.brand}
                      </span>
                    )}
                    <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2 flex-1">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-foreground">
                          {product.price}
                        </span>
                        {product.listPrice && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground line-through">
                              {product.listPrice}
                            </span>
                            {product.savings && (
                              <span className="text-xs font-medium text-green-600">
                                -{product.savings}%
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        View <ExternalLink className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Empty State */}
          {data?.products && data.products.length === 0 && (
            <div className="text-center py-16">
              <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No products found. Try a different search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
