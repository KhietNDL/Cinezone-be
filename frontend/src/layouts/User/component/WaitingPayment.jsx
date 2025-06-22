import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPaypal } from "react-icons/fa6";
import { BsBank } from "react-icons/bs";
import { RiVisaFill } from "react-icons/ri";
import { CheckCircle, XCircle, Clock, Home, RotateCcw } from "lucide-react";
import logo from "../../../assets/logoWeb.svg";
import qrCodeImg from "../../../assets/qr-bank.png";

const WaitingPayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleViewTicket = () => {
    navigate("/ticket", {
      state: {
        movieTitle: movie.title,
        screen: ticketInfo.screen,
        showtimeDate: ticketInfo.date,
        showtimeTime: ticketInfo.time,
        timeRange: movie.timeRange,
        room: ticketInfo.room,
        seats: ticketInfo.seats,
        pricePerTicket: ticketInfo.price,
        numberOfTickets: ticketInfo.count,
        discount: ticketInfo.discount,
        ticketId: ticketInfo.id,
        cardHolder: user.name,
        email: user.email,
        identity: user.idCard,
        phone: user.phone,
        description: movie.description,
      },
    });
  };

  const {
    numberOfTickets = 2,
    selectedSeats = [],
    totalPrice = 0,
    comboPrice = 0,
    discount = 0,
    paymentMethod: initialPaymentMethod = "",
    cinema = "CGV Crescent Mall",
    date = "2024-06-12",
    time = "14:00",
    movie = {},
    user = {},
    ticketInfo = {},
  } = state || {};

  const [timeLeft, setTimeLeft] = useState(300);
  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod);
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  // State để track trạng thái thanh toán
  const [paymentStatus, setPaymentStatus] = useState("waiting");

  const total = totalPrice + comboPrice - discount;

  useEffect(() => {
    if (paymentStatus !== "waiting") return; // Dừng timer khi đã có kết quả

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setPaymentStatus("failed"); // Set trạng thái failed
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [paymentStatus]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    if (paymentMethod !== "VNPay" && ((!cardHolder || !cardNumber || !expiry || !cvc))) {
      alert("Please fill out all fields.");
      return;
    }

    setPaymentStatus("success"); // Set trạng thái success
  };

  const handleBankPayment = () => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    setPaymentStatus("success"); // Set trạng thái success
  };

  // Component hiển thị khi thanh toán thành công
  const SuccessContent = () => (
    <>
      {/* Left Side - Success Info */}
      <div className="w-1/2 p-8 ">
        <div role="button" className="flex items-center mb-4">
          <img
            src={logo}
            alt=""
            loading="lazy"
            role="button"
            onClick={() => navigate("/")}
            className="w-[160px] h-[70px] object-cover"
          />
        </div>
        <div className="flex justify-center items-center">

          <CheckCircle className="w-30 h-30 text-green-400 mb-6" />
        </div>
        <h1 className="text-3xl font-bold text-green-400 mb-4 text-center">Payment Successful!</h1>
        <p className="text-center text-gray-300 mb-6">
          Your booking has been confirmed. Enjoy your movie!
        </p>


      </div>

      {/* Right Side - Booking Details */}
      <div className="w-1/2 bg-[#25244A] rounded-r-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Booking Details</h2>

        <div className="space-y-4 mb-8">
          <div className="bg-[#1E1B3A] rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-green-400">Movie Information</h3>
            <p className="text-sm">Cinema: {cinema}</p>
            <p className="text-sm">Date: {date}</p>
            <p className="text-sm">Time: {time}</p>
            <p className="text-sm">Seats: {selectedSeats.join(", ")}</p>
          </div>

          <div className="bg-[#1E1B3A] rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-green-400">Payment Summary</h3>
            <div className="text-sm space-y-1">
              <p className="flex justify-between">
                <span>Tickets ({numberOfTickets})</span>
                <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
              </p>
              <p className="flex justify-between">
                <span>Combo</span>
                <span>{comboPrice.toLocaleString("vi-VN")}₫</span>
              </p>
              <p className="flex justify-between">
                <span>Discount</span>
                <span>-{discount.toLocaleString("vi-VN")}₫</span>
              </p>
              <div className="border-t pt-2 mt-2 font-bold">
                <p className="flex justify-between">
                  <span>Total Paid</span>
                  <span>{total.toLocaleString("vi-VN")}₫</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex-1 flex items-center justify-center gap-2 bg-[#6B59E6] hover:bg-[#534a89c2] text-white py-3 rounded-lg font-semibold transition"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
          <button
            onClick={() =>
              navigate("/ticket", {
                state: {
                  selectedSeats,
                  numberOfTickets,
                  cinema,
                  date,
                  time,
                  total,
                  cardHolder,
                },
              })
            }
            className="flex-1 flex items-center justify-center gap-2 bg-green-400 hover:bg-green-500 text-white py-3 rounded-lg font-semibold transition"
          >
            🎫 View Ticket
          </button>
        </div>
      </div>
    </>
  );

  // Component hiển thị khi thanh toán thất bại
  const FailedContent = () => (
    <>
      {/* Left Side - Failed Info */}
      <div className="w-1/2 p-8 ">
        <div role="button" className="flex items-center mb-4">
          <img
            src={logo}
            alt=""
            loading="lazy"
            role="button"
            onClick={() => navigate("/")}
            className="w-[160px] h-[70px] object-cover"
          />
        </div>

        <div className="flex justify-center items-center mb-6">
          <XCircle className="w-30 h-30 text-red-500 text-center " />

        </div>

        <h1 className="text-3xl font-bold text-red-400 mb-4 text-center">Payment Failed</h1>
        <p className="text-center text-gray-300 mb-6">
          Thank you for using our service !
        </p>


      </div>

      {/* Right Side - What Happened */}
      <div className="w-1/2 bg-[#25244A] rounded-r-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">What Happened?</h2>

        <div className="space-y-4 mb-8">
          <div className="bg-[#1E1B3A] rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-red-400">Order Details</h3>
            <div className="text-sm space-y-1 text-gray-300">
              <p>• Payment was not completed within 5 minutes</p>
              <p>• Selected seats have been released</p>
              <p>• No charges were made to your account</p>
            </div>
          </div>

          <div className="bg-[#1E1B3A] rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-red-400">Failed Order Summary</h3>
            <div className="text-sm space-y-1">
              <p className="flex justify-between">
                <span>Cinema:</span>
                <span>{cinema}</span>
              </p>
              <p className="flex justify-between">
                <span>Seats:</span>
                <span>{selectedSeats.join(", ")}</span>
              </p>
              <p className="flex justify-between">
                <span>Total Amount:</span>
                <span>{total.toLocaleString("vi-VN")}₫</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex-1 flex items-center justify-center gap-2 bg-[#6B59E6] hover:bg-[#534a89c2] text-white py-3 rounded-lg font-semibold transition"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>



        </div>
      </div>
    </>
  );

  // Component hiển thị khi đang chờ thanh toán
  const WaitingContent = () => (
    <>
      {/* Left Side - Original */}
      <div className="w-1/2 p-8">
        <div role="button" className="flex items-center mb-4">
          <img
            src={logo}
            alt=""
            loading="lazy"
            role="button"
            onClick={() => navigate("/")}
            className="w-[160px] h-[70px] object-cover"
          />
        </div>

        <div className="text-3xl font-bold text-center mb-4">{formatTime(timeLeft)}</div>
        <p className="text-center text-gray-400 mb-6">
          If payment is not made within 5 minutes, the ticket will be automatically canceled.
        </p>

        <div className="text-lg mb-4">
          <p className="flex justify-between">
            <span>Tickets ({numberOfTickets})</span>
            <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
          </p>
          <p className="flex justify-between">
            <span>Combo popcorn 1</span>
            <span>{comboPrice.toLocaleString("vi-VN")}₫</span>
          </p>
          <p className="flex justify-between text-white my-2 pt-2 font-bold">
            <span>Discount & Offer</span>
            <span>{discount.toLocaleString("vi-VN")}₫</span>
          </p>
          <div className="border-t mt-4 pt-4 text-xl font-bold flex justify-between">
            <span>Total</span>
            <span>{total.toLocaleString("vi-VN")}₫</span>
          </div>
        </div>
      </div>

      {/* Right Side - Payment Methods */}
      <div className="w-1/2 bg-[#25244A] rounded-r-xl p-8">
        <div className="grid grid-cols-10 gap-3 mb-6">
          <button
            type="button"
            className={`col-span-3 flex items-center justify-center p-3 rounded-lg font-semibold ${paymentMethod === "Momo" ? "bg-[#6B59E6] text-white" : "bg-[#1E1B3A] text-white"
              }`}
            onClick={() => setPaymentMethod("Momo")}
          >
            <img
              src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Transparent-1024x1024.png"
              alt="Momo logo"
              className="w-20 h-10 mb-1 "
            />
          </button>
          <button
            type="button"
            className={`col-span-3 flex items-center justify-center p-3 rounded-lg font-semibold ${paymentMethod === "VNPay" ? "bg-[#6B59E6] text-white" : "bg-[#1E1B3A] text-white"
              }`}
            onClick={() => setPaymentMethod("VNPay")}
          >
            <img
              src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-350x65.png"
              alt="VnPay logo"
              className="w-20 h-10 mb-1 "
            />

          </button>
          <button
            type="button"
            className={`col-span-4 flex items-center justify-center p-3 rounded-lg font-semibold ${paymentMethod === "ZaloPay" ? "bg-[#6B59E6] text-white" : "bg-[#1E1B3A] text-white"
              }`}
            onClick={() => setPaymentMethod("ZaloPay")}
          >
            <img
              src="https://vectorseek.com/wp-content/uploads/2023/09/Zalopay-Logo-Vector.svg-.png"
              alt="ZaloPay logo"
              className="w-20 h-10 mb-1 "
            />
          </button>
        </div>

        {/* Payment Forms */}
        {paymentMethod === "VNPay" ? (
          <div className="flex flex-col items-center text-center mt-8">
            <img
              src={qrCodeImg}
              alt="QR Code"
              className="w-60 h-60 mb-4 rounded-lg border border-white shadow-md"
            />
            <p className="text-lg font-semibold mb-1">Scan to Pay</p>
            <p className="text-sm text-gray-300">
              Please use your banking app to scan the QR code and complete your payment.
            </p>
            <button
              onClick={handleBankPayment}
              className="mt-6 bg-[#6B59E6] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#534a89c2] transition"
            >
              I've Paid →
            </button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <p className="mb-2 text-sm font-semibold">Cardholder's Name</p>
              <input
                type="text"
                className="w-full bg-[#1E1B3A] text-white p-3 rounded-lg focus:outline-none"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                placeholder="Enter name"
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Card Number</p>
              <div className="flex items-center bg-[#1E1B3A] rounded-lg p-3">
                <RiVisaFill className="mr-3 text-[#b2a6ff] text-2xl" />
                <input
                  type="text"
                  className="bg-transparent text-white outline-none w-full"
                  placeholder="8888 9999 7777 6666"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="mb-2 text-sm font-semibold">Expiry</p>
                <input
                  type="text"
                  className="w-full bg-[#1E1B3A] text-white p-3 rounded-lg"
                  placeholder="MM / YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <p className="mb-2 text-sm font-semibold">CVC</p>
                <input
                  type="text"
                  className="w-full bg-[#1E1B3A] text-white p-3 rounded-lg"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-1/2 border border-[#6B59E6] text-[#6B59E6] hover:bg-[#534a89c2] hover:text-white rounded-lg py-3 transition font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 bg-[#6B59E6] hover:bg-[#534a89c2] text-white rounded-lg py-3 transition font-semibold"
              >
                Pay Now →
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] text-white p-8 flex justify-center items-center">
      <div className="bg-[#1E1B3A] rounded-xl shadow-xl w-full max-w-7xl flex">
        {paymentStatus === "waiting" && <WaitingContent />}
        {paymentStatus === "success" && <SuccessContent />}
        {paymentStatus === "failed" && <FailedContent />}
      </div>
    </div>
  );
};

export default WaitingPayment;