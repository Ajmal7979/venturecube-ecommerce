const express = require("express");
const Address = require("../models/Address");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

/* ✅ SAVE ADDRESS */
router.post("/", auth, async (req, res) => {
  try {
    const { fullName, phone, address, city, state, pincode } = req.body;

    if (!fullName || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ message: "All fields required" });
    }

    const saved = await Address.create({
      user: req.user._id,
      fullName: fullName.trim(),
      phone: String(phone).trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: String(pincode).trim(),
    });

    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ✅ GET MY LAST SAVED ADDRESS */
router.get("/my", auth, async (req, res) => {
  try {
    const addr = await Address.findOne({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(addr);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
