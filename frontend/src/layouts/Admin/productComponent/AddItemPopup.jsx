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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden border border-gray-100 transform transition-all duration-300 animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 px-8 py-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full transform -translate-x-12 translate-y-12"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1">
                  Add to Combo
                </h2>
                <p className="text-emerald-100 text-sm font-medium">
                  Enhance your combo with more items
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAddItemPopup(false)}
              className="w-11 h-11 hover:bg-white/20 rounded-2xl transition-all duration-300 flex items-center justify-center group border border-white/20 hover:border-white/40"
              aria-label="Close"
            >
              <MdOutlineClose className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          <form className="space-y-8" onSubmit={handleAddItemToCombo}>
            {/* Product Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-emerald-600"
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
                <div>
                  <label className="block text-lg font-bold text-gray-800 flex items-center">
                    Select Product <span className="text-red-500 ml-1">*</span>
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Choose from available products
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {products
                  .filter((p) => p.Unit !== "Combo")
                  .map((p) => (
                    <div
                      key={p.ProductId}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                        addItemProductId === p.ProductId
                          ? "border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-lg shadow-emerald-200/50"
                          : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md"
                      }`}
                      onClick={() => setAddItemProductId(p.ProductId)}
                      tabIndex={0}
                      role="button"
                      aria-pressed={addItemProductId === p.ProductId}
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          checked={addItemProductId === p.ProductId}
                          onChange={() => setAddItemProductId(p.ProductId)}
                          className="w-5 h-5 text-emerald-600 border-gray-300 focus:ring-emerald-500 focus:ring-2"
                        />
                        {addItemProductId === p.ProductId && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                        )}
                      </div>
                      <div className="relative">
                        <img
                          src={
                            p.ImageUrl ||
                            "https://via.placeholder.com/48x48?text=No+Image"
                          }
                          alt={p.ProductName}
                          className="w-14 h-14 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-base truncate">
                          {p.ProductName}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Unit: {p.Unit}
                        </p>
                      </div>
                      {addItemProductId === p.ProductId && (
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
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
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
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
                <div>
                  <label className="block text-lg font-bold text-gray-800 flex items-center">
                    Quantity <span className="text-red-500 ml-1">*</span>
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Enter the desired quantity
                  </p>
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  value={addItemQuantity}
                  onChange={(e) => setAddItemQuantity(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-gray-900 placeholder-gray-500 text-lg font-medium"
                  min={1}
                  placeholder="Enter quantity"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-emerald-600"
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
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowAddItemPopup(false)}
                className="px-8 py-4 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all duration-300 font-semibold shadow-sm hover:shadow-md transform hover:scale-105"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 transform hover:scale-105"
                disabled={loading || !addItemProductId}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span>Add to Combo</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200 flex flex-col items-center max-w-xs mx-auto">
              <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-6"></div>
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
