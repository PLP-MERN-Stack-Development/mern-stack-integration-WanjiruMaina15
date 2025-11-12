
const express = require('express');
const router = express.Router();
const User = require('../models/Auth'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_fallback_key'; 

// user registration route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already taken' });
    }
    
 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
  
    const newUser = new User({ username, email, password: hashedPassword }); 
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// --- 2. USER LOGIN 
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    
    const isMatch = await bcrypt.compare(password, user.password); 
    if (!isMatch) {
      
      return res.status(400).json({ message: 'Invalid credentials' }); 
    }

    const payload = { 
      user: {
        id: user.id 
      }
    };
    
    const token = jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    
    res.json({ 
        message: 'Login successful', 
        token,
       
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
           
        }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// --- 3. DELETE USER (Path remains the same, but should be secured by middleware) ---
router.delete('/:id', async (req, res) => {
  // ⚠️ NOTE: In a real app, this route would require JWT authentication middleware
  // to ensure only the owner or an admin can delete the account.
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;