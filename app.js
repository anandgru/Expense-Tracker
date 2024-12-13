const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const User = require('./models/user');
const expenseRoutes = require('./routes/expenseRoutes');




const path = require('path');


const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

(async () => {
    await User.createTable();
})();


// Routes
app.use('/user', userRoutes);
app.use(expenseRoutes);

// Start Server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
