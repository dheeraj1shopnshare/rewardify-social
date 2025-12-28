import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

const Navigation = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
      <Link to="/" className="flex items-center">
        <img 
          src="/lovable-uploads/f7fd8e9d-5949-42bc-9147-977a3f94ce15.png"
          alt="Logo" 
          className="h-24 w-auto object-contain max-w-full"
        />
      </Link>
      <div className="flex gap-8 items-center">
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
        {user ? (
          <>
            <Link to="/profile">
              <Button variant="outline" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="gap-2" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </>
        ) : (
          <Link to="/auth">
            <Button size="sm">Sign In</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
