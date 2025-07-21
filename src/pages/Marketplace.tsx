
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, ExternalLink, Filter } from "lucide-react";

// Mock data for top 50 health and beauty products
const healthBeautyProducts = [
  {
    id: 1,
    name: "La Roche-Posay Toleriane Double Repair Face Moisturizer, Daily Moisturizer Face Cream with Ceramide & Niacinamide for All Skin Types, Immediate Comfort & Long Lasting Hydration, Fragrance Free",
    category: "Skincare",
    price: "$23.99",
    originalPrice: "$23.99",
    rating: 4.6,
    reviews: 68277,
    image: "/lovable-uploads/d806e2a4-8a3d-4bba-bde2-892fa83cfde0.png",
    amazonUrl: "https://amzn.to/3TLjOZo",
    description: "Ultra hydrating face moisturizer helps restore skin barrier for healthy looking skin. Formulated with a high concentration of Prebiotic Thermal Water, Ceramide-3, Niacinamide & Glycerin. Fragrance free & oil free, wont clog pores",
  },
  {
    id: 2,
    name: "The Ordinary Niacinamide 10% + Zinc 1%",
    category: "Skincare",
    price: "$7.90",
    originalPrice: "$8.90",
    rating: 4.3,
    reviews: 8950,
    image: "/lovable-uploads/81cbc84d-b796-4297-a718-0f8ee584fabc.png",
    amazonUrl: "https://amazon.com/dp/example2",
    description: "Serum for blemish-prone skin"
  },
  {
    id: 3,
    name: "Neutrogena Hydrating Foaming Cleanser",
    category: "Skincare",
    price: "$8.97",
    originalPrice: "$10.99",
    rating: 4.4,
    reviews: 12300,
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop",
    amazonUrl: "https://amazon.com/dp/example3",
    description: "Gentle foaming facial cleanser with hyaluronic acid"
  },
  {
    id: 4,
    name: "Maybelline Fit Me Foundation",
    category: "Makeup",
    price: "$7.42",
    originalPrice: "$8.99",
    rating: 4.2,
    reviews: 9876,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=300&fit=crop",
    amazonUrl: "https://amazon.com/dp/example4",
    description: "Matte + poreless liquid foundation"
  },
  {
    id: 5,
    name: "Olaplex No. 3 Hair Perfector",
    category: "Hair Care",
    price: "$28.00",
    originalPrice: "$30.00",
    rating: 4.6,
    reviews: 11250,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=300&fit=crop",
    amazonUrl: "https://amazon.com/dp/example5",
    description: "At-home bond building hair treatment"
  },
  {
    id: 6,
    name: "Nature's Bounty Biotin Supplements",
    category: "Supplements",
    price: "$11.84",
    originalPrice: "$13.99",
    rating: 4.5,
    reviews: 7890,
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop",
    amazonUrl: "https://amazon.com/dp/example6",
    description: "Hair, skin and nail health supplement"
  }
];

const categories = ["All", "Skincare", "Makeup", "Hair Care", "Supplements", "Tools & Accessories"];

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState(healthBeautyProducts);

  useEffect(() => {
    console.log("Marketplace component mounted");
  }, []);

  useEffect(() => {
    let filtered = healthBeautyProducts;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory]);

  const handleAffiliateClick = (amazonUrl: string, productName: string) => {
    console.log(`Affiliate link clicked for: ${productName}`);
    window.open(amazonUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-white font-['Inter']">
      <Navigation />
      <div className="pt-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Top Health & Beauty Products
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover the most popular health and beauty products on Amazon. 
              Carefully curated selection of top-rated items with exclusive deals.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-sm"
                >
                  <Filter className="h-3 w-3 mr-1" />
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {product.rating} ({product.reviews.toLocaleString()})
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-sm font-semibold leading-tight">
                    {product.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-green-600">
                        {product.price}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        {product.originalPrice}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAffiliateClick(product.amazonUrl, product.name)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    size="sm"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Amazon
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call-to-Action Section */}
          <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Find Your Perfect Health & Beauty Products
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust our curated selection. 
              All products are sourced from Amazon with verified reviews and competitive prices.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Explore More Products
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>
              * Prices and availability are subject to change. 
              As an Amazon Associate, we earn from qualifying purchases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
