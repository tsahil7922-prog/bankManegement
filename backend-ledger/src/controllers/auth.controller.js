const userModal = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");
async function registerUserController(req, res) {
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

  res.status(201).json({
    message: "User registered successfully",
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
  });

  await emailService.sendRegistrationEmail(user.email, user.name); // Call the email service to send the registration email
}

async function loginUserController(req, res) {
  const { email, password } = req.body;
  const user = await userModal.findOne({ email }).select("+password"); // Select the password field explicitly since it's set to not be selected by default in the schema
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
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
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    message: "Login successful",
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
  });
}
module.exports = { registerUserController, loginUserController };
