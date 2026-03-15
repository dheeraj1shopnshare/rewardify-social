import Navigation from "@/components/Navigation";

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-background font-['Inter']">
      <Navigation />
      <div className="pt-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Marketplace
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Products coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
