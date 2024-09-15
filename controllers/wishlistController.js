const Wishlist = require("../models/wishlistModel");
const Product = require("../models/productsModel");

const addToWishList = async (req, resp) => {
  const { userId, productId, action } = req.body;
  try {
    //Fetch Product
    const product = await Product.findById(productId);
    if (!product.qty > 0) {
      return resp.status(404).json({ message: "Product out of stock" });
    }

    // fetching wishlist
    const wishlist = await Wishlist.findOne({ userId: userId });
    // add items to wishlist
    if (action === "add") {
      if (!wishlist) {
        const newWishList = new Wishlist({
          userId: userId,
          products: productId,
        });
        await newWishList.save();
      } else {
        //check if product already included in wishlist
        if (wishlist.products.includes(productId)) {
          return resp
            .status(400)
            .json({ message: "Product already in wishlist" });
        }
        wishlist.products.push(productId);
        await wishlist.save();
      }
      resp.status(200).json({ message: "Added to Wishlist Successfully" });
    }
    // remove item from wishlist
    if (action === "remove") {
      wishlist.products.pull(productId);
      await wishlist.save();
      resp
        .status(200)
        .json({ message: "Item removed from Wishlist Successfully" });
    }
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "internal error" });
  }
};

//view wishlist
const viewWishList = async (req, resp) => {
  const id = req.params;
  try {
    const wishList = await Wishlist.findById(id);
    if (!wishList) {
      return resp.status(404).json({ message: "Wishlist not found" });
    }
    resp.status(200).json({
      status: "success",
      data: wishList,
    });
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "internal error" });
  }
};

//delete wishlist
const deleteWishList = async (req, resp) => {
  const id = req.params;
  try {
    const wishList = await Wishlist.findByIdAndDelete(id);
    if (!wishList) {
      return resp.status(404).json({ message: "Wishlist not found" });
    }
    resp.status(200).json({
      status: "success",
      message: "wishlist removed",
    });
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "internal error" });
  }
};
module.exports = { addToWishList, viewWishList, deleteWishList };
