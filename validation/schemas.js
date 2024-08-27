const joi = require("joi");

const userSchema = joi.object({
  name: joi
    .string()
    .max(30)
    .messages({ "string.empty": "Name field cannot be empty." }),
  email: joi.string().email().required(),
  password: joi
    .string()
    .pattern(new RegExp("^[a-zA-Z0-9]{6,12}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must be between 6 to 12 characters long and contain only letters and numbers.",
      "string.empty": "Password cannot be empty.",
    }),
  passwordConfirmation: joi
    .any()
    .valid(joi.ref("password"))
    .messages({
      "any.only": "Password confirmation does not match the new password.",
    })
    .required(),
  tc: joi
    .boolean()
    .required()
    .messages({ "any.required": "You must accept the terms and conditions" }),
});

const changePasswordSchema = joi.object({
  currentPassword: joi.string().required().messages({
    "string.empty": "Current password cannot be empty.",
  }),
  newPassword: joi
    .string()
    .pattern(new RegExp("^[a-zA-Z0-9]{6,12}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must be between 6 to 12 characters long and contain only letters and numbers.",
      "string.empty": "Password cannot be empty.",
    }),
  passwordConfirmation: joi
    .any()
    .valid(joi.ref("newPassword"))
    .messages({
      "any.only": "Password confirmation does not match the new password.",
    })
    .required(),
});

const loginSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.empty": "Email can not be empty",
    "string.email": "Enter a valid email address",
  }),
  password: joi.string().required().messages({
    "string.empty": "Plz enter password",
  }),
});

const updateSchema = joi
  .object({
    name: joi.string().max(30).required().messages({
      "string.empty": "Name field can not be empty",
    }),
    email: joi.string().required().messages({
      "string.empty": "Email field can not be empty",
      "string.email": "Enter a valid email address",
    }),
  })
  .or("name", "email");

module.exports = {
  userSchema,
  changePasswordSchema,
  loginSchema,
  updateSchema,
};
