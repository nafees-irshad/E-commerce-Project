const Product = require('../models/productsModel');

const createProducts = async (req, resp) => {
    const product = req.body;
    try {
        const products = await Product.insertMany(product)
        resp.status(201).json(products)
    } catch (err) {
        console.log(err) 
        resp.status(500).json({ message: "error creating document" });
    }
};

const updateAllProducts = async (req, resp) => {
    try {
        //define new field and its value 
        const updateall = { $set: { qty: 10 } };

        // Update all documents in the Product collection
        const result = await Product.updateMany({}, updateall);
        resp.status(201).json(result)
    } catch (err) {
        console.log(err)
        resp.status(500).json({ message: "error creating document" });
    }
}

const productDetails = async(req,resp)=>{
    const id = req.params;
    try{
        const product = await Product.findById(id)
        if(!product){
            return resp.status(404).json({
                message: "Porduct not found"
              });
        }

        resp.status(200).json(product)
    } catch(err){
        resp.status(500).send({ message: 'Internal Server Error' })
    }
}

//get all products details
const getAllProducts = async (req, resp) => {
    try{
        const products = await Product.find();
        resp.status(200).json(products);
    } catch (error) {
        resp.status(500).json({ message: "Error fetching products",});
    }
};



const deleteProduct = async(req,resp)=>{
    const id = req.params;
    try{
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return resp.status(404).json({
                message: "Porduct not found"
            });
        }
        resp.status(200).json({"product deleted successfully": product})
    } catch(err){
        resp.status(500).send({ message: 'Internal Server Error' })
    };
}

module.exports = {createProducts, updateAllProducts, productDetails, deleteProduct, getAllProducts};