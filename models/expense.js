const Sequelize= require('sequelize');
const sequelize= require('../config/database');

const Expense=sequelize.define('Expense',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false,
        validate: {
            isInt: true
        }
    },
    amount:{
        type: Sequelize.DECIMAL(10,2)
    },
    description:{
        type: Sequelize.STRING
    },
    category:{
        type: Sequelize.STRING
    }
});

module.exports = Expense;