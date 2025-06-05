import { useLocation, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaRegClock,
  FaCalendarAlt,
  FaHeart,
  FaTicketAlt,
} from "react-icons/fa";

const ConfirmPayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Extract data from BookingPage via location state
  const {
    selectedSeats = [],
    numberOfTickets = 1,
    totalPrice = 0,
    cinema = "CGV Crescent Mall",
    date = "2024-06-12",
    time = "14:00",
  } = state || {};

  // Movie details (hardcoded for consistency with BookingPage)
  const movieDetails = {
    title: "Mắt Biếc",
    poster:
      "https://cdnb.artstation.com/p/assets/images/images/024/183/449/large/baju-creative-mat-biec.jpg?1581838909",
    duration: "117 min",
    releaseDate: "12/12/2023",
    genres: "Romantic, Comedy",
    description:
      "A touching story about youth, memories and unrequited love that lasts a lifetime. 'Mắt Biếc' will take you back to your student years full of dreams and aspirations.",
    rating: "8.7",
    feedback: "1.2K",
  };

  // Handle payment confirmation (mock)
  const handleConfirmPayment = (e) => {
    e.preventDefault();
    // Simulate payment processing
    alert("Payment successful! Your tickets have been booked.");
    navigate("/"); // Redirect to home or booking confirmation page
  };

  return (
    <div className="overflow-x-hidden bg-gray-900 text-white p-6 pt-[86px] min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Movie Information */}
        <div className="bg-[#1e1b3a] rounded-tl-xl rounded-tr-xl shadow-lg p-6 flex gap-6">
          <img
            src={movieDetails.poster}
            alt={movieDetails.title}
            className="w-40 h-60 object-cover rounded-lg"
          />
          <div className="flex flex-col justify-between flex-1">
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                {movieDetails.title}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                <span className="flex items-center gap-1">
                  <FaRegClock /> {movieDetails.duration}
                </span>
                <span className="flex items-center gap-1">
                  <FaCalendarAlt /> {movieDetails.releaseDate}
                </span>
                <span>{movieDetails.genres}</span>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                {movieDetails.description}
              </p>
              <div className="flex items-center gap-4 text-sm mb-4">
                <span className="flex items-center text-yellow-400 font-bold gap-1">
                  <FaStar /> {movieDetails.rating}{" "}
                  <span className="text-white">/10</span>
                </span>
                <span className="flex items-center gap-1 text-blue-400">
                  <FaHeart /> {movieDetails.feedback} feedback
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="bg-[#252642] rounded-bl-xl rounded-br-xl p-6">
          <h2 className="text-lg font-bold mb-4">Booking Summary</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-400">Cinema</p>
              <p>{cinema}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Date</p>
              <p>{date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Time</p>
              <p>{time}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Seats</p>
              <p>
                {selectedSeats.length > 0
                  ? selectedSeats.join(", ")
                  : "None selected"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Number of Tickets</p>
              <p>{numberOfTickets}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Price</p>
              <p>{totalPrice.toLocaleString("vi-VN")}đ</p>
            </div>
          </div>

          {/* Payment Form */}
          <h2 className="text-lg font-bold mb-4">Payment Details</h2>
          <form onSubmit={handleConfirmPayment} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Cardholder Name</label>
              <input
                type="text"
                required
                className="w-full bg-gray-800 text-white p-2 rounded"
                placeholder="Enter name on card"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Card Number</label>
              <input
                type="text"
                required
                className="w-full bg-gray-800 text-white p-2 rounded"
                placeholder="1234 5678 9012 3456"
                maxLength="19"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-1">Expiry Date</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-800 text-white p-2 rounded"
                  placeholder="MM/YY"
                  maxLength="5"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1">CVV</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-800 text-white p-2 rounded"
                  placeholder="123"
                  maxLength="3"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-[#6956F5] hover:bg-[#6956f5bf] text-white px-5 py-2 rounded-full text-sm flex items-center font-semibold mt-4"
            >
              <FaTicketAlt className="mr-2" />
              Confirm Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPayment;
