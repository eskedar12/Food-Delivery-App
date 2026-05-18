import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { FoodCard } from "../components/FoodCard.jsx";
import { sampleFoods } from "../lib/sampleData.js";
import { Search, Clock, Mail, Phone, MapPin } from "lucide-react";

export function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const traditionalFoods = sampleFoods.filter(food => food.category === "traditional");
  const modernFoods = sampleFoods.filter(food => food.category === "modern");
  const drinks = sampleFoods.filter(food => food.category === "drinks");
  const featuredFoods = sampleFoods.filter(food => food.is_featured);

  return (
    <div>
      {/* Hero Section - Split Screen */}
      <section id="hero" className="min-h-screen flex">
        {/* Left Side - Text Content */}
        <div className="flex-1 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center">
          <div className="max-w-xl mx-auto px-8">
            <div className="mb-4">
              <span className="text-clay font-semibold text-lg">DIRE DAWA'S FINEST</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-clay mb-4">
              Delivering Authentic Meals, Blending Tradition and Modern Taste
            </h1>

            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search Doro Wat, Kitfo, Burgers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-clay focus:border-transparent bg-white"
                />
              </div>
              <Link to={`/search?q=${searchTerm}`}>
                <Button className="bg-clay hover:bg-clay/90 text-white px-8">
                  Find
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="flex-1 hidden md:block">
          <div className="h-full w-full bg-cover bg-center" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1657807058952-4fc53587819b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGV0aGlvcGlhbiUyMGZvb2R8ZW58MHx8MHx8fDA%3D')"
          }}></div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center text-clay mb-12">Our Menu</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover the best of Ethiopian and international cuisine, made fresh to order
          </p>
        </div>
      </section>

      {/* Traditional Ethiopian Section */}
      <section id="traditional" className="py-16 bg-parchment">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-serif font-bold text-ink">Traditional Ethiopian</h2>
              <p className="text-gray-600 mt-2">Authentic recipes passed down through generations</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {traditionalFoods.map(food => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </div>
      </section>

      {/* Modern Foods Section */}
      <section id="modern" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-serif font-bold text-ink">Modern Foods</h2>
              <p className="text-gray-600 mt-2">Contemporary favorites with a local twist</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modernFoods.map(food => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </div>
      </section>

      {/* Drinks Section */}
      <section id="drinks" className="py-16 bg-parchment">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-serif font-bold text-ink">Drinks</h2>
              <p className="text-gray-600 mt-2">Refreshing beverages to complement your meal</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drinks.map(food => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </div>
      </section>

      {/* Fastest Delivery Banner */}
      <section className="bg-forest py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Clock className="w-8 h-8 text-gold" />
            <span className="text-3xl font-bold text-white">25m</span>
          </div>
          <p className="text-white text-lg">Fastest Delivery In Dire Dawa City</p>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">
            Popular Dishes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredFoods.map(food => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-parchment">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Image */}
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmljeWNsZSUyMGRlbGl2ZXJpbmclMjBmb29kfGVufDB8fDB8fHww"
                alt="Food Delivery"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {/* Right Side - Text */}
            <div>
              <h2 className="text-4xl font-serif font-bold text-clay mb-6">🍽️ About Dire Foods</h2>
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                Dire Foods was created with a passion to deliver delicious meals quickly and reliably, bringing the authentic and diverse flavors of Dire Dawa straight to your doorstep.
              </p>
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                Our name "Dire Foods" reflects the spirit of our city — vibrant, welcoming, and full of rich culinary culture.
              </p>
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                We specialize in fast food delivery, combining traditional Ethiopian-inspired dishes with popular modern meals, ensuring that everyone finds something they love — delivered fresh, hot, and fast.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                At Dire Foods, we believe great food should not only taste amazing but also arrive quickly, anytime you crave it.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-clay">5+</div>
                  <div className="text-sm text-gray-500">Years</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-clay">20+</div>
                  <div className="text-sm text-gray-500">Dishes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-clay">10+</div>
                  <div className="text-sm text-gray-500">Locations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold text-center text-clay mb-12">
            Contact Us
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* LEFT SIDE */}
            <div className="space-y-8">
              {/* Address */}
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-clay mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Address</h3>
                  <p className="text-gray-600">Dire Dawa, Ethiopia</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-clay mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Phone</h3>
                  <p className="text-gray-600">+251 940269784</p>
                  <p className="text-sm text-gray-400">Call us for fast delivery support</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-clay mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p className="text-gray-600">info@direfoods.com</p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Opening Hours</h3>
              <div className="space-y-3 text-gray-600">
                <p className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>8:00 AM - 10:30 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>Saturday - Sunday</span>
                  <span>9:00 AM - 11:00 PM</span>
                </p>
              </div>
              <div className="mt-6 p-4 bg-white rounded-lg border">
                <p className="text-sm text-gray-600">
                  🚚 <b>Dire Foods</b> delivers fresh meals fast across the city.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}