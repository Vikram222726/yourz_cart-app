const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getSingleProduct,
  postNewProduct,
  deleteProduct,
} = require("../controllers/productValidators");

router.get("/", getAllProducts);

router.get("/:id", getSingleProduct);

router.post("/", postNewProduct);

router.delete("/:id", deleteProduct);

module.exports.productRouter = router;
