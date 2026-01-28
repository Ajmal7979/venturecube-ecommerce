const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  pincode: String,
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },

    addresses: [addressSchema],

    cart: [
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    qty: { type: Number, default: 1 },
  },
],

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);