const express = require("express");
const addRemoveWishlist = require("../controllers/wishlistController");

const router = express.Router();

router.post("/wishlist", addRemoveWishlist);

module.exports = router;
