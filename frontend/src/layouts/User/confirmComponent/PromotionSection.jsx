const PromotionSection = ({
  promoCode,
  isLoadingPromotion,
  appliedPromotion,
  promotionError,
  isUsingPoints,
  handleInputPromoCode,
  handleAddPromotion,
  handleRemovePromotion
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-white mb-4">Promotion Code</h3>
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            className="flex-1 bg-white/10 text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/20"
            placeholder="Enter promotion code (seats only)"
            value={promoCode}
            onChange={handleInputPromoCode}
            disabled={isLoadingPromotion || appliedPromotion || isUsingPoints}
          />
          <button
            className={`px-6 py-3 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 text-white font-semibold rounded-xl text-sm transition-all duration-300 whitespace-nowrap ${isLoadingPromotion || appliedPromotion || isUsingPoints ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleAddPromotion}
            disabled={isLoadingPromotion || appliedPromotion || isUsingPoints}
          >
            {isLoadingPromotion ? 'Checking...' : 'Apply'}
          </button>
        </div>

        {/* Promotion error */}
        {promotionError && (
          <p className="text-red-400 text-xs mt-3">{promotionError}</p>
        )}

        {/* Promotion applied notification */}
        {appliedPromotion && (
          <div className="mt-3 p-3 bg-green-500/20 rounded-lg border border-green-400/30">
            <div className="flex justify-between items-center">
              <div className="text-green-400 text-sm">
                ✓ Promotion applied: {appliedPromotion.Code} (-{appliedPromotion.DiscountValue}%)
              </div>
              <button
                onClick={handleRemovePromotion}
                className="text-red-400 hover:text-red-300 text-xs ml-2 transition-colors"
              >
                ✕ Remove
              </button>
            </div>
          </div>
        )}

        {isUsingPoints && (
          <div className="mt-3 text-xs text-gray-400">
            Cannot use both discounts at the same time.
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionSection;