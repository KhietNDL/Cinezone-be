import StripeCheckoutForm from "../component/StripeCheckoutForm";
import { toast } from "react-toastify";

const PaymentMethodsSection = ({
  paymentMethod,
  stripeCardType,
  stripeClientSecret,
  stripeLoading,
  stripeError,
  handlePaymentMethod,
  handleCardTypeChange,
}) => {
  // Danh sách các loại thẻ hỗ trợ
  const cardTypes = [
    {
      value: "VISA",
      name: "Visa",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
    },
    {
      value: "MASTERCARD",
      name: "MasterCard",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
    },
    {
      value: "JCB",
      name: "JCB",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/40/JCB_logo.svg",
    },
    {
      value: "UNIONPAY",
      name: "UnionPay",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/UnionPay_logo.svg",
    },
    {
      value: "American Express",
      name: "American Express",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg",
    },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-white mb-4">Payment Methods</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {/* Stripe (Visa/MasterCard/JCB/UnionPay) */}
        <div>
          <button
            onClick={() => handlePaymentMethod("3")}
            className={`flex flex-col items-center justify-center rounded-2xl p-4 h-20 font-semibold transition-all duration-300 border-2 ${
              paymentMethod === "3"
                ? "bg-gradient-to-r from-purple-600/10 via-purple-500/80 to-purple-600/10 border-purple-600 shadow-lg"
                : "bg-white/90 hover:bg-white/95 border-white/20"
            } focus:outline-none focus:ring-2 focus:ring-purple-600 w-full`}
          >
            <img
              src="https://www.thesmbguide.com/images/Stripe-Payments-Review-1024x512-20200129.png"
              alt="Stripe Logo"
              className="w-16 h-7 mb-1"
            />
          </button>
        </div>

        {/* ZaloPay */}
        <div>
          <button
            onClick={() => handlePaymentMethod("4")}
            className={`flex flex-col items-center justify-center rounded-2xl p-4 h-20 font-semibold transition-all duration-300 border-2 ${
              paymentMethod === "4"
                ? "bg-gradient-to-r from-purple-600/10 via-purple-500/80 to-purple-600/10 border-purple-600 shadow-lg"
                : "bg-white/90 hover:bg-white/95 border-white/20"
            } focus:outline-none focus:ring-2 focus:ring-purple-600 w-full`}
          >
            <img
              src="https://vectorseek.com/wp-content/uploads/2023/09/Zalopay-Logo-Vector.svg-.png"
              alt="ZaloPay logo"
              className="w-16 h-5 mb-1"
            />
          </button>
        </div>

        {/* Momo */}
        <div>
          <button
            onClick={() => handlePaymentMethod("2")}
            className={`flex flex-col items-center justify-center rounded-2xl p-4 h-20 font-semibold transition-all duration-300 border-2 ${
              paymentMethod === "2"
                ? "bg-gradient-to-r from-purple-600/10 via-purple-500/80 to-purple-600/10 border-purple-600 shadow-lg"
                : "bg-white/90 hover:bg-white/95 border-white/20"
            } focus:outline-none focus:ring-2 focus:ring-purple-600 w-full`}
          >
            <img
              src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Transparent-1024x1024.png"
              alt="Momo logo"
              className="w-10 h-8 mb-1"
            />
          </button>
        </div>
      </div>

      {/* Card Type Selection for Stripe */}
      {paymentMethod === "3" && (
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-4">
          <h4 className="text-md font-semibold text-white mb-3">
            Select Card Type
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {cardTypes.map((card) => (
              <button
                key={card.value}
                onClick={() => handleCardTypeChange(card.value)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 border-2 ${
                  stripeCardType === card.value
                    ? "bg-purple-600/30 border-purple-400 shadow-lg"
                    : "bg-white/5 hover:bg-white/10 border-white/20"
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <img
                  src={card.logo}
                  alt={`${card.name} logo`}
                  className="w-12 h-8 object-contain mb-1"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <span
                  className="text-xs text-white font-medium text-center hidden"
                  style={{ display: "none" }}
                >
                  {card.name}
                </span>
                <span className="text-xs text-gray-300 text-center">
                  {card.name}
                </span>
              </button>
            ))}
          </div>

          {/* Stripe Processing Status */}
          {stripeLoading && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-purple-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
              <span className="text-sm">Setting up payment...</span>
            </div>
          )}

          {stripeError && (
            <div className="mt-4 p-3 bg-red-500/20 rounded-lg border border-red-400/30">
              <p className="text-red-400 text-sm">{stripeError}</p>
            </div>
          )}

          {stripeClientSecret && !stripeError && (
            <div className="mt-4 p-3 bg-green-500/20 rounded-lg border border-green-400/30">
              <p className="text-green-400 text-sm">
                ✓ Payment ready for{" "}
                {cardTypes.find((c) => c.value === stripeCardType)?.name}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Stripe Checkout Form */}
      {paymentMethod === "3" && stripeClientSecret && (
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-4">
          <h4 className="text-md font-semibold text-white mb-3">
            Payment Details
          </h4>
          <StripeCheckoutForm
            clientSecret={stripeClientSecret}
            onSuccess={() => {
              toast.success("Payment processed successfully!", {
                duration: 4000,
                position: "top-center",
              });
            }}
            onError={(error) => {
              toast.error(`Payment failed: ${error.message}`, {
                duration: 4000,
                position: "top-center",
              });
              console.error("Stripe payment error:", error);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsSection;
