const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: String,
    userId: String,
    cartId: String,
    Customer: String,
    Products:[{
        productId: String,
        name: String,
        price: Number,
        quantity: Number
    }],
    TotalAmount: Number
}) ;

const orderModel = new mongoose.model('orders', orderSchema);

module.exports = orderModel;