
const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../config/database');

exports.getLeaderboard = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', [sequelize.fn('SUM', sequelize.col('Expenses.amount')), 'totalExpense']],
            include: [
                {
                    model: Expense,
                    attributes: [],
                },
            ],
            group: ['User.id'],
            order: [[sequelize.literal('totalExpense'), 'DESC']],
        });

        const leaderboard = users.map(user => ({
            id: user.id,
            name: user.name,
            totalExpense: user.dataValues.totalExpense || 0,
        }));

        res.status(200).json({ leaderboard });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Failed to fetch leaderboard.' });
    }
};
