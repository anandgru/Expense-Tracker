// controllers/expenseController.js

//const sequelize = require('../config/database');
const Expense = require('../models/expense');
const User = require('../models/user');

// Controller to add a new expense
const { sequelize } = require('../config/database'); // Assuming sequelize instance is exported in your models

exports.addExpense = async (req, res) => {
    const { amount, description, category } = req.body;

    if (!amount || !description || !category) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const transaction = await sequelize.transaction(); // Start a transaction
    try {
        const userId = req.user.userId;

        // Find the user and increment total expenses within the transaction
        const user = await User.findByPk(userId, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ message: 'User not found.' });
        }

        await user.increment('totalExpenses', { by: amount, transaction });

        // Create the expense within the transaction
        const expense = await Expense.create(
            { amount, description, category, userId },
            { transaction }
        );

        await transaction.commit(); // Commit the transaction
        res.status(201).json(expense);
    } catch (error) {
        await transaction.rollback(); // Rollback the transaction in case of error
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

        if (!id) {
            return res.status(400).json({ message: 'Expense ID is required.' });
        }
        const userId = req.user.userId;

        const transaction = await sequelize.transaction();
        // Find the user and decrement total expenses within the transaction
        const user = await User.findByPk(userId, { transaction });
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ message: 'User not found.' });
        }
        const expense = await Expense.findByPk(id, { transaction });

        await user.decrement('totalExpenses', { by: expense.amount, transaction });

        // Find and delete the expense within the transaction
        await Expense.destroy({
            where: { id },
            transaction
        });

        await transaction.commit();
        res.status(200).json({ message: 'Expense deleted successfully.' });

    } catch (error) {
        console.error('Error deleting expense:', error);
        return res.status(500).json({ message: 'Failed to delete expense.' });
    }
};
