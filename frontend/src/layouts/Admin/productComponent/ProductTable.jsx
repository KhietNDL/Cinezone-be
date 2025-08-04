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
          <tr className="text-left text-slate-600 text-xs sm:text-sm border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-purple-50/30">
            <th className="py-3 px-3 sm:px-4 text-center font-semibold">
              Image
            </th>
            <th className="py-3 px-3 sm:px-4 text-left font-semibold">
              Product Name
            </th>
            <th className="py-3 px-3 sm:px-4 text-center font-semibold">
              Unit
            </th>
            <th className="py-3 px-3 sm:px-4 text-center font-semibold">
              Price
            </th>
            <th className="py-3 px-3 sm:px-4 text-center font-semibold">
              Quantity
            </th>
            <th className="py-3 px-3 sm:px-4 text-center font-semibold">
              Status
            </th>
            <th className="py-3 px-3 sm:px-4 text-center font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const stockStatus = getStockStatus(product.Quantity);
            return (
              <tr
                key={product.ProductId}
                className="border-b cursor-pointer border-gray-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 text-xs sm:text-sm transition-all duration-200 group"
              >
                <td className="py-3 px-3 sm:px-4 text-center">
                  {product.ImageUrl ? (
                    <div className="flex justify-center">
                      <img
                        src={product.ImageUrl}
                        alt={product.ProductName}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto border border-gray-200">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                </td>
                <td className="py-3 px-3 sm:px-4">
                  <div>
                    <div className="font-medium text-gray-800 group-hover:text-purple-700 transition-colors duration-200 line-clamp-1 mb-1">
                      {product.ProductName}
                    </div>
                    <div className="text-xs text-gray-600 line-clamp-1">
                      {product.Description}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 sm:px-4 text-center">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {product.Unit}
                  </span>
                </td>
                <td className="py-3 px-3 sm:px-4 text-center">
                  <span className="font-medium text-gray-600">
                    {formatPrice(product.Price)}
                  </span>
                </td>
                <td className="py-3 px-3 sm:px-4 text-center">
                  <span className="font-medium text-gray-600">
                    {product.Quantity}
                  </span>
                </td>
                <td className="py-3 px-3 sm:px-4 text-center">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${stockStatus.class}`}
                  >
                    {stockStatus.status}
                  </span>
                </td>
                <td className="py-3 px-3 sm:px-4 text-center">
                  <div className="flex justify-center space-x-1 sm:space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                      title="Edit product"
                      aria-label="Edit product"
                    >
                      <FaRegEdit size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowDeletePopup(true);
                      }}
                      className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                      title="Delete product"
                      aria-label="Delete product"
                    >
                      <RiDeleteBin5Line size={14} />
                    </button>
                    {product.Unit === "Combo" && (
                      <>
                        <button
                          onClick={() => {
                            setComboIdForAddItem(product.ProductId);
                            setShowAddItemPopup(true);
                          }}
                          className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                          title="Add Item to Combo"
                          aria-label="Add item to combo"
                        >
                          <FaCirclePlus size={14} />
                        </button>
                        <button
                          onClick={() =>
                            handleViewComboDetail(product.ProductId)
                          }
                          className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                          title="View Combo Details"
                          aria-label="View combo items"
                        >
                          <GrView size={14} />
                        </button>
                      </>
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
