const express = require("express");
const router = express.Router();
const {
  postCartValidator,
  putCartValidator,
} = require("../controllers/cartValidator");

router.post("/", postCartValidator);

router.put("/", putCartValidator);

module.exports.cartRouter = router;
