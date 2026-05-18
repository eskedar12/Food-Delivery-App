const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import User model
const User = require('../models/User');

async function createUser() {
  try {
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'test@direfoods.com' });
    if (existingUser) {
      console.log('⚠️ Test user already exists!');
      console.log('📧 Email: test@direfoods.com');
      process.exit(0);
    }

    // Create regular user
    const hashedPassword = await bcrypt.hash('test123', 10);
    const user = new User({
      name: 'Test Customer',
      email: 'test@direfoods.com',
      phone: '0987654321',
      address: 'Kezira District, Dire Dawa',
      password: hashedPassword,
      role: 'user',
    });

    await user.save();
    
    console.log('\n🎉 Test user created successfully!');
    console.log('📧 Email: test@direfoods.com');
    console.log('🔑 Password: test123');
    console.log('👤 Role: User');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

createUser();