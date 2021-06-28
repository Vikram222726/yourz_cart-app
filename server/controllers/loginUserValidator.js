const { User } = require("../models/user");
const Joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const postLoginUserValidator = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const isUserRegistered = await User.findOne({ email: req.body.email });
    if (!isUserRegistered) {
      return res.status(400).send("Invalid Email or Password!");
    }

    let newUser = new User(_.pick(req.body, ["username", "email", "isAdmin"]));
    if (newUser.email === "admin@gmail.com") {
      newUser.isAdmin = true;
    }

    //Decrypt send Password and compare with registered Password..
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      isUserRegistered.password
    );
    if (!isValidPassword) {
      return res.status(400).send("Invalid Email or Password!");
    }

    // Generate Auth Token and send username, email, userId and isAdmin in payload..
    const token = newUser.generateAuthToken();

    return res
      .header("x-auth-token", token)
      .send({ id: newUser._id, token: token });
  } catch (ex) {
    console.log(ex.message);
    return res.status(500).send(ex.message);
  }
};

const validateUser = (user) => {
  const schema = {
    email: Joi.string().min(3).required().email(),
    password: Joi.string().min(8).required(),
  };
  return Joi.validate(user, schema);
};

module.exports.postLoginUserValidator = postLoginUserValidator;
