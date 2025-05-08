import mongoose from 'mongoose';
import User from './backend/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function makeOwner() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: 'admin@gmail.com' });
    if (!user) {
      console.log('User not found');
      return;
    }

    user.role = 'owner';
    await user.save();
    console.log('User role updated to owner');

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

makeOwner(); 