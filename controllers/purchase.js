const Razorpay=require('razorpay');
const Order = require('../models/order');
const User = require('../models/user');
const { request } = require('express');


const purchasePremium = async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: 'rzp_test_N7VlD9IFJY3pef',
            key_secret: 'MW2dSOmq0fGpwrP6iToeytoq',
        });

        const amount = 900;
        const currency = 'INR';

        rzp.orders.create({ amount, currency }, async (err, order) => {
            if (err) {
                console.error('Error in order creation:', err);
                return res.status(500).json({ message: 'Error during order creation.' });
            }

            try {
                // Check if req.user is defined
                if (!req.user || !req.user.userId) {
                    return res.status(401).json({ message: 'User not authenticated.' });
                }

                console.log(req.user.userId+' is authenticated  and authorized to order with '+currency);

                // Explicit Order creation
                const newOrder = await Order.create({
                    userId: req.user.userId, // Use req.user.id directly
                    orderId: order.id,
                    status: 'Pending',
                });

                return res.status(201).json({ orderId: newOrder.orderId, key_id: rzp.key_id });
            } catch (dbErr) {
                console.error('Error saving order in database:', dbErr);
                return res.status(500).json({ message: 'Error saving order in database.' });
            }
        });
    } catch (err) {
        console.error('Error in payment:', err);
        return res.status(500).json({ message: 'Error during payment.' });
    }
};


// Controller to update the order status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, paymentId } = req.body;
        if (!paymentId) {
            const order = await Order.findOne({where: {orderId: orderId}});
            await order.update({status: 'Failed'})
            return res.status(400).json({ message: 'OrderId and paymentId are required.' });
        }
        const status='Success';
        const order = await Order.findOne({where: {orderId: orderId}});
        const p1= order.update({paymentId: paymentId, status: status});
        const user = await User.findOne({where: {id: req.user.userId}});
        const p2= user.update({premium:true});
        console.log('User updated');
        await Promise.all([p1,p2]).then(() => {
            console.log('Both updates done');
            return res.status(200).json({ success: true, message: 'Order status updated successfully.' });
        })
    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({ message: 'Error updating order status.' });
    }
};

module.exports = { purchasePremium ,updateOrderStatus};
