import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { User, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navigation = () => {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const navLinks = user ? (
    <>
      <Link to="/dashboard" className="text-foreground font-semibold hover:text-primary transition-colors" onClick={() => setOpen(false)}>
        Dashboard
      </Link>
      <Link to="/profile" onClick={() => setOpen(false)}>
        <Button variant="outline" size="sm" className="gap-2 w-full">
          <User className="h-4 w-4" />
          Profile
        </Button>
      </Link>
      <Button variant="ghost" size="sm" className="gap-2 w-full" onClick={() => { signOut(); setOpen(false); }}>
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </>
  ) : (
    <>
      <Link to="/" className="text-foreground font-semibold hover:text-primary transition-colors" onClick={() => setOpen(false)}>
        Shoppers
      </Link>
      <Link to="/brands" className="text-foreground font-semibold hover:text-primary transition-colors" onClick={() => setOpen(false)}>
        Brands
      </Link>
      <Link to="/restaurants" className="text-foreground font-semibold hover:text-primary transition-colors" onClick={() => setOpen(false)}>
        Restaurants
      </Link>
      <Link to="/marketplace" className="text-foreground font-semibold hover:text-primary transition-colors" onClick={() => setOpen(false)}>
        Marketplace
      </Link>
      <Link to="/blog" className="text-foreground font-semibold hover:text-primary transition-colors" onClick={() => setOpen(false)}>
        Blog
      </Link>
      <Link to="/auth" onClick={() => setOpen(false)}>
        <Button size="sm" className="w-full">Sign In</Button>
      </Link>
    </>
  );

  return (
    <nav className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between z-50">
      <Link to="/" className="flex items-center">
        <img
          src="/lovable-uploads/f7fd8e9d-5949-42bc-9147-977a3f94ce15.png"
          alt="Logo"
          className="h-16 md:h-24 w-auto object-contain max-w-full"
        />
      </Link>

      {isMobile ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] pt-12">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col gap-4">
              {navLinks}
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="flex gap-8 items-center">
          {navLinks}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
