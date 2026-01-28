const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

router.get("/dashboard", auth, role("admin"), async (req, res) => {
  try {
    // USERS
    const totalUsers = await User.countDocuments();
    const totalBuyers = await User.countDocuments({ role: "buyer" });
    const totalSellers = await User.countDocuments({ role: "seller" });

    // PRODUCTS
    const totalProducts = await Product.countDocuments();
    const approvedProducts = await Product.countDocuments({ status: "approved" });
    const pendingProducts = await Product.countDocuments({ status: "pending" });
    const rejectedProducts = await Product.countDocuments({ status: "rejected" });

    // ORDERS
    const totalOrders = await Order.countDocuments();

    // Total Revenue (safe)
    const orders = await Order.find();
    const totalRevenue = orders.reduce(
      (sum, o) => sum + Number(o.totalAmount || 0),
      0
    );

    // LATEST ORDERS (support both "buyer" and "user")
    const latestOrders = await Order.find()
      .populate("buyer", "username email")
      .populate("user", "username email")
      .sort({ createdAt: -1 })
      .limit(5);

    // latest buyers/sellers
    const latestBuyers = await User.find({ role: "buyer" })
      .select("username email createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    const latestSellers = await User.find({ role: "seller" })
      .select("username email createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    // TOP SELLERS BASED ON SOLD ORDERS
    const fullOrders = await Order.find()
      .populate("items.seller", "username email")
      .populate("items.product", "name price");

    const sellerMap = {};

    for (const o of fullOrders) {
      for (const it of o.items) {
        const sellerObj = it.seller;
        const sid = sellerObj?._id?.toString();
        if (!sid) continue;

        const qty = Number(it.qty || it.quantity || 0);
        const price = Number(it.price || 0);
        const amount = qty * price;

        if (!sellerMap[sid]) {
          sellerMap[sid] = {
            seller: sellerObj,
            totalSales: 0,
          };
        }

        sellerMap[sid].totalSales += amount;
      }
    }

    const topSellers = Object.values(sellerMap)
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 5);

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
      latestOrders,
      latestBuyers,
      latestSellers,
      topSellers,
    });
  } catch (err) {
    console.log("ADMIN DASHBOARD ERROR =>", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
