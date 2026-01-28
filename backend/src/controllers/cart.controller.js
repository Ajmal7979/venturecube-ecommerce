const User = require("../models/User");
const Product = require("../models/Product");

// Add item to cart (Buyer only)
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const user = await User.findById(req.user._id);

  const itemIndex = user.cart.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    user.cart[itemIndex].quantity += quantity;
  } else {
    user.cart.push({ product: productId, quantity });
  }

  await user.save();
  res.json({ message: "Added to cart", cart: user.cart });
};

// Get cart
exports.getCart = async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "cart.product",
    "name price"
  );
  res.json(user.cart);
};

// Remove item
exports.removeFromCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter(
    (item) => item.product.toString() !== req.params.productId
  );
  await user.save();
  res.json({ message: "Item removed", cart: user.cart });
};

// Clear cart
exports.clearCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();
  res.json({ message: "Cart cleared" });
};
