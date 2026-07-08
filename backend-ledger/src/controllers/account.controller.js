const accountModel = require("../model/accounst.model");
async function createAccountController(req, res) {
  // console.log(req.body);
  const user = req.user; // Assuming the user is attached to the request by the auth middleware
  const account = await accountModel.create({
    user: user._id,
  });
  return res
    .status(201)
    .json({ message: "Account created successfully", account });
}

module.exports = { createAccountController };
