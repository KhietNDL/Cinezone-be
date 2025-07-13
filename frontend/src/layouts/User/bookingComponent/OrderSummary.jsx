import { FaTicketAlt } from "react-icons/fa";

const OrderSummary = ({
  selectedSeats,
  selectedProducts,
  calculatedTotalPrice,
  totalProductPrice,
  totalAmount,
  movie,
  selectedDate,
  selectedTime,
  formatPrice,
  onContinue,
}) => {
  const renderProductsSummary = () => {
    if (selectedProducts.length === 0) return null;
    return (
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300 font-medium">Snacks & Drinks</span>
          <span className="text-white font-semibold">
            {formatPrice(totalProductPrice)}
          </span>
        </div>
        <div className="space-y-1 text-sm text-gray-400">
          {selectedProducts.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>
                {item.ProductName || item.productName} x
                {item.selectedQuantity || item.Quantity}
              </span>
              <span>
                {formatPrice(
                  (item.Price || 0) *
                    (item.selectedQuantity || item.Quantity || 0)
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    (selectedSeats.length > 0 || selectedProducts.length > 0) && (
      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-4 md:p-6 lg:p-8 border border-white/10 shadow-2xl">
        <h3 className="text-lg md:text-xl font-bold text-white mb-6">
          Order Summary
        </h3>
        <div className="space-y-4">
          {selectedSeats.length > 0 && (
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 font-medium">Movie Tickets</span>
                <span className="text-white font-semibold">
                  {formatPrice(calculatedTotalPrice || 0)}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""}
                : {selectedSeats.join(", ")}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {movie?.NameOfEnglish} •{" "}
                {selectedDate
                  ? new Date(selectedDate).toLocaleDateString("vi-VN")
                  : ""}{" "}
                • {selectedTime}
              </div>
            </div>
          )}
          {renderProductsSummary()}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-4 border border-purple-400/30">
            <div className="flex justify-between items-center">
              <span className="text-white font-bold text-lg">Total Amount</span>
              <span className="text-purple-300 font-bold text-2xl">
                {formatPrice(totalAmount)}
              </span>
            </div>
            {selectedProducts.length > 0 && (
              <div className="text-xs text-gray-400 mt-2">
                Products will be reserved when you confirm payment
              </div>
            )}
          </div>
        </div>
        {selectedSeats.length > 0 && (
          <div className="flex justify-center mt-6">
            <button
              disabled={selectedSeats.length === 0}
              onClick={onContinue}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transform hover:scale-[1.02] transition-all duration-300 ease-out border border-purple-400/20 text-white font-semibold rounded-4xl disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-lg"
            >
              <FaTicketAlt className="inline-block mr-2" />
              Continue to Confirm
            </button>
          </div>
        )}
      </div>
    )
  );
};

export default OrderSummary;
