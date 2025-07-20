import React from "react";
import { RiDeleteBin5Line } from "react-icons/ri";

const DeletePopup = ({
  showDeletePopup,
  setShowDeletePopup,
  handleDelete,
  loading,
}) => {
  if (!showDeletePopup) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-slideUp border border-gray-100">
        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping"></div>
            <div className="relative w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <RiDeleteBin5Line className="text-white text-2xl" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Delete Product
          </h3>

          {/* Message */}
          <p className="text-gray-600 text-base mb-2 leading-relaxed">
            Are you sure you want to delete this product?
          </p>
          <p className="text-sm text-gray-500 mb-8">
            This action cannot be undone and will permanently remove the product
            from your inventory.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowDeletePopup(false)}
              className="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading}
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
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <RiDeleteBin5Line className="text-lg" />
                  <span>Delete</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-3xl">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
              <div className="text-center">
                <div className="font-semibold text-lg text-gray-800 mb-1">
                  Deleting Product...
                </div>
                <div className="text-gray-600 text-sm">
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

export default DeletePopup;
