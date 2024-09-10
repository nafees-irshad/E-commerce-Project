const express = require("express");
const {
  addToWishList,
  viewWishList,
  deleteWishList,
} = require("../controllers/wishlistController");
const checkUserAuth = require("../middleware/authMiddleware");

const router = express.Router();

//route level middleware
router.use("/wishlist", checkUserAuth);
router.use("/wishlist", checkUserAuth);
router.use("/wishlist", checkUserAuth);

//routes
router.post("/wishlist", addToWishList);
router.get("/wishlist/:_id", viewWishList);
router.delete("/wishlist/:_id", deleteWishList);

module.exports = router;
