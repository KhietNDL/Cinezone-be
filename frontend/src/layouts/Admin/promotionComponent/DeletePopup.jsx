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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-2">
      <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center shadow-xl min-w-[280px] max-w-[90vw]">
        <RiDeleteBin5Line className="text-red-500" size={32} />
        <div className="font-semibold text-base sm:text-lg text-gray-700 my-2 text-center">
          Are you sure you want to delete this promotion?
        </div>
        <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4">
          <button
            onClick={() => setShowDeletePopup(false)}
            className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm sm:text-base"
            disabled={loading}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
