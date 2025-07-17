import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaCirclePlus } from "react-icons/fa6";
import { GrView } from "react-icons/gr";

const ProductTable = ({
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
    <div className="w-full overflow-x-auto hidden md:block">
      <table className="min-w-[700px] w-full table-auto border-collapse">
        <thead>
          <tr className="text-left text-slate-500 text-sm border-b border-slate-200">
            <th className="py-2 text-center w-[90px] ">Image</th>
            <th className="py-2 px-2 w-[110px] sm:w-[130px]">Product Name</th>
            <th className="py-2 text-center w-[50px]">Unit</th>
            <th className="py-2 text-center w-[80px]">Price</th>
            <th className="py-2 text-center w-[70px]">Quantity</th>
            <th className="py-2 text-center w-[70px]">Status</th>
            <th className="py-2 text-center w-[90px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const stockStatus = getStockStatus(product.Quantity);
            return (
              <tr
                key={product.ProductId}
                className="border-b border-slate-200 hover:bg-slate-100 hover:rounded-lg cursor-pointer text-sm"
              >
                <td className="py-2 text-center w-[90px]">
                  {product.ImageUrl ? (
                    <img
                      src={product.ImageUrl}
                      alt={product.ProductName}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded mx-auto"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No image</span>
                  )}
                </td>
                <td className="px-2 py-2 w-[110px] sm:w-[130px]">
                  <div>
                    <div className="text-xs font-medium text-gray-900 line-clamp-1">
                      {product.ProductName}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {product.Description}
                    </div>
                  </div>
                </td>
                <td className="py-2 text-center w-[50px] ">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {product.Unit}
                  </span>
                </td>
                <td className="py-2 text-center w-[80px]">
                  <span className="font-medium text-gray-900 text-xs">
                    {formatPrice(product.Price)}
                  </span>
                </td>
                <td className="py-2 text-center w-[70px]">
                  <span className="font-medium text-gray-900 text-xs">
                    {product.Quantity}
                  </span>
                </td>
                <td className="py-2 text-center w-[70px]">
                  <span
                    className={`px-2 py-1 rounded-full font-semibold text-xs ${stockStatus.class}`}
                  >
                    {stockStatus.status}
                  </span>
                </td>
                <td className="px-2 py-2 text-xs font-medium w-[90px]">
                  <div className="flex items-center justify-center gap-1 flex-wrap">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-500 hover:text-blue-700 cursor-pointer"
                      title="Edit"
                      aria-label="Edit product"
                    >
                      <FaRegEdit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowDeletePopup(true);
                      }}
                      className="text-red-400 hover:text-red-600 cursor-pointer"
                      title="Delete"
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
                        className="text-purple-500 hover:text-purple-600 cursor-pointer"
                        title="Add Item"
                        aria-label="Add item to combo"
                      >
                        <FaCirclePlus size={16} />
                      </button>
                    )}
                    {product.Unit === "Combo" && (
                      <button
                        onClick={() => handleViewComboDetail(product.ProductId)}
                        className="text-emerald-600 hover:text-emerald-800 cursor-pointer"
                        title="View Combo Items"
                        aria-label="View combo items"
                      >
                        <GrView size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
