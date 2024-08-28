const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateCode = (){
  const code = Math.floor(100000 + Math.random() * 900000);
}
const userRegistration = async (req, resp) => {
  const { name, email, password, passwordConfirmation, tc, address } = req.body;
  const user = await User.findOne({ email: email });

  //check User Availblity
  if (user) {
    return resp.status(400).json({
      status: "failed",
      message: "Email already exists.",
    });
  }

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUserDoc = new User({
      name: name,
      email: email,
      password: hashPassword,
      tc: tc,
      address: address,
    });

    //Saving User Details
    await newUserDoc.save();
    const newUser = await User.findOne({ email: email });

    resp.status(201).json({
      status: "success",
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        tc: newUser.tc,
      },
    });
  } catch (err) {
    console.log(err);
    resp.status(500).json({
      status: "failed",
      message: "Error in registration",
    });
  }
};

const userLogin = async (req, resp) => {
  const { email, password } = req.body;

  // check user availablity by email
  const user = await User.findOne({ email: email });
  if (!user) {
    return resp.status(400).json({
      status: "failer",
      message: "Email not exist",
    });
  }

  // validating password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return resp.status(400).json({
      status: "failed",
      message: "Invalid password.",
    });
  }

  try {
    //generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "5d",
    });
    resp.send({
      status: "success",
      message: "User logged in successfully",
      token: token,
    });
  } catch (err) {
    console.log(err);
    resp.send({ status: "failed", message: "login error" });
  }
};

const changePassword = async (req, resp) => {
  const { currentPassword, newPassword, passwordConfirmation } = req.body;

  try {
    const user = await User.findById(req.user._id);
    // Validate Password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return resp.status(400).json({
        status: "failed",
        message: "Wrong password",
      });
    }
    //Generate new password
    const salt = await bcrypt.genSalt(10);
    const newHashPassword = await bcrypt.hash(newPassword, salt);

    user.password = newHashPassword;
    await user.save();
    resp.send({
      status: "sucess",
      message: "Password changed successfully",
    });
  } catch (err) {
    console.log(err);
    resp.status(500).json({
      status: "failed",
      message: "Error changing password",
    });
  }
};

const updateUser = async (req, resp) => {
  const updates = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    resp.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: updatedUser,
    });

    if (!updatedUser) {
      return resp.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }
  } catch (err) {
    console.error(err);
    resp.status(500).json({
      status: "failed",
      message: "An error occurred while updating the user",
    });
  }
};

const loggedUser = async (req, resp) => {
  resp.status(200).json({
    user: req.user,
  });
};
module.exports = {
  userRegistration,
  userLogin,
  changePassword,
};
