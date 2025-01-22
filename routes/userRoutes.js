const express = require('express');
const path = require('path');
const {jwtAuthMiddleware}=require('../jwt');
const userController = require('../controllers/userController');
const router = express.Router();


router.post('/login', userController.loginUser);

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "../views","login.html"));
});


router.get('/dashboard',jwtAuthMiddleware, (req, res) => {
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

   router.post('/reset-password/:resetId', userController.resetPassword);

module.exports = router;
