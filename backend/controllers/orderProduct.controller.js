const OrderProduct = require('../models/orderProduct.model');

exports.getAll = async (req, res) => {
  try {
    const data = await OrderProduct.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await OrderProduct.getById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const id = await OrderProduct.create(req.body);
    res.status(201).json({ OrderProductId: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await OrderProduct.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await OrderProduct.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.holdOrder = async (req, res) => {
  try {
    const { MemberId, products, Notes } = req.body;
    const CreatedBy = req.user ? req.user.id : null; // Assuming user ID is available in req.user
    if (!MemberId || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'MemberId và products là bắt buộc' });
    }
    const result = await OrderProduct.holdOrder({ MemberId, products, Notes, CreatedBy });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.confirmOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await OrderProduct.confirmOrder(id);
    if (!success) return res.status(400).json({ error: 'Order not in holding state or not found' });
    res.json({ message: 'Order confirmed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkinOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await OrderProduct.checkinOrder(id);
    if (!success) return res.status(400).json({ error: 'Order not in confirmed state or not found' });
    res.json({ message: 'Order checked-in successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await OrderProduct.cancelOrder(id);
    if (!success) return res.status(400).json({ error: 'Order not in holding/confirmed state or not found' });
    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderProductDetail = async (req, res) => {
  try {
    const { orderProductId } = req.params;
    const detail = await OrderProduct.getOrderProductDetail(orderProductId);
    if (!detail) {
      return res.status(404).json({ error: 'OrderProduct not found' });
    }
    res.json({ status: 'success', data: detail });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};