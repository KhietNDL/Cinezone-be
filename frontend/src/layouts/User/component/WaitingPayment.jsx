import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Home } from "lucide-react";
import logo from "../../../assets/logoWeb.svg";
import {
  createMomoPayment,
  createVnpayPayment,
  createZalopayPayment,
} from "../../../services/API";

const WaitingPayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    selectedSeats = [],
    calculatedTotalPrice = 0,
    comboPrice = 0,
    discount = 0,
    paymentMethod = "",
    selectedShowtimeId,
    seatIds,
    promotionId,
    userId,
    bookingId,
    finalPrice = 0,
    // Product related data from ConfirmPayment
    OrderProductId = null,
    products = [],
    productHoldResult = null,
  } = state || {};

  const [paymentStatus, setPaymentStatus] = useState("waiting");
  const returnUrl = `${window.location.origin}/ticket`;

  console.log("🎫 WaitingPayment received data:", {
    bookingId,
    OrderProductId,
    products: products.length,
    finalPrice,
    paymentMethod
  });

  useEffect(() => {
    const processPayment = async () => {
      try {
        let payload = {};

        // Determine payment scenario and build appropriate payload
        if (bookingId && OrderProductId) {
          // Case 1: Mua cả ghế và bắp nước (Pay for both booking and order product)
          payload = {
            bookingId: bookingId,
            orderProductId: OrderProductId,
            amount: finalPrice,
            returnUrl,
            userId,
          };
          console.log("💳 Case 1: Pay for both booking and order product");
        } else if (bookingId && !OrderProductId) {
          // Case 2: Chỉ mua ghế (Pay for booking only)
          payload = {
            bookingId: bookingId,
            amount: finalPrice,
            returnUrl,
            userId,
          };
          console.log("🎫 Case 2: Pay for booking only");
        } else if (!bookingId && OrderProductId) {
          // Case 3: Chỉ mua bắp nước (Pay for order product only)
          payload = {
            orderProductId: OrderProductId,
            amount: finalPrice,
            returnUrl,
            userId,
          };
          console.log("🛍️ Case 3: Pay for order product only");
        } else {
          console.error("❌ No valid booking or product order found");
          setPaymentStatus("failed");
          return;
        }

        console.log("💳 Payment payload:", payload);
        console.log("🎫 Seat Booking ID:", bookingId || "None");
        console.log("🛍️ Product Order ID:", OrderProductId || "None");
        console.log("💰 Final Price:", finalPrice);
        console.log("🔄 Payment Method:", paymentMethod);

        let response;

        if (paymentMethod === "2") {
          console.log("PAYLOAD CUA MOMO", payload);
          response = await createMomoPayment(payload);
          console.log("📱 Momo payment response:", response);
        } else if (paymentMethod === "3") {
          response = await createVnpayPayment(payload);
          console.log("🏦 VNPay payment response:", response);
        } else if (paymentMethod === "4") {
          response = await createZalopayPayment(payload);
          console.log("💰 ZaloPay payment response:", response);
        } else {
          console.error("❌ Invalid payment method:", paymentMethod);
          setPaymentStatus("failed");
          return;
        }

        const redirectUrl = response?.data?.payUrl || response?.payUrl;

        if (redirectUrl) {
          console.log("🔄 Redirecting to payment gateway:", redirectUrl);
          window.location.href = redirectUrl;
        } else {
          console.error("❌ No payment URL returned from server:", response);
          setPaymentStatus("failed");
        }
      } catch (err) {
        console.error("❌ Error creating payment:", err);
        setPaymentStatus("failed");
      }
    };

    if (paymentMethod && (bookingId || OrderProductId)) {
      processPayment();
    } else {
      console.error("❌ Missing required data:", { 
        paymentMethod, 
        bookingId, 
        OrderProductId 
      });
      setPaymentStatus("failed");
    }
  }, [paymentMethod, bookingId, OrderProductId]);

  // Helper function to determine payment type
  const getPaymentType = () => {
    if (bookingId && OrderProductId) return "Both seats and products";
    if (bookingId && !OrderProductId) return "Seats only";
    if (!bookingId && OrderProductId) return "Products only";
    return "Unknown";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] text-white flex items-center justify-center p-6">
      <div className="bg-[#1E1B3A] rounded-xl shadow-xl w-full max-w-2xl p-10 text-center">
        <img src={logo} alt="Logo" className="w-40 h-auto mb-6 mx-auto" />
        
        {paymentStatus === "waiting" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B59E6] mx-auto mb-6"></div>
            <p className="text-2xl font-bold mb-4">Redirecting to payment gateway...</p>
            <p className="text-gray-300 mb-4">Please wait while we process your payment.</p>
            
            {/* Payment summary */}
            <div className="bg-white/5 rounded-lg p-4 text-left max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-3 text-center">Payment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Payment Type:</span>
                  <span className="font-semibold text-[#6B59E6]">{getPaymentType()}</span>
                </div>
                
                {bookingId && (
                  <div className="flex justify-between">
                    <span>Seat Booking ID:</span>
                    <span className="font-mono">{bookingId.slice(0, 8)}...</span>
                  </div>
                )}
                
                {OrderProductId && (
                  <div className="flex justify-between">
                    <span>Product Order ID:</span>
                    <span className="font-mono">{OrderProductId.slice(0, 8)}...</span>
                  </div>
                )}
                
                {bookingId && selectedSeats.length > 0 && (
                  <div className="flex justify-between">
                    <span>Seats:</span>
                    <span>{selectedSeats.join(", ")}</span>
                  </div>
                )}
                
                {OrderProductId && products.length > 0 && (
                  <div className="flex justify-between">
                    <span>Products:</span>
                    <span>{products.length} item{products.length > 1 ? 's' : ''}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-semibold border-t border-gray-600 pt-2">
                  <span>Total Amount:</span>
                  <span>{finalPrice.toLocaleString()}đ</span>
                </div>
              </div>
            </div>
          </>
        )}

        {paymentStatus === "failed" && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-2xl font-bold text-red-400 mb-2">Payment Failed</p>
            <p className="text-gray-300 mb-6">There was a problem processing your payment. Please try again.</p>
            
            {/* Error details */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
              <h4 className="font-semibold text-red-400 mb-2">Error Details:</h4>
              <div className="text-sm text-gray-300">
                {!paymentMethod && <p>• Payment method not selected</p>}
                {!bookingId && !OrderProductId && <p>• No booking or product order found</p>}
                {!finalPrice && <p>• Amount is invalid</p>}
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Go Back
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-[#6B59E6] hover:bg-[#534a89] text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
              >
                <Home size={20} />
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WaitingPayment;