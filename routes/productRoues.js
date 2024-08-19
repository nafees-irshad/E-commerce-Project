const express = require('express');
const {createProducts, updateAllProducts, productDetails, deleteProduct, getAllProducts}  = require('../controllers/productController');

const router = express.Router();

router.post('/create', createProducts);
router.put('/update-all', updateAllProducts);
router.get('/details/:_id', productDetails)
router.get('/details', getAllProducts)
router.delete('/delete/:_id', deleteProduct)

module.exports = router; 