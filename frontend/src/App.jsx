import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { CartProvider } from "./lib/CartContext.jsx";
import { AuthProvider } from "./lib/AuthContext.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { Footer } from "./components/Footer.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { FoodsPage } from "./pages/FoodsPage.jsx";
import { FoodDetailPage } from "./pages/FoodDetailPage.jsx";
import { CartPage } from "./pages/CartPage.jsx";
import { CheckoutPage } from "./pages/CheckoutPage.jsx";
import { OrdersPage } from "./pages/OrdersPage.jsx";
import { SearchPage } from "./pages/SearchPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-parchment">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/foods" element={<FoodsPage />} />
                <Route path="/food/:foodId" element={<FoodDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login" element={<AuthPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" richColors />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;