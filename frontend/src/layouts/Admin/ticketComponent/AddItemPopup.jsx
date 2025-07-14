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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-hidden border border-gray-100 animate-slideUp">
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 px-6 py-5 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg
                  className="w-6 h-6 text-white"
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
                <h2 className="text-xl font-bold tracking-tight">
                  Add to Combo
                </h2>
                <p className="text-emerald-100 text-sm mt-1">
                  Add item to existing combo
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowAddItemPopup(false)}
              className="w-10 h-10 hover:bg-white/10 rounded-xl transition-all duration-200 flex items-center justify-center group"
              aria-label="Close"
            >
              <MdOutlineClose className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-180px)]">
          <form className="space-y-6" onSubmit={handleAddItemToCombo}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                Select Product <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="grid grid-cols-1 gap-3 max-h-56 overflow-y-auto">
                {products
                  .filter((p) => p.Unit !== "Combo")
                  .map((p) => (
                    <div
                      key={p.ProductId}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-150 ${
                        addItemProductId === p.ProductId
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 bg-white hover:border-emerald-300"
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
                        className="accent-emerald-500"
                      />
                      <img
                        src={
                          p.ImageUrl ||
                          "https://via.placeholder.com/40x40?text=No+Image"
                        }
                        alt={p.ProductName}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                      />
                      <span className="font-medium text-gray-800 text-base">
                        {p.ProductName}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                Quantity <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={addItemQuantity}
                  onChange={(e) => setAddItemQuantity(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  min={1}
                  placeholder="Enter quantity"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
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
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowAddItemPopup(false)}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-xl transition-all duration-200 font-medium shadow-sm"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
                    <span>Add Item</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-200 flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
              <div className="font-semibold text-lg text-gray-800">
                Adding Item...
              </div>
              <div className="text-gray-600 text-sm mt-1">
                Please wait a moment
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddItemPopup;
