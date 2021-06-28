const express = require("express");
const router = express.Router();
const { postLoginUserValidator } = require("../controllers/loginUserValidator");

router.post("/", postLoginUserValidator);

module.exports.loginUserRouter = router;
