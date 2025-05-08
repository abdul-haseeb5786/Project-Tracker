import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

// Fix admin role
router.post('/fix-admin', async (req, res) => {
  try {
    const admin = await User.findOne({ email: 'admin@gmail.com' });
    if (admin) {
      admin.role = 'owner';
      await admin.save();
      res.json({ message: 'Admin role updated successfully' });
    } else {
      res.status(404).json({ error: 'Admin user not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Set role based on email or user count
    let role;
    if (email === 'admin@gmail.com') {
      role = 'owner';
    } else {
      const userCount = await User.countDocuments();
      role = userCount === 0 ? 'owner' : 'employee';
    }
    
    const user = new User({ 
      email, 
      password: hashedPassword,
      name,
      role
    });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Galat email/password!" });
    }

    // Force admin@gmail.com to be owner
    if (email === 'admin@gmail.com') {
      user.role = 'owner';
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ 
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token missing' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Send user data including role
    res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: 'Invalid token' });
  }
});


export default router;