const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const path = require('path');

// Secret key for JWT (should be stored securely, e.g., in environment variables)
const JWT_SECRET = 'abcd';

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists!' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id, email }, JWT_SECRET, { expiresIn: '1h' });

    // Send the token and user information as a response
    res.status(201).json({
      message: 'User created successfully!',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ message: 'Error during signup.' });
  }
};
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    
    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      
      return res.status(404).json({ message: 'User does not exist.' });
    }
    
    // Verify the password
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '1h' });

    // Send the token and user information as a response
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Error during login.' });
  }
};
