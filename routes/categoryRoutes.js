const express = require('express');
const {createCategory, getCategories, getCategory} = require('../controllers/categoryController')
const router = express.Router();

router.post('/create', createCategory);
router.get('/get', getCategories);
router.get('/get', getCategory)
module.exports = router;