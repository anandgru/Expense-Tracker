// routes/expenseRoutes.js

const express = require('express');
const expenseController = require('../controllers/expenseController');
const router = express.Router();

// Route to add a new expense



router.post('/api/expenses', expenseController.addExpense);

// Route to get all expenses for a user
router.get('/api/expenses', expenseController.getExpenses);

// Route to delete an expense by ID
router.delete('/api/expenses/:id', expenseController.deleteExpense);

module.exports = router;
