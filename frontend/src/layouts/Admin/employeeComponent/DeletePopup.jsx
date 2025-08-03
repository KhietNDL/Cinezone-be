import React from "react";

const DeletePopup = ({
  confirmDelete,
  setShowDeletePopup,
  selectedEmployee,
  deleteLoading,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white text-black rounded-xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md shadow-2xl border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-red-600">
            Delete Employee
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Are you sure you want to delete employee{" "}
            <span className="font-bold text-gray-800">
              {selectedEmployee?.FullName || "this employee"}
            </span>
            ? This action cannot be undone.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <button
            onClick={() => setShowDeletePopup(false)}
            disabled={deleteLoading}
            className="px-6 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 text-sm font-medium transition-all duration-200 hover:border-gray-400 flex-1"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            disabled={deleteLoading}
            className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 flex items-center justify-center text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex-1"
            aria-label="Delete employee"
          >
            {deleteLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
