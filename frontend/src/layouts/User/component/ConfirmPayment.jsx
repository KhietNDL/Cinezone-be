import { useLocation, useNavigate } from "react-router-dom";
import { FaStar, FaRegClock, FaCalendarAlt, FaHeart } from "react-icons/fa";
import { BsBank } from "react-icons/bs";
import { RiVisaFill } from "react-icons/ri";
import { FaPaypal } from "react-icons/fa6";
import { useState } from "react";

const ConfirmPayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState(""); // Quản lý phương thức thanh toán

  // Extract data from BookingPage via location state
  const {
    selectedSeats = [],
    numberOfTickets = 1,
    totalPrice = 0,
    cinema = "CGV Crescent Mall",
    date = "2024-06-12",
    time = "14:00",
  } = state || {};

  // Movie details
  const movieDetails = {
    title: "Mắt Biếc",
    poster: "https://cdnb.artstation.com/p/assets/images/images/024/183/449/large/baju-creative-mat-biec.jpg?1581838909",
    duration: "117 min",
    releaseDate: "12/12/2023",
    genres: "Romantic, Comedy",
    description:
      "A touching story about youth, memories and unrequited love that lasts a lifetime. 'Mắt Biếc' will take you back to your student years full of dreams and aspirations.",
    rating: "8.7",
    feedback: "1.2K",
  };

  const user = {
    fullName: "Vu Quan",
    email: "VuQuan@gmail.com",
    phone: "0215666999",
    identityCard: "0000111122223333",
  };

  // Handle payment method selection
  const handlePaymentMethod = (method) => {
    setPaymentMethod(method);
  };

  // Handle confirm and navigate to waiting
  const handleConfirm = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    console.log("Navigating to /waiting with state:", {
      numberOfTickets,
      selectedSeats,
      totalPrice,
      paymentMethod,
      cinema,
      date,
      time,
    });

    navigate("/waiting", {
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
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] text-white p-3 sm:p-6 pt-[80px] sm:pt-[100px]">

      {/* Container chính với layout responsive */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Cột trái - Thông tin phim và khách hàng */}
        <div className="space-y-6">

          {/* Phần thông tin phim */}
          <div className="bg-[#1e1b3a]/30 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 h-[412px]">
              {/* Poster */}
              <div className="flex justify-center sm:justify-start">
                <img
                  src={movieDetails.poster}
                  alt={movieDetails.title}
                  className="w-40 h-56 sm:w-48 sm:h-72 object-cover rounded-lg flex-shrink-0"
                />
              </div>

              {/* Thông tin phim */}
              <div className="flex flex-col justify-between flex-1">
                <div > 
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center sm:text-left">
                    {movieDetails.title}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <FaRegClock /> {movieDetails.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt /> {movieDetails.releaseDate}
                    </span>
                    <span>{movieDetails.genres}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs sm:text-sm mb-4">
                    <span className="flex items-center text-yellow-400 font-bold gap-1">
                      <FaStar /> {movieDetails.rating} <span className="text-white">/10</span>
                    </span>
                    <span className="flex items-center gap-1 text-blue-400">
                      <FaHeart /> {movieDetails.feedback} feedback
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm text-center sm:text-left leading-relaxed">
                    {movieDetails.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Phần thông tin khách hàng */}
          <div className="bg-[#1e1b3a]/30 rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-2xl font-bold mb-4 text-center sm:text-left">
              Check your booking ticket information
            </h2>
            <div className="space-y-3 font-semibold">
              <p className="flex flex-col sm:flex-row">
                <span className="text-gray-400 text-sm sm:text-base min-w-[120px]">Full Name:</span>
                <span className="text-sm sm:text-base">{user.fullName}</span>
              </p>
              <p className="flex flex-col sm:flex-row">
                <span className="text-gray-400 text-sm sm:text-base min-w-[120px]">Email:</span>
                <span className="text-sm sm:text-base">{user.email}</span>
              </p>
              <p className="flex flex-col sm:flex-row">
                <span className="text-gray-400 text-sm sm:text-base min-w-[120px]">Phone:</span>
                <span className="text-sm sm:text-base">{user.phone}</span>
              </p>
              <p className="flex flex-col sm:flex-row">
                <span className="text-gray-400 text-sm sm:text-base min-w-[120px]">Identity Card:</span>
                <span className="text-sm sm:text-base">{user.identityCard}</span>
              </p>
            </div>

            {/* Terms and Policy Section */}
            <div className="mt-6 pt-4 border-t border-gray-600/50">
              <div className="text-xs sm:text-sm text-gray-400 space-y-2">
                <p className="leading-relaxed">
                  By proceeding with this booking, you agree to our
                  <a href="/terms" className="text-blue-400 hover:text-blue-300 underline mx-1">
                    Terms of Service
                  </a>
                  and
                  <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline ml-1">
                    Privacy Policy
                  </a>.
                </p>
                <div className="flex flex-wrap gap-4 text-xs">
                  <a href="/refund-policy" className="text-gray-500 hover:text-gray-300 transition-colors">
                    Refund Policy
                  </a>
                  <a href="/cinema-rules" className="text-gray-500 hover:text-gray-300 transition-colors">
                    Cinema Rules
                  </a>
                  <a href="/contact" className="text-gray-500 hover:text-gray-300 transition-colors">
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải - Thông tin đặt vé và thanh toán */}
        <div className="bg-[#252642]/30 rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-2xl font-bold mb-4 text-center sm:text-left">
            Confirm Booking Ticket
          </h2>

          {/* Thông tin đặt vé */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div>
              <p className="text-xs sm:text-sm text-gray-400">Cinema:</p>
              <p className="text-sm sm:text-base font-semibold">{cinema}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400">Date:</p>
              <p className="text-sm sm:text-base font-semibold">{date}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400">Time:</p>
              <p className="text-sm sm:text-base font-semibold">{time}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400">Seats:</p>
              <p className="text-sm sm:text-base font-semibold">
                {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None selected"}
              </p>
            </div>
          </div>

          {/* Tổng giá */}
          <div className="bg-[#2E3A4E]/50 mb-4 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-400">Total price</p>
            <p className="text-xl sm:text-2xl font-bold">{totalPrice.toLocaleString("vi-VN")}đ</p>
          </div>

          {/* Mã khuyến mãi */}
          <div className="bg-[#2E3A4E]/50 p-3 sm:p-4 rounded-lg mb-3">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                className="flex-1 bg-[#474787]/26 text-white rounded-xl p-2 sm:p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5B4CBD]"
                placeholder="Enter promotion code"
              />
              <button className="bg-[#5B4CBD] hover:bg-[#5B4CBD]/80 text-white font-bold rounded-xl p-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap">
                Add promotion
              </button>
            </div>
          </div>

          {/* Điểm tích lũy */}
          <div className="bg-[#2E3A4E]/50 p-3 sm:p-4 rounded-lg mb-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                className="flex-1 bg-[#474787]/26 text-white rounded-xl p-2 sm:p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5B4CBD]"
                placeholder="1,000 points = 1,000 VND"
              />
              <button className="bg-[#5B4CBD] hover:bg-[#5B4CBD]/80 text-white font-bold rounded-xl p-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap">
                Use Point
              </button>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <h3 className="text-base sm:text-lg mb-4 font-semibold">Payment Methods</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <button
              onClick={() => handlePaymentMethod("Bank")}
              className={`flex flex-col items-center justify-center rounded-lg p-3 sm:p-4 h-20 sm:h-24 font-semibold transition-colors ${paymentMethod === "Bank" ? "bg-[#5B4CBD]" : "bg-[#474787]/26 hover:bg-[#2E3A4E]"
                } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5B4CBD]`}
            >
              <BsBank size={20} className="mb-1 text-[#b2a6ff]" />
              <span className="text-xs sm:text-sm">Bank</span>
            </button>
            <button
              onClick={() => handlePaymentMethod("Visa")}
              className={`flex flex-col items-center justify-center rounded-lg p-3 sm:p-4 h-20 sm:h-24 font-semibold transition-colors ${paymentMethod === "Visa" ? "bg-[#5B4CBD]" : "bg-[#474787]/26 hover:bg-[#2E3A4E]"
                } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5B4CBD]`}
            >
              <RiVisaFill size={20} className="mb-1 text-[#b2a6ff]" />
              <span className="text-xs sm:text-sm text-center">Visa/Master</span>
            </button>
            <button
              onClick={() => handlePaymentMethod("PayPal")}
              className={`flex flex-col items-center justify-center rounded-lg p-3 sm:p-4 h-20 sm:h-24 font-semibold transition-colors ${paymentMethod === "PayPal" ? "bg-[#5B4CBD]" : "bg-[#474787]/26 hover:bg-[#2E3A4E]"
                } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5B4CBD]`}
            >
              <FaPaypal size={20} className="mb-1 text-[#b2a6ff]" />
              <span className="text-xs sm:text-sm">PayPal</span>
            </button>
          </div>

          {/* Nút hành động */}
          <div className="space-y-3">
            <button
              type="button"
              className="bg-[#6956F5] hover:bg-[#6956f5bf] text-white px-4 py-3 sm:px-5 sm:py-4 rounded-lg flex items-center font-semibold w-full justify-center text-base sm:text-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleConfirm}
              disabled={!paymentMethod}
            >
              Confirm And Payment
            </button>
            <button
              type="button"
              className="bg-transparent hover:bg-[#000000bf]/30 border-2 border-[#5B4CBD] text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg flex items-center font-semibold w-full justify-center text-base sm:text-xl transition-colors"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPayment;