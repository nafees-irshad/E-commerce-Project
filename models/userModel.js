const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  verificationCode: { type: String },
  codeExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  tc: { type: Boolean, required: true },
  address: { type: String },
});

const UserModel = new mongoose.model("users", userSchema);

module.exports = UserModel;
