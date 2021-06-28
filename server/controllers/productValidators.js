const { Product } = require("../models/product");
const Joi = require("joi");
const getAllProducts = async (req, res) => {
  try {
    const result = await Product.find().sort("name");
    return res.json(result);
  } catch (ex) {
    console.log(ex);
    return res
      .status(500)
      .json({ message: "There is some Internal Server Error!" });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const result = await Product.findById(req.params.id);
    return res.json(result);
  } catch (ex) {
    return res.status(500).json({ message: ex.message });
  }
};

const postNewProduct = async (req, res) => {
  try {
    const { error } = validateNewProduct(req.body);
    if (error) {
      return res.status(400).send(err.details[0].message);
    }

    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      countInStock: req.body.countInStock,
      imageURL: req.body.imageURL,
      ratings: req.body.ratings,
      reviews: req.body.reviews,
      kind: req.body.kind,
      itemType: req.body.itemType,
      discount: req.body.discount,
    });

    await newProduct.save();
    res.send("Success");
  } catch (ex) {
    return res.status(500).send(ex.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const removedProduct = await Product.findByIdAndRemove(req.params.id);
    res.send(removedProduct);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
};

const validateNewProduct = (newProduct) => {
  const schema = {
    name: Joi.string().min(3).required(),
    description: Joi.string().min(2).required(),
    price: Joi.number().required(),
    countInStock: Joi.number().required(),
    imageURL: Joi.string().min(4).required(),
    ratings: Joi.number().required(),
    reviews: Joi.number().required(),
    kind: Joi.string().required(),
    itemType: Joi.string().required(),
    discount: Joi.number().required(),
  };
  return Joi.validate(newProduct, schema);
};

module.exports.getAllProducts = getAllProducts;
module.exports.getSingleProduct = getSingleProduct;
module.exports.postNewProduct = postNewProduct;
module.exports.deleteProduct = deleteProduct;
