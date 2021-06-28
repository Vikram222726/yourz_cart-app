const express = require("express");
const router = express.Router();
const {
  postOrderListValidator,
  getOrderListValidator,
} = require("../controllers/orderListValidator");

router.post("/", postOrderListValidator);

router.get("/", getOrderListValidator);

module.exports.orderListRouter = router;
