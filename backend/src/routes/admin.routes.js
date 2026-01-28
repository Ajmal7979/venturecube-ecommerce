const express = require("express");
const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

const router = express.Router();

/* ✅ Admin: get all products */
router.get("/products", auth, role("admin"), async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "username email");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ✅ Admin dashboard FULL DATA */
router.get("/dashboard", auth, role("admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBuyers = await User.countDocuments({ role: "buyer" });
    const totalSellers = await User.countDocuments({ role: "seller" });

    const totalProducts = await Product.countDocuments();
    const approvedProducts = await Product.countDocuments({ status: "approved" });
    const pendingProducts = await Product.countDocuments({ status: "pending" });
    const rejectedProducts = await Product.countDocuments({ status: "rejected" });

    const totalOrders = await Order.countDocuments();

    // ✅ total revenue
    const totalRevenueAgg = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // ✅ top sellers
    const topSellers = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.seller",
          totalSales: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $unwind: "$seller" },
      {
        $project: {
          _id: 0,
          seller: { username: "$seller.username", email: "$seller.email" },
          totalSales: 1,
        },
      },
    ]);

    // ✅ latest orders
    const latestOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("buyer", "username email");

    // ✅ latest buyers
    const latestBuyers = await User.find({ role: "buyer" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("username email createdAt");

    // ✅ latest sellers
    const latestSellers = await User.find({ role: "seller" })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("username email createdAt");

    res.json({
      counts: {
        totalUsers,
        totalBuyers,
        totalSellers,
        totalProducts,
        approvedProducts,
        pendingProducts,
        rejectedProducts,
        totalOrders,
      },
      totalRevenue,
      topSellers,
      latestOrders,
      latestBuyers,
      latestSellers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
