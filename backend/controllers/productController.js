const Product = require('../models/Product');

// GET all products
exports.getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// POST add product
exports.createProduct = async (req, res) => {
  const { name, category, price, quantity, image } = req.body;
  const product = new Product({ name, category, price, quantity, image });
  await product.save();
  res.status(201).json(product);
};

// PUT update product
exports.updateProduct = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

// DELETE product
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
};
