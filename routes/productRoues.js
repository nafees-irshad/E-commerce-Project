const express = require('express');
const {createProducts, updateAllProducts, productDetails, deleteProduct}  = require('../controllers/productController');

const router = express.Router();

router.post('/create', createProducts);
router.put('/update-all', updateAllProducts);
router.get('/details/:_id', productDetails)
router.delete('/delete/:_id', deleteProduct)

module.exports = router; 