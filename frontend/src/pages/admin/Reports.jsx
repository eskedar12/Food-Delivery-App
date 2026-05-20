import { useState, useEffect } from "react";
import { useAuth } from "../../lib/AuthContext.jsx";
import { Navigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/Card.jsx";
import { MapPin, Navigation, Clock, DollarSign, Route } from "lucide-react";

export default function TodaysRoute() {
  const { user } = useAuth();
  const [routeStops, setRouteStops] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [loading, setLoading] = useState(true);

  if (!user || user.role !== "driver") {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchRouteData();
  }, []);

  const fetchRouteData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://food-delivery-api-am5l.onrender.com/api/driver/todays-route", {
        headers: { "x-auth-token": token }
      });
      const data = await res.json();
      setRouteStops(data.stops || getSampleStops());
      setTotalDistance(data.totalDistance || 12.5);
      setEstimatedTime(data.estimatedTime || 65);
    } catch (error) {
      // Sample data for demo
      setRouteStops(getSampleStops());
      setTotalDistance(12.5);
      setEstimatedTime(65);
    } finally {
      setLoading(false);
    }
  };

  const getSampleStops = () => [
    { id: 1, type: "pickup", restaurant: "Sabian Hotel", address: "Sabian Area", time: "10:00 AM", duration: "15 min", fee: 50 },
    { id: 2, type: "dropoff", customer: "John Doe", address: "Kezira District, House #142", time: "10:30 AM", duration: "20 min", fee: 50 },
    { id: 3, type: "pickup", restaurant: "Samrat Hotel", address: "Samrat Area", time: "11:15 AM", duration: "10 min", fee: 50 },
    { id: 4, type: "dropoff", customer: "Sarah Smith", address: "Megala Area, Block 3", time: "11:45 AM", duration: "20 min", fee: 50 },
  ];

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
          <h1 className="text-2xl font-serif font-bold">Today's Route</h1>
          <p className="text-sm opacity-90">Optimized delivery sequence</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Navigation className="w-8 h-8 text-clay" />
              <div>
                <p className="text-sm text-gray-500">Total Distance</p>
                <p className="text-xl font-bold">{totalDistance} km</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="w-8 h-8 text-clay" />
              <div>
                <p className="text-sm text-gray-500">Estimated Time</p>
                <p className="text-xl font-bold">{estimatedTime} min</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-clay" />
              <div>
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-xl font-bold">ETB {routeStops.reduce((sum, stop) => sum + (stop.fee || 0), 0)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Route Stops */}
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Route className="text-clay" /> Optimized Sequence
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-300"></div>

          <div className="space-y-6">
            {routeStops.map((stop, index) => (
              <div key={stop.id} className="relative flex gap-4">
                {/* Step number */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 shrink-0 ${
                  stop.type === "pickup" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                }`}>
                  <span className="font-bold">{index + 1}</span>
                </div>
                
                {/* Stop details */}
                <Card className="flex-1">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {stop.type === "pickup" ? (
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">PICKUP</span>
                          ) : (
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">DROPOFF</span>
                          )}
                          <span className="text-sm text-gray-500">{stop.time}</span>
                        </div>
                        <p className="font-semibold">{stop.restaurant || stop.customer}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {stop.address}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">⏱️ Est. {stop.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-clay font-bold">ETB {stop.fee}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Route Tips */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Route Tips</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Start from your current location</li>
              <li>• Follow the optimized sequence for best efficiency</li>
              <li>• Traffic is light between 10 AM - 11 AM</li>
              <li>• Keep this route open for navigation</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}