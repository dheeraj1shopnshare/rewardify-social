
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
      <Link to="/" className="flex items-center">
        <img 
          src="/lovable-uploads/f7fd8e9d-5949-42bc-9147-977a3f94ce15.png"
          alt="Logo" 
          className="h-24 w-auto object-contain max-w-full"
        />
      </Link>
      <div className="flex gap-8">
        <Link to="/" className="text-gray-900 font-semibold hover:text-primary transition-colors">
          Shoppers
        </Link>
        <Link to="/brands" className="text-gray-900 font-semibold hover:text-primary transition-colors">
          Brands
        </Link>
        <Link to="/restaurants" className="text-gray-900 font-semibold hover:text-primary transition-colors">
          Restaurants
        </Link>
        <Link to="/marketplace" className="text-gray-900 font-semibold hover:text-primary transition-colors">
          Marketplace
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
