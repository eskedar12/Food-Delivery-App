import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Users, ShoppingBag, Utensils, Truck, DollarSign, Package, Plus, Edit, Trash2 } from "lucide-react";

export function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalFoods: 0,
    totalDrivers: 0,
    totalRevenue: 0,
  });
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold text-clay mb-8">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <ShoppingBag className="w-8 h-8 text-clay mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
            <p className="text-sm text-gray-500">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-clay mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
            <p className="text-sm text-gray-500">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Utensils className="w-8 h-8 text-clay mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.totalFoods}</p>
            <p className="text-sm text-gray-500">Food Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Truck className="w-8 h-8 text-clay mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.totalDrivers}</p>
            <p className="text-sm text-gray-500">Active Drivers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 text-clay mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.totalRevenue}</p>
            <p className="text-sm text-gray-500">Revenue (ETB)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full">Manage Foods</Button>
            <Button className="w-full">Manage Restaurants</Button>
            <Button className="w-full">Manage Users</Button>
            <Button className="w-full">Manage Drivers</Button>
            <Button className="w-full">View All Orders</Button>
          </CardContent>
        </Card>
        
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent orders</p>
            ) : (
              orders.map(order => (
                <div key={order._id} className="border-b py-2">
                  <p>Order #{order._id?.slice(-6)}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}