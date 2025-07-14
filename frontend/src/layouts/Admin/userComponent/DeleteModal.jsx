import React from "react";

const DeleteModal = ({
  showDeleteModal,
  setShowDeleteModal,
  selectedUser,
  confirmDeleteUser,
  deleteLoading,
}) => {
  if (!showDeleteModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white text-black rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-red-600">
          Delete User
        </h2>
        <p className="mb-4 sm:mb-6 text-xs sm:text-sm">
          Are you sure you want to delete user{" "}
          <strong>{selectedUser?.FullName || "this user"}</strong>? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-2 sm:gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            disabled={deleteLoading}
            className="px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-xs sm:text-sm"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteUser}
            disabled={deleteLoading}
            className="px-3 sm:px-4 py-1 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center text-xs sm:text-sm"
            aria-label="Delete user"
          >
            {deleteLoading ? (
              <>
                <div className="animate-spin rounded-full h-3 sm:h-4 w-3 sm:w-4 border-b-2 border-white mr-1 sm:mr-2"></div>
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

export default DeleteModal;
