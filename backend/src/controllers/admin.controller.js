const User = require("../models/User");
const Order = require("../models/Order");

// Get all users
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// Update user role
exports.updateUserRole = async (req, res) => {
  const { role } = req.body;

  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.role = role;
  await user.save();

  res.json({ message: "User role updated", user });
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("buyer", "username email")
    .sort({ createdAt: -1 });

  res.json(orders);
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.orderStatus = status;
  await order.save();

  res.json({ message: "Order status updated", order });
};
