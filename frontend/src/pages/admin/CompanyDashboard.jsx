import { useState, useEffect } from "react";
import { useAuth } from "../../lib/AuthContext.jsx";
import { Navigate, Link } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Building2, Utensils, Package, DollarSign, Users, TrendingUp, Clock, ShoppingBag } from "lucide-react";

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalFoods: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    totalUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Get stats from admin API
      const statsRes = await fetch("https://food-delivery-api-am5l.onrender.com/api/admin/stats", {
        headers: { "x-auth-token": token }
      });
      const statsData = await statsRes.json();
      
      // Get foods
      const foodsRes = await fetch("https://food-delivery-api-am5l.onrender.com/api/foods", {
        headers: { "x-auth-token": token }
      });
      const foods = await foodsRes.json();
      
      // Get orders
      const ordersRes = await fetch("https://food-delivery-api-am5l.onrender.com/api/orders", {
        headers: { "x-auth-token": token }
      });
      const orders = await ordersRes.json();
      
      // Get users
      const usersRes = await fetch("https://food-delivery-api-am5l.onrender.com/api/users", {
        headers: { "x-auth-token": token }
      });
      const users = await usersRes.json();
      
      // Calculate revenue
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);
      const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
      const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
      
      setStats({
        totalRestaurants: statsData.totalRestaurants || 0,
        totalFoods: foods.length,
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === "pending").length,
        totalRevenue: totalRevenue,
        todayRevenue: todayRevenue,
        totalUsers: users.length
      });
      
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "preparing": return "bg-blue-100 text-blue-700";
      case "delivered": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
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
          <h1 className="text-3xl font-serif font-bold">Company Dashboard</h1>
          <p className="mt-1 opacity-90">Welcome back, {user.name?.split(" ")[0]}!</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Restaurants</p>
                <p className="text-2xl font-bold text-clay">{stats.totalRestaurants}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-500" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Menu Items</p>
                <p className="text-2xl font-bold text-clay">{stats.totalFoods}</p>
              </div>
              <Utensils className="w-8 h-8 text-orange-500" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-clay">{stats.totalOrders}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-green-500" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Orders</p>
                <p className="text-2xl font-bold text-red-500">{stats.pendingOrders}</p>
              </div>
              <Clock className="w-8 h-8 text-red-500" />
            </CardContent>
          </Card>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Today's Revenue</p>
                <p className="text-2xl font-bold text-clay">ETB {stats.todayRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-clay">ETB {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-clay">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <Link to="/admin/restaurants">
            <Button className="w-full bg-clay hover:bg-clay/90">Restaurants</Button>
          </Link>
          <Link to="/admin/menu">
            <Button className="w-full bg-forest hover:bg-forest/90">Menu</Button>
          </Link>
          <Link to="/admin/orders">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Orders</Button>
          </Link>
          <Link to="/admin/drivers">
            <Button className="w-full bg-purple-600 hover:bg-purple-700">Drivers</Button>
          </Link>
        </div>

        {/* Recent Orders */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium">Order ID</th>
                    <th className="p-3 text-left text-sm font-medium">Restaurant</th>
                    <th className="p-3 text-left text-sm font-medium">Amount</th>
                    <th className="p-3 text-left text-sm font-medium">Status</th>
                    <th className="p-3 text-left text-sm font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-gray-500">No orders yet</td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order._id} className="border-t">
                        <td className="p-3 text-sm">#{order._id?.slice(-6)}</td>
                        <td className="p-3 text-sm">{order.restaurant || "N/A"}</td>
                        <td className="p-3 text-sm font-medium">ETB {order.grandTotal}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3 text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}