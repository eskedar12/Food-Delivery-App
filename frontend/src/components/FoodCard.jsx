import { Link } from "react-router-dom";
import { Plus, Star, Store } from "lucide-react";
import { useCart } from "../lib/CartContext.jsx";
import { Button } from "./ui/Button.jsx";
import { Badge } from "./ui/Badge.jsx";
import { Card, CardContent } from "./ui/Card.jsx";
import { toast } from "sonner";

export function FoodCard({ food }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: food.id,
      name: food.name,
      price: food.price,
      quantity: 1,
      image: food.image,
      restaurant: food.restaurant,
    });
    toast.success(`${food.name} added to cart!`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/food/${food.id}`}>
        <div className="aspect-video overflow-hidden">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/food/${food.id}`}>
            <h3 className="font-semibold text-lg hover:text-clay transition-colors">
              {food.name}
            </h3>
          </Link>
          <Badge variant="default" className="bg-clay">
            ETB {food.price}
          </Badge>
        </div>
        
        {/* Restaurant Name */}
        <div className="flex items-center gap-1 mb-2">
          <Store className="w-3 h-3 text-gray-500" />
          <span className="text-xs text-gray-500">{food.restaurant}</span>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {food.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-gold text-gold" />
              <span className="text-sm ml-1">{food.rating}</span>
            </div>
            <span className="text-xs text-gray-500">{food.prep_time}</span>
          </div>
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="bg-forest hover:bg-forest/90"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}