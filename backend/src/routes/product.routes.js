const express = require("express");
const Product = require("../models/Product");

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

const router = express.Router();

/* SELLER → ADD PRODUCT (PENDING) */
router.post("/", auth, role("seller"), async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      category: req.body.category?.trim().toLowerCase(), // ✅ normalize
      seller: req.user._id,
      status: "pending",
    });

    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ADMIN → APPROVE / REJECT */
router.put("/:id/status", auth, role("admin"), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* BUYER → VIEW APPROVED PRODUCTS (CATEGORY FILTER FIXED) */
router.get("/", async (req, res) => {
  try {
    const filter = { status: "approved" };

    if (req.query.category) {
      const category = req.query.category.trim().toLowerCase();

      // ✅ This makes Shoes / shoes / SHOES all work
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* SELLER DASHBOARD → MY PRODUCTS */
router.get("/seller/my", auth, role("seller"), async (req, res) => {
  const products = await Product.find({ seller: req.user._id });
  res.json(products);
});

/* GET SINGLE PRODUCT DETAILS */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(404).json({ message: "Product not found" });
  }
});

module.exports = router;