import React from "react";
import { MdOutlineClose } from "react-icons/md";

const AddItemPopup = ({
  showAddItemPopup,
  setShowAddItemPopup,
  products,
  addItemProductId,
  setAddItemProductId,
  addItemQuantity,
  setAddItemQuantity,
  handleAddItemToCombo,
  loading,
}) => {
  if (!showAddItemPopup) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Add to Combo</h2>
              <p className="text-purple-100 text-xs sm:text-sm mt-1">
                Enhance your combo with more items
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddItemPopup(false)}
              className="p-2 hover:bg-purple-700 rounded-xl transition-all duration-200 hover:scale-110"
              aria-label="Close"
            >
              <MdOutlineClose className="w-5 sm:w-6 h-5 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <form
            className="space-y-4 sm:space-y-6"
            onSubmit={handleAddItemToCombo}
          >
            {/* Product Selection */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 sm:p-5 rounded-xl border border-purple-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                Select Product <span className="text-red-500 ml-1">*</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Choose from available products
              </p>

              <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                {products
                  .filter((p) => p.Unit !== "Combo")
                  .map((p) => (
                    <div
                      key={p.ProductId}
                      className={`flex items-center gap-4 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        addItemProductId === p.ProductId
                          ? "border-purple-500 bg-purple-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm"
                      }`}
                      onClick={() => setAddItemProductId(p.ProductId)}
                      tabIndex={0}
                      role="button"
                      aria-pressed={addItemProductId === p.ProductId}
                    >
                      <input
                        type="radio"
                        checked={addItemProductId === p.ProductId}
                        onChange={() => setAddItemProductId(p.ProductId)}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500 focus:ring-2"
                      />
                      <img
                        src={
                          p.ImageUrl ||
                          "https://via.placeholder.com/48x48?text=No+Image"
                        }
                        alt={p.ProductName}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                          {p.ProductName}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Unit: {p.Unit}
                        </p>
                      </div>
                      {addItemProductId === p.ProductId && (
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Quantity Input */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 sm:p-5 rounded-xl border border-purple-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    />
                  </svg>
                </div>
                Quantity <span className="text-red-500 ml-1">*</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Enter the desired quantity
              </p>

              <input
                type="number"
                value={addItemQuantity}
                onChange={(e) => setAddItemQuantity(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-xs sm:text-sm hover:border-gray-400"
                min={1}
                placeholder="Enter quantity"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="bg-gradient-to-r from-gray-50 to-purple-50/30 px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 rounded-b-xl">
              <button
                type="button"
                onClick={() => setShowAddItemPopup(false)}
                className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-xl font-medium transition-all duration-200 text-xs sm:text-sm shadow-sm hover:shadow-md"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs sm:text-sm"
                disabled={loading || !addItemProductId}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Add to Combo
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-200 flex flex-col items-center max-w-xs mx-auto">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
              <div className="text-center">
                <div className="font-bold text-xl text-gray-800 mb-2">
                  Adding Item...
                </div>
                <div className="text-gray-600 text-sm">
                  Please wait while we process your request
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddItemPopup;
