const userModal = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
async function registerUserController() {
  // Implementation for user registration
  const { email, name, password } = req.body;
  const isEmailExist = await userModal.findOne({ email });
  if (isEmailExist) {
    return res.status(402).json({ message: "Email already exist" });
  }
  const user = await userModal.create({
    email,
    name,
    password,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true, // Protects against XSS
    secure: true, // Requires HTTPS
    sameSite: "strict", // Protects against CSRF
    maxAge: 3600000, // Cookie life in milliseconds (1 hour)
  });

  //  Set Refresh Token Cookie (Long lifespan, restricted path)
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/api/auth/refresh", // Only sent to the refresh endpoint
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  res.status(201).json({ message: "User registered successfully", token });
}

module.exports = { registerUserController };
