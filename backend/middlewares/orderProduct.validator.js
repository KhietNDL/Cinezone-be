/**
 * Validate order product creation input
 */
function orderProductValidator(req, res, next) {
  const { MemberId, products, Notes, CreatedBy } = req.body;

  if (!MemberId || typeof MemberId !== 'string') {
    return res.status(400).json({ error: 'MemberId is required and must be a string' });
  }
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: 'Products must be a non-empty array' });
  }
  for (const p of products) {
    if (!p.ProductId || typeof p.ProductId !== 'string') {
      return res.status(400).json({ error: 'Each product must have a valid ProductId' });
    }
    if (
      typeof p.Quantity !== 'number' ||
      !Number.isInteger(p.Quantity) ||
      p.Quantity <= 0
    ) {
      return res.status(400).json({ error: 'Each product must have Quantity as a positive integer' });
    }
  }
  // Notes, CreatedBy có thể kiểm tra thêm nếu muốn
  next();
}

module.exports = { orderProductValidator };