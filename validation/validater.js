const {
  userSchema,
  changePasswordSchema,
  loginSchema,
  updateSchema,
} = require("./schemas");

const validateSignUp = async (req, resp, next) => {
  try {
    const value = await userSchema.validateAsync(req.body);
    next();
  } catch (error) {
    if (error.isJoi) {
      return resp.json({ message: error.details[0].message });
    }
    resp.status(500).json({ message: "Internal server error" });
  }
};

const validateChangePassword = async (req, resp, next) => {
  try {
    const value = await changePasswordSchema.validateAsync(req.body);
    next();
  } catch (error) {
    if (error.isJoi) {
      return resp.json({ message: error.details[0].message });
    }
    resp.status(500).json({ message: "Internal server error" });
  }
};

const validateLogin = async (req, resp, next) => {
  try {
    const value = await loginSchema.validateAsync(req.body);
    next();
  } catch (error) {
    if (error.isJoi) {
      return resp.json({ message: error.details[0].message });
    }
    resp.status(500).json({ message: "Internal server error" });
  }
};

const validateUpdate = async (req, resp, next) => {
  try {
    const value = await updateSchema.validateAsync(req.body);
    next();
  } catch (error) {
    if (error.isJoi) {
      return resp.json({ message: error.details[0].message });
    }
    resp.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  validateSignUp,
  validateChangePassword,
  validateLogin,
  validateUpdate,
};
