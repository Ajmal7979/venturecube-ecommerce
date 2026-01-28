const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // ✅ buyer (same naming across app)
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },

        // ✅ use quantity everywhere (not qty)
        quantity: { type: Number, required: true, default: 1 },

        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],

    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    paymentMethod: { type: String, default: "COD" }, // COD / CARD / UPI
    paymentStatus: { type: String, default: "pending" }, // pending / paid
    orderStatus: { type: String, default: "placed" }, // placed / shipped / delivered

    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
