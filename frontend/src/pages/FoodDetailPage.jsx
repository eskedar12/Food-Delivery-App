import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../lib/CartContext.jsx";
import { Button } from "../components/ui/Button.jsx";
import { sampleFoods } from "../lib/sampleData.js";
import { ArrowLeft, Star, Clock, Store } from "lucide-react";
import { toast } from "sonner";

export function FoodDetailPage() {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const food = sampleFoods.find(f => f.id === foodId);

  if (!food) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Food not found</h1>
        <Button onClick={() => navigate("/foods")}>Back to Menu</Button>
      </div>
    );
  }

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="rounded-lg overflow-hidden">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-auto object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">{food.name}</h1>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-gold text-gold" />
              <span className="font-semibold">{food.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{food.prep_time}</span>
            </div>
          </div>

          <p className="text-gray-600 mb-6">{food.description}</p>
          
          <div className="mb-4">
            <span className="text-sm text-gray-500">Category</span>
            <p className="capitalize font-medium">{food.category}</p>
          </div>

          <div className="mb-6">
            <span className="text-sm text-gray-500">Restaurant</span>
            <div className="flex items-center gap-2 mt-1">
              <Store className="w-4 h-4 text-clay" />
              <p className="font-semibold text-clay">{food.restaurant}</p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-6">
            <div>
              <span className="text-sm text-gray-500">Price</span>
              <p className="text-3xl font-bold text-clay">ETB {food.price}</p>
            </div>
            <Button
              size="lg"
              onClick={handleAddToCart}
              className="bg-forest hover:bg-forest/90"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}