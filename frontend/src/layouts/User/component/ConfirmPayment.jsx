import { useLocation, useNavigate } from "react-router-dom";
import { FaStar, FaRegClock, FaCalendarAlt, FaHeart } from "react-icons/fa";

import { RiMovie2AiLine} from "react-icons/ri";

import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";


const ConfirmPayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const { user } = useAuth();

  const {
    selectedSeats = [],

    totalPrice = 0,
    selectedRoom,
    selectedDate,
    selectedTime,
    movie,
  } = state || {};
  if (!movie) return <div>Không có dữ liệu phim.</div>;

  const handlePaymentMethod = (method) => {
    setPaymentMethod(method);
  };




  const handleConfirm = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    console.log("Navigating to /waiting with state:", {

      selectedSeats,
      totalPrice,
      paymentMethod,
      selectedRoom,
      selectedDate,
      selectedTime,
    });


    navigate("/waiting", {
      state: {

        selectedSeats,
        totalPrice,
        paymentMethod,
        selectedRoom,
        selectedDate,
        selectedTime,

      },
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] text-white p-3 sm:p-6 pt-[80px] sm:pt-[100px]">

      {/* container chinh responsive */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* left-side */}
        <div className="space-y-6">

          {/* moive info*/}
          <div className="bg-white/5 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 h-[412px]">

              <div className="flex justify-center sm:justify-start">
                <img
                  src={movie.PosterImage}
                  alt={movie.NameOfEnglish}

                  className="w-40 h-56 sm:w-48 sm:h-72 object-cover rounded-lg flex-shrink-0"
                />
              </div>


              {/*info movie*/}
              <div className="flex flex-col justify-between flex-1">
                <div >
                  <h2 className="text-xl sm:text-2xl font-bold mb-1 text-center sm:text-left">
                    {movie.NameOfEnglish}
                  </h2>
                  <h3 className="text-md sm:text-xl font-semibod mb-4 text-center sm:text-left ">
                    {movie.NameOfVietnamese}
                  </h3>
                  <div className="flex flex-col items-start gap-2 text-xs sm:text-sm text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <FaRegClock className="text-green-400" /> {movie.RunningTime} min
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="text-blue-300" /> {new Date(movie.FromDate).toLocaleDateString("vi-VN")}
                    </span>
                    <span className="flex items-center gap-1"><RiMovie2AiLine className="text-red-600" />{movie.Genres}</span>
                  </div>

                  {/* <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs sm:text-sm mb-4">
                    <span className="flex items-center text-yellow-400 font-bold gap-1">
                      <FaStar /> {movie.rating} <span className="text-white">/10</span>
                    </span>
                    <span className="flex items-center gap-1 text-blue-400">
                      <FaHeart /> {movie.feedback} feedback
                    </span>
                  </div> */}
                  <p className="text-gray-300 text-xs sm:text-sm text-center sm:text-left leading-relaxed">
                    {movie.ContentSynopsis}
                  </p>

                </div>
              </div>
            </div>

          </div>

          {/* user info */}
          <div className="bg-white/5 rounded-xl shadow-lg p-4 sm:p-6">
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
                <span className="text-sm sm:text-base">{user.phoneNumber}</span>
              </p>
              <p className="flex flex-col sm:flex-row">
                <span className="text-gray-400 text-sm sm:text-base min-w-[120px]">Identity Card:</span>
                <span className="text-sm sm:text-base">1112223336868</span>
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

        {/* right side - payment*/}
        <div className="bg-white/5 rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-2xl font-bold mb-4 text-center sm:text-left">
            Confirm Booking Ticket
          </h2>

          {/* ticket info*/}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div>
              <p className="text-xs sm:text-sm text-gray-400">Room:</p>
              <p className="text-sm sm:text-base font-semibold">{selectedRoom}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400">Date:</p>
              <p className="text-sm sm:text-base font-semibold">{selectedDate ? new Date(selectedDate).toLocaleDateString("vi-VN") : "N/A"}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400">Time:</p>
              <p className="text-sm sm:text-base font-semibold">{selectedTime}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-400">Seats:</p>
              <p className="text-sm sm:text-base font-semibold">
                {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None selected"}
              </p>
            </div>
          </div>

          {/* total price*/}
          <div className="bg-[#2E3A4E]/40 mb-4 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-400">Total price</p>
            <p className="text-xl sm:text-2xl font-bold">{totalPrice.toLocaleString("vi-VN")}đ</p>
          </div>

          {/* promotion */}
          <div className="bg-[#2E3A4E]/40 p-3 sm:p-4 rounded-lg mb-3">
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

          {/* point */}
          <div className="bg-[#2E3A4E]/40 p-3 sm:p-4 rounded-lg mb-4">
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

          {/* payment method */}
          <h3 className="text-base sm:text-lg mb-4 font-semibold">Payment Methods</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <button
              onClick={() => handlePaymentMethod("VnPay")}
              className={`flex flex-col items-center justify-center rounded-lg p-3 sm:p-4 h-20 sm:h-24 font-semibold transition-colors ${paymentMethod === "VnPay" ? "bg-[#5B4CBD]" : "bg-[#474787]/26 hover:bg-[#2E3A4E]"
                } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5B4CBD]`}
            >
              <img
                src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-350x65.png"
                alt="VnPay logo"
                className="w-20 h-10 mb-1 "
              />
              <span className="text-xs sm:text-sm">VnPay</span>
            </button>
            <button
              onClick={() => handlePaymentMethod("Zalo")}
              className={`flex flex-col items-center justify-center rounded-lg p-3 sm:p-4 h-20 sm:h-24 font-semibold transition-colors ${paymentMethod === "Zalo"
                  ? "bg-[#5B4CBD]"
                  : "bg-[#474787]/26 hover:bg-[#2E3A4E]"
                } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5B4CBD]`}
            >
             
              <img
                src="https://vectorseek.com/wp-content/uploads/2023/09/Zalopay-Logo-Vector.svg-.png"
                alt="ZaloPay logo"
                className="w-20 h-10 mb-1 "
              />
              <span className="text-xs sm:text-sm text-center">ZaloPay</span>
            </button>

            <button
              onClick={() => handlePaymentMethod("Momo")}
              className={`flex flex-col items-center justify-center rounded-lg p-3 sm:p-4 h-20 sm:h-24 font-semibold transition-colors ${paymentMethod === "Momo" ? "bg-[#5B4CBD]" : "bg-[#474787]/26 hover:bg-[#2E3A4E]"
                } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5B4CBD]`}
            >
               <img
                src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Transparent-1024x1024.png"
                alt="Momo logo"
                className="w-20 h-10 mb-1 "
              />
              <span className="text-xs sm:text-sm">Momo</span>
            </button>
          </div>

          {/* action button */}
          <div className="space-y-3">
            <button
              type="button"
               className="appearance-none w-full py-3 pl-4 pr-10 text-lg font-semibold text-purple-100 bg-gradient-to-r from-[#36355a] to-[#4e408e] 
                 border-b-2 border-purple-500 hover:border-purple-400 focus:outline-none focus:ring-0 
                 transition duration-300 ease-in-out tracking-wide rounded-4xl"
              onClick={handleConfirm}
              disabled={!paymentMethod}
            >
              Confirm And Payment
            </button>
            <button
              type="button"
              className="bg-transparent hover:bg-[#000000bf]/30 border-2 border-purple-500/70 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-4xl flex items-center font-semibold w-full justify-center text-base sm:text-xl transition-colors"
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