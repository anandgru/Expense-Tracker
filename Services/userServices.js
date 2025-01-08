exports.getExpenses = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1, limit 10 per page
    try {
        const userId = req.user.userId;

        const { count, rows: expenses } = await Expense.findAndCountAll({
            where: { userId },
            limit: parseInt(limit), // Limit the number of records
            offset: (page - 1) * limit, // Skip records for previous pages
            order: [['createdAt', 'DESC']], // Order by most recent expenses
        });

        res.status(200).json({
            expenses,
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalExpenses: count,
        });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Failed to fetch expenses.' });
    }
};

module.exports = { getExpenses };