const pool = require('../config/database');

const User = {
    async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            );
            
        `;

        try {
            await pool.query(query);
            console.log("Users table created or already exists.");
        } catch (error) {
            console.error("Error creating users table:", error.message);
        }
    }
};

module.exports = User;