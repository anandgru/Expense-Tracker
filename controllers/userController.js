const pool = require('../config/database');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if email already exists
       /* const existingUser = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(409).send('User already exists.');
        }*/


        // Validate password length
        //if (password.length < 8) {
          //  return res.status(400).send('Password must be at least 8 characters long.');
        //}

        // Validate password complexity (at least one uppercase letter, one lowercase letter, one number, and one special character)

        // Hash the password
        //const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        await pool.query(query, [name, email, password]);

        res.send(`
            <h1>Signup Successful</h1>
            <a href="/user/signup">Go back to Signup</a>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
