import { useState, useEffect } from "react";

export const ProductCard = ({
  product,
  onQuantityChange,
  quantity: externalQuantity = 0, // Props từ parent
  disabled = false,
  maxQuantity = null,
}) => {
  const [quantity, setQuantity] = useState(externalQuantity);

  // Sync với props từ parent component
  useEffect(() => {
    setQuantity(externalQuantity);
  }, [externalQuantity, product.ProductId, product.ProductName]);

  // Calculate max quantity (từ props hoặc product stock)
  const maxQty = maxQuantity || product.Quantity;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 0 && newQuantity <= maxQty && !disabled) {
      setQuantity(newQuantity);
      // Call parent callback với product và quantity
      if (onQuantityChange) {
        onQuantityChange(product, newQuantity);
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div
      className={`bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-purple-400/30 transition-all duration-300 group ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <div className="relative overflow-hidden rounded-xl mb-4">
        {product.ImageUrl ? (
          <img
            src={product.ImageUrl}
            alt={product.ProductName}
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <div className="text-4xl text-purple-300/50">🍿</div>
          </div>
        )}
        {product.Quantity <= 10 && (
          <div className="absolute top-2 right-2 bg-red-500/90 text-white text-xs px-2 py-1 rounded-full">
            Low Stock
          </div>
        )}
        {disabled && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-sm font-medium">Processing...</div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="font-bold text-white text-base truncate">
            {product.ProductName}
          </h4>
          <p
            className="text-gray-300 text-sm mt-1 overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.Description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-purple-300 font-bold text-lg">
              {formatPrice(parseFloat(product.Price))}
            </span>
            <span className="text-gray-400 text-sm ml-1">/{product.Unit}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 0 || disabled}
              className="w-8 h-8 rounded-full bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed border border-purple-400/30 flex items-center justify-center text-purple-300 hover:text-purple-200 transition-all"
            >
              -
            </button>
            <span className="w-8 text-center text-white font-semibold">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= maxQty || disabled}
              className="w-8 h-8 rounded-full bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed border border-purple-400/30 flex items-center justify-center text-purple-300 hover:text-purple-200 transition-all"
            >
              +
            </button>
          </div>

         
        </div>

        {/* Selected indicator */}
        {quantity > 0 && (
          <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-2 mt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-300 font-medium">Selected</span>
              <span className="text-white font-bold">
                {quantity} × {formatPrice(parseFloat(product.Price))}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
