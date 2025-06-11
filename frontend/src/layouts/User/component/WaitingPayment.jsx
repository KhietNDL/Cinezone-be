import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPaypal } from "react-icons/fa6";
import { BsBank } from "react-icons/bs";
import { RiVisaFill } from "react-icons/ri";
import logo from "../../../assets/logoWeb.svg";
import qrCodeImg from "../../../assets/qr-bank.png";

const WaitingPayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

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
  } = state || {};

  const [timeLeft, setTimeLeft] = useState(300); 
  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod);
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const total = totalPrice + comboPrice - discount;

  
  useEffect(() => {
    if (timeLeft === 0) {
      alert("Time's up! The order has been canceled.");
      navigate("/");
      return;
    }

    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, navigate]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    if (paymentMethod !== "Bank" && ((!cardHolder || !cardNumber || !expiry || !cvc))) {
      alert("Please fill out all fields.");
      return;
    }

    console.log("Navigating to /success with state:", {
      numberOfTickets,
      selectedSeats,
      totalPrice,
      paymentMethod,
      cardHolder,
      cinema,
      date,
      time,
    });

    alert("Payment successful!");
    navigate("/success", {
      state: {
        numberOfTickets,
        selectedSeats,
        totalPrice,
        paymentMethod,
        cardHolder,
        cinema,
        date,
        time,
      },
    });
  };

  const handleBankPayment = () => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    console.log("Navigating to /success with state:", {
      numberOfTickets,
      selectedSeats,
      totalPrice,
      paymentMethod,
      cinema,
      date,
      time,
    });

    alert("Payment confirmed!");
    navigate("/success", {
      state: {
        numberOfTickets,
        selectedSeats,
        totalPrice,
        paymentMethod,
        cinema,
        date,
        time,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] text-white p-8 flex justify-center items-center">
      <div className="bg-[#1E1B3A] rounded-xl shadow-xl w-full max-w-7xl flex">
        {/* div ben trai */}
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

        {/* khoi div ben phai */}
        <div className="w-1/2 bg-[#25244A] rounded-r-xl p-8">
          <div className="grid grid-cols-10 gap-3 mb-6">
            <button
              type="button"
              className={`col-span-3 flex items-center justify-center p-3 rounded-lg font-semibold ${
                paymentMethod === "PayPal" ? "bg-[#6B59E6] text-white" : "bg-[#1E1B3A] text-white"
              }`}
              onClick={() => setPaymentMethod("PayPal")}
            >
              <FaPaypal className="mr-2 text-[#b2a6ff]" /> PayPal
            </button>
            <button
              type="button"
              className={`col-span-3 flex items-center justify-center p-3 rounded-lg font-semibold ${
                paymentMethod === "Bank" ? "bg-[#6B59E6] text-white" : "bg-[#1E1B3A] text-white"
              }`}
              onClick={() => setPaymentMethod("Bank")}
            >
              <BsBank className="mr-2 text-[#b2a6ff]" /> Bank
            </button>
            <button
              type="button"
              className={`col-span-4 flex items-center justify-center p-3 rounded-lg font-semibold ${
                paymentMethod === "Visa" ? "bg-[#6B59E6] text-white" : "bg-[#1E1B3A] text-white"
              }`}
              onClick={() => setPaymentMethod("Visa")}
            >
              <RiVisaFill className="mr-2 text-[#b2a6ff]" /> Visa / Master Card
            </button>
          </div>

          {/* form payment */}
          {paymentMethod === "Bank" ? (
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
                <p className="mb-2 text-sm font-semibold">Cardholder’s Name</p>
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
      </div>
    </div>
  );
};

export default WaitingPayment;