import React from "react";
import { MdOutlineClose } from "react-icons/md";

const PromotionFormPopup = ({
  showFormPopup,
  setShowFormPopup,
  isEdit,
  title,
  setTitle,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  discountValue,
  setDiscountValue,
  detail,
  setDetail,
  imagePreview,
  handleSubmit,
  handleImageChange,
  resetForm,
  loading,
}) => {
  if (!showFormPopup) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full min-w-[300px] max-w-[90vw] sm:max-w-xl max-h-[95vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-3 sm:py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold">
                {isEdit ? "Edit Promotion" : "Add New Promotion"}
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">
                {isEdit
                  ? "Update the details below to edit the promotion"
                  : "Fill in the details below to add a promotion"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowFormPopup(false);
                resetForm();
              }}
              className="p-1 sm:p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close"
            >
              <MdOutlineClose size={30} />
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-170px)]">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2"
                >
                  Promotion Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Enter promotion name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="discountValue"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2"
                >
                  Value <span className="text-red-500">*</span>
                </label>
                <input
                  id="discountValue"
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="e.g. 25 or 10"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="startTime"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2"
                >
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="startTime"
                  type="date"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="endTime"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2"
                >
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="endTime"
                  type="date"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="detail"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2"
                >
                  Detail
                </label>
                <input
                  id="detail"
                  type="text"
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Promotion detail"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="image"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2"
                >
                  Image
                </label>
                <div className="flex items-center gap-3 sm:gap-4">
                  <label className="cursor-pointer flex flex-col items-center">
                    <span className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-100 text-sm sm:text-base">
                      Choose Image
                    </span>
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
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded border border-gray-200"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowFormPopup(false);
                  resetForm();
                }}
                className="px-4 sm:px-6 py-2 sm:py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm sm:text-base"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm sm:text-base"
                disabled={loading}
              >
                {isEdit ? "Save Promotion" : "Add Promotion"}
              </button>
            </div>
          </form>
        </div>
        {loading && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center shadow-xl">
              <svg
                className="animate-spin h-6 sm:h-8 w-6 sm:w-8 text-blue-600 mb-3 sm:mb-4"
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
              <div className="font-semibold text-base sm:text-lg text-blue-700">
                {isEdit
                  ? "Đang cập nhật khuyến mãi..."
                  : "Đang thêm khuyến mãi..."}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionFormPopup;
