const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    qty: Number,
    commonDetails: {
        description: String,
        brand: String
    },
    categoryDetails: {
        electronics: {
            specifications:String,
            ram: String,
            storage: String
        },
        clothes:{
            size: String,
            color: String
        }
    }
});

const productModel = new mongoose.model('products', productSchema)

module.exports = productModel;