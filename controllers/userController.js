const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/userShema');

const router = express.Router();

// **Register a new user** (with password hashing)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check for missing fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Check for existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10); // Generate salt for hashing
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, phone });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// **Login a user** (with password comparison)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password); // Compare hashed password
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Store user data in the session
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone // Add phone number to the user data
    };

    // Login successful, send user data along with success message
    res.status(200).json({ message: 'Login successful!', user: req.session.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
});


// **Get all users** (optional, add authorization middleware if needed)
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting users' });
  }
});



// Server-side route to check authentication status

router.get('/status', (req, res) => {
  // Log session data for debugging
  console.log('Session:', req.session);
  
  // Check if the user is authenticated
  if (req.session.user) {
    // If authenticated, send user data
    res.json({ authenticated: true, user: req.session.user });
  } else {
    // If not authenticated, send false
    res.json({ authenticated: false });
  }
});

router.get('/logout', (req, res) => {
  // Clear user session
  req.session.destroy(err => {
    if (err) {
      console.error('Error logging out:', err);
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.status(200).json({ message: 'You have been logged out successfully. Please log in again to continue.' });
  });
});

// **Get a user by ID** (optional, add authorization middleware if needed)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting user' });
  }
});

// **Update a user by ID** (optional, add authorization middleware if needed)
router.put('/:id', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone }, // Update fields provided in the request body
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user' });
  }
}
);
module.exports =router;