import { ProductCard } from "../../../component/productCard";


const ProductsSection = ({ product, selectedProducts, onProductSelect }) => {
  return (
    product &&
    product.length > 0 && (
      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-4 md:p-6 lg:p-8 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg md:text-xl font-bold text-white">
            Snacks & Drinks
          </h3>
          {selectedProducts.length > 0 && (
            <div className="flex items-center gap-2 text-blue-400">
              <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
              <span className="text-sm">
                {selectedProducts.length} item
                {selectedProducts.length > 1 ? "s" : ""} selected
              </span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {product
            .filter((p) => !p.IsDeleted && p.Quantity > 0)
            .map((prod) => {
              const currentQuantity =
                selectedProducts.find((sp) => sp.ProductId === prod.ProductId)
                  ?.selectedQuantity || 0;
              return (
                <ProductCard
                  key={prod.ProductId}
                  product={prod}
                  quantity={currentQuantity}
                  onQuantityChange={onProductSelect}
                  disabled={false}
                  maxQuantity={prod.Quantity}
                />
              );
            })}
        </div>
      </div>
    )
  );
};

export default ProductsSection;
