import React, { useState } from "react";
import { MdOutlineClose } from "react-icons/md";

const ProductFormPopup = ({
  showFormPopup,
  setShowFormPopup,
  isEdit,
  productName,
  setProductName,
  description,
  setDescription,
  unit,
  setUnit,
  price,
  setPrice,
  quantity,
  setQuantity,
  imagePreview,
  handleSubmit,
  handleImageChange,
  resetForm,
  loading,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const unitOptions = [
    { value: "Box", label: "📦 Box", icon: "📦" },
    { value: "Cup", label: "☕ Cup", icon: "☕" },
    { value: "Combo", label: "🎯 Combo", icon: "🎯" },
  ];

  const selectedOption = unitOptions.find((option) => option.value === unit);

  if (!showFormPopup) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 sm:px-6 py-3 sm:py-4 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                {isEdit ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="text-purple-100 text-xs sm:text-sm mt-1">
                {isEdit
                  ? "Update your product information"
                  : "Create a new product entry"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowFormPopup(false);
                resetForm();
              }}
              className="p-2 hover:bg-purple-700 rounded-xl transition-all duration-200 hover:scale-110"
              aria-label="Close"
            >
              <MdOutlineClose className="w-5 sm:w-6 h-5 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {/* Product Information Section */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 sm:p-6 rounded-xl border border-purple-100">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                Product Information
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Fill in the basic details of your product
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Product Name */}
                <div>
                  <label
                    htmlFor="productName"
                    className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    Product Name <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="productName"
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-xs sm:text-sm hover:border-gray-400"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                {/* Unit */}
                <div>
                  <label
                    htmlFor="unit"
                    className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    Unit <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-xs sm:text-sm hover:border-gray-400 bg-white text-left flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        {selectedOption ? (
                          <>
                            <span className="text-base">
                              {selectedOption.icon}
                            </span>
                            <span className="text-gray-900">
                              {selectedOption.value}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-500">Select unit</span>
                        )}
                      </span>
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                        {unitOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setUnit(option.value);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-purple-50 transition-colors duration-200 flex items-center gap-3 text-xs sm:text-sm ${
                              unit === option.value
                                ? "bg-purple-50 text-purple-700 border-r-2 border-purple-500"
                                : "text-gray-700 hover:text-purple-600"
                            }`}
                          >
                            <span className="text-base">{option.icon}</span>
                            <span className="font-medium">{option.value}</span>
                            {unit === option.value && (
                              <svg
                                className="w-4 h-4 text-purple-600 ml-auto"
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
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label
                    htmlFor="price"
                    className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    Price (VND) <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-xs sm:text-sm hover:border-gray-400"
                    placeholder="e.g. 50,000"
                    required
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label
                    htmlFor="quantity"
                    className="text-sm font-semibold text-gray-700 mb-2 flex items-center"
                  >
                    Quantity <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-xs sm:text-sm hover:border-gray-400"
                    placeholder="e.g. 100"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-xs sm:text-sm hover:border-gray-400 resize-none"
                    placeholder="Enter product description..."
                    rows="3"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="image"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Product Image
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer">
                      <div className="px-4 py-2.5 bg-purple-100 border border-purple-200 rounded-xl hover:bg-purple-200 transition-all duration-200 flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="text-purple-700 font-medium text-sm">
                          Choose Image
                        </span>
                      </div>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-purple-50/30 px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 rounded-b-xl">
              <button
                type="button"
                onClick={() => {
                  setShowFormPopup(false);
                  resetForm();
                }}
                className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-xl font-medium transition-all duration-200 text-xs sm:text-sm shadow-sm hover:shadow-md"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs sm:text-sm"
                disabled={loading}
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
                    Processing...
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
                    {isEdit ? "Save Changes" : "Add Product"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Backdrop to close dropdown */}
        {isDropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}

        {loading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-xl border border-gray-200 flex flex-col items-center">
              <div className="w-10 sm:w-12 h-10 sm:h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-3 sm:mb-4"></div>
              <div className="text-center">
                <div className="font-semibold text-base sm:text-lg text-gray-800 mb-1">
                  Processing...
                </div>
                <div className="text-gray-600 text-xs sm:text-sm">
                  Please wait a moment
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFormPopup;
