const express = require("express");
const router = express.Router();
const { postUserValidator } = require("../controllers/usersValidator");

router.post("/", postUserValidator);

module.exports.UserRouter = router;
