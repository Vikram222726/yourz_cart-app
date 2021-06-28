const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 3,
  },
  orderListItems: {
    type: Array,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const OrderList = mongoose.model("user_order_list", orderSchema);

module.exports.OrderList = OrderList;
