import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../lib/CartContext.jsx";
import { useAuth } from "../lib/AuthContext.jsx";
import { api } from "../lib/api.js";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Textarea } from "../components/ui/Textarea.jsx";
import { Store, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    phone: user?.phone || "",
    address: user?.address || "",
    notes: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFee = 50;
  const grandTotal = totalPrice + deliveryFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.phone) {
      toast.error("Please enter your phone number");
      return;
    }
    
    if (!formData.address) {
      toast.error("Please enter your delivery address");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare order data for API
      const orderData = {
        items: items.map(item => ({
          foodId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          restaurant: item.restaurant || "Tafach Foods",
        })),
        totalAmount: totalPrice,
        grandTotal: grandTotal,
        deliveryDetails: formData,
        paymentMethod: "cash",
      };
      
      // Send order to backend
      const order = await api.createOrder(orderData);
      
      // Clear cart and show success
      clearCart();
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Order error:", error);
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-bold text-clay mb-8">Delivery details</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Side - Delivery Form */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+251 91 234 5678"
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House #, street, neighborhood (Kezira / Megala / Sabian)..."
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <Textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Gate code, allergies, etc."
                    rows={4}
                    className="w-full"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-clay hover:bg-clay/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Side - Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Order Items with Restaurant Names */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <span className="font-medium">{item.name} × {item.quantity}</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Store className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{item.restaurant || "Tafach Foods"}</span>
                        </div>
                      </div>
                      <span className="font-semibold">
                        {item.price * item.quantity} ETB
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{totalPrice} ETB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span>{deliveryFee} ETB</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-clay">{grandTotal} ETB</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}