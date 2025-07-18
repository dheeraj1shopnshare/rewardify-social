
import { useEffect } from "react";
import Navigation from "@/components/Navigation";

const Marketplace = () => {
  useEffect(() => {
    console.log("Marketplace component mounted");
  }, []);

  return (
    <div className="min-h-screen bg-white font-['Inter']">
      <Navigation />
      <div className="pt-32 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Marketplace</h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover and shop from our curated marketplace of products and services.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-gray-600">
                Browse our selection of featured products from trusted sellers.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Services</h2>
              <p className="text-gray-600">
                Find professional services and solutions for your needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
