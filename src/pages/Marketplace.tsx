import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink } from "lucide-react";
import MarketplaceSteps from "@/components/MarketplaceSteps";
import BlogPreview from "@/components/BlogPreview";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const AFFILIATE_TAG = "berryrewardss-20";


const Marketplace = () => {
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = async (term: string) => {
    const query = term.trim();
    if (!query) return;

    // Log the search
    supabase.from("search_logs").insert({ search_term: query }).then();

    const url = `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AFFILIATE_TAG}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchInput);
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
              Shop, Share and Earn in 3 steps
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-4 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search any product on Amazon..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" className="gap-2 whitespace-nowrap">
              Shop on Amazon <ExternalLink className="h-4 w-4" />
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mb-8">
            You'll be redirected to Amazon. Purchases through our link support Berry Rewards!
          </p>

          {/* Steps */}
          <MarketplaceSteps />
        </div>
      </div>
      <BlogPreview />
      <Footer />
    </div>
  );
};

export default Marketplace;
