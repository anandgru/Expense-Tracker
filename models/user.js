const Sequelize= require('sequelize');
const sequelize = require('../config/database');

const User =sequelize.define('User',{
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
    name:{
        type: Sequelize.STRING
    },
    email:{
        type: Sequelize.STRING,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password:{
        type: Sequelize.STRING
    },
    premium:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

module.exports = User;