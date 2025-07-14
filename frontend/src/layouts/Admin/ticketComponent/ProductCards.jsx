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
            className="bg-white p-4 rounded-lg shadow-sm border border-slate-200"
          >
            <div className="flex items-center gap-4">
              {product.ImageUrl ? (
                <img
                  src={product.ImageUrl}
                  alt={product.ProductName}
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                <span className="text-gray-400 italic">No image</span>
              )}
              <div className="flex-1 w-[200px]">
                <h3 className="text-sm font-medium text-gray-900 break-words">
                  {product.ProductName}
                </h3>
                <p className="text-xs text-gray-500 break-words">
                  {product.Description}
                </p>
              </div>
            </div>
            <div className="mt-4 text-xs grid grid-cols-2 gap-2 text-gray-700">
              <p>
                <strong>Unit:</strong> {product.Unit}
              </p>
              <p>
                <strong>Price:</strong> {formatPrice(product.Price)}
              </p>
              <p>
                <strong>Quantity:</strong> {product.Quantity}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs ${stockStatus.class}`}
                >
                  {stockStatus.status}
                </span>
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(product)}
                className="text-blue-500 hover:text-blue-700"
                aria-label="Edit product"
              >
                <FaRegEdit size={16} />
              </button>
              <button
                onClick={() => {
                  setSelectedProduct(product);
                  setShowDeletePopup(true);
                }}
                className="text-red-400 hover:text-red-600"
                aria-label="Delete product"
              >
                <RiDeleteBin5Line size={16} />
              </button>
              {product.Unit === "Combo" && (
                <button
                  onClick={() => {
                    setComboIdForAddItem(product.ProductId);
                    setShowAddItemPopup(true);
                  }}
                  className="text-purple-500 hover:text-purple-700 cursor-pointer"
                  title="Add Item"
                  aria-label="Add item to combo"
                >
                  <FaCirclePlus size={16} />
                </button>
              )}
              {product.Unit === "Combo" && (
                <button
                  onClick={() => handleViewComboDetail(product.ProductId)}
                  className="text-emerald-600 hover:text-emerald-800 text-xs"
                  aria-label="View combo items"
                >
                  <GrView size={16} />
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default ProductCards;
