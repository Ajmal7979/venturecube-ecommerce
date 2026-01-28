const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const Order = require("../models/Order");
const Product = require("../models/Product");

// ✅ CREATE ORDER
router.post("/", auth, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (
      !shippingAddress?.fullName ||
      !shippingAddress?.phone ||
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !shippingAddress?.state ||
      !shippingAddress?.pincode
    ) {
      return res.status(400).json({ message: "Shipping address missing" });
    }

    // ✅ Calculate total using DB values (best practice)
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const qty = Number(item.quantity || 1);
      const price = Number(product.price);

      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      totalAmount += price * qty;

      validatedItems.push({
        product: product._id,
        name: product.name,
        price,
        quantity: qty, // ✅ correct
        seller: product.seller,
      });
    }

    if (isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    const order = await Order.create({
      buyer: req.user._id, // ✅ FIXED
      items: validatedItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      paymentStatus: "paid",
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET MY ORDERS (buyer)
router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ✅ SELLER SUMMARY (TOTAL SALES)
router.get("/seller/summary", auth, async (req, res) => {
  try {
    const sellerId = req.user._id;

    // seller orders = orders that contain items from this seller
    const orders = await Order.find({ "items.seller": sellerId });

    let totalSales = 0;
    let totalQtySold = 0;

    for (const o of orders) {
      for (const it of o.items) {
        // only count items for this seller
        if (String(it.seller) === String(sellerId)) {
          totalSales += Number(it.price || 0) * Number(it.quantity || it.qty || 1);
          totalQtySold += Number(it.quantity || it.qty || 1);
        }
      }
    }

    res.json({
      totalSales,
      totalQtySold,
      totalOrders: orders.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
