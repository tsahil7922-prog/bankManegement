const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required for creatinga account"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
      unique: [true, "Email already exist"],
    },
    name: {
      type: String,
      required: [true, "Name is required for creating account"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password  is required for creatinga account"],
      minLength: [6, "Password should contan more then 6 character"],
      trim: true,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, 10);
  return next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const userModal = mongoose.model("user", userSchema);
module.exports = userModal;
