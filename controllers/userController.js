const pool = require('../config/database');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        await pool.query(query, [name, email, hashedPassword]);

        res.send(`
            <h1>Signup Successful</h1>
            <a href="/user/signup">Go back to Signup</a>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to register user.');
    }
};
