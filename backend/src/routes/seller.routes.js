const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

const router = express.Router();

/**
 * SELLER: Orders received (only orders containing seller products)
 */
router.get("/orders", auth, role("seller"), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("items.product");

    const sellerOrders = orders
      .map((o) => {
        const sellerItems = o.items.filter(
          (it) => it.product?.seller?.toString() === req.user._id.toString()
        );

        if (sellerItems.length === 0) return null;

        return {
          _id: o._id,
          buyer: o.user,
          total: sellerItems.reduce((sum, it) => sum + it.price * it.qty, 0),
          paymentStatus: o.paymentStatus,
          createdAt: o.createdAt,
          items: sellerItems.map((it) => ({
            product: {
              _id: it.product._id,
              name: it.product.name,
              category: it.product.category,
            },
            qty: it.qty,
            price: it.price,
          })),
        };
      })
      .filter(Boolean);

    res.json(sellerOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * SELLER dashboard summary
 */
router.get("/dashboard", auth, role("seller"), async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });

    const orders = await Order.find().populate("items.product");
    let totalSales = 0;

    orders.forEach((o) => {
      o.items.forEach((it) => {
        if (it.product?.seller?.toString() === req.user._id.toString()) {
          totalSales += it.price * it.qty;
        }
      });
    });

    res.json({
      totalProducts: products.length,
      totalSales,
      totalQty: products.reduce((sum, p) => sum + (p.qty || 0), 0),
      products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
