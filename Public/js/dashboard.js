// Function to fetch and display expenses on page load
async function fetchExpenses() {
    try {
        const response = await axios.get(`/api/expenses`);
        const expenses = response.data;
        displayExpenses(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        displayMessage('Failed to load expenses.', 'error');
    }
}

// Function to delete expense
async function deleteExpense(id) {
    try {
        await axios.delete(`/api/expenses/${id}`);
        fetchExpenses();
        displayMessage('Expense deleted successfully.');
    } catch (error) {
        console.error('Error deleting expense:', error);
        displayMessage('Failed to delete expense.', 'error');
    }
}

// Function to display expenses in the table
function displayExpenses(expenses) {
    const expenseTableBody = document.getElementById('expense-table-body');
    expenseTableBody.innerHTML = ''; // Clear previous entries

    if (expenses.length === 0) {
        expenseTableBody.innerHTML = '<tr><td colspan="5">No expenses found.</td></tr>';
        return;
    }

    expenses.forEach((expense) => {
        const row = document.createElement('tr');
        
        // Amount
        const amountCell = document.createElement('td');
        amountCell.textContent = `₹${expense.amount}`;
        row.appendChild(amountCell);
        
        // Description
        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = expense.description;
        row.appendChild(descriptionCell);
        
        // Category
        const categoryCell = document.createElement('td');
        categoryCell.textContent = expense.category;
        row.appendChild(categoryCell);
        
        // Added On
        const dateCell = document.createElement('td');
        const date = new Date(expense.created_at);
        dateCell.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        row.appendChild(dateCell);
        
        // Action (Delete button)
        const actionCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = () => deleteExpense(expense.id);
        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);
        
        expenseTableBody.appendChild(row);
    });
}

// Function to handle the form submission for adding a new expense
async function addExpense(event) {
    event.preventDefault();
    const messageElement = document.getElementById('message');
    messageElement.textContent = '';
    messageElement.className = '';

    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    if (!amount || !description || !category) {
        displayMessage('Please fill in all fields.', 'error');
        return;
    }

    try {
        const response = await axios.post('/api/expenses', {
            amount,
            description,
            category
        });
        console.log(response.status);

        if (response.status === 201) {
            //displayMessage('Expense added successfully!', 'success');
            fetchExpenses(); // Fetch updated expenses list
            document.getElementById('expenseForm').reset(); // Clear the form
        }
    } catch (error) {
        console.error('Error adding expense:', error);
        displayMessage('Failed to add expense.', 'error');
    }
}

// Function to display messages
function displayMessage(message, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = type === 'success' ? 'success-message' : 'error-message';
}

// Attach event listener to the form
const expenseForm = document.getElementById('expenseForm');
if (expenseForm) {
    expenseForm.addEventListener('submit', addExpense);
}

// Fetch and display expenses on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    fetchExpenses();
});
