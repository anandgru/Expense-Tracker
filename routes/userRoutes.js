const express = require('express');
const path = require('path');
const ForgotPassword = require('../models/ForgotPassword');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const userController = require('../controllers/userController');
const router = express.Router();


router.post('/login', userController.loginUser);

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "../views","login.html"));
});


router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, "../views","dashboard.html"));

});
router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, "../views","signup.html"));
});

router.post('/signup', userController.signup);

router.get('/forgot-password', (req, res) => {
    res.sendFile(path.join(__dirname, "../views","forgot-password.html"));
});

router.post('/forgot-password', userController.forgotPassword);

router.get('/reset-password/:resetId',(req,res)=>{
    res.sendFile(path.join(__dirname, "../views","reset-password.html"));
} );
//     async (req, res) => {const resetId = req.params.resetId;

//     try {
//      // Check if the request exists and is active
//      const request = await ForgotPassword.findOne({ where: { id: resetId, isActive: true } });
   
//      if (!request) {
//       return res.status(404).json({ message: 'Invalid or expired reset link.' });
//      }
   
//      // Render a form to update the password
//      res.send(`
//        <form action="/user/update-password" method="POST">
//          <input type="hidden" name="resetId" value="${resetId}">
//          <input type="password" name="newPassword" placeholder="New Password" required>
//          <button type="submit">Update Password</button>
//        </form>
//      `);
//     } catch (error) {
//      console.error('Error verifying forgot password request:', error);
//      res.status(500).json({ message: 'Internal server error.' });
//     }
//    });

   router.post('/reset-password/:resetId', userController.resetPassword);
//      async (req, res) => {
//     const { resetId, newPassword } = req.body;
   
//     try {
//       const request = await ForgotPassword.findOne({ where: { id: resetId, isActive: true } });
//       if (!request) {
//         return res.status(400).json({ message: 'Invalid or expired reset link.' });
//       }
   
//       const userId = request.userId;
//       const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the password
   
//       await User.update({ password: hashedPassword }, { where: { id: userId } });
//       await ForgotPassword.update({ isActive: false }, { where: { id: resetId } });
   
//       res.status(200).json({ message: 'Password updated successfully.' });
   
//     } catch (error) {
//       console.error('Error updating password:', error);
//       res.status(500).json({ message: 'Failed to update password.' });
//     }
//    });

module.exports = router;
