import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Clock, Package, CheckCircle, Loader2 } from "lucide-react";
import { api } from "../lib/api.js";
import { useAuth } from "../lib/AuthContext.jsx";

export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await api.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getStatusIcon = (status) => {
    switch(status) {
      case "pending":
        return <Clock className="w-5 h-5 text-orange-500" />;
      case "preparing":
        return <Package className="w-5 h-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case "pending":
        return "Order Placed";
      case "preparing":
        return "Preparing";
      case "delivered":
        return "Delivered";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-clay" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">No orders yet</h1>
        <p className="text-gray-500 mb-6">You haven't placed any orders</p>
        <Link to="/foods">
          <Button className="bg-clay hover:bg-clay/90">Start Ordering</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold text-clay mb-8">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Order #{order._id?.slice(-6) || order.id?.slice(-6)}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className="text-sm font-medium">{getStatusText(order.status)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>{item.price * item.quantity} ETB</span>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total Paid</span>
                    <span className="text-clay">{order.grandTotal || order.total} ETB</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg mt-3">
                  <p className="text-sm text-gray-600">
                    <strong>Delivery Address:</strong> {order.deliveryDetails?.address}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Phone:</strong> {order.deliveryDetails?.phone}
                  </p>
                  {order.deliveryDetails?.notes && (
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Notes:</strong> {order.deliveryDetails.notes}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}