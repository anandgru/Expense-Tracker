const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const path = require('path');
const uuid = require('uuid');
const ForgotPassword = require('../models/ForgotPassword');
const Sib = require('sib-api-v3-sdk');
require('dotenv').config();


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


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }
  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
  
    if (!user) {
     return res.status(404).json({ message: 'User not found.' });
    }
  
    const resetId = generateUUID();
  
    // Create a new forgot password request
    await ForgotPassword.create({ id: resetId, userId: user.id, isActive: true });
  
    const resetUrl = `http://localhost:3000/user/reset-password/${resetId}`;
  
    // Send the password reset email
   // await sendPasswordResetEmail(email, resetUrl);

const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;
const tranEmailApi = new Sib.TransactionalEmailsApi();

const sender = {
    email: 'anandverma6225@gmail.com',
    name: 'Anand'
};
  const emailBody = `
    Hi [User Name] (if you have it),

    You requested a password reset for your account.
    Click the following link to reset your password:
    [Reset Link]([${resetUrl})

    If you did not request a password reset, please ignore this email.

    Sincerely,

    The [Your Company Name] Team
  `;

  const receivers = [{ email: email }];

  const sendSmtpEmail = {
    sender: sender, // Use the correctly formatted sender object
    to: receivers,
    subject: 'Reset Password',
    htmlContent: emailBody,
  };
  
   await tranEmailApi.sendTransacEmail(sendSmtpEmail);
   console.log('Password reset email sent successfully');
   res.status(200).json({ message: 'Password reset link sent successfully. Please check your inbox.' });
  } 
  catch (error) {
    console.error('Error sending password reset email:', error);
  }
}

exports.resetPassword = async (req, res) => {
  const resetId = req.params.resetId;
  const newPassword = req.body.newPassword;

  if (!resetId ||!newPassword) {
    return res.status(400).json({ message: 'Reset ID and password are required.' });
  }
  try {
          const request = await ForgotPassword.findOne({ where: { id: resetId, isActive: true } });
          if (!request) {
            return res.status(400).json({ message: 'Invalid or expired reset link.' });
          }
       
          const userId = request.userId;
          const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the password
       
          await User.update({ password: hashedPassword }, { where: { id: userId } });
          await ForgotPassword.update({ isActive: false }, { where: { id: resetId } });
       
          res.status(200).json({ message: 'Password updated successfully.' });
       
        } catch (error) {
          console.error('Error updating password:', error);
          res.status(500).json({ message: 'Failed to update password.' });
        }

}

function generateUUID() {
  return uuid.v4();
 }