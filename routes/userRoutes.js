const express = require("express");
const router = express.Router();
const checkUserAuth = require("../middleware/authMiddleware");
const {
  validateSignUp,
  validateVerification,
  validateLogin,
  validateChangePassword,
  validateUpdate,
} = require("../validation/validater");
//Import userModel
const {
  userRegistration,
  verifyEmail,
  userLogin,
  changePassword,
  resetPassword,
  updateUser,
  viewProfile,
} = require("../controllers/userController");

//Route level Middleware
router.use("/change-password", checkUserAuth);
router.use("/update", checkUserAuth);
router.use("/profile", checkUserAuth);

//Public Routes
router.post("/register", validateSignUp, userRegistration);
router.post("/verify-email", validateVerification, verifyEmail);
router.post("/login", validateLogin, userLogin);

//Protected Routes
router.post("/change-password", validateChangePassword, changePassword);
router.put("/update", validateUpdate, updateUser);
router.get("/profile", viewProfile);

module.exports = router;
