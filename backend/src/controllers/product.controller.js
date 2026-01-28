const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  const product = await Product.create({
    ...req.body,
    seller: req.user._id,
  });
  res.status(201).json(product);
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product || product.seller.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Unauthorized" });

  Object.assign(product, req.body);
  await product.save();
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};

exports.getProducts = async (req, res) => {
  const products = await Product.find().populate("seller", "username");
  res.json(products);
};