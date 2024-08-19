const User = require('../models/userModel');
const Product = require('../models/productsModel');
const Order = require('../models/orderModel');

const placeOrder = async (req, resp) => {
    //Generate OrderId
    function generateRandomId() {
        const prefix = 'CH#';
        const randomNumber = Math.floor(10000 + Math.random() * 9000)
        const now = new Date();
        const time = now.toTimeString().slice(0, 8).replace(/:/g, '')

        return `${prefix}${randomNumber}-${time}`
    }
    const orderId = generateRandomId()

    const { userId, cartId, products, } = req.body
    try {
        //Fetch User Name 
        const userName = await User.findById(userId);
        const name = userName.name

        let productInStock = []
        let productOutOfStock = []
        let total = 0
        for (i = 0; i < products.length; i++) {
            //Fectch Product
            const product = await Product.findById(products[i].productId)
            const productDetails = ({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: products[i].qty
            })

            if (product.qty > 0) {
                //Calculate Total Amount
                total += product.price * products[i].qty
                //update qty field in Product collection
                updateQty = product.qty - products[i].qty
                await Product.updateOne(
                    { _id: products[i].productId },
                    { $set: { qty: updateQty } }
                )
                //push available product details in productInStock
                productInStock.push(productDetails)
            } else {
                // push unavailable product details in productoutofStock
                productOutOfStock.push(productDetails)
            }
        }
        //Creating Order Object
        const newOrder = new Order({
            orderId: orderId,
            userId: userId,
            cartId: cartId,
            Customer: name,
            Products: productInStock,
            TotalAmount: total
        })
        //Saving new Order
        await newOrder.save()
        resp.status(200).json({
            message: "Order Created Successfully",
            Order: newOrder,
            productOutOfStock: productOutOfStock
        });
    } catch (err) {
        resp.status(500).json({ message: 'Error Creating Order' });
    }
}

const viewOrder = async (req,resp)=>{
    const orderId = req.params;
    try{
        const order = await Order.findById(orderId);
        if(order){
            resp.status(200).json(order)
        } else{
            resp.status(400).json("order Not Found")
        }
    }catch (err) {
        resp.status(500).json({ message: 'Internal Server error' });
    }
}

module.exports = {placeOrder, viewOrder}