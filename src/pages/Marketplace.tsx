import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useAmazonSearch } from "@/hooks/useAmazonProducts";
import ProductCard from "@/components/marketplace/ProductCard";
import StaticProductCard from "@/components/marketplace/StaticProductCard";
import type { StaticProduct } from "@/components/marketplace/StaticProductCard";

// Fallback static products (used when API is unavailable)
const staticProducts: StaticProduct[] = [
  {
    id: 1,
    name: "AXIS-Y Vegan Collagen Eye Serum - K Beauty Triple Hyaluronic Acid & Peptide Collagen Serum",
    category: "Skincare",
    price: "$13.05",
    originalPrice: "$15.99",
    rating: 4.4,
    reviews: 2612,
    image: "/lovable-uploads/eye_serum.jpg",
    amazonUrl: "https://amzn.to/46mcme1",
    description: "Under Eye Brightener: Targets puffiness, dark circles, and fine lines.",
  },
  {
    id: 2,
    name: "Fisher Chef's Naturals Pecan Halves 24 oz",
    category: "Super Food",
    price: "$17.02",
    originalPrice: "$17.02",
    rating: 4.6,
    reviews: 18453,
    image: "/lovable-uploads/peacons.jpg",
    amazonUrl: "https://amzn.to/4rvQghv",
    description: "Unsalted Raw Nuts for Cooking, Baking & Snacking.",
  },
  {
    id: 3,
    name: "Beauty of Joseon Green Plum Refreshing Cleanser",
    category: "Skincare",
    price: "$13.00",
    originalPrice: "$13.00",
    rating: 4.5,
    reviews: 45000,
    image: "/lovable-uploads/614JLcBp8uL._AC_SL1500.jpg",
    amazonUrl: "https://amzn.to/4qUzx6B",
    description: "Deep Cleansing facial skin care product for pore refinement.",
  },
  {
    id: 4,
    name: "Dyvicl Metallic Marker Pens - Set of 10",
    category: "Art Supplies",
    price: "$13.28",
    originalPrice: "$13.98",
    rating: 4.7,
    reviews: 51000,
    image: "/lovable-uploads/71rv7RldAvL._AC_SX679.jpg",
    amazonUrl: "https://amzn.to/4sdKeCf",
    description: "Vibrant Metallic Colors for rock painting, card making, scrapbooking.",
  },
];

const searchCategories = [
  { label: "All", value: "All" },
  { label: "Fashion", value: "Fashion" },
  { label: "Beauty", value: "Beauty" },
  { label: "Health", value: "HealthPersonalCare" },
  { label: "Skin Care", value: "Beauty" },
  { label: "Hair Care", value: "Beauty" },
  { label: "Supplements", value: "HealthPersonalCare" },
];

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("health beauty skincare");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const {
    data: apiProducts,
    isLoading,
    isError,
  } = useAmazonSearch(activeSearch, selectedCategory);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setActiveSearch(searchTerm.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    // Re-trigger search with the current search term and new category
    setActiveSearch(searchTerm.trim() || "health beauty skincare");
  };

  const showApiResults = apiProducts && apiProducts.length > 0;
  const showFallback = !isLoading && (!apiProducts || apiProducts.length === 0);

  return (
    <div className="min-h-screen bg-background font-['Inter']">
      <Navigation />
      <div className="pt-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Top Health & Beauty Products
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover the most popular health and beauty products on Amazon.
              Live data powered by Amazon Creators API.
            </p>
          </div>

          {/* Search */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md mx-auto flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search products on Amazon..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch}>Search</Button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              {searchCategories.map((cat) => (
                <Button
                  key={cat.label}
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(cat.value)}
                  className="text-sm"
                >
                  <Filter className="h-3 w-3 mr-1" />
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">
                Searching Amazon...
              </span>
            </div>
          )}

          {/* API Error banner */}
          {isError && (
            <div className="text-center py-4 mb-6 bg-destructive/10 rounded-lg">
              <p className="text-sm text-destructive">
                Unable to fetch live data from Amazon. Showing curated picks below.
              </p>
            </div>
          )}

          {/* API Products Grid */}
          {showApiResults && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {apiProducts.map((product) => (
                <ProductCard key={product.asin} product={product} />
              ))}
            </div>
          )}

          {/* Fallback Static Products */}
          {showFallback && (
            <>
              {isError && (
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Our Curated Picks
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {staticProducts.map((product) => (
                  <StaticProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Find Your Perfect Health & Beauty Products
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Search millions of products on Amazon with live pricing and
              availability. All links include our affiliate tag.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 text-center text-xs text-muted-foreground pb-8">
            <p>
              * Prices and availability are subject to change. As an Amazon
              Associate, we earn from qualifying purchases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
