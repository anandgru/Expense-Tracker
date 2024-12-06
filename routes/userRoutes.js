const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Signup</title>
            <style>
                body { font-family: Arial, sans-serif; }
                form { max-width: 400px; margin: 0 auto; padding: 1em; border: 1px solid #ccc; border-radius: 1em; }
                div + div { margin-top: 1em; }
                label { display: block; margin-bottom: 0.5em; color: #333333; }
                input { border: 1px solid #ccc; font: 1em sans-serif; width: 100%; box-sizing: border-box; padding: 0.5em; }
                button { padding: 0.7em; color: #fff; background-color: #007BFF; border: none; border-radius: 0.5em; cursor: pointer; }
                button:hover { background-color: #0056b3; }
            </style>
        </head>
        <body>
            <h1>Signup Page</h1>
            <form action="/user/signup" method="POST">
                <div>
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div>
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div>
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div>
                    <button type="submit">Signup</button>
                </div>
            </form>
        </body>
        </html>
    `);
});

router.post('/signup', userController.signup);

module.exports = router;
