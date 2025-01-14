const express = require('express');
const helmet = require('helmet');
const fs = require('fs');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/user');
const Order= require('./models/order');  
const ForgotPassword = require('./models/ForgotPassword');
const Expense = require('./models/expense');
const expenseRoutes = require('./routes/expenseRoutes');
const purchaseRoutes = require('./routes/purchase');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const compression = require('compression');
const morgan = require('morgan');

const path = require('path');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'),{flags: 'a'});

const app = express();
//app.use(helmet());

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"], // Allow CDN for Axios
      styleSrc: ["'self'", "https://fonts.googleapis.com"], // Example for fonts
      // Add any other necessary directives here...
    }
  }
}));

app.use(compression());
app.use(morgan('combined',{stream: accessLogStream}));
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
app.use('/purchase', purchaseRoutes);

app.use('/api', leaderboardRoutes);

app.use(expenseRoutes);


User.hasMany(Expense);
Expense.belongsTo(User, {constraints:true, onDelete:'CASCADE'});

User.hasMany(Order);
Order.belongsTo(User,{constraints:true, onDelete:'CASCADE'});

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User,{constraints:true, onDelete:'CASCADE'});

sequelize
.sync()
//.sync({force:true})
.then((result)=>{
    console.log('Database connected');
})
.catch((err)=>{
    console.log('Error connecting to the database', err);
});

// Start Server
app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on http://localhost:3000');
});