import { useState, useEffect } from "react";
import { useAuth } from "../../lib/AuthContext.jsx";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Utensils, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

export default function MenuManagement() {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFood, setNewFood] = useState({ 
    name: "", 
    price: "", 
    category: "modern", 
    restaurant: "",
    description: ""
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  // Fetch foods and restaurants on load
  useEffect(() => {
    fetchFoods();
    fetchRestaurants();
  }, []);

  const fetchFoods = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/foods", {
        headers: { "x-auth-token": token }
      });
      const data = await res.json();
      setFoods(data);
    } catch (error) {
      console.error("Error fetching foods:", error);
      toast.error("Failed to load foods");
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/restaurants", {
        headers: { "x-auth-token": token }
      });
      const data = await res.json();
      setRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addFood = async () => {
    if (!newFood.name || !newFood.price || !newFood.restaurant) {
      toast.error("Please fill all fields");
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      
      formData.append("data", JSON.stringify({
        name: newFood.name,
        price: Number(newFood.price),
        category: newFood.category,
        restaurant: newFood.restaurant,
        description: newFood.description || `${newFood.name} - Delicious food from ${newFood.restaurant}`,
        rating: 4.5,
        prep_time: "20-30 min",
        is_featured: false
      }));
      
      if (selectedImage) {
        formData.append("image", selectedImage);
      }
      
      const response = await fetch("http://localhost:5000/api/foods", {
        method: "POST",
        headers: {
          "x-auth-token": token
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success("Food added successfully!");
        setNewFood({ name: "", price: "", category: "modern", restaurant: "", description: "" });
        setSelectedImage(null);
        setImagePreview(null);
        setShowAddModal(false);
        fetchFoods();
      } else {
        toast.error(data.message || "Failed to add food");
      }
    } catch (error) {
      console.error("Error adding food:", error);
      toast.error("Something went wrong");
    }
  };

  const deleteFood = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/foods/${id}`, {
        method: "DELETE",
        headers: { "x-auth-token": token }
      });
      
      if (res.ok) {
        toast.success("Food deleted!");
        fetchFoods();
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clay"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-clay to-forest text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold">Menu Management</h1>
          <p className="mt-1 opacity-90">Manage all food items and prices</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">All Menu Items ({foods.length})</h2>
          <Button onClick={() => setShowAddModal(true)} className="bg-clay hover:bg-clay/90">
            <Plus className="w-4 h-4 mr-2" /> Add Food Item
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food) => (
            <Card key={food._id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {food.image && (
                        <img src={food.image} alt={food.name} className="w-12 h-12 rounded-lg object-cover" />
                      )}
                      <Utensils className="w-5 h-5 text-clay" />
                      <h3 className="font-bold">{food.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{food.restaurant}</p>
                    <p className="text-sm text-gray-500">Category: {food.category}</p>
                    <p className="text-lg font-bold text-clay mt-2">ETB {food.price}</p>
                  </div>
                  <button onClick={() => deleteFood(food._id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Add New Food Item</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input 
                    placeholder="Food Name" 
                    value={newFood.name}
                    onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                  />
                  <Input 
                    type="number"
                    placeholder="Price (ETB)" 
                    value={newFood.price}
                    onChange={(e) => setNewFood({ ...newFood, price: e.target.value })}
                  />
                  <Input 
                    placeholder="Description" 
                    value={newFood.description}
                    onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
                  />
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={newFood.category}
                    onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
                  >
                    <option value="modern">Modern</option>
                    <option value="traditional">Traditional</option>
                    <option value="drinks">Drinks</option>
                  </select>
                  
                  {/* Restaurant Dropdown - Dynamically loaded from API */}
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={newFood.restaurant}
                    onChange={(e) => setNewFood({ ...newFood, restaurant: e.target.value })}
                  >
                    <option value="">Select Restaurant</option>
                    {restaurants.map((restaurant) => (
                      <option key={restaurant._id} value={restaurant.name}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
                  
                  {/* Image Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      id="foodImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label htmlFor="foodImage" className="cursor-pointer">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover mx-auto rounded-lg" />
                      ) : (
                        <div className="py-4">
                          <Upload className="w-8 h-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-500 mt-2">Click to upload food image</p>
                        </div>
                      )}
                    </label>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={addFood} className="bg-clay hover:bg-clay/90">Add Item</Button>
                    <Button variant="outline" onClick={() => {
                      setShowAddModal(false);
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}>Cancel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}