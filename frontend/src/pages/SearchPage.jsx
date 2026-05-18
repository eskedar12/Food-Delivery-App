import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FoodCard } from "../components/FoodCard.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Button } from "../components/ui/Button.jsx";
import { sampleFoods } from "../lib/sampleData.js";
import { Search } from "lucide-react";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  const searchResults = sampleFoods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    food.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = () => {
    setSearchParams({ q: searchTerm });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold mb-8">Search Foods</h1>
      
      <div className="flex gap-2 mb-8">
        <Input
          placeholder="Search for your favorite food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} className="bg-clay hover:bg-clay/90">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {searchTerm && (
        <>
          <p className="text-gray-600 mb-4">Found {searchResults.length} results for "{searchTerm}"</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map(food => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}