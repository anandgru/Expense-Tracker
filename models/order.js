const Sequelize= require( 'sequelize');
const sequelize= require('../config/database');

const Order = sequelize.define('order', {
    orderId: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true
    },
    status: {
        type: Sequelize.STRING
    },
    paymentId: Sequelize.STRING,
    userId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
})
module.exports = Order;