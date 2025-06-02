import { useState } from 'react';
import { FaStar, FaRegClock, FaCalendarAlt, FaHeart, FaTicketAlt } from 'react-icons/fa';

const BookingPage = () => {
  // State để toggle hiển thị phần chọn ghế
  const [showSeatSelection, setShowSeatSelection] = useState(false);

  // State để quản lý số lượng vé, ghế đã chọn, v.v.
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Danh sách ghế (8 hàng, mỗi hàng 8 ghế)
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 8;
  const soldSeats = ['A1', 'B3', 'C5', 'D2', 'E4']; // Ghế đã bán (ví dụ)

  // Hàm xử lý chọn ghế
  const toggleSeat = (seat) => {
    if (soldSeats.includes(seat)) return; // Không cho chọn ghế đã bán
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else if (selectedSeats.length < numberOfTickets) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // Tính tổng giá (ví dụ: 100k/vé)
  const ticketPrice = 100000;
  const totalPrice = selectedSeats.length * ticketPrice;

  

  return (
    <div className="overflow-x-hidden bg-gray-900 text-white p-6">
      {/* Phần thông tin phim */}
      <div className="bg-[#1e1b3a] text-white rounded-xl shadow-lg p-6 flex gap-6 max-w-4xl mx-auto">
        {/* Poster */}
        <img
          src="https://cdnb.artstation.com/p/assets/images/images/024/183/449/large/baju-creative-mat-biec.jpg?1581838909"
          alt="Mắt Biếc"
          className="w-40 h-60 object-cover rounded-lg"
        />

        {/* Thông tin */}
        <div className="flex flex-col justify-between flex-1">
          {/* Tên phim */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">Mắt Biếc</h2>
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
              <span className="flex items-center gap-1">
                <FaRegClock /> 117 min
              </span>
              <span className="flex items-center gap-1">
                <FaCalendarAlt /> 12/12/2023
              </span>
              <span>Romantic, Comedy</span>
            </div>

            {/* Mô tả */}
            <p className="text-gray-300 text-sm mb-4">
              A touching story about youth, memories and unrequited love that
              lasts a lifetime. "Mắt Biếc" will take you back to your student
              years full of dreams and aspirations.
            </p>

            {/* Rating */}
            <div className="flex items-center gap-4 text-sm mb-4">
              <span className="flex items-center text-yellow-400 font-bold gap-1">
                <FaStar /> 8.7 <span className="text-white">/10</span>
              </span>
              <span className="flex items-center gap-1 text-blue-400">
                <FaHeart /> 1.2K feedback
              </span>
            </div>
          </div>

          {/* Nút */}
          <div className="flex gap-4">
            <button
              onClick={() => setShowSeatSelection(true)}
              className="bg-[#6956F5] hover:bg-[#5446bd] text-white px-5 py-2 rounded-full text-sm flex items-center font-semibold  "
            >
              <FaTicketAlt className="mr-2" />
              Book now
            </button>
            <button className="text-white border border-white px-5 py-2 rounded-full text-sm hover:bg-white hover:text-black transition font-semibold">
              View trailer
            </button>
          </div>
        </div>
      </div>

      {/* Phần chọn ghế (hiển thị khi nhấn "Book now") */}
      {showSeatSelection && (
        <div className="mt-0 max-w-4xl mx-auto bg-[#252642]">
          {/* Phần thông tin rạp chiếu */}
          <div className="mb-6 p-[20px]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1">
                <label className="block text-sm mb-1">Cinema</label>
                <select className="w-full bg-gray-800 text-white p-2 rounded">
                  <option>CGV Crescent Mall</option>
                </select>
              </div>
              <div className="flex-1 mx-4">
                <label className="block text-sm mb-1">Date</label>
                <select className="w-full bg-gray-800 text-white p-2 rounded">
                  <option>2024-06-12</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1">Time</label>
                <select className="w-full bg-gray-800 text-white p-2 rounded">
                  <option>14:00</option>
                </select>
              </div>
              <div className="flex-1 ml-4">
                <label className="block text-sm mb-1">Number ticket</label>
                <select
                  className="w-full bg-gray-800 text-white p-2 rounded"
                  value={numberOfTickets}
                  onChange={(e) => {
                    setNumberOfTickets(Number(e.target.value));
                    setSelectedSeats([]); // Reset ghế đã chọn
                  }}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Phần chọn ghế */}
          <div className="mb-6">
            <h2 className="text-start text-lg mb-4 font-bold p-[20px]">Choose seat</h2>
            <div className="text-center mb-4">
              <div className="inline-block w-3/4 h-[10px] bg-[#8A2BE2] text-[#6956F5] py-1 rounded-t-lg rounded-tl-3xl 	rounded-tr-3xl font-bold ">
              <span className="flex items-end justify-center p-4 text-xl"> SCREEN</span>
              
              </div>
            
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-10 gap-2">
                {/* Cột số thứ tự hàng */}
                {rows.map((row) => (
                  <div key={row} className="text-center text-sm">
                    {row}
                  </div>
                ))}
                {/* Ghế */}
                {rows.map((row) =>
                  Array.from({ length: seatsPerRow }, (_, i) => {
                    const seat = `${row}${i + 1}`;
                    const isSold = soldSeats.includes(seat);
                    const isSelected = selectedSeats.includes(seat);
                    return (
                      <button
                        key={seat}
                        onClick={() => toggleSeat(seat)}
                        className={`w-8 h-8 rounded ${
                          isSold
                            ? 'bg-gray-500 cursor-not-allowed'
                            : isSelected
                            ? 'bg-blue-500'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        disabled={isSold}
                        aria-label={`Seat ${seat} ${isSold ? 'sold' : isSelected ? 'selected' : 'available'}`}
                      >
                        {i + 1}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Trạng thái ghế */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center mr-4">
              <div className="w-4 h-4 bg-gray-700 mr-2"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center mr-4">
              <div className="w-4 h-4 bg-blue-500 mr-2"></div>
              <span className="text-sm">Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-500 mr-2"></div>
              <span className="text-sm">Sold</span>
            </div>
          </div>

          {/* Phần tổng giá và nút thanh toán */}
          <div className="flex justify-between items-center p-[20px]">
            <div>
              <p>
                Seat:{' '}
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Not yet'}
              </p>
              <p>
                Total price:{' '}
                {totalPrice.toLocaleString('vi-VN')}đ
              </p>
            </div>
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full text-sm flex items-center"
              disabled={selectedSeats.length !== numberOfTickets}
            >
              <FaTicketAlt className="mr-2" />
              Continue payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;