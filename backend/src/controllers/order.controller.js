const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

exports.checkout = async (req, res) => {
  const { shippingAddress } = req.body;

  const user = await User.findById(req.user._id).populate("cart.product");

  if (!user.cart.length) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  let total = 0;

  const items = user.cart.map((item) => {
    total += item.product.price * item.quantity;

    return {
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    };
  });

  const order = await Order.create({
    buyer: user._id,
    items,
    shippingAddress,
    totalAmount: total,
    paymentStatus: "paid", // mock payment
  });

  // Clear cart after order
  user.cart = [];
  await user.save();

  res.status(201).json({
    message: "Order placed successfully",
    order,
  });
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
};
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("buyer", "username email")
    .sort({ createdAt: -1 });
  res.json(orders);
};