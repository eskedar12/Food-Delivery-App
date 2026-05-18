import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useCart } from "../lib/CartContext.jsx";
import { useAuth } from "../lib/AuthContext.jsx";
import { Button } from "./ui/Button.jsx";

export function Navbar() {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    // If we're not on home page, navigate to home first then scroll
    if (location.pathname !== "/") {
      navigate("/");
      // Wait for navigation to complete then scroll
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false);
      }
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-parchment shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button onClick={() => handleNavigation("/")} className="flex items-center cursor-pointer">
            <span className="font-serif text-2xl font-bold">
              <span className="text-clay">DIRE</span>
              <span className="text-forest"> FOODS</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Home - scrolls to hero section */}
            <button onClick={() => scrollToSection("hero")} className="text-gray-700 hover:text-clay transition font-medium cursor-pointer">
              Home
            </button>
            
            {/* Menu - scrolls to menu section */}
            <button onClick={() => scrollToSection("menu")} className="text-gray-700 hover:text-clay transition font-medium cursor-pointer">
              Menu
            </button>
            
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                onMouseEnter={() => setIsCategoriesOpen(true)}
                className="flex items-center gap-1 text-gray-700 hover:text-clay transition font-medium cursor-pointer"
              >
                Categories
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isCategoriesOpen && (
                <div
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  <button
                    onClick={() => {
                      scrollToSection("traditional");
                      setIsCategoriesOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-clay hover:text-white transition cursor-pointer"
                  >
                    Traditional Ethiopian
                  </button>
                  <button
                    onClick={() => {
                      scrollToSection("modern");
                      setIsCategoriesOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-clay hover:text-white transition cursor-pointer"
                  >
                    Modern Foods
                  </button>
                  <button
                    onClick={() => {
                      scrollToSection("drinks");
                      setIsCategoriesOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-clay hover:text-white transition cursor-pointer"
                  >
                    Drinks
                  </button>
                </div>
              )}
            </div>
            
            {/* About - scrolls to about section */}
            <button onClick={() => scrollToSection("about")} className="text-gray-700 hover:text-clay transition font-medium cursor-pointer">
              About
            </button>
            
            {/* Contact - scrolls to contact section */}
            <button onClick={() => scrollToSection("contact")} className="text-gray-700 hover:text-clay transition font-medium cursor-pointer">
              Contact
            </button>
          </div>

          {/* Right side icons */}
          <div className="hidden md:flex items-center space-x-3">
            <button onClick={() => handleNavigation("/search")}>
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            </button>
            <button onClick={() => handleNavigation("/cart")} className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-clay text-white text-xs flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </button>
            <button onClick={() => handleNavigation("/orders")}>
              <Button variant="ghost" size="sm">
                My Orders
              </Button>
            </button>
            <Link to="/profile" className="flex items-center gap-2">
  <Button variant="ghost" size="icon">
    <User className="h-5 w-5" />
  </Button>
  {user && (
    <span className="text-sm text-gray-700 hidden lg:inline">
      {user.name?.split(" ")[0]}
    </span>
  )}
</Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <button onClick={() => scrollToSection("hero")} className="text-left text-gray-700 hover:text-clay transition cursor-pointer">
                Home
              </button>
              <button onClick={() => scrollToSection("menu")} className="text-left text-gray-700 hover:text-clay transition cursor-pointer">
                Menu
              </button>
              <button onClick={() => scrollToSection("traditional")} className="text-left text-gray-700 hover:text-clay transition pl-4 cursor-pointer">
                • Traditional Ethiopian
              </button>
              <button onClick={() => scrollToSection("modern")} className="text-left text-gray-700 hover:text-clay transition pl-4 cursor-pointer">
                • Modern Foods
              </button>
              <button onClick={() => scrollToSection("drinks")} className="text-left text-gray-700 hover:text-clay transition pl-4 cursor-pointer">
                • Drinks
              </button>
              <button onClick={() => scrollToSection("about")} className="text-left text-gray-700 hover:text-clay transition cursor-pointer">
                About
              </button>
              <button onClick={() => scrollToSection("contact")} className="text-left text-gray-700 hover:text-clay transition cursor-pointer">
                Contact
              </button>
              
              {/* User info in mobile menu */}
              {user && (
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Logged in as:</p>
                  <p className="font-semibold text-clay">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              )}
              
              <div className="flex items-center gap-4 pt-2">
                <button onClick={() => handleNavigation("/search")}>
                  <Search className="h-5 w-5" />
                </button>
                <button onClick={() => handleNavigation("/cart")} className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-clay text-white text-xs flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
                <button onClick={() => handleNavigation("/orders")}>
                  <span className="text-sm">Orders</span>
                </button>
                <button onClick={() => handleNavigation("/profile")}>
                  <User className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}