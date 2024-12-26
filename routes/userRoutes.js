const express = require('express');
const path = require('path');
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

module.exports = router;
