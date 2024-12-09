const db = require('../config/database');
const bcrypt = require('bcrypt');

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).send('<h3>Email and password are required.</h3>');
  }

  try {
    // Check if the user exists
    const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(404).send('<h3>User does not exist.</h3>');
    }

    // Verify password
    const isPasswordMatched = await bcrypt.compare(password, user[0].password);
    if (!isPasswordMatched) {
      return res.status(401).send('<h3>Password not matched.</h3>');
    }

    // Successful login
    res.send(`<h3>Welcome back, ${user[0].name}!</h3>`);
  } catch (error) {
    console.error(error);
    res.status(500).send('<h3>Internal server error.</h3>');
  }
};



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
