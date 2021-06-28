const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      userId: this._id,
      isAdmin: this.isAdmin,
      username: this.username,
      email: this.email,
    },
    process.env.JWT_PRIVATE_KEY
  );
  return token;
};

const User = mongoose.model("users", userSchema);

module.exports.User = User;
