import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FoodCard } from "../components/FoodCard.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Search, Loader2 } from "lucide-react";
import { api } from "../lib/api.js";

export function FoodsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  
  const category = searchParams.get("category") || "";
  const restaurantFilter = searchParams.get("restaurant") || "";

  // Fetch foods from API
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const data = await api.getFoods();
        setFoods(data);
        
        // Get unique restaurants from foods
        const uniqueRestaurants = [...new Set(data.map(food => food.restaurant))];
        setRestaurants(uniqueRestaurants);
      } catch (error) {
        console.error('Error fetching foods:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFoods();
  }, []);

  const filteredFoods = useMemo(() => {
    let filtered = foods;
    
    if (category) {
      filtered = filtered.filter(food => food.category === category);
    }
    
    if (restaurantFilter) {
      filtered = filtered.filter(food => food.restaurant === restaurantFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [category, restaurantFilter, searchTerm, foods]);

  const handleSearch = () => {
    setSearchParams({ 
      q: searchTerm, 
      ...(category && { category }),
      ...(restaurantFilter && { restaurant: restaurantFilter })
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-clay" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-clay mb-2">Our Menu</h1>
        <p className="text-gray-600">Discover the best of Ethiopian and international cuisine</p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Category</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={category === "" ? "default" : "outline"}
            onClick={() => setSearchParams({})}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={category === "traditional" ? "default" : "outline"}
            onClick={() => setSearchParams({ category: "traditional" })}
            size="sm"
          >
            Traditional
          </Button>
          <Button
            variant={category === "modern" ? "default" : "outline"}
            onClick={() => setSearchParams({ category: "modern" })}
            size="sm"
          >
            Modern
          </Button>
          <Button
            variant={category === "drinks" ? "default" : "outline"}
            onClick={() => setSearchParams({ category: "drinks" })}
            size="sm"
          >
            Drinks
          </Button>
        </div>
      </div>

      {/* Restaurant Filters */}
      <div className="mb-8">
        <p className="text-sm font-medium text-gray-700 mb-2">Restaurant</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={restaurantFilter === "" ? "default" : "outline"}
            onClick={() => setSearchParams({ category })}
            size="sm"
          >
            All Restaurants
          </Button>
          {restaurants.map(rest => (
            <Button
              key={rest}
              variant={restaurantFilter === rest ? "default" : "outline"}
              onClick={() => setSearchParams({ category, restaurant: rest })}
              size="sm"
            >
              {rest}
            </Button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">Found {filteredFoods.length} items</p>

      {filteredFoods.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No foods found. Try a different search!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoods.map(food => (
            <FoodCard key={food._id || food.id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
}