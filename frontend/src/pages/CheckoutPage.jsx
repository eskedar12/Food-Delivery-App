import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../lib/CartContext.jsx";
import { useAuth } from "../lib/AuthContext.jsx";
import { api } from "../lib/api.js";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Textarea } from "../components/ui/Textarea.jsx";
import { Store, Loader2, CreditCard, Landmark, Bike } from "lucide-react";
import { toast } from "sonner";

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    phone: user?.phone || "",
    address: user?.address || "",
    notes: "",
    paymentMethod: "cash", // Default payment method
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFee = 50;
  const grandTotal = totalPrice + deliveryFee;

  // Payment method options
  const paymentMethods = [
    { value: "telebirr", label: "Telebirr", icon: <CreditCard className="w-4 h-4" /> },
    { value: "awash", label: "Awash Bank", icon: <Landmark className="w-4 h-4" /> },
    { value: "cash", label: "Cash on Delivery", icon: <Bike className="w-4 h-4" /> },
  ];

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
        deliveryDetails: {
          phone: formData.phone,
          address: formData.address,
          notes: formData.notes,
        },
        paymentMethod: formData.paymentMethod,
        status: "pending",
      };
      
      // Send order to backend
      const order = await api.createOrder(orderData);
      
      // Show payment success message based on method
      const paymentMessages = {
        telebirr: "✅ Payment successful via Telebirr! Your order has been placed.",
        awash: "✅ Payment successful via Awash Bank! Your order has been placed.",
        cash: "✅ Order placed! Pay ETB " + grandTotal + " on delivery.",
      };
      
      toast.success(paymentMessages[formData.paymentMethod] || "Order placed successfully!");
      
      // Clear cart and redirect
      clearCart();
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
                
                {/* Payment Method Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clay focus:border-transparent bg-white appearance-none cursor-pointer"
                      required
                    >
                      {paymentMethods.map((method) => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {/* Payment method hint */}
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.paymentMethod === "telebirr" && "You will be redirected to Telebirr payment page"}
                    {formData.paymentMethod === "awash" && "You will be redirected to Awash Bank payment page"}
                    {formData.paymentMethod === "cash" && "Pay when your order arrives"}
                  </p>
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
                      Processing...
                    </>
                  ) : (
                    `Place Order - ETB ${grandTotal}`
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
                
                {/* Payment Method Summary */}
                <div className="bg-gray-50 p-3 rounded-lg mt-2">
                  <p className="text-sm text-gray-600">
                    <strong>Payment Method:</strong>{" "}
                    {paymentMethods.find(m => m.value === formData.paymentMethod)?.label}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}