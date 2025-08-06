import { MdClose, MdStar, MdStarBorder, MdRateReview } from "react-icons/md";

const FeedbackModal = ({
  isOpen,
  feedbackRating,
  feedbackComment,
  hoveredStar,
  isSubmittingFeedback,
  setFeedbackRating,
  setFeedbackComment,
  setHoveredStar,
  setIsFeedbackOpen,
  onSubmit,
}) => {
  const getRatingText = (rating) => {
    const texts = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent",
    };
    return texts[rating] || "Rate this movie";
  };

  const handleClose = () => {
    setIsFeedbackOpen(false);
    setFeedbackRating(0);
    setFeedbackComment("");
    setHoveredStar(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-b from-black via-gray-900 via-50% via-purple-950/50 to-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-md relative transform transition-all duration-300 animate-in slide-in-from-bottom-4 scale-in-95 border border-white/10 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/60 hover:text-red-400 hover:bg-white/10 rounded-full p-2 transition-all duration-200 hover:scale-110 z-10"
          onClick={handleClose}
          disabled={isSubmittingFeedback}
        >
          <MdClose className="text-lg sm:text-xl" />
        </button>

        <div className="text-center mb-4 sm:mb-6">
          <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
            <MdRateReview className="text-white text-xl sm:text-2xl" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Movie Feedback
          </h2>
          <p className="text-white/70 text-sm">
            Share your thoughts about this movie
          </p>
        </div>

        <div className="mb-4 sm:mb-6">
          <div className="text-center mb-4">
            <p className="text-sm font-medium text-white/80 mb-2">
              How would you rate this movie?
            </p>
            <p className="text-base sm:text-lg font-bold text-purple-300 h-5 sm:h-6">
              {getRatingText(hoveredStar || feedbackRating)}
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center gap-1 sm:gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-all duration-200 hover:scale-110 active:scale-95 p-1 sm:p-2 rounded-full"
                onClick={() => setFeedbackRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                disabled={isSubmittingFeedback}
              >
                {(hoveredStar || feedbackRating) >= star ? (
                  <MdStar className="text-yellow-400 text-2xl sm:text-3xl lg:text-4xl drop-shadow-lg" />
                ) : (
                  <MdStarBorder className="text-yellow-400 text-2xl sm:text-3xl lg:text-4xl opacity-60 hover:opacity-100" />
                )}
              </button>
            ))}
          </div>

          {/* Mobile rating text below stars */}
          <div className="sm:hidden text-center mt-2">
            <span className="text-xs text-white/60 bg-white/5 px-3 py-1 rounded-full">
              {feedbackRating > 0 && `${feedbackRating}/5 stars`}
            </span>
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <label className="block text-sm font-medium text-white/80 mb-2">
            Your thoughts
          </label>
          <textarea
            className="w-full border-2 border-white/20 bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:outline-none text-white placeholder-white/40 resize-none transition-all duration-200 hover:border-white/30 text-sm sm:text-base min-h-[80px] sm:min-h-[100px]"
            rows={3}
            placeholder="Tell us what you think about this movie..."
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
            disabled={isSubmittingFeedback}
            maxLength={500}
          />
          <div className="text-right text-xs text-white/40 mt-1">
            {feedbackComment.length}/500
          </div>
        </div>

        {/* Submit Button */}
        <button
          className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 text-white font-bold rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-purple-500/50"
          onClick={onSubmit}
          disabled={
            isSubmittingFeedback || !feedbackRating || !feedbackComment.trim()
          }
        >
          {isSubmittingFeedback ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm sm:text-base">Submitting...</span>
            </div>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <MdStar className="text-base sm:text-lg" />
              <span className="text-sm sm:text-base">Submit Feedback</span>
            </span>
          )}
        </button>

        {/* Footer message */}
        <p className="text-center text-xs text-white/50 mt-3 sm:mt-4">
          Your feedback helps us improve our service
        </p>
      </div>
    </div>
  );
};

export default FeedbackModal;
