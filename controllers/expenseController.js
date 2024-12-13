// controllers/expenseController.js

const db = require('../config/database');

// Controller to add a new expense
exports.addExpense = async (req, res) => {
    const { amount, description, category } = req.body;
    


    if ( !amount || !description || !category) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        
        const insertQuery = 'INSERT INTO expenses ( amount, description, category) VALUES ( ?, ?, ?)';
        await db.execute(insertQuery, [amount, description, category]);
        res.status(201).json({ message: 'Expense added successfully.' });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ message: 'Failed to add expense.' });
    }
};

// Controller to get all expenses for a user
exports.getExpenses = async (req, res) => {
    try {
        const selectQuery = 'SELECT * FROM expenses';
        const [expenses] = await db.execute(selectQuery);
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Failed to fetch expenses.' });
    }
};

// Controller to delete an expense
exports.deleteExpense = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Expense ID is required.' });
    }

    try {
        const deleteQuery = 'DELETE FROM expenses WHERE id = ?';
        await db.execute(deleteQuery, [id]);
        res.status(200).json({ message: 'Expense deleted successfully.' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Failed to delete expense.' });
    }
};
