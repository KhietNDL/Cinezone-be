import React from "react";
import { MdDeleteForever } from "react-icons/md";

const DeletePopup = ({ confirmDelete, setShowDeletePopup, selectedMovie }) => {
  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px]">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <MdDeleteForever className="text-red-500" size={24} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Delete Movie</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete{" "}
            <strong>{selectedMovie?.NameOfEnglish}</strong>? This action cannot
            be undone.
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setShowDeletePopup(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
