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
  } = state || {};

  const [paymentStatus, setPaymentStatus] = useState("waiting");
  const returnUrl = `${window.location.origin}/ticket`;

  useEffect(() => {
    const processPayment = async () => {
      try {
        const payload = {
          bookingId,
          amount: finalPrice,
          returnUrl,
          userId
        
        
        };
        console.log("Payment payload:", payload);

        let response;

        if (paymentMethod === "2") {
          response = await createMomoPayment(payload);
          console.log("Momo payment response:", response);
        } else if (paymentMethod === "3") {
          response = await createVnpayPayment(payload);
        } else if (paymentMethod === "4") {
          response = await createZalopayPayment(payload);
        } else {
          console.error("Phương thức thanh toán không hợp lệ");
          setPaymentStatus("failed");
          return;
        }

        const redirectUrl = response?.data.payUrl;

        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          console.error("Không có URL thanh toán trả về từ server.");
          setPaymentStatus("failed");
        }
      } catch (err) {
        console.error("Lỗi khi tạo thanh toán:", err);
        setPaymentStatus("failed");
      }
    };

    if (paymentMethod) {
      processPayment();
    }
  }, [paymentMethod]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] text-white flex items-center justify-center p-6">
      <div className="bg-[#1E1B3A] rounded-xl shadow-xl w-full max-w-2xl p-10 text-center">
        <img src={logo} alt="Logo" className="w-40 h-auto mb-6 mx-auto" />
        {paymentStatus === "waiting" && (
          <>
            <p className="text-2xl font-bold mb-4">Redirecting to payment gateway...</p>
            <p className="text-gray-300">Please wait while we process your payment.</p>
          </>
        )}

        {paymentStatus === "failed" && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-2xl font-bold text-red-400 mb-2">Payment failed</p>
            <p className="text-gray-300 mb-6">There was a problem processing your payment. Please try again.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#6B59E6] hover:bg-[#534a89] text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default WaitingPayment;
