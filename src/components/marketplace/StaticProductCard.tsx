import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface StaticProduct {
  id: number;
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  rating: number;
  reviews: number;
  image: string;
  amazonUrl: string;
  description: string;
}

interface StaticProductCardProps {
  product: StaticProduct;
}

const StaticProductCard = ({ product }: StaticProductCardProps) => {
  const handleClick = () => {
    window.open(product.amazonUrl, "_blank");
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground">
              ⭐ {product.rating} ({product.reviews.toLocaleString()})
            </span>
          </div>
        </div>
        <CardTitle className="text-sm font-semibold leading-tight line-clamp-2">
          {product.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-green-600">
              {product.price}
            </span>
            {product.originalPrice !== product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {product.originalPrice}
              </span>
            )}
          </div>
        </div>
        <Button
          onClick={handleClick}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          size="sm"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View on Amazon
        </Button>
      </CardContent>
    </Card>
  );
};

export default StaticProductCard;

export type { StaticProduct };
