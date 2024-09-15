const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();
const generateCode = () => {
  // Generates a 6-digit hex code
  const code = crypto.randomBytes(3).toString("hex");
  return code;
};
const userRegistration = async (req, resp) => {
  const { name, email, password, passwordConfirmation, tc, address } = req.body;
  const verificationCode = generateCode();
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
      verificationCode: verificationCode,
      codeExpires: Date.now() + 3600000,
      tc: tc,
      address: address,
    });

    //Saving User Details
    await newUserDoc.save();
    //send verification mail
    sendVerificationEmail(email, verificationCode);
    resp
      .status(200)
      .json({ message: "User registered! Please verify your email." });
  } catch (err) {
    console.log(err);
    resp.status(500).json({
      status: "failed",
      message: "Error in registration",
    });
  }
};

// Function to send verification email
const sendVerificationEmail = (email, code) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verification code",
    text: `Your verification code is ${code}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email", error);
    } else {
      console.log("Email sent", info.response);
    }
  });
};
const verifyEmail = async (req, resp) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.verificationCode === code && user.codeExpires > Date.now()) {
      user.isVerified = true;
      user.verificationCode = undefined;
      user.codeExpires = undefined;
      await user.save();

      resp.status(200).json({ message: "Email verified successfully!" });
    } else {
      resp.status(400).json({ error: "Invalid or expired verification code" });
    }
  } catch (error) {
    resp.status(500).json({ error: "Error verifying email." });
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

const viewProfile = async (req, resp) => {
  const id = req.user.id;
  try {
    const user = await User.findById(id);
    if (user) {
      resp.status(200).json({
        status: "success",
        message: "user fetched successfully",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          address: user.address,
        },
      });
    } else {
      resp.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }
  } catch (err) {
    console.error(err);
    resp.status(500).json({
      message: "internal server error",
    });
  }
};

module.exports = {
  userRegistration,
  verifyEmail,
  userLogin,
  changePassword,
  updateUser,
  viewProfile,
};
