const { Cart } = require("../models/cart");
const Joi = require("joi");
const _ = require("lodash");

const postCartValidator = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const cartItem = await Cart.findOne({ email: req.body.email });
    if (!cartItem) {
      return res
        .status(400)
        .send("Cart Item with this Email ID is not present!");
    }

    return res.send(cartItem);
  } catch (ex) {
    console.log(ex.message);
    return res.status(500).send(ex.message);
  }
};

const putCartValidator = async (req, res) => {
  try {
    const result = await Cart.findOneAndUpdate(
      { email: req.body.email },
      {
        $set: {
          cartItems: req.body.cartItems,
        },
      },
      { new: true }
    );

    res.send(_.pick(result, ["_id", "cartItems"]));
  } catch (ex) {
    return res.send(500).send(ex.message);
  }
};

const validateUser = (user) => {
  const schema = {
    email: Joi.string().min(3).required().email(),
  };
  return Joi.validate(user, schema);
};

module.exports.postCartValidator = postCartValidator;
module.exports.putCartValidator = putCartValidator;
