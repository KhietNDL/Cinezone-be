const ActionButtons = ({
  paymentMethod,
  stripeCardType,
  isConfirming,
  stripeLoading,
  handleConfirm,
  handleCancel
}) => {
  return (
    <div className="mt-auto space-y-4">
      <button
        type="button"
        className={`w-full py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transform hover:scale-[1.02] transition-all duration-300 ease-out border border-purple-400/10 text-white font-semibold rounded-2xl text-lg ${(!paymentMethod || isConfirming || (paymentMethod === "3" && !stripeCardType)) ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleConfirm}
        disabled={!paymentMethod || isConfirming || (paymentMethod === "3" && !stripeCardType)}
      >
        {isConfirming ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>
              {paymentMethod === "3" && stripeLoading ? "Setting up Stripe payment..." : "Processing..."}
            </span>
          </div>
        ) : (
          'Confirm And Payment'
        )}
      </button>

      <button
        type="button"
        className="w-full py-4 bg-transparent hover:bg-white/10 border-2 border-purple-500/50 hover:border-purple-400 text-white font-semibold rounded-2xl text-lg transition-all duration-300"
        onClick={handleCancel}
        disabled={isConfirming}
      >
        Cancel
      </button>
    </div>
  );
};

export default ActionButtons;