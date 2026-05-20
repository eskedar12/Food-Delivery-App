import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Package, Plus, Clock, CheckCircle } from "lucide-react";

export function RestaurantDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);

  if (!user || user.role !== 'restaurant_owner') {
    return <Navigate to="/" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold text-clay mb-8">
        {user.restaurantName || 'My Restaurant'} Dashboard
      </h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package /> Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending orders</p>
            ) : (
              orders.map(order => (
                <div key={order._id} className="border-b py-3">
                  <p className="font-semibold">Order #{order._id?.slice(-6)}</p>
                  <p className="text-sm text-gray-500">{order.items?.length} items</p>
                  <p className="text-clay font-bold">ETB {order.grandTotal}</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" className="bg-green-600">Confirm</Button>
                    <Button size="sm" variant="outline">Prepare</Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        
        {/* Restaurant Menu */}
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Menu</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full mb-4"><Plus /> Add New Food</Button>
            {foods.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No food items yet. Click "Add New Food" to get started!</p>
            ) : (
              foods.map(food => (
                <div key={food._id} className="flex justify-between items-center border-b py-2">
                  <span>{food.name}</span>
                  <span className="text-clay font-bold">ETB {food.price}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}