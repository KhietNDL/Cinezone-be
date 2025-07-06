import { useState } from "react";

export const ProductCard = ({ product, onQuantityChange }) => {
    const [quantity, setQuantity] = useState(0);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 0 && newQuantity <= product.Quantity) {
            setQuantity(newQuantity);
            onQuantityChange(product, newQuantity);
        }
    };
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };
    return (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-purple-400/30 transition-all duration-300 group">
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
            </div>

            <div className="space-y-3">
                <div>
                    <h4 className="font-bold text-white text-base truncate">{product.ProductName}</h4>
                    <p className="text-gray-300 text-sm mt-1 overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}>{product.Description}</p>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-purple-300 font-bold text-lg">{formatPrice(parseFloat(product.Price))}</span>
                        <span className="text-gray-400 text-sm ml-1">/{product.Unit}</span>
                    </div>
                    <span className="text-gray-400 text-xs">Stock: {product.Quantity}</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 0}
                            className="w-8 h-8 rounded-full bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed border border-purple-400/30 flex items-center justify-center text-purple-300 hover:text-purple-200 transition-all"
                        >
                            -
                        </button>
                        <span className="w-8 text-center text-white font-semibold">{quantity}</span>
                        <button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            disabled={quantity >= product.Quantity}
                            className="w-8 h-8 rounded-full bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed border border-purple-400/30 flex items-center justify-center text-purple-300 hover:text-purple-200 transition-all"
                        >
                            +
                        </button>
                    </div>

                    {quantity > 0 && (
                        <div className="text-right">
                            <div className="text-white font-bold text-sm">
                                {formatPrice(parseFloat(product.Price) * quantity)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};