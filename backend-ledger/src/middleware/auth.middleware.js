const userModal = require("../model/user.model");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  // console.log("Token:", token);

  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded:", decoded);

    const user = await userModal.findById(decoded.id);
    // console.log("User:", user);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    // console.log(err);
    return res.status(401).json({ message: err.message });
  }
}

module.exports = { authMiddleware };
