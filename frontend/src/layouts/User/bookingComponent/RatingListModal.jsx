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
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
    return `${Math.floor(diff / 31536000)}y ago`;
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
        <div className="bg-gradient-to-br from-red-900/90 via-red-800/90 to-red-700/90 rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-sm relative transform transition-all duration-300 animate-in slide-in-from-bottom-4 scale-in-95 border border-red-400/20">
          <div className="text-center mb-4 sm:mb-6">
            <div className="bg-red-500/20 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <MdWarning className="text-red-400 text-2xl sm:text-3xl" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              Delete Rating
            </h3>
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
                  <span className="hidden sm:inline">Deleting...</span>
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-300">
        <div className="bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl relative border border-white/10 max-h-[95vh] sm:max-h-[90vh] flex flex-col">
          <button
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/60 hover:text-red-400 hover:bg-white/10 rounded-full p-2 transition-all duration-200 hover:scale-110 z-10"
            onClick={handleClose}
          >
            <MdClose className="text-lg sm:text-xl" />
          </button>

          <div className="text-center mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <MdStar className="text-white text-xl sm:text-2xl" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              All Ratings
            </h2>
            <p className="text-white/70 text-sm">See what others think</p>
          </div>

          <div className="flex-1 overflow-hidden min-h-0">
            {ratingsLoading ? (
              <div className="flex items-center justify-center py-8 sm:py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-white/80 text-sm sm:text-base">
                    Loading ratings...
                  </span>
                </div>
              </div>
            ) : ratingsList.length === 0 ? (
              <div className="flex items-center justify-center py-8 sm:py-12">
                <div className="text-center">
                  <div className="bg-white/5 rounded-full p-4 sm:p-6 w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4">
                    <MdStarBorder className="text-white/40 text-2xl sm:text-4xl" />
                  </div>
                  <h3 className="text-white/80 text-base sm:text-lg font-medium mb-2">
                    No ratings yet
                  </h3>
                  <p className="text-white/60 text-sm">
                    Be the first to share your thoughts!
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="space-y-3 sm:space-y-4 overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 280px)" }}
              >
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
                      className="group relative bg-white/5 hover:bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all duration-200 border border-white/10 hover:border-white/20"
                    >
                      {/* Action buttons */}
                      {isMine && !isEditing && (
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 flex gap-1 sm:gap-2">
                          <button
                            className="p-1.5 sm:p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-md sm:rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                            onClick={() => handleEditStart(rating)}
                          >
                            <MdEdit className="text-sm" />
                          </button>
                          <button
                            className="p-1.5 sm:p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-md sm:rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400/50"
                            onClick={() => handleDeleteClick(rating.RatingId)}
                          >
                            <MdDelete className="text-sm" />
                          </button>
                        </div>
                      )}

                      {/* Rating header */}
                      <div className="flex items-start justify-between mb-3 pr-12 sm:pr-0">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full shrink-0">
                            <img
                              src={rating.avatar_url}
                              alt=""
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-white text-sm sm:text-base font-medium truncate pr-2">
                              {rating.FullName}
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 mt-1">
                              {/* Stars */}
                              {isEditing ? (
                                <div className="flex items-center gap-0.5 sm:gap-1">
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
                                      {(hoveredStar || editRatingValue) >=
                                      star ? (
                                        <MdStar className="text-yellow-400 text-base sm:text-lg lg:text-xl" />
                                      ) : (
                                        <MdStarBorder className="text-yellow-400 text-base sm:text-lg lg:text-xl opacity-60 hover:opacity-100" />
                                      )}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex items-center gap-0.5 sm:gap-1">
                                  {Array.from({ length: 5 }).map((_, i) =>
                                    i < rating.Rating ? (
                                      <MdStar
                                        key={i}
                                        className="text-yellow-400 text-sm sm:text-base lg:text-lg"
                                      />
                                    ) : (
                                      <MdStarBorder
                                        key={i}
                                        className="text-yellow-400 text-sm sm:text-base lg:text-lg opacity-50"
                                      />
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <span className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded-full shrink-0 hidden sm:block">
                          {formatRelativeTime(rating.CreatedAt)}
                        </span>
                      </div>

                      {/* Mobile timestamp */}
                      <div className="sm:hidden mb-3">
                        <span className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded-full">
                          {formatRelativeTime(rating.CreatedAt)}
                        </span>
                      </div>

                      {/* Comment section */}
                      {isEditing ? (
                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <textarea
                              className="w-full border-2 border-white/20 bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:outline-none text-white placeholder-white/40 resize-none transition-all duration-200 hover:border-white/30 text-sm sm:text-base"
                              rows={3}
                              placeholder="Edit your comment..."
                              value={editRatingComment}
                              onChange={(e) =>
                                setEditRatingComment(e.target.value)
                              }
                              disabled={editLoading}
                              maxLength={500}
                            />
                            <div className="text-right text-xs text-white/40 mt-1">
                              {editRatingComment.length}/500
                            </div>
                          </div>

                          {/* Edit actions */}
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <button
                              className="flex-1 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white/50"
                              onClick={handleEditCancel}
                              disabled={editLoading}
                            >
                              <span className="flex items-center justify-center gap-2">
                                <MdCancel className="text-sm" />
                                Cancel
                              </span>
                            </button>
                            <button
                              className="flex-1 py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-60 disabled:cursor-not-allowed"
                              onClick={onUpdateRating}
                              disabled={editLoading || !editRatingValue}
                            >
                              {editLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span className="hidden sm:inline">
                                    Saving...
                                  </span>
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
                          <div className="text-white/90 text-sm sm:text-base leading-relaxed bg-white/5 rounded-lg p-3 mt-2">
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
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mt-4 sm:mt-6 pt-4 border-t border-white/10">
            <p className="text-xs text-white/50 order-2 sm:order-1">
              {ratingsList.length}{" "}
              {ratingsList.length === 1 ? "rating" : "ratings"} total
            </p>
            <button
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 text-white font-bold rounded-lg sm:rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-500/50 order-1 sm:order-2"
              onClick={() => {
                setIsRatingListOpen(false);
                setIsFeedbackOpen(true);
                setEditingRatingId(null);
                setEditRatingValue(0);
                setEditRatingComment("");
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <MdRateReview className="text-sm" />
                <span className="text-sm sm:text-base">Add Your Rating</span>
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
