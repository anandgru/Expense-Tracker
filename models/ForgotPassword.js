const Sequelize= require('sequelize');
const sequelize= require('../config/database');

const ForgotPassword=sequelize.define('ForgotPassword',{
    id:{
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
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
    },
    isActive:{
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }
});
module.exports = ForgotPassword;