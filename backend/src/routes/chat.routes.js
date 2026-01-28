const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ✅ simple helpers
const normalize = (s = "") => s.toString().trim().toLowerCase();

const getCategoryFromText = (text) => {
  const t = normalize(text);

  if (t.includes("mobile") || t.includes("mobiles")) return "mobiles";
  if (t.includes("shoe") || t.includes("shoes")) return "shoes";
  if (t.includes("book") || t.includes("books")) return "books";
  if (t.includes("electronic") || t.includes("electronics")) return "electronics";
  if (t.includes("fashion")) return "fashion";
  if (t.includes("home")) return "home applications";

  return null;
};

const getMaxPriceFromText = (text) => {
  const t = normalize(text);

  // matches: under 5000 / below 5000 / less than 5000
  const match = t.match(/(under|below|less than)\s*(\d+)/i);
  if (match && match[2]) return Number(match[2]);

  // matches: ₹5000 / rs 5000
  const match2 = t.match(/(₹|rs)\s*(\d+)/i);
  if (match2 && match2[2]) return Number(match2[2]);

  return null;
};

// ✅ CHATBOT API
router.post("/", async (req, res) => {
  try {
    const message = normalize(req.body.message || "");

    if (!message) {
      return res.json({
        reply: "Please type something 😊",
        products: [],
      });
    }

    // ✅ base filter
    let filter = { status: "approved" };

    // ✅ category detection
    const cat = getCategoryFromText(message);
    if (cat) filter.category = cat;

    // ✅ keyword detection (brand/product name)
    // ex: vivo, nike, jordan, mrf, victus etc..
    let keyword = null;

    // ignore general words
    const ignoreWords = [
      "trending",
      "best",
      "top",
      "under",
      "below",
      "less",
      "than",
      "products",
      "product",
      "show",
      "give",
      "me",
      "i",
      "want",
      "mobile",
      "mobiles",
      "shoes",
      "shoe",
      "electronics",
      "fashion",
      "books",
      "home",
    ];

    const words = message
      .split(" ")
      .map((w) => w.trim())
      .filter(Boolean);

    // pick first meaningful keyword
    for (let w of words) {
      if (!ignoreWords.includes(w) && w.length >= 3 && isNaN(w)) {
        keyword = w;
        break;
      }
    }

    // ✅ price limit
    const maxPrice = getMaxPriceFromText(message);

    // ✅ Trending
    const isTrending = message.includes("trending") || message.includes("top") || message.includes("best");

    // ✅ build query
    let query = Product.find(filter);

    if (keyword) {
      // search keyword in product name/description
      query = query.find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      });
    }

    if (maxPrice) {
      query = query.find({ price: { $lte: maxPrice } });
    }

    // ✅ sorting
    if (isTrending) {
      query = query.sort({ sold: -1, createdAt: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const products = await query.limit(5);

    // ✅ reply builder
    let reply = "";

    if (!products.length) {
      reply = "Sorry 😕 I couldn't find matching products. Try asking:\n• mobiles under 15000\n• trending shoes\n• best electronics";
    } else {
      if (keyword) {
        reply = `Here are ${products.length} results for "${keyword}" ✅`;
      } else if (cat) {
        reply = `Here are ${products.length} products in ${cat.toUpperCase()} ✅`;
      } else if (isTrending) {
        reply = `Here are trending products 🔥`;
      } else {
        reply = `Here are some products I found for you 😊`;
      }

      if (maxPrice) reply += `\n(Under ₹${maxPrice})`;
    }

    return res.json({
      reply,
      products,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
