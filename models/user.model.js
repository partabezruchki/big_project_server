const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    image: { type: String },
    isAdmin: { type: Boolean, default: false },
    phone: { type: String },
    address: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
