const express = require("express");
const router = express.Router();
const checkUserAuth = require("../middleware/authMiddleware");
const {
  validateSignUp,
  validateLogin,
  validateChangePassword,
} = require("../validation/validater");
//Import userModel
const {
  userRegistration,
  userLogin,
  changePassword,
} = require("../controllers/userController");

//Route level Middleware
router.use("/change-password", checkUserAuth);
// router.use("/update", checkUserAuth);

//Public Routes
router.post("/register", validateSignUp, userRegistration);
router.post("/login", validateLogin, userLogin);

//Protected Routes
router.post("/change-password", validateChangePassword, changePassword);
// router.put("/update", updateUser);
// router.get("/logged-user", loggedUser);

module.exports = router;
