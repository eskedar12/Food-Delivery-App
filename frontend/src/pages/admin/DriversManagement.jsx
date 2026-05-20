import { useState, useEffect } from "react";
import { useAuth } from "../../lib/AuthContext.jsx";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Users, Plus, Truck, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function DriversManagement() {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDriver, setNewDriver] = useState({ name: "", phone: "", email: "" });

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { "x-auth-token": token }
      });
      const allUsers = await res.json();
      // Filter only users with role "driver"
      const driverUsers = allUsers.filter(u => u.role === "driver");
      setDrivers(driverUsers);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast.error("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  };

  const addDriver = async () => {
    if (!newDriver.name || !newDriver.phone || !newDriver.email) {
      toast.error("Please fill all fields");
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      // First register the user
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newDriver.name,
          email: newDriver.email,
          phone: newDriver.phone,
          password: "driver123"
        })
      });
      
      const data = await res.json();
      if (data.token) {
        // Update role to driver
        const userId = data.user.id;
        await fetch(`http://localhost:5000/api/users/${userId}/role`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
          },
          body: JSON.stringify({ role: "driver" })
        });
        
        toast.success("Driver added successfully!");
        setNewDriver({ name: "", phone: "", email: "" });
        setShowAddModal(false);
        fetchDrivers();
      } else {
        toast.error(data.message || "Failed to add driver");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const deleteDriver = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: { "x-auth-token": token }
      });
      
      if (res.ok) {
        toast.success("Driver removed!");
        fetchDrivers();
      } else {
        toast.error("Failed to delete driver");
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
          <h1 className="text-3xl font-serif font-bold">Driver Management</h1>
          <p className="mt-1 opacity-90">Manage delivery drivers</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">All Drivers ({drivers.length})</h2>
          <Button onClick={() => setShowAddModal(true)} className="bg-clay hover:bg-clay/90">
            <Plus className="w-4 h-4 mr-2" /> Add Driver
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drivers.map((driver) => (
            <Card key={driver._id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-clay rounded-full flex items-center justify-center text-white">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold">{driver.name}</h3>
                      <p className="text-sm text-gray-500">{driver.phone}</p>
                      <p className="text-sm text-gray-500">{driver.email}</p>
                      <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        Available
                      </span>
                    </div>
                  </div>
                  <button onClick={() => deleteDriver(driver._id)} className="text-red-500 hover:text-red-700">
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
                <CardTitle>Add New Driver</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input 
                    placeholder="Driver Name" 
                    value={newDriver.name}
                    onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                  />
                  <Input 
                    placeholder="Phone Number" 
                    value={newDriver.phone}
                    onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                  />
                  <Input 
                    placeholder="Email" 
                    value={newDriver.email}
                    onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">Default password: driver123</p>
                  <div className="flex gap-2">
                    <Button onClick={addDriver} className="bg-clay hover:bg-clay/90">Add Driver</Button>
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