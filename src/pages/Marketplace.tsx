import Navigation from "@/components/Navigation";
import StaticProductCard from "@/components/marketplace/StaticProductCard";
import type { StaticProduct } from "@/components/marketplace/StaticProductCard";

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

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-background font-['Inter']">
      <Navigation />
      <div className="pt-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Our Curated Picks
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover our hand-picked health and beauty products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {staticProducts.map((product) => (
              <StaticProductCard key={product.id} product={product} />
            ))}
          </div>

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
