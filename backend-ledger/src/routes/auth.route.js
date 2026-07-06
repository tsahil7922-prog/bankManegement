const express = require("express");
const router = express.Router();
const { registerUserController,loginUserController } = require("../controllers/auth.controller");

router.post("/register", registerUserController);


// login
router.post("/login", loginUserController)
module.exports = router;
