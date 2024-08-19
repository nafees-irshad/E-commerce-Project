const Category  = require('../models/categoryModel');

const createCategory = async (req, resp)=>{
    const newCategory = req.body;
    try{
        const saveCategory = await Category.insertMany(newCategory);
        resp.status(201).json(saveCategory)
        console.log(saveCategory)
    }catch(err){
        console.log(err)
        resp.status(500).json({ message: "error creating document" });
    }
    
}; 

const getCategories = async(req,resp)=>{
    try{
        const categories = await Category.find();
        resp.status(200).json(categories)
    } catch(err){
        console.log(err)
        resp.status(404).send({ message: "category not found" })
    }
};

const getCategory = async(req,resp) =>{
    const category = req.params.category
    try{
        const newcategory = await Category.findOne({category: category})
        resp.status(201).json(newcategory)
    } catch(err){
        console.log(err)
        resp.status(404).send({ message: "category not found" })
    }
}


module.exports= {createCategory, getCategories, getCategory};