import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { Input } from "../components/ui/Input.jsx";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, LogOut } from "lucide-react";

export function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleUpdate = () => {
    updateProfile({ name, phone, address });
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold text-clay mb-8">My Profile</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-clay rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-xl font-bold">{user.name || "User"}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <div className="mt-6 space-y-2">
                  <button onClick={() => setIsEditing(!isEditing)} className="w-full text-clay hover:underline text-sm">
                    {isEditing ? "Cancel Editing" : "Edit Profile"}
                  </button>
                  <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 text-sm">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" /> Email Address
                </label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" /> Full Name
                </label>
                {isEditing ? (
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-2 rounded">{name || "Not provided"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" /> Phone Number
                </label>
                {isEditing ? (
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone number" />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-2 rounded">{phone || "Not provided"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" /> Delivery Address
                </label>
                {isEditing ? (
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your delivery address" />
                ) : (
                  <p className="text-gray-900 bg-gray-50 p-2 rounded">{address || "Not provided"}</p>
                )}
              </div>

              {isEditing && (
                <Button onClick={handleUpdate} className="w-full bg-forest hover:bg-forest/90 mt-4">
                  Save Changes
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}