const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: String,
    products:[{
        productId: String,
        name: String,
        price:String,
        quantity: Number,
    }]
});

const cartModel = new mongoose.model('cartItems', cartSchema);

module.exports = cartModel;