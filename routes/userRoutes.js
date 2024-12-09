const express = require('express');
const path = require('path');
const userController = require('../controllers/userController');
const router = express.Router();


router.post('/login', userController.loginUser);

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "../views","login.html"));
});

//app.use(express.static(path.join(__dirname, "public")));
router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, "../views","signup.html"));
});

router.post('/signup', userController.signup);

module.exports = router;
