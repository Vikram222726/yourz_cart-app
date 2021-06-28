const { User } = require("../models/user");
const { Cart } = require("../models/cart");
const { OrderList } = require("../models/orderList");
const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const postUserValidator = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const alreadyRegisteredUser = await User.findOne({ email: req.body.email });
    if (alreadyRegisteredUser) {
      return res
        .status(400)
        .send("User with this Email ID is already registered!");
    }

    const newUser = new User(
      _.pick(req.body, ["username", "email", "password", "isAdmin"])
    );

    if (req.body.email === "admin@gmail.com") {
      newUser.isAdmin = true;
    }

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    await newUser.save();

    //Create a new cart for this user..
    const newCart = new Cart({
      email: req.body.email,
      cartItems: [],
    });
    await newCart.save();

    return res.send(_.pick(newUser, ["username", "_id", "isAdmin"]));
  } catch (ex) {
    console.log(ex.message);
    return res.status(500).send(ex.message);
  }
};

const validateUser = (user) => {
  const schema = {
    username: Joi.string().min(3).required(),
    email: Joi.string().min(3).required().email(),
    password: Joi.string().min(8).required(),
  };
  return Joi.validate(user, schema);
};

module.exports.postUserValidator = postUserValidator;
