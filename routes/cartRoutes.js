const express = require('express');
const {updateCart, getCart, deleteCart} = require('../controllers/cartController');

const router = express.Router();

router.post('/update', updateCart);
router.get('/view/:_id', getCart)
router.delete('/delete/:_id', deleteCart)

module.exports = router; 