import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaCirclePlus } from "react-icons/fa6";
import { GrView } from "react-icons/gr";

const ProductCards = ({
  products,
  handleEdit,
  setSelectedProduct,
  setShowDeletePopup,
  setComboIdForAddItem,
  setShowAddItemPopup,
  handleViewComboDetail,
  getStockStatus,
  formatPrice,
}) => {
  return (
    <div className="block sm:hidden space-y-4">
      {products.map((product) => {
        const stockStatus = getStockStatus(product.Quantity);
        return (
          <article
            key={product.ProductId}
            className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              {product.ImageUrl ? (
                <img
                  src={product.ImageUrl}
                  alt={product.ProductName}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                  <span className="text-gray-400 text-xs text-center">
                    No image
                  </span>
                </div>
              )}
              <div className="flex-1 w-[200px]">
                <h3 className="text-sm font-semibold text-gray-900 break-words mb-1">
                  {product.ProductName}
                </h3>
                <p className="text-xs text-gray-600 break-words line-clamp-2">
                  {product.Description}
                </p>
              </div>
            </div>

            <div className="mt-4 bg-gradient-to-br from-purple-50 to-indigo-50 p-3 rounded-lg border border-purple-100">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-gray-600 font-medium">Unit:</span>
                  <span className="text-gray-800 font-semibold">
                    {product.Unit}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-600 font-medium">Price:</span>
                  <span className="text-purple-600 font-bold">
                    {formatPrice(product.Price)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-600 font-medium">Quantity:</span>
                  <span className="text-gray-800 font-semibold">
                    {product.Quantity}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-600 font-medium">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.class}`}
                  >
                    {stockStatus.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-200">
              <button
                onClick={() => handleEdit(product)}
                className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                aria-label="Edit product"
                title="Edit product"
              >
                <FaRegEdit size={16} />
              </button>
              <button
                onClick={() => {
                  setSelectedProduct(product);
                  setShowDeletePopup(true);
                }}
                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                aria-label="Delete product"
                title="Delete product"
              >
                <RiDeleteBin5Line size={16} />
              </button>
              {product.Unit === "Combo" && (
                <>
                  <button
                    onClick={() => {
                      setComboIdForAddItem(product.ProductId);
                      setShowAddItemPopup(true);
                    }}
                    className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                    title="Add Item to Combo"
                    aria-label="Add item to combo"
                  >
                    <FaCirclePlus size={16} />
                  </button>
                  <button
                    onClick={() => handleViewComboDetail(product.ProductId)}
                    className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all duration-200"
                    title="View Combo Details"
                    aria-label="View combo items"
                  >
                    <GrView size={16} />
                  </button>
                </>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default ProductCards;
