import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Menu,
  X,
  Search,
  User,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "../lib/CartContext.jsx";
import { useAuth } from "../lib/AuthContext.jsx";

export function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const scrollToSection = (sectionId) => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const section = document.getElementById(sectionId);
      if (section) section.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  // If admin is logged in, show admin navbar only
  if (user?.role === "admin") {
    return (
      <nav className="sticky top-0 z-50 bg-parchment shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button onClick={handleLogoClick} className="flex items-center cursor-pointer">
              <span className="font-serif text-2xl font-bold">
                <span className="text-clay">DIRE</span>
                <span className="text-forest"> FOODS</span>
              </span>
            </button>

            {/* Admin Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/admin/dashboard" className="text-gray-700 hover:text-clay">Dashboard</Link>
              <Link to="/admin/restaurants" className="text-gray-700 hover:text-clay">Restaurants</Link>
              <Link to="/admin/menu" className="text-gray-700 hover:text-clay">Menu</Link>
              <Link to="/admin/orders" className="text-gray-700 hover:text-clay">Orders</Link>
              <Link to="/admin/drivers" className="text-gray-700 hover:text-clay">Drivers</Link>
            </div>

            {/* Right side icons for admin */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={() => handleNavigation("/admin/dashboard")}
                className="flex items-center gap-1 p-2 rounded-full hover:bg-gray-100"
              >
                <User className="h-5 w-5" />
                <span className="text-sm text-gray-700 hidden sm:inline">{user.name?.split(" ")[0]}</span>
              </button>
              <button onClick={handleLogout} className="text-red-500 text-sm">
                Logout
              </button>
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation for admin */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-3">
                <Link to="/admin/dashboard">Dashboard</Link>
                <Link to="/admin/restaurants">Restaurants</Link>
                <Link to="/admin/menu">Menu</Link>
                <Link to="/admin/orders">Orders</Link>
                <Link to="/admin/drivers">Drivers</Link>
                <button onClick={handleLogout} className="text-red-500 text-left">Logout</button>
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  }

  // User navbar (for non-admin users)
  return (
    <nav className="sticky top-0 z-50 bg-parchment shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <button onClick={handleLogoClick} className="flex items-center cursor-pointer">
            <span className="font-serif text-2xl font-bold">
              <span className="text-clay">DIRE</span>
              <span className="text-forest"> FOODS</span>
            </span>
          </button>

          {/* User Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => scrollToSection("hero")} className="text-gray-700 hover:text-clay">Home</button>
            <button onClick={() => scrollToSection("menu")} className="text-gray-700 hover:text-clay">Menu</button>
            <div className="relative">
              <button onClick={() => setIsCategoriesOpen(!isCategoriesOpen)} className="flex items-center gap-1 text-gray-700 hover:text-clay">
                Categories <ChevronDown className="w-4 h-4" />
              </button>
              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
                  <button onClick={() => { scrollToSection("traditional"); setIsCategoriesOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-clay hover:text-white">Traditional Ethiopian</button>
                  <button onClick={() => { scrollToSection("modern"); setIsCategoriesOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-clay hover:text-white">Modern Foods</button>
                  <button onClick={() => { scrollToSection("drinks"); setIsCategoriesOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-clay hover:text-white">Drinks</button>
                </div>
              )}
            </div>
            <button onClick={() => scrollToSection("about")} className="text-gray-700 hover:text-clay">About</button>
            <button onClick={() => scrollToSection("contact")} className="text-gray-700 hover:text-clay">Contact</button>
          </div>

          {/* Right side icons for user */}
          <div className="hidden md:flex items-center space-x-3">
            <button onClick={() => handleNavigation("/search")} className="p-2 rounded-full hover:bg-gray-100">
              <Search className="h-5 w-5" />
            </button>
            <button onClick={() => handleNavigation("/cart")} className="relative p-2 rounded-full hover:bg-gray-100">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-clay text-white text-xs flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => handleNavigation("/orders")} className="px-3 py-2 rounded-full hover:bg-gray-100 text-sm font-medium">
              My Orders
            </button>
            
            {user ? (
              <>
                <button onClick={() => handleNavigation("/profile")} className="flex items-center gap-1 p-2 rounded-full hover:bg-gray-100">
                  <User className="h-5 w-5" />
                  <span className="text-sm text-gray-700 hidden sm:inline">{user.name?.split(" ")[0]}</span>
                </button>
                <button onClick={handleLogout} className="text-red-500 text-sm hidden sm:block">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-clay text-white rounded-full text-sm font-medium hover:bg-clay/90">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation for user */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <button onClick={() => scrollToSection("hero")}>Home</button>
              <button onClick={() => scrollToSection("menu")}>Menu</button>
              <button onClick={() => scrollToSection("about")}>About</button>
              <button onClick={() => scrollToSection("contact")}>Contact</button>
              <button onClick={() => handleNavigation("/orders")}>My Orders</button>
              <div className="flex items-center gap-4 pt-2">
                <button onClick={() => handleNavigation("/search")}><Search className="h-5 w-5" /></button>
                <button onClick={() => handleNavigation("/cart")}><ShoppingBag className="h-5 w-5" /></button>
                <button onClick={() => handleNavigation("/profile")}><User className="h-5 w-5" /></button>
                {user && <button onClick={handleLogout} className="text-red-500">Logout</button>}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}