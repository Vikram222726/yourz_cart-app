const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 3,
  },
  cartItems: {
    type: Array,
  },
});

const Cart = mongoose.model("cart_items", cartSchema);

module.exports.Cart = Cart;
