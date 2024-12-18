const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/user');
const Expense = require('./models/expense');
const expenseRoutes = require('./routes/expenseRoutes');




const path = require('path');


const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));


// Routes


// Serve the dashboard page
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html')); // Adjust the path to your dashboard.html
});

app.use('/user', userRoutes);
app.use(expenseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User, {constraints:true, onDelete:'CASCADE'});

sequelize.sync()
.then((result)=>{
    console.log('Database connected');
})
.catch((err)=>{
    console.log('Error connecting to the database', err);
});

// Start Server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
