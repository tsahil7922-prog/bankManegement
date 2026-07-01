const express = require("express");
const router = express.Router();
const { registerUserController } = require("../controllers/auth.controller");

router.post("/register", registerUserController);

module.exports = router;
