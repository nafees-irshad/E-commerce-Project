const Cart = require('../models/cartModel');
const Product = require('../models/productsModel');

//create or update cart

const updateCart = async (req, resp) => {
    const { userId, productId, qty, action } = req.body;
    try {
        //Fetch Product 
        const product = await Product.findById(productId);
        if (!product.qty > 0) {
            return resp.status(404).json({
                message: "Porduct out of stock"
            });
        }

        productDetails = {
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity: qty
        }
        //Fetch Cart
        const cart = await Cart.findOne({ userId: userId })
        if (cart) {
            if (action === 'add') {
                //check Product exist or not
                const productExist = cart.products.find(p => p.productId.toString() === productDetails.productId.toString());
                //if not product not exist, add product to the cart
                if (!productExist) {
                    await Cart.updateOne(
                        { userId: userId },
                        { $push: { products: productDetails } }
                    )
                }
                //if product exist increment or decrement qty
                else {
                    if (qty > 0) {
                        await Cart.updateOne(
                            { userId: userId, "products.productId": productDetails.productId },
                            { $inc: { "products.$.quantity": productDetails.quantity } }
                        )
                    } else{
                        await Cart.updateOne(
                            { userId: userId, "products.productId": productDetails.productId },
                            { $inc: { "products.$.quantity": productDetails.quantity } }
                        )
                    }
                }
            }
            if (action === 'remove') {
                await Cart.updateOne(
                    { userId: userId },
                    { $pull: { products: { productId: productId } } }
                )
            }
            // Fetch the updated cart from the database
            const updatedCart = await Cart.findOne({ userId });
            resp.status(200).json({ updatedCart })
        } else {
            const newCart = new Cart({
                userId: userId,
                products: productDetails
            })
            await newCart.save();
            resp.status(200).json(newCart)
        }


    } catch (err) {
        resp.status(500).json({ message: 'Error updating cart' });
    }
}
//view cart
const getCart = async (req, resp) => {
    const userId = req.params
    try {
        const cart = await Cart.findOne({ userId })
        if (cart) {
            resp.status(201).json(cart)
        } else {
            resp.status(404).json({ message: 'Cart not found' });
        }
    } catch (err) {
        console.error('Error creating order:', err);
        resp.status(500).send({ message: 'Internal Server Error' })
    }
};

//delete single cart item
const deleteCart = async (req, resp) => {
    const cartId = req.params;
    try {
        const cart = await Cart.findByIdAndDelete(cartId)
        if (cart) {
            resp.status(200).json(cart)
        } else {
            resp.status(404).json(
                { message: 'Cart not found' }
            )
        }
    } catch (err) {
        resp.status(500).send({ message: 'Internal Server Error' })
    };
};



module.exports = { updateCart, getCart, deleteCart };