const User = require("../models/userModel");
const Product = require("../models/productsModel");
const Order = require("../models/orderModel");

const placeOrder = async (req, resp) => {
  //Generate OrderId
  function generateRandomId() {
    const prefix = "CH#";
    const randomNumber = Math.floor(10000 + Math.random() * 9000);
    const now = new Date();
    const time = now.toTimeString().slice(0, 8).replace(/:/g, "");

    return `${prefix}${randomNumber}-${time}`;
  }
  const orderId = generateRandomId();
  const { userId, cartId, products, customer, shippingAdress, paymentMethod } =
    req.body;
  try {
    let productInStock = [];
    let productOutOfStock = [];
    let total = 0;
    for (i = 0; i < products.length; i++) {
      //Fectch Product
      const product = await Product.findById(products[i].productId);
      const productDetails = {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: products[i].quantity,
      };

      if (product.qty > 0) {
        //Calculate Total Amount
        total += product.price * products[i].quantity;
        //update qty field in Product collection
        updateQty = product.qty - products[i].quantity;
        await Product.updateOne(
          { _id: products[i].productId },
          { $set: { qty: updateQty } }
        );
        //push available product details in productInStock
        productInStock.push(productDetails);
      } else {
        // push unavailable product details in productoutofStock
        productOutOfStock.push(productDetails);
      }
    }
    //Creating Order Object
    const newOrder = new Order({
      orderId: orderId,
      userId: userId,
      cartId: cartId,
      customer: customer,
      products: productInStock,
      totalAmount: total,
      shippingAdress: shippingAdress,
      paymentMethod: paymentMethod,
    });
    //Saving new Order
    await newOrder.save();
    //Sending Response
    const responseObj = {
      "order Id": newOrder.orderId,
      Name: customer[0].name,
      Email: customer[0].email,
      Products: productInStock,
      "Total Amount": total,
      "Shipping Adress": shippingAdress,
      "Payment Method": paymentMethod,
    };
    resp.status(200).json({
      message: "Order Created Successfully",
      response: responseObj,
      productOutOfStock: productOutOfStock,
    });
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "Error Creating Order" });
  }
};

const viewOrder = async (req, resp) => {
  const orderId = req.params;
  try {
    const order = await Order.findById(orderId);
    if (order) {
      resp.status(200).json(order);
    } else {
      resp.status(400).json("order Not Found");
    }
  } catch (err) {
    resp.status(500).json({ message: "Internal Server error" });
  }
};

const cancelOrder = async (req, resp) => {
  const { orderId } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (order.status === "Pending") {
      await Order.updateOne(
        { _id: orderId },
        { $set: { status: "Cancelled" } }
      );
    } else {
      resp.status(400).json("Order already Processed");
    }
    resp.status(200).json({
      message: "Order Cancelled Successfully",
    });
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "Error Cancelling Order" });
  }
};

const refund = async (req, resp) => {
  const { orderId } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (order.paymentStatus === "Paid") {
      await Order.updateOne(
        { _id: orderId },
        { $set: { paymentStatus: "Refunded" } }
      );
    } else {
      resp.status(400).json("Order Not Paid");
    }
    resp.status(200).json("Refund Processed Successfully");
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "Error Refunding Order" });
  }
};

const orderStatus = async (req, resp) => {
  const { orderId } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (order) {
      resp.status(200).json({
        Status: order.status,
      });
    } else {
      resp.status(404).json("Order Not Found");
    }
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "Error Fetching Order Status" });
  }
};

const invoice = async (req, resp) => {
  //generate invoice number
  function generateInvoiceNumber() {
    const now = new Date();
    const time = now.toTimeString().slice(0, 8).replace(/:/g, "");
    const invoiceNumber = "INV-" + time;
    return invoiceNumber;
  }
  // const invoiceNumber = generateInvoiceNumber();
  const { orderId, paymentMethod } = req.body;
  let amountToBePaid = 0;
  const delieveryFee = 200;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return resp.status(404).json("Order Not Found");
    }
    const products = order.products;
    const productDetails = products.map((product) => {
      return {
        name: product.name,
        price: product.price,
        quantity: product.quantity,
      };
    });
    if (paymentMethod === "Cash on Delivery") {
      amountToBePaid = order.totalAmount + delieveryFee;
    } else {
      amountToBePaid = order.totalAmount + 0;
    }
    const responseObj = {
      orderId: order.orderId,
      invoiceNumber: generateInvoiceNumber(),
      products: productDetails,
      subTotal: order.totalAmount,
      deliveryFee: delieveryFee,
      taxes: 0,
      totalAmount: amountToBePaid,
      billingAddress: order.shippingAdress,
    };
    order.invoice = responseObj;
    await order.save();
    resp.status(200).json(responseObj);
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "Error in Order" });
  }
};
module.exports = {
  placeOrder,
  viewOrder,
  cancelOrder,
  refund,
  orderStatus,
  invoice,
};
