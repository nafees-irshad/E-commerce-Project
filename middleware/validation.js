const { check, validationResult } = require("express-validator");
const { User } = require("../models/userModel")

const validateSignUp = [
  check("email").isEmail().withMessage("Please enter valid email"),

  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/[a-zA-z]/)
    .withMessage("Password must contain at least one letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),

  check("passwordConfirmation")
    .custom((value, {req})=>value === req.body.password)
    .withMessage('Password confirmation does not match password'),

  check("name").notEmpty().withMessage("Name is required"),

  (req, resp, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Initialize an empty object to hold formatted errors
        const formattedErrors = {};

        // Iterate over each error in the array
        errors.array().forEach(error => {
            // Assign the error message to the respective field
            formattedErrors[error.path] = error.msg;
        });
      return resp.status(400).json({ errors: formattedErrors });
    }
    next();
  },
];

module.exports = validateSignUp;
