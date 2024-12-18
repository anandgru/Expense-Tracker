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
    },
    userId:{
        type: Sequelize.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        },
        allowNull: false,
        validate: {
            isInt: true
        }
    }
});

module.exports = Expense;