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
    <div className="overflow-x-hidden bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] text-white p-6 pt-[100px] min-h-screen grid grid-cols-2">

      {/* div ben trai, thong tin phim, thong tin khaach hang */}
      <div className="max-w-4xl mx-auto">
        
        <div className="rounded-tl-xl py-6 flex gap-6">
          <img
            src={movieDetails.poster}
            alt={movieDetails.title}
            className="w-60 h-90 object-cover rounded-lg"
          />
          <div className="flex flex-col justify-between flex-1">
            <div>
              <h2 className="text-2xl font-bold mb-2">{movieDetails.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                <span className="flex items-center gap-1">
                  <FaRegClock /> {movieDetails.duration}
                </span>
                <span className="flex items-center gap-1">
                  <FaCalendarAlt /> {movieDetails.releaseDate}
                </span>
                <span>{movieDetails.genres}</span>
              </div>
              <div className="flex items-center gap-4 text-sm mb-4">
                <span className="flex items-center text-yellow-400 font-bold gap-1">
                  <FaStar /> {movieDetails.rating} <span className="text-white">/10</span>
                </span>
                <span className="flex items-center gap-1 text-blue-400">
                  <FaHeart /> {movieDetails.feedback} feedback
                </span>
              </div>
              <p className="text-gray-300 mb-4">{movieDetails.description}</p>
            </div>
          </div>
        </div>

        <div className="pt-[10px] mt-[30px]">
          <h2 className="text-2xl font-bold pt-8">Check your booking ticket information</h2>
          <div className="py-4 font-semibold">
            <p className="py-2">
              <span className="text-gray-400">Full Name:</span> {user.fullName}
            </p>
            <p className="py-2">
              <span className="text-gray-400">Email:</span> {user.email}
            </p>
            <p className="py-2">
              <span className="text-gray-400">Phone:</span> {user.phone}
            </p>
            <p className="py-2">
              <span className="text-gray-400">Identity Card:</span> {user.identityCard}
            </p>
          </div>
        </div>
      </div>
       
       {/* div ben phai thong tin ve, payment method */}

      <div className="bg-[#1e1b3a]/30 pl-[20px] p-4 rounded-2xl mt-[14px]">
        <h2 className="text-2xl font-bold mb-4">Confirm Booking Ticket</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-400">Cinema:</p>
            <p>{cinema}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Date:</p>
            <p>{date}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Time:</p>
            <p>{time}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Seats:</p>
            <p>{selectedSeats.length > 0 ? selectedSeats.join(", ") : "None selected"}</p>
          </div>
        </div>
        <div className="bg-[#2E3A4E]/50 mb-3 rounded-lg">
          <p className="text-sm text-gray-400 pt-2 pl-2">Total price</p>
          <p className="p-2 text-2xl font-bold">{totalPrice.toLocaleString("vi-VN")}đ</p>
        </div>
        <div className="bg-[#2E3A4E]/50 p-4 rounded-lg w-full max-w-4xl mx-auto">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            <input
              type="text"
              className="col-span-2 sm:col-span-3 md:col-span-4 bg-[#474787]/26 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#5B4CBD]"
              placeholder="Enter promotion code"
            />
            <button className="col-span-1 bg-[#5B4CBD] text-white font-bold rounded-xl p-3 text-sm sm:text-base">
              Add promotion
            </button>
          </div>
        </div>
        <div className="bg-[#2E3A4E]/50 p-4 rounded-lg w-full max-w-4xl mx-auto mt-[10px]">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            <input
              type="text"
              className="col-span-2 sm:col-span-3 md:col-span-4 bg-[#474787]/26 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#5B4CBD]"
              placeholder="1,000 points = 1,000 VND"
            />
            <button className="col-span-1 bg-[#5B4CBD] text-white font-bold rounded-xl p-3 text-sm sm:text-base">
              Use Point
            </button>
          </div>
        </div>
        <h2 className="text-lg mb-4 mt-4 font-semibold">Payment Methods</h2>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => handlePaymentMethod("Bank")}
            className={`flex items-center justify-center rounded-lg p-4 h-[120px] font-semibold ${
              paymentMethod === "Bank" ? "bg-[#5B4CBD]" : "bg-[#474787]/26 hover:bg-[#2E3A4E]"
            } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5B4CBD]`}
          >
            <BsBank size={24} className="mr-1 text-[#b2a6ff]" />
            Bank
          </button>
          <button
            onClick={() => handlePaymentMethod("Visa")}
            className={`flex items-center justify-center rounded-lg p-4 h-[120px] font-semibold ${
              paymentMethod === "Visa" ? "bg-[#5B4CBD]" : "bg-[#474787]/26 hover:bg-[#2E3A4E]"
            } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5B4CBD]`}
          >
            <RiVisaFill size={24} className="mr-1 text-[#b2a6ff]" />
            Visa/MasterCard
          </button>
          <button
            onClick={() => handlePaymentMethod("PayPal")}
            className={`flex items-center justify-center rounded-lg p-4 h-[120px] font-semibold ${
              paymentMethod === "PayPal" ? "bg-[#5B4CBD]" : "bg-[#474787]/26 hover:bg-[#2E3A4E]"
            } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5B4CBD]`}
          >
            <FaPaypal size={24} className="mr-1 text-[#b2a6ff]" />
            PayPal
          </button>
        </div>
        <button
          type="button" 
          className="bg-[#6956F5] hover:bg-[#6956f5bf] text-white px-5 py-4 rounded-lg flex items-center font-semibold mt-4 w-full justify-center text-xl"
          onClick={handleConfirm}
        >
          Confirm And Payment
        </button>
        <button
          type="button"
          className="bg-transparent hover:bg-[#000000bf]/30 border-2 border-[#5B4CBD] text-white px-5 py-2.5 rounded-lg flex items-center font-semibold mt-4 w-full justify-center text-xl"
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmPayment;