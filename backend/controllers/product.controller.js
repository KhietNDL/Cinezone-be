const Product = require("../models/product.model");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAllProducts();
    res.json({ Products: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.getProductById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ Products: product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const productId = await Product.createProduct({
      ...req.body,
      CreatedBy: req.user?.UserId || null,
    });
    res.status(201).json({ status: "success", productId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updated = await Product.updateProduct(productId, {
      ...req.body,
      UpdatedBy: req.user?.UserId || null,
    });
    if (!updated) return res.status(404).json({ error: "Product not found or not updated" });
    res.json({ status: "success", message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const deleted = await Product.deleteProduct(productId, req.user?.UserId || null);
    if (!deleted) return res.status(404).json({ error: "Product not found or not deleted" });
    res.json({ status: "success", message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};