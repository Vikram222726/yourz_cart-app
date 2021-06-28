const { OrderList } = require("../models/orderList");
const Joi = require("joi");
const _ = require("lodash");

const postOrderListValidator = async (req, res) => {
  try {
    if (req.body.email.length < 3) {
      return res.status(400).send("Invalid Email ID");
    }
    const newListOrder = new OrderList({
      email: req.body.email,
      orderListItems: req.body.orderListItems,
    });
    await newListOrder.save();

    return res.send("Order List added Successfully!");
  } catch (ex) {
    console.log(ex.message);
    return res.status(500).send(ex.message);
  }
};

const getOrderListValidator = async (req, res) => {
  try {
    const prevOrderLists = await OrderList.find({
      email: req.query.email,
    }).sort({ date: -1 });
    if (!prevOrderLists) {
      return res
        .status(400)
        .send("Order List with this Email ID is not present!");
    }

    res.send(prevOrderLists);
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
};

module.exports.postOrderListValidator = postOrderListValidator;
module.exports.getOrderListValidator = getOrderListValidator;
