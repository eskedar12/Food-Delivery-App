import { useState, useEffect } from "react";
import { useAuth } from "../../lib/AuthContext.jsx";
import { Navigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Package, Clock, CheckCircle, Truck } from "lucide-react";
import { toast } from "sonner";

export default function OrdersManagement() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://food-delivery-api-am5l.onrender.com/api/orders", {
        headers: { "x-auth-token": token }
      });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://food-delivery-api-am5l.onrender.com/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const filteredOrders = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "confirmed": return "bg-blue-100 text-blue-700";
      case "preparing": return "bg-purple-100 text-purple-700";
      case "out_for_delivery": return "bg-indigo-100 text-indigo-700";
      case "delivered": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "delivered": return <CheckCircle className="w-4 h-4" />;
      case "out_for_delivery": return <Truck className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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
          <h1 className="text-3xl font-serif font-bold">Order Management</h1>
          <p className="mt-1 opacity-90">View and manage all customer orders</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button 
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            All ({orders.length})
          </Button>
          <Button 
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
            size="sm"
          >
            Pending ({orders.filter(o => o.status === "pending").length})
          </Button>
          <Button 
            variant={filter === "confirmed" ? "default" : "outline"}
            onClick={() => setFilter("confirmed")}
            size="sm"
          >
            Confirmed ({orders.filter(o => o.status === "confirmed").length})
          </Button>
          <Button 
            variant={filter === "preparing" ? "default" : "outline"}
            onClick={() => setFilter("preparing")}
            size="sm"
          >
            Preparing ({orders.filter(o => o.status === "preparing").length})
          </Button>
          <Button 
            variant={filter === "out_for_delivery" ? "default" : "outline"}
            onClick={() => setFilter("out_for_delivery")}
            size="sm"
          >
            Out for Delivery ({orders.filter(o => o.status === "out_for_delivery").length})
          </Button>
          <Button 
            variant={filter === "delivered" ? "default" : "outline"}
            onClick={() => setFilter("delivered")}
            size="sm"
          >
            Delivered ({orders.filter(o => o.status === "delivered").length})
          </Button>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order._id}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg">Order #{order._id?.slice(-6)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status?.replace("_", " ")}
                      </span>
                    </div>
                    <p className="font-medium">{order.restaurant || "Unknown Restaurant"}</p>
                    <p className="text-sm text-gray-500">Customer: {order.user?.name || "Guest"}</p>
                    <p className="text-sm text-gray-500">Phone: {order.deliveryDetails?.phone}</p>
                    <p className="text-sm text-gray-500">Address: {order.deliveryDetails?.address}</p>
                    <p className="text-sm text-gray-500 mt-1">Ordered at: {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-clay">ETB {order.grandTotal}</p>
                    {order.status !== "delivered" && (
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="mt-2 p-2 border rounded-md text-sm bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}