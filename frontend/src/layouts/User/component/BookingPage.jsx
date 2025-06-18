import { useState } from "react";
import {
  FaStar,
  FaRegClock,
  FaCalendarAlt,
  FaHeart,
  FaTicketAlt,
} from "react-icons/fa";
import { MdChair, MdOutlineOndemandVideo } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Swal from "sweetalert2";

const BookingPage = () => {
  // State để quản lý số lượng vé, ghế đã chọn, v.v.
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const { user, isLoading } = useAuth();

  // Danh sách ghế (8 hàng, mỗi hàng 8 ghế)
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 8;
  const soldSeats = ["A1", "B3", "C5", "D2", "E4"]; // Ghế đã bán (ví dụ)

  // Hàm xử lý chọn ghế
  const toggleSeat = (seat) => {
    if (!user) {
      Swal.fire({
        icon: "info",
        title: "Bạn cần đăng nhập",
        text: "Vui lòng đăng nhập để chọn ghế.",
        confirmButtonText: "Đăng nhập",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    if (soldSeats.includes(seat)) return; // Không cho chọn ghế đã bán

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else if (selectedSeats.length < numberOfTickets) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };
  const navigate = useNavigate();
  // Tính tổng giá (ví dụ: 100k/vé)
  const ticketPrice = 100000;
  const totalPrice = selectedSeats.length * ticketPrice;

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#1a005f] via-[#3f2b96] to-[#000c2d] text-white p-3 sm:p-6 pt-[80px] sm:pt-[100px]">
      {/* Phần thông tin phim */}
      <div className="bg-[#1e1b3a]/30 text-white rounded-tl-xl rounded-tr-xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 max-w-6xl mx-auto">
        {/* Poster */}
        <div className="flex justify-center sm:justify-start">
          <img
            src="https://cdnb.artstation.com/p/assets/images/images/024/183/449/large/baju-creative-mat-biec.jpg?1581838909"
            alt="Mắt Biếc"
            className="w-32 h-48 sm:w-40 sm:h-60 object-cover rounded-lg flex-shrink-0"
          />
        </div>

        {/* Thông tin */}
        <div className="flex flex-col justify-between flex-1">
          {/* Tên phim */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-center sm:text-left">
              Mắt Biếc
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-2">
              <span className="flex items-center gap-1">
                <FaRegClock /> 117 min
              </span>
              <span className="flex items-center gap-1">
                <FaCalendarAlt /> 12/12/2023
              </span>
              <span>Romantic, Comedy</span>
            </div>

            {/* Mô tả */}
            <p className="text-gray-300 text-xs sm:text-sm mb-4 text-center sm:text-left leading-relaxed">
              A touching story about youth, memories and unrequited love that
              lasts a lifetime. "Mắt Biếc" will take you back to your student
              years full of dreams and aspirations.
            </p>

            {/* Rating */}
            <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs sm:text-sm mb-4">
              <span className="flex items-center text-yellow-400 font-bold gap-1">
                <FaStar /> 8.7 <span className="text-white">/10</span>
              </span>
              <span className="flex items-center gap-1 text-blue-400">
                <FaHeart /> 1.2K feedback
              </span>
            </div>
          </div>

          {/* Nút */}
          <div className="flex justify-center sm:justify-start">
            <button className="text-white bg-[#6956F5] px-4 py-2 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-[#6956f5bf] transition font-semibold flex items-center">
              <MdOutlineOndemandVideo className="mr-2" />
              View trailer
            </button>
          </div>
        </div>
      </div>

      {/* Phần chọn ghế */}
      <div className="mt-0 max-w-6xl mx-auto bg-[#252642]/30 rounded-bl-xl rounded-br-xl">
        {/* Phần thông tin rạp chiếu */}
        <div className="mb-6 p-4 sm:p-[24px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
            <div>
              <label className="block text-xs sm:text-sm mb-1">Cinema</label>
              <select className="w-full bg-gray-800/40 text-white p-2 rounded text-xs sm:text-sm">
                <option>CGV Crescent Mall</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm mb-1">Date</label>
              <select className="w-full bg-gray-800/40  text-white p-2 rounded text-xs sm:text-sm">
                <option>2024-06-12</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm mb-1">Time</label>
              <select className="w-full bg-gray-800/40 text-white p-2 rounded text-xs sm:text-sm">
                <option>14:00</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm mb-1">
                Number ticket
              </label>
              <select
                className="w-full bg-gray-800/40 text-white p-2 rounded text-xs sm:text-sm"
                value={numberOfTickets}
                onChange={(e) => {
                  setNumberOfTickets(Number(e.target.value));
                  setSelectedSeats([]); // Reset ghế đã chọn
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Phần chọn ghế */}
        <div className="mb-6 px-2 sm:px-0">
          <h2 className="text-center sm:text-start text-base sm:text-lg mb-4 font-bold px-4 sm:p-[24px]">
            Choose seat
          </h2>
          <div className="text-center mb-4">
            <div className="inline-block w-4/5 sm:w-3/4 h-[8px] sm:h-[10px] bg-[#6956F5] text-[#6956F5] py-1 rounded-t-lg rounded-tl-3xl rounded-tr-3xl font-semibold">
              <span className="flex items-end justify-center p-2 sm:p-4 text-sm sm:text-xl">
                SCREEN
              </span>
            </div>
          </div>

          {/* Seat selection - Mobile optimized */}
          <div className="flex justify-center overflow-x-auto">
            <div className="min-w-max">
              <div className="grid grid-cols-10 gap-1 sm:gap-2">
                {/* Cột số thứ tự ghế */}
                <div></div>
                {Array.from({ length: seatsPerRow + 1 }, (_, i) => {
                  if (i === 4) {
                    return <div key="aisle-header" className="w-2 sm:w-4" />;
                  }
                  const seatNumber = i > 4 ? i : i + 1;
                  return (
                    <div
                      key={i}
                      className="text-center text-lg sm:text-3xl text-[#6956F5] font-semibold"
                    >
                      {seatNumber}
                    </div>
                  );
                })}

                {/* Ghế và tên hàng */}
                {rows.map((row) =>
                  Array.from({ length: seatsPerRow + 2 }, (_, i) => {
                    if (i === 0) {
                      // Cột hiển thị tên hàng (A, B, C...)
                      return (
                        <div
                          key={`${row}-label`}
                          className="text-center text-lg sm:text-3xl text-[#6956F5] font-semibold pt-2 sm:pt-4"
                        >
                          {row}
                        </div>
                      );
                    }

                    if (i === 5) {
                      // Cột lối đi
                      return (
                        <div key={`${row}-aisle`} className="w-2 sm:w-4" />
                      );
                    }

                    // Tính chỉ số thực của ghế
                    const seatIndex = i > 5 ? i - 1 : i;
                    const seat = `${row}${seatIndex}`;
                    const isSold = soldSeats.includes(seat);
                    const isSelected = selectedSeats.includes(seat);

                    return (
                      <button
                        key={seat}
                        onClick={() => toggleSeat(seat)}
                        disabled={isSold}
                        className="w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center bg-transparent p-0 border-none outline-none"
                      >
                        <MdChair
                          aria-label={`Seat ${seat} ${
                            isSold
                              ? "sold"
                              : isSelected
                              ? "selected"
                              : "available"
                          }`}
                          className={`w-8 h-8 sm:w-13 sm:h-13 transition-colors
                ${
                  isSold
                    ? "text-gray-500"
                    : isSelected
                    ? "text-blue-500"
                    : "text-gray-300 hover:text-gray-100"
                }`}
                        />
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Trạng thái ghế */}
        <div className="flex justify-center mb-6 px-4">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-700 mr-2"></div>
              <span className="text-xs sm:text-sm">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 mr-2"></div>
              <span className="text-xs sm:text-sm">Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-500 mr-2"></div>
              <span className="text-xs sm:text-sm">Sold</span>
            </div>
          </div>
        </div>

        {/* Phần tổng giá và nút thanh toán */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 sm:p-[24px]">
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm mb-1">
              Seat:{" "}
              {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Not yet"}
            </p>
            <p className="text-sm sm:text-base font-semibold">
              Total price: {totalPrice.toLocaleString("vi-VN")}đ
            </p>
          </div>
          <button
            className="bg-[#6956F5] hover:bg-[#6956f5bf] text-white px-4 py-2 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm flex items-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
            disabled={selectedSeats.length !== numberOfTickets}
            onClick={() =>
              navigate("/confirmPayment", {
                state: {
                  selectedSeats,
                  numberOfTickets,
                  totalPrice,
                  cinema: "CGV Crescent Mall",
                  date: "2024-06-12",
                  time: "14:00",
                },
              })
            }
          >
            <FaTicketAlt className="mr-2" />
            Continue Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
