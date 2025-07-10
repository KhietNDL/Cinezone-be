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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] rounded-3xl shadow-2xl p-8 w-full max-w-md relative transform transition-all duration-300 animate-in slide-in-from-bottom-4 scale-in-95 border border-white/10">
        <button
          className="absolute top-4 right-4 text-white/60 hover:text-red-400 hover:bg-white/10 rounded-full p-2 transition-all duration-200 hover:scale-110"
          onClick={handleClose}
          disabled={isSubmittingFeedback}
        >
          <MdClose className="text-xl" />
        </button>
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <MdRateReview className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Movie Feedback</h2>
          <p className="text-white/70 text-sm">
            Share your thoughts about this movie
          </p>
        </div>
        <div className="mb-6">
          <div className="text-center mb-4">
            <p className="text-sm font-medium text-white/80 mb-2">
              How would you rate this movie?
            </p>
            <p className="text-lg font-bold text-purple-300 h-6">
              {getRatingText(hoveredStar || feedbackRating)}
            </p>
          </div>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-all duration-200 hover:scale-110 active:scale-95"
                onClick={() => setFeedbackRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                disabled={isSubmittingFeedback}
              >
                {(hoveredStar || feedbackRating) >= star ? (
                  <MdStar className="text-yellow-400 text-4xl drop-shadow-lg" />
                ) : (
                  <MdStarBorder className="text-yellow-400 text-4xl opacity-60 hover:opacity-100" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-white/80 mb-2">
            Your thoughts
          </label>
          <textarea
            className="w-full border-2 border-white/20 bg-white/5 rounded-xl p-4 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:outline-none text-white placeholder-white/40 resize-none transition-all duration-200 hover:border-white/30"
            rows={4}
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
        <button
          className="w-full py-3 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-purple-500/50"
          onClick={onSubmit}
          disabled={
            isSubmittingFeedback || !feedbackRating || !feedbackComment.trim()
          }
        >
          {isSubmittingFeedback ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </div>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <MdStar className="text-lg" />
              Submit Feedback
            </span>
          )}
        </button>
        <p className="text-center text-xs text-white/50 mt-4">
          Your feedback helps us improve our service
        </p>
      </div>
    </div>
  );
};

export default FeedbackModal;
