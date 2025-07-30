const PointsSection = ({
  pointsToUse,
  isUsingPoints,
  appliedPromotion,
  pointsError,
  userDiscount,
  handlePointsChange,
  handleUsePoints,
  handleRemovePoints
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-white mb-4">Use Points</h3>
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            className="flex-1 bg-white/10 text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
            placeholder="Enter points to use on seats (1 point = 1,000 VND)"
            value={pointsToUse}
            onChange={handlePointsChange}
            disabled={isUsingPoints || appliedPromotion || userDiscount !== 0}
          />
          <button
            className={`px-6 py-3 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 text-white rounded-xl text-sm transition-all duration-300 whitespace-nowrap ${isUsingPoints || appliedPromotion ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleUsePoints}
            disabled={isUsingPoints || appliedPromotion || userDiscount !== 0}
          >
            Use Points
          </button>
        </div>

        {/* Points error */}
        {pointsError && (
          <p className="text-red-400 text-xs mt-3">{pointsError}</p>
        )}

        {/* Points applied notification */}
        {isUsingPoints && (
          <div className="mt-3 p-3 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
            <div className="flex justify-between items-center">
              <div className="text-yellow-400 text-sm">
                ✓ Using {parseInt(pointsToUse).toLocaleString()} points on seats
              </div>
              <button
                onClick={handleRemovePoints}
                className="text-red-400 hover:text-red-300 text-xs ml-2 transition-colors"
              >
                ✕ Remove
              </button>
            </div>
          </div>
        )}

        {appliedPromotion && (
          <div className="mt-3 text-xs text-gray-400">
            Cannot use both discounts at the same time.
          </div>
        )}
      </div>
    </div>
  );
};

export default PointsSection;