
const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../config/database');

exports.getLeaderboard = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'totalExpenses'],
            order: [['totalExpenses', 'DESC']],
        });

        res.status(200).json({ users: users });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Failed to fetch leaderboard.' });
    }
};
