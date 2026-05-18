const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import User model
const User = require('../models/User');

async function createAdmin() {
  try {
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@direfoods.com' });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists!');
      console.log('📧 Email: admin@direfoods.com');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Admin User',
      email: 'admin@direfoods.com',
      phone: '0912345678',
      address: 'Dire Dawa, Ethiopia',
      password: hashedPassword,
      role: 'admin',
    });

    await admin.save();
    
    console.log('\n🎉 Admin user created successfully!');
    console.log('📧 Email: admin@direfoods.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: Admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

createAdmin();