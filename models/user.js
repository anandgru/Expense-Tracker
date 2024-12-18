const Sequelize= require('sequelize');
const sequelize = require('../config/database');

const User =sequelize.define('User',{
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
    }
});

module.exports = User;