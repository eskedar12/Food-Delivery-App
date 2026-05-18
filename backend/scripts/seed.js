const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
const Food = require('../models/Food');
const Restaurant = require('../models/Restaurant');

// Your actual food data from sampleData.js
const foods = [
  // Sabian Hotel Restaurant - Modern Foods
  {
    name: "Special Pizza",
    description: "Large pizza with beef, chicken, mushrooms, olives, and extra cheese.",
    price: 380,
    category: "modern",
    restaurant: "Sabian Hotel Restaurant",
    rating: 4.7,
    prep_time: "15-20 min",
    is_featured: true,
    image: "https://plus.unsplash.com/premium_photo-1673439304183-8840bd0dc1bf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGl6YXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    name: "Chicken Burger",
    description: "Grilled chicken breast with fresh veggies and garlic mayo. Served with fries.",
    price: 320,
    category: "modern",
    restaurant: "Sabian Hotel Restaurant",
    rating: 4.5,
    prep_time: "15-20 min",
    is_featured: false,
    image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "French Fries",
    description: "Crispy golden fries with special seasoning.",
    price: 80,
    category: "modern",
    restaurant: "Sabian Hotel Restaurant",
    rating: 4.6,
    prep_time: "10 min",
    is_featured: false,
    image: "https://images.unsplash.com/photo-1598679253544-2c97992403ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZnJlbmNoJTIwZnJpZXN8ZW58MHx8MHx8fDA%3D",
  },

  // Samrat Hotel Restaurant - Traditional
  {
    name: "Special Doro Wat",
    description: "Traditional Ethiopian spicy chicken stew with hard-boiled eggs, served with injera.",
    price: 450,
    category: "traditional",
    restaurant: "Samrat Hotel Restaurant",
    rating: 4.9,
    prep_time: "30-40 min",
    is_featured: true,
    image: "https://live.staticflickr.com/5280/7146229703_ecc6f1c4a8_w.jpg",
  },
  {
    name: "Lega Kitfo",
    description: "Minced lean beef seasoned with mitmita and clarified butter. Served with cottage cheese.",
    price: 520,
    category: "traditional",
    restaurant: "Samrat Hotel Restaurant",
    rating: 4.8,
    prep_time: "20-25 min",
    is_featured: true,
    image: "https://live.staticflickr.com/7424/11046084653_af5edc6ce8_n.jpg",
  },
  {
    name: "Beyaynetu Platter",
    description: "Colorful assortment of vegan dishes including shiro, gomen, and misir. Served with injera.",
    price: 320,
    category: "traditional",
    restaurant: "Samrat Hotel Restaurant",
    rating: 4.7,
    prep_time: "25-30 min",
    is_featured: false,
    image: "https://live.staticflickr.com/8330/8087331028_d1c39ba60f_n.jpg",
  },
  {
    name: "Sizzling Beef Tibs",
    description: "Sizzling hot beef cubes sautéed with onions, peppers, and rosemary.",
    price: 380,
    category: "traditional",
    restaurant: "Samrat Hotel Restaurant",
    rating: 4.8,
    prep_time: "20-25 min",
    is_featured: false,
    image: "https://live.staticflickr.com/3316/3473996841_09fc3447c0_m.jpg",
  },

  // Karamara Hotel Restaurant
  {
    name: "lasagna",
    description: "Classic Italian lasagna with layers of pasta, meat sauce, béchamel, and cheese.",
    price: 450,
    category: "modern",
    restaurant: "Karamara Hotel Restaurant",
    rating: 4.6,
    prep_time: "20-25 min",
    is_featured: true,
    image: "https://media.istockphoto.com/id/2208184610/photo/tray-of-homemade-italian-lasagna-at-a-restaurant-of-or-supermarket-self-serve-buffet.jpg?s=612x612&w=0&k=20&c=tE4-v2k5T87XmlmT9IaJHVBtTUpH8ITOtyyteVTKP7Q=",
  },
  {
    name: "Pasta Alfredo",
    description: "Creamy pasta with chicken and mushrooms, topped with parmesan.",
    price: 280,
    category: "modern",
    restaurant: "Karamara Hotel Restaurant",
    rating: 4.4,
    prep_time: "15-20 min",
    is_featured: false,
    image: "https://live.staticflickr.com/6009/5938779977_1e3dabd9db_n.jpg",
  },
  {
    name: "Club Sandwich",
    description: "Triple-layer sandwich with chicken, bacon, lettuce, tomato, and mayo.",
    price: 180,
    category: "modern",
    restaurant: "Karamara Hotel Restaurant",
    rating: 4.5,
    prep_time: "10-15 min",
    is_featured: false,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop",
  },

  // Winta Hotel Restaurant
  {
    name: "Winta Special Shawarma",
    description: "Marinated chicken or beef wrapped in pita with garlic sauce and vegetables.",
    price: 220,
    category: "modern",
    restaurant: "Winta Hotel Restaurant",
    rating: 4.7,
    prep_time: "10-15 min",
    is_featured: true,
    image: "https://images.unsplash.com/photo-1662116765994-1e4200c43589?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2hhd2FybWF8ZW58MHx8MHx8fDA%3D",
  },
  {
    name: "Fish",
    description: "Crispy battered fish served with tartar sauce.",
    price: 300,
    category: "modern",
    restaurant: "Winta Hotel Restaurant",
    rating: 4.5,
    prep_time: "15-20 min",
    is_featured: false,
    image: "https://media.istockphoto.com/id/2207982472/photo/fried-cod-with-asparagus-and-on-plate-grey-background-close-up.jpg?s=612x612&w=0&k=20&c=gPCGrWhi1oNDsC0nUvvPEyJ3MSVbFBoSlqnuEkCgBkM=",
  },

  // Biyyo Hotel Restaurant
  {
    name: "Grilled Chicken",
    description: "Half chicken marinated in special spices, grilled to perfection.",
    price: 350,
    category: "modern",
    restaurant: "Biyyo Hotel Restaurant",
    rating: 4.6,
    prep_time: "20-25 min",
    is_featured: false,
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop",
  },

  // Ras Hotel Restaurant
  {
    name: "Ras Breakfast Special",
    description: "Traditional Ethiopian breakfast with firfir, egg, and tea.",
    price: 150,
    category: "traditional",
    restaurant: "Ras Hotel Restaurant",
    rating: 4.7,
    prep_time: "15-20 min",
    is_featured: false,
    image: "https://live.staticflickr.com/92/277844837_a3ad3ef070_m.jpg",
  },
  {
    name: "Firfir",
    description: "Shredded injera mixed with spicy sauce and clarified butter.",
    price: 120,
    category: "traditional",
    restaurant: "Ras Hotel Restaurant",
    rating: 4.6,
    prep_time: "10-15 min",
    is_featured: false,
    image: "https://live.staticflickr.com/4048/4436611938_a910fd9790_m.jpg",
  },

  // Drinks
  {
    name: "Orange Juice",
    description: "Freshly squeezed orange juice, sweet and tangy. Served chilled.",
    price: 80,
    category: "drinks",
    restaurant: "euroshake",
    rating: 4.9,
    prep_time: "10-15 min",
    is_featured: false,
    image: "https://live.staticflickr.com/3846/15081236866_ddd9596e7f_m.jpg",
  },
  {
    name: "Tej",
    description: "Traditional Ethiopian honey wine, sweet and aromatic. Served chilled.",
    price: 120,
    category: "drinks",
    restaurant: "winta juice",
    rating: 4.7,
    prep_time: "5 min",
    is_featured: false,
    image: "https://live.staticflickr.com/5051/5559099857_8f01e78d8f_m.jpg",
  },
  {
    name: "Avocado Juice",
    description: "Creamy avocado juice blended with milk and sugar. Served chilled.",
    price: 60,
    category: "drinks",
    restaurant: "maki restaurant",
    rating: 4.6,
    prep_time: "5-10 min",
    is_featured: false,
    image: "https://live.staticflickr.com/5518/9063315451_8484c17d75_m.jpg",
  },
  {
    name: "Soft Drinks",
    description: "Coke, Sprite, Fanta, and other soft drinks.",
    price: 40,
    category: "drinks",
    restaurant: "All Restaurants",
    rating: 4.5,
    prep_time: "2-3 min",
    is_featured: false,
    image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400&h=300&fit=crop",
  },
];

// Restaurants data
const restaurants = [
  { name: "Sabian Hotel Restaurant", description: "Modern burgers and fast food", is_active: true },
  { name: "Samrat Hotel Restaurant", description: "Traditional Ethiopian cuisine", is_active: true },
  { name: "Karamara Hotel Restaurant", description: "Pizza and pasta", is_active: true },
  { name: "Winta Hotel Restaurant", description: "Shawarma and fast food", is_active: true },
  { name: "Biyyo Hotel Restaurant", description: "Grills and mixed platters", is_active: true },
  { name: "Ras Hotel Restaurant", description: "Breakfast and traditional", is_active: true },
];

async function seedData() {
  try {
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️  Clearing existing data...');
    await Food.deleteMany({});
    await Restaurant.deleteMany({});
    console.log('✅ Cleared existing data');

    console.log('🏨 Inserting restaurants...');
    const insertedRestaurants = await Restaurant.insertMany(restaurants);
    console.log(`✅ Inserted ${insertedRestaurants.length} restaurants`);

    console.log('🍔 Inserting foods...');
    const insertedFoods = await Food.insertMany(foods);
    console.log(`✅ Inserted ${insertedFoods.length} foods`);

    console.log('\n🎉 Database seeded successfully!');
    console.log(`📊 Summary: ${insertedRestaurants.length} restaurants, ${insertedFoods.length} foods`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedData();