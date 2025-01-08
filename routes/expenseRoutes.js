// routes/expenseRoutes.js

const express = require('express');
const expenseController = require('../controllers/expenseController');
const { getLeaderboard } = require('../controllers/leaderboardController');
const {jwtAuthMiddleware} = require('../jwt');
const router = express.Router();

// Route to add a new expense
router.post('/api/expenses', jwtAuthMiddleware, expenseController.addExpense);

// Route to get all expenses for a user
router.get('/api/expenses', jwtAuthMiddleware, expenseController.getExpenses);

// Route to delete an expense by ID
router.delete('/api/expenses/:id',jwtAuthMiddleware, expenseController.deleteExpense);

router.get('/leaderboard', jwtAuthMiddleware, getLeaderboard);

// Route to download all expenses for a user in text format
router.get('/api/expenses/download', jwtAuthMiddleware, expenseController.downloadExpenses);

module.exports = router;
