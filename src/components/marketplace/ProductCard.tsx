import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink } from "lucide-react";
import type { AmazonProduct } from "@/hooks/useAmazonProducts";

interface ProductCardProps {
  product: AmazonProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const handleClick = () => {
    window.open(product.detailPageURL, "_blank");
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square overflow-hidden bg-muted flex items-center justify-center">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-200 p-2"
          loading="lazy"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {product.brand}
          </span>
        </div>
        <CardTitle className="text-sm font-semibold leading-tight line-clamp-2">
          {product.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {product.features.length > 0 && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {product.features[0]}
          </p>
        )}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {product.price && (
              <span className="text-lg font-bold text-green-600">
                {product.price}
              </span>
            )}
            {product.originalPrice &&
              product.originalPrice !== product.price && (
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

export default ProductCard;
