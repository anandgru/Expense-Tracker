// controllers/expenseController.js

//const sequelize = require('../config/database');
const Expense = require('../models/expense');
const User = require('../models/user');

// Controller to add a new expense
exports.addExpense = async (req, res) => {
    const { amount, description, category } = req.body;
    

    if ( !amount || !description || !category) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const userId = req.user.userId;
        const user = await User.findByPk(userId);
        user.increment('totalExpenses', { by: amount });
        user.save();
        const expense = await Expense.create({ amount, description, category, userId});
        res.status(201).json(expense);
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ message: 'Failed to add expense.' });
    }
};

// Controller to get all expenses for a user
exports.getExpenses = async (req, res) => {
    try {
        const userId = req.user.userId;
        const expenses = await Expense.findAll({where : {userId: userId}});
        const user=await User.findByPk(userId);

        res.status(200).json({expenses: expenses, premium: user.premium});
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Failed to fetch expenses. 1' });
    }
};

// Controller to delete an expense
exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the expense
        const deletedExpense = await Expense.destroy({
            where: { id }
        });

        if (deletedExpense) {
            return res.status(200).json({ message: 'Expense deleted successfully.' });
        } else {
            return res.status(404).json({ message: 'Expense not found.' });
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
        return res.status(500).json({ message: 'Failed to delete expense.' });
    }
};
