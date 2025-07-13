import { useState } from "react";
import {
  MdClose,
  MdStar,
  MdStarBorder,
  MdRateReview,
  MdEdit,
  MdDelete,
  MdCancel,
  MdSave,
  MdWarning,
} from "react-icons/md";

const RatingListModal = ({
  isOpen,
  ratingsList,
  ratingsLoading,
  user,
  editingRatingId,
  editRatingValue,
  editRatingComment,
  editLoading,
  setEditingRatingId,
  setEditRatingValue,
  setEditRatingComment,
  setIsRatingListOpen,
  setIsFeedbackOpen,
  onUpdateRating,
  onDeleteRating,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingRatingId, setDeletingRatingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
    return `${Math.floor(diff / 31536000)} years ago`;
  };

  const handleClose = () => {
    setIsRatingListOpen(false);
    setEditingRatingId(null);
    setEditRatingValue(0);
    setEditRatingComment("");
    setHoveredStar(0);
  };

  const handleDeleteClick = (ratingId) => {
    setDeletingRatingId(ratingId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingRatingId) return;
    setIsDeleting(true);
    try {
      await onDeleteRating(deletingRatingId);
      setShowDeleteConfirm(false);
      setDeletingRatingId(null);
    } catch (error) {
      console.error("Error deleting rating:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingRatingId(null);
  };

  const handleEditStart = (rating) => {
    setEditingRatingId(rating.RatingId);
    setEditRatingValue(rating.Rating);
    setEditRatingComment(rating.Comment || "");
    setHoveredStar(0);
  };

  const handleEditCancel = () => {
    setEditingRatingId(null);
    setEditRatingValue(0);
    setEditRatingComment("");
    setHoveredStar(0);
  };

  if (!isOpen) return null;
  const ConfirmDeleteModal = ({ isOpen, onConfirm, onCancel, isDeleting }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300">
        <div className="bg-gradient-to-br from-red-900/90 via-red-800/90 to-red-700/90 rounded-2xl shadow-2xl p-6 w-full max-w-sm relative transform transition-all duration-300 animate-in slide-in-from-bottom-4 scale-in-95 border border-red-400/20">
          <div className="text-center mb-6">
            <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MdWarning className="text-red-400 text-3xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Rating</h3>
            <p className="text-white/70 text-sm">
              Are you sure you want to delete this rating? This action cannot be
              undone.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white/50"
              onClick={onCancel}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      {" "}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300">
        <div className="bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] rounded-3xl shadow-2xl p-8 w-full max-w-2xl relative border border-white/10 max-h-[90vh] flex flex-col">
          <button
            className="absolute top-4 right-4 text-white/60 hover:text-red-400 hover:bg-white/10 rounded-full p-2 transition-all duration-200 hover:scale-110"
            onClick={handleClose}
          >
            <MdClose className="text-xl" />
          </button>

          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <MdStar className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">All Ratings</h2>
            <p className="text-white/70 text-sm">See what others think</p>
          </div>

          <div className="flex-1 overflow-hidden">
            {ratingsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-white/80">Loading ratings...</span>
                </div>
              </div>
            ) : ratingsList.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="bg-white/5 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-4">
                    <MdStarBorder className="text-white/40 text-4xl" />
                  </div>
                  <h3 className="text-white/80 text-lg font-medium mb-2">
                    No ratings yet
                  </h3>
                  <p className="text-white/60 text-sm">
                    Be the first to share your thoughts!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto pr-2 max-h-[400px]">
                {ratingsList.map((rating) => {
                  const isMine =
                    user &&
                    (String(user.userId) === String(rating.UserId) ||
                      String(user.id) === String(rating.UserId) ||
                      String(user._id) === String(rating.UserId));

                  const isEditing = editingRatingId === rating.RatingId;

                  return (
                    <div
                      key={rating.RatingId}
                      className="group relative bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all duration-200 border border-white/10 hover:border-white/20"
                    >
                      {/* Action buttons - hover to show */}
                      {isMine && !isEditing && (
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
                          <button
                            className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                            onClick={() => handleEditStart(rating)}
                          >
                            <MdEdit className="text-sm" />
                          </button>
                          <button
                            className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400/50"
                            onClick={() => handleDeleteClick(rating.RatingId)}
                          >
                            <MdDelete className="text-sm" />
                          </button>
                        </div>
                      )}

                      {/* Rating header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {/* Stars */}
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  className="focus:outline-none transition-all duration-200 hover:scale-110 active:scale-95"
                                  onClick={() => setEditRatingValue(star)}
                                  onMouseEnter={() => setHoveredStar(star)}
                                  onMouseLeave={() => setHoveredStar(0)}
                                  disabled={editLoading}
                                >
                                  {(hoveredStar || editRatingValue) >= star ? (
                                    <MdStar className="text-yellow-400 text-xl" />
                                  ) : (
                                    <MdStarBorder className="text-yellow-400 text-xl opacity-60 hover:opacity-100" />
                                  )}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) =>
                                i < rating.Rating ? (
                                  <MdStar
                                    key={i}
                                    className="text-yellow-400 text-lg"
                                  />
                                ) : (
                                  <MdStarBorder
                                    key={i}
                                    className="text-yellow-400 text-lg opacity-50"
                                  />
                                )
                              )}
                            </div>
                          )}

                          <span className="text-white/80 font-medium">
                            {isEditing
                              ? hoveredStar || editRatingValue
                              : rating.Rating}
                            /5
                          </span>
                        </div>

                        <span className="text-xs text-white/60 bg-white/5 px-3 py-1 rounded-full">
                          {formatRelativeTime(rating.CreatedAt)}
                        </span>
                      </div>

                      {/* Comment section */}
                      {isEditing ? (
                        <div className="space-y-4">
                          <textarea
                            className="w-full border-2 border-white/20 bg-white/5 rounded-xl p-4 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:outline-none text-white placeholder-white/40 resize-none transition-all duration-200 hover:border-white/30"
                            rows={3}
                            placeholder="Edit your comment..."
                            value={editRatingComment}
                            onChange={(e) =>
                              setEditRatingComment(e.target.value)
                            }
                            disabled={editLoading}
                            maxLength={500}
                          />
                          <div className="text-right text-xs text-white/40 mb-2">
                            {editRatingComment.length}/500
                          </div>

                          {/* Edit actions */}
                          <div className="flex gap-3">
                            <button
                              className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white/50"
                              onClick={handleEditCancel}
                              disabled={editLoading}
                            >
                              <span className="flex items-center justify-center gap-2">
                                <MdCancel className="text-sm" />
                                Cancel
                              </span>
                            </button>
                            <button
                              className="flex-1 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-60 disabled:cursor-not-allowed"
                              onClick={onUpdateRating}
                              disabled={editLoading || !editRatingValue}
                            >
                              {editLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>Saving...</span>
                                </div>
                              ) : (
                                <span className="flex items-center justify-center gap-2">
                                  <MdSave className="text-sm" />
                                  Save
                                </span>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        rating.Comment && (
                          <div className="text-white/90 text-sm leading-relaxed bg-white/5 rounded-lg p-3 mt-2">
                            {rating.Comment}
                          </div>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
            <p className="text-xs text-white/50">
              {ratingsList.length}{" "}
              {ratingsList.length === 1 ? "rating" : "ratings"} total
            </p>
            <button
              className="px-6 py-2 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
              onClick={() => {
                setIsRatingListOpen(false);
                setIsFeedbackOpen(true);
                setEditingRatingId(null);
                setEditRatingValue(0);
                setEditRatingComment("");
              }}
            >
              <span className="flex items-center gap-2">
                <MdRateReview className="text-sm" />
                Add Your Rating
              </span>
            </button>
          </div>
        </div>
      </div>
      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default RatingListModal;
