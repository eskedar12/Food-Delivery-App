import { useState, useEffect } from "react";
import { useAuth } from "../../lib/AuthContext.jsx";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Building2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Restaurants() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({ name: "", address: "", phone: "" });

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

 useEffect(() => {
  fetchRestaurants();
}, []);

const fetchRestaurants = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch("https://food-delivery-api-am5l.onrender.com/api/restaurants", {
    headers: { "x-auth-token": token }
  });
      const data = await res.json();
      setRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      toast.error("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  const addRestaurant = async () => {
    if (!newRestaurant.name) {
      toast.error("Please enter restaurant name");
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
        body: JSON.stringify({
          name: newRestaurant.name,
          address: newRestaurant.address || "",
          phone: newRestaurant.phone || "",
          is_active: true
        })
      });
      
      if (res.ok) {
        toast.success("Restaurant added successfully!");
        setNewRestaurant({ name: "", address: "", phone: "" });
        setShowAddModal(false);
        fetchRestaurants();
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to add restaurant");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const deleteRestaurant = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/restaurants/${id}`, {
        method: "DELETE",
        headers: { "x-auth-token": token }
      });
      
      if (res.ok) {
        toast.success("Restaurant deleted!");
        fetchRestaurants();
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
          <h1 className="text-3xl font-serif font-bold">Manage Restaurants</h1>
          <p className="mt-1 opacity-90">Add, edit or remove partner restaurants</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">All Restaurants ({restaurants.length})</h2>
          <Button onClick={() => setShowAddModal(true)} className="bg-clay hover:bg-clay/90">
            <Plus className="w-4 h-4 mr-2" /> Add Restaurant
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.map((restaurant) => (
            <Card key={restaurant._id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-10 h-10 text-clay" />
                    <div>
                      <h3 className="font-bold text-lg">{restaurant.name}</h3>
                      <p className="text-sm text-gray-500">{restaurant.address}</p>
                      <p className="text-sm text-gray-500">{restaurant.phone}</p>
                      <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Active
                      </span>
                    </div>
                  </div>
                  <button onClick={() => deleteRestaurant(restaurant._id)} className="text-red-500 hover:text-red-700">
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
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Add New Restaurant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input 
                    placeholder="Restaurant Name" 
                    value={newRestaurant.name}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                  />
                  <Input 
                    placeholder="Address" 
                    value={newRestaurant.address}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, address: e.target.value })}
                  />
                  <Input 
                    placeholder="Phone" 
                    value={newRestaurant.phone}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, phone: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Button onClick={addRestaurant} className="bg-clay hover:bg-clay/90">Add Restaurant</Button>
                    <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
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