const Product = require("../models/product.model");
const bucket = require('../config/firebase');

const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const sortBy = req.query.sortBy || 'ProductName';
    const sortOrder = req.query.sortOrder || 'asc';

    const result = await Product.getAllProducts(page, limit, sortBy, sortOrder);
    res.json(result);
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
    const data = req.body;
    data.CreatedBy = req.user.UserId;

    if (req.files && req.files.image && req.files.image[0]) {
      const imageFile = req.files.image[0];
      const imageFileName = `products/${Date.now()}-${imageFile.originalname.replace(/\s+/g, '_')}`;
      const imageBlob = bucket.file(imageFileName);

      const imageStream = imageBlob.createWriteStream({
        metadata: { contentType: imageFile.mimetype }
      });

      await new Promise((resolve, reject) => {
        imageStream.on('error', reject);
        imageStream.on('finish', resolve);
        imageStream.end(imageFile.buffer);
      });

      const [url] = await imageBlob.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });

      data.ImageUrl = url;
    }

    const productId = await Product.createProduct(data);
    const product = await Product.getProductById(productId);

    res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const data = {
      ...req.body,
      UpdatedBy: req.user?.UserId || null,
    };

    // Lấy thông tin sản phẩm cũ để xóa ảnh cũ nếu cần
    const oldProduct = await Product.getProductById(productId);

    // Nếu có file ảnh mới thì upload lên Firebase và cập nhật ImageUrl
    if (req.files && req.files.image && req.files.image[0]) {
      // Xóa ảnh cũ trên Firebase nếu có
      if (oldProduct && oldProduct.ImageUrl) {
        try {
          const match = oldProduct.ImageUrl.match(/products\/[^?]+/);
          if (match && match[0]) {
            await bucket.file(match[0]).delete();
          }
        } catch (err) {
          // Không cần throw, chỉ log nếu muốn
        }
      }

      const imageFile = req.files.image[0];
      const imageFileName = `products/${Date.now()}-${imageFile.originalname.replace(/\s+/g, '_')}`;
      const imageBlob = bucket.file(imageFileName);

      const imageStream = imageBlob.createWriteStream({
        metadata: { contentType: imageFile.mimetype }
      });

      await new Promise((resolve, reject) => {
        imageStream.on('error', reject);
        imageStream.on('finish', resolve);
        imageStream.end(imageFile.buffer);
      });

      const [url] = await imageBlob.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });

      data.ImageUrl = url;
    }

    const updated = await Product.updateProduct(productId, data);
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

const getComboChildren = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await Product.getComboChildren(productId);
    if (!result) return res.status(404).json({ error: "Combo product not found or not a combo" });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchProductsByName = async (req, res) => {
  try {
    const { name, page = 1, limit = 10, sortBy = "ProductName", sortOrder = "asc" } = req.query;
    const result = await Product.searchProductsByName(name, parseInt(page), parseInt(limit), sortBy, sortOrder);
    res.json(result);
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
  getComboChildren,
  searchProductsByName,
};