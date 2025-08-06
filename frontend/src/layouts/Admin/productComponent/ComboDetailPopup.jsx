import React, { useState } from "react";
import {
  X,
  ShoppingBag,
  Star,
  Package,
  Clock,
  Gift,
  Edit3,
  Trash2,
  Check,
  X as Cancel,
} from "lucide-react";

const ComboDetailPopup = ({
  showComboDetail,
  setShowComboDetail,
  comboDetail,
  handleUpdateComboItem,
  handleDeleteComboItem,
}) => {
  const [editingItemId, setEditingItemId] = useState(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  if (!showComboDetail || !comboDetail) return null;

  const handleEditClick = (item) => {
    setEditingItemId(item.ComboProductId);
    setEditQuantity(item.Quantity.toString());
  };

  const handleSaveEdit = (comboProductId) => {
    if (editQuantity && parseInt(editQuantity) > 0) {
      handleUpdateComboItem(comboProductId, parseInt(editQuantity));
      setEditingItemId(null);
      setEditQuantity("");
    }
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditQuantity("");
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      handleDeleteComboItem(itemToDelete.ComboProductId);
      setShowDeletePopup(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setItemToDelete(null);
  };

  if (!showComboDetail || !comboDetail) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto border border-gray-100 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setShowComboDetail(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-purple-100 hover:bg-purple-200 transition-all duration-200 z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-purple-600" />
        </button>

        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 sm:px-6 py-3 sm:py-4 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                {comboDetail.combo.ProductName}
              </h2>
              <p className="text-purple-100 text-xs sm:text-sm mt-1 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Combo Package Details
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6">
          {/* Product Image Card */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 sm:p-6 rounded-xl border border-purple-100 mb-4 sm:mb-6">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
              <div className="flex-shrink-0">
                <img
                  src={comboDetail.combo.ImageUrl}
                  alt={comboDetail.combo.ProductName}
                  className="w-32 sm:w-40 h-32 sm:h-40 object-cover rounded-xl shadow-md mx-auto md:mx-0"
                />
              </div>

              <div className="flex-1">
                <p className="text-gray-700 mb-4 leading-relaxed text-sm sm:text-base">
                  {comboDetail.combo.Description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-purple-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <ShoppingBag className="w-4 h-4 text-purple-600" />
                      <span className="text-xs sm:text-sm font-medium text-purple-700">
                        Combo Price
                      </span>
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-purple-600">
                      {Number(comboDetail.combo.Price).toLocaleString("vi-VN")}{" "}
                      ₫
                    </div>
                  </div>

                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-purple-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Package className="w-4 h-4 text-purple-600" />
                      <span className="text-xs sm:text-sm font-medium text-purple-700">
                        Quantity
                      </span>
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-purple-600">
                      {comboDetail.combo.Quantity}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Combo Items Section */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
            <div className="p-4 sm:p-6 border-b border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <Star className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                </div>
                <h3 className="text-base sm:text-xl font-bold text-gray-800">
                  Products in Combo
                </h3>
                <div className="bg-purple-100 text-purple-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  {comboDetail.children.length} products
                </div>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto">
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                {comboDetail.children.map((item, index) => (
                  <div
                    key={item.ComboProductId}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white border border-purple-200 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="relative">
                      <img
                        src={item.ImageUrl}
                        alt={item.ProductName}
                        className="w-12 sm:w-16 h-12 sm:h-16 object-cover rounded-lg shadow-sm"
                      />
                      <div className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base truncate">
                        {item.ProductName}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                        {item.Description}
                      </p>

                      <div className="flex items-center gap-2 sm:gap-4 text-xs">
                        <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          <Package className="w-3 h-3" />
                          <span className="font-medium">{item.Unit}</span>
                        </div>

                        {/* Editable Quantity Section */}
                        {editingItemId === item.ComboProductId ? (
                          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                            <Clock className="w-3 h-3" />
                            <span className="font-medium mr-1">QTY:</span>
                            <input
                              type="number"
                              value={editQuantity}
                              onChange={(e) => setEditQuantity(e.target.value)}
                              className="w-12 px-1 py-0.5 text-xs border border-yellow-300 rounded text-center bg-white"
                              min="1"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            <Clock className="w-3 h-3" />
                            <span className="font-medium">
                              QTY: {item.Quantity}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-1">
                      {editingItemId === item.ComboProductId ? (
                        // Edit mode buttons
                        <>
                          <button
                            onClick={() => handleSaveEdit(item.ComboProductId)}
                            className="p-1.5 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors duration-200"
                            title="Save changes"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors duration-200"
                            title="Cancel"
                          >
                            <Cancel className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        // Normal mode buttons
                        <>
                          <button
                            onClick={() => handleEditClick(item)}
                            className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors duration-200"
                            title="Edit quantity"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors duration-200"
                            title="Remove from combo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-purple-50/30 px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 rounded-b-xl">
          <div className="flex items-center gap-2 text-gray-600">
            <Star className="w-4 h-4" />
            <span className="text-xs sm:text-sm">
              Economical & Convenient Combo
            </span>
          </div>
          <button
            onClick={() => setShowComboDetail(false)}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg text-xs sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-100 relative animate-slideUp">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Confirm Product Deletion
              </h3>

              {itemToDelete && (
                <div className="mb-4">
                  <p className="text-gray-600 mb-3">
                    Are you sure you want to remove this product from the combo?
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <img
                        src={itemToDelete.ImageUrl}
                        alt={itemToDelete.ProductName}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="text-left">
                        <p className="font-semibold text-gray-800">
                          {itemToDelete.ProductName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {itemToDelete.Quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <button
                  onClick={cancelDelete}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComboDetailPopup;
