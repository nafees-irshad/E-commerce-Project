const express = require('express');
const {placeOrder, viewOrder} = require('../controllers/orderController');

const router = express.Router();

router.post('/submit', placeOrder)
router.get('/view/:_id', viewOrder)
module.exports = router; 