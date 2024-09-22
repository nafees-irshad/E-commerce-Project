const express = require("express");
const {
  placeOrder,
  viewOrder,
  cancelOrder,
  refund,
  orderStatus,
  invoice,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/submit", placeOrder);
router.post("/cancel", cancelOrder);
router.post("/refund", refund);
router.post("/invoice", invoice);
router.get("/view/:_id", viewOrder);
router.get("/status", orderStatus);

module.exports = router;
