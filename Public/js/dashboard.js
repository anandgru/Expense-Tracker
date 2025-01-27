// Function to fetch and display expenses on page load
const token = localStorage.getItem('authToken');
let currentPage = 1; // Track the current page
let totalPages = 1;
let expensesPerPage = localStorage.getItem('expensesPerPage') || 10;
async function fetchExpenses(page=1) {
    try {
        if (!token) {
            throw new Error('No token found.');
        }

        const response = await axios.get(`/api/expenses?page=${page}&limit=${expensesPerPage}`,{
            headers: { Authorization: `Bearer ${token}` },
        });
        const { premium, expenses, currentPage: serverPage, totalPages: serverTotalPages } = response.data;

        currentPage = serverPage;
        totalPages = serverTotalPages;
        if(premium) {
        document.getElementById('buy-premium').style.display = 'none'; // Hide the button
        document.getElementById('show-leaderboard').style.display = 'block'; 
        document.getElementById('download').style.display = 'block'; 
        document.getElementById('premium-status').textContent = '🌟 Premium Member';
        }
        updatePaginationControls();

        displayExpenses(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        displayMessage('Failed to load expenses.', 'error');
    }
}

document.getElementById('download').addEventListener('click', async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Authentication token not found. Please log in.');
        return;
    }
    try {
        const response = await axios.get('/api/expenses/download', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
            const fileURL = response.data.fileURL;

            // Check if file URL exists
            if (fileURL) {
                const link = document.createElement('a');
                link.href = fileURL;
                link.download = 'Expense.txt'; // Name of the file to be downloaded
                
                link.click();
            } else {
                console.error('No file URL received.');
                displayMessage('Failed to download expenses. No URL received.', 'error');
            }
        } else {
            console.error('Failed to download expenses:', response.data.message);
            displayMessage('Failed to download expenses.', 'error');
        }
    } catch (error) {
        console.error('Error downloading expenses:', error);
        displayMessage('Failed to download expenses.', 'error');
    }
});



document.getElementById('show-leaderboard').addEventListener('click', async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Authentication token not found. Please log in.');
        return;
    }

    try {
        const response = await axios.get('/api/leaderboard', {
            headers: { Authorization: `Bearer ${token}` },
        });

        const leaderboard = response.data.users;
        const leaderboardTableBody = document.getElementById('leaderboard-table').querySelector('tbody');
        leaderboardTableBody.innerHTML = ''; // Clear previous leaderboard

        leaderboard.forEach((user, index) => {
            const row = document.createElement('tr');

            const rankCell = document.createElement('td');
            rankCell.textContent = index + 1;
            row.appendChild(rankCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = user.name;
            row.appendChild(nameCell);

            const expenseCell = document.createElement('td');
            expenseCell.textContent = `₹${user.totalExpenses}`;
            row.appendChild(expenseCell);

            leaderboardTableBody.appendChild(row);
        });

        // Show the leaderboard
        document.getElementById('leaderboard-container').style.display = 'block';
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        alert('Failed to fetch leaderboard.');
    }
});


// Function to delete expense
async function deleteExpense(id) {
    try {
        if (!token) {
            throw new Error('No token found.');
        }

        // Send the DELETE request with the Authorization header
        await axios.delete(`/api/expenses/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
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
        const date = new Date(expense.createdAt);
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
        }, 
        {
            headers: {
                Authorization: `Bearer ${token}` // Add the token in the Authorization header
            }
        }
    );
        console.log(response.status);

        if (response.status === 201) {
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
    setupUserPreferences();
    fetchExpenses();

});

document.getElementById('buy-premium').addEventListener('click', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
        displayMessage('Authentication token not found. Please log in again.', 'error');
        return;
    }
    try {
        const response = await axios.get('/purchase/premium', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log(response.data.orderId, response.data.key_id);
        const options = {
            key: response.data.key_id,
            order_id: response.data.orderId,
            handler: async function (response) {
                try {
                    await axios.post('/purchase/updateOrder', {
                        orderId: options.order_id,
                        paymentId: response.razorpay_payment_id,
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    alert('Transaction Successful! You are now a premium user.');
                    fetchExpenses();
                } catch (err) {
                    console.error('Error updating order:', err);
                    alert('Transaction was successful, but we could not verify it. Please contact support.');
                }
            },
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();

        rzp1.on('payment.failed', async function (response) {
            try {
                await axios.post('/purchase/updateOrder', {
                    orderId: options.order_id,
                    paymentId: null, // Indicate failure
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert('Transaction failed! Order status updated.');
            } catch (error) {
                console.error('Error updating failed order:', error);
                alert('Transaction failed, but we could not update the order status. Please contact support.');
            }
        });
    } catch (error) {
        console.error('Error during premium purchase:', error);
        displayMessage('Failed to initiate premium purchase.', 'error');
    }
});

function updatePaginationControls() {
    const paginationContainer = document.getElementById('pagination-controls');
    paginationContainer.innerHTML = ''; // Clear existing buttons

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => fetchExpenses(currentPage-1);
        paginationContainer.appendChild(prevButton);
    }

    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    paginationContainer.appendChild(pageInfo);

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => fetchExpenses(currentPage+1);
        paginationContainer.appendChild(nextButton);
    }
}
function setupUserPreferences() {
    const preferencesContainer = document.getElementById('preferences-container');

    const label = document.createElement('label');
    label.textContent = 'Expenses per page:';
    preferencesContainer.appendChild(label);

    const select = document.createElement('select');
    [5, 8, 10, 20, 40].forEach((option) => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        if (parseInt(expensesPerPage) === option) {
            opt.selected = true;
        }
        select.appendChild(opt);
    });
    preferencesContainer.appendChild(select);

    select.onchange = () => {
        expensesPerPage = select.value;
        localStorage.setItem('expensesPerPage', expensesPerPage); // Save preference
        fetchExpenses(1); // Fetch the first page with updated limit
    };
}

document.getElementById('logout-button').onclick = () =>{
    localStorage.removeItem('authToken');
    window.location.href = '/user/login'; // Redirect to login page after logout
}