const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: String,
    description: String,
    parentId: String,
    createdAt: String
});

const Category = new mongoose.model('categories', categorySchema);

module.exports = Category;