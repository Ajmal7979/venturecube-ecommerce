const express = require("express");
const User = require("../models/User");

const protect = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const router = express.Router();

router.use(protect, authorize("buyer"));

/* ✅ GET CART */
router.get("/", async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart.product");
  res.json(user.cart || []);
});

/* ✅ ADD TO CART */
router.post("/add", async (req, res) => {
  const { productId, qty } = req.body;

  const user = await User.findById(req.user._id);

  if (!user.cart) user.cart = [];

  const exist = user.cart.find((c) => c.product.toString() === productId);

  if (exist) {
    exist.qty += qty;
  } else {
    user.cart.push({ product: productId, qty });
  }

  await user.save();

  const updated = await User.findById(req.user._id).populate("cart.product");
  res.json(updated.cart);
});

/* ✅ UPDATE QTY */
router.put("/update", async (req, res) => {
  const { productId, qty } = req.body;

  const user = await User.findById(req.user._id);

  user.cart = user.cart.map((c) =>
    c.product.toString() === productId ? { ...c.toObject(), qty } : c
  );

  await user.save();

  const updated = await User.findById(req.user._id).populate("cart.product");
  res.json(updated.cart);
});

/* ✅ REMOVE */
router.delete("/remove/:id", async (req, res) => {
  const user = await User.findById(req.user._id);

  user.cart = user.cart.filter((c) => c.product.toString() !== req.params.id);

  await user.save();

  const updated = await User.findById(req.user._id).populate("cart.product");
  res.json(updated.cart);
});

module.exports = router;
