import React, { useState, useEffect } from "react";
import { PiArmchairLight, PiArmchairFill } from "react-icons/pi";
import { MdOutlineChair } from "react-icons/md";

export const LayoutSelectSeat = ({
  onSeatSelect = () => { },
  initialSelectedSeats = [],
  seatDataFromAPI = [],
  totalSeats = 80,
  maxSeatsPerRow = 14,
  maxRows = 10,
  containerWidth = "750px",
  width = 30,
  height = 30,
  textColor = "text-gray-500",
  widthDouble = 60,
  heightDouble = 30,

  aisleWidth = 60,
  seatSpacing = 12,
  seatSpacingCouple = 0,
  seatColors = {
    available: "text-green-600",
    selected: "text-[#5341DB]",
    taken: "text-red-600",
    holding: "text-black",
    vip: "text-yellow-600",
    normal: "text-gray-700",
    couple: "text-pink-600",
  },
}) => {
  const [selectedSeats, setSelectedSeats] = useState(new Set(initialSelectedSeats));
  const [seatLayout, setSeatLayout] = useState([]);

  // Tạo seat map từ API data với seatId làm key
  const seatMap = {};
  seatDataFromAPI.forEach((seat) => {
    seatMap[seat.seatNumber] = seat;
  });

  // Group seats by row từ API data với cải thiện logic chia ghế
  const groupSeatsByRow = () => {
    const rows = {};

    seatDataFromAPI.forEach((seat) => {
      const row = seat.seatNumber[0]; // A, B, C...
      const number = parseInt(seat.seatNumber.slice(1)); // 1, 2, 3...

      if (!rows[row]) {
        rows[row] = [];
      }

      rows[row].push({
        ...seat,
        number,
        isCouple: seat.type === 'Couple'
      });
    });

    // Sort rows A-Z và tạo layout cân đối
    const sortedRows = Object.entries(rows)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([row, seats]) => {
        const sortedSeats = seats.sort((a, b) => a.number - b.number);

        // Chia ghế thành 2 bên một cách thông minh
        // Ưu tiên chia đều, nếu lẻ thì bên trái nhiều hơn 1 ghế
        const totalSeats = sortedSeats.length;
        const leftSideCount = Math.ceil(totalSeats / 2);

        return {
          row,
          seats: sortedSeats,
          leftSeats: sortedSeats.slice(0, leftSideCount),
          rightSeats: sortedSeats.slice(leftSideCount),
          isDouble: sortedSeats.some(s => s.type === 'Couple')
        };
      });

    return sortedRows;
  };

  console.log("SEAT DATA: ", seatDataFromAPI);

  useEffect(() => {
    if (seatDataFromAPI.length > 0) {
      const layout = groupSeatsByRow();
      setSeatLayout(layout);
    }
  }, [seatDataFromAPI]);

  const handleSeatClick = (seatNumber) => {
    const seat = seatMap[seatNumber];
    if (!seat || seat.status === "taken" || seat.status === "holding") return;

    const newSelectedSeats = new Set(selectedSeats);
    if (newSelectedSeats.has(seatNumber)) {
      newSelectedSeats.delete(seatNumber);
    } else {
      newSelectedSeats.add(seatNumber);
    }

    setSelectedSeats(newSelectedSeats);


    // Trả về thông tin ghế đã chọn với tổng giá
    const selectedSeatDetails = Array.from(newSelectedSeats).map(seatNum => seatMap[seatNum]);
    const totalPrice = selectedSeatDetails.reduce((sum, seat) => sum + seat.price, 0);
    const selectedSeatIds = selectedSeatDetails.map(seat => seat.seatId);

    onSeatSelect({
      seats: selectedSeatDetails,
      seatIds: selectedSeatIds,
      totalPrice: totalPrice,
      count: selectedSeatDetails.length
    });
  };

  const getSeatColor = (seat) => {
    const { seatNumber, status, type } = seat;

    if (status === "taken") return seatColors.taken;
    else if (status === "holding") return seatColors.holding;
    else if (selectedSeats.has(seatNumber)) return seatColors.selected;

    // Màu theo loại ghế
    switch (type) {
      case 'VIP':
        return seatColors.vip;
      case 'Normal':
        return seatColors.normal;
      case 'Couple':
        return seatColors.couple;
      default:
        return seatColors.available;
    }
  };

  const renderSeat = (seat) => {
    const { seatId, seatNumber, status, type, price } = seat;
    const isSelected = selectedSeats.has(seatNumber);
    const isTaken = status === "taken";
    const isHolding = status === "holding";
    const isCouple = type === 'Couple';

    // Render ghế đôi (Couple)
    if (isCouple) {
      return (
        <div
          key={seatId}
          className="relative inline-block"
          style={{ marginRight: `${seatSpacingCouple}px` }}
        >
          <button
            onClick={() => handleSeatClick(seatNumber)}
            className={`transition-all duration-200 hover:scale-105 
              ${isTaken ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              ${isHolding ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
             ${getSeatColor(seat)} relative group`}
            disabled={isTaken || isHolding}
            title={`${type} Seat ${seatNumber} - ${price.toLocaleString()}đ - ${status}`}
          >
            <MdOutlineChair
              style={{
                width: `${widthDouble}px`,
                height: `${heightDouble}px`,
                display: 'block'
              }}
            />

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {seatNumber} - {price.toLocaleString()}đ
            </div>
          </button>
        </div>
      );
    }

    // Render ghế đơn (Normal/VIP)
    return (
      <div
        key={seatId}
        className="relative inline-block"
        style={{ marginRight: `${seatSpacing}px` }}
      >
        <button
          onClick={() => handleSeatClick(seatNumber)}
          className={`transition-all duration-200 hover:scale-110 
            ${isTaken ? "cursor-not-allowed opacity-50" : "cursor-pointer"} 
            ${isHolding ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
            ${getSeatColor(seat)} relative group`}
          disabled={isTaken || isHolding}
          title={`${type} Seat ${seatNumber} - ${price.toLocaleString()}đ - ${status}`}
        >
          {isTaken || isHolding || isSelected ? (
            <PiArmchairFill
              style={{
                width: `${width}px`,
                height: `${height}px`,
                display: 'block'
              }}
            />
          ) : (
            <PiArmchairLight
              style={{
                width: `${width}px`,
                height: `${height}px`,
                display: 'block'
              }}
            />
          )}

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
            {seatNumber} - {price.toLocaleString()}đ
          </div>
        </button>
      </div>
    );
  };

  // Tính toán width của hàng rộng nhất để căn chỉnh
  const getMaxRowWidth = () => {
    let maxLeftWidth = 0;
    let maxRightWidth = 0;

    seatLayout.forEach((row) => {
      // Tính width của left side
      const leftWidth = row.leftSeats.reduce((total, seat) => {
        const seatWidth = seat.type === 'Couple' ? widthDouble : width;
        return total + seatWidth + seatSpacing;
      }, 0);

      // Tính width của right side
      const rightWidth = row.rightSeats.reduce((total, seat) => {
        const seatWidth = seat.type === 'Couple' ? widthDouble : width;
        return total + seatWidth + seatSpacing;
      }, 0);

      maxLeftWidth = Math.max(maxLeftWidth, leftWidth);
      maxRightWidth = Math.max(maxRightWidth, rightWidth);
    });

    return { maxLeftWidth, maxRightWidth };
  };

  const { maxLeftWidth, maxRightWidth } = getMaxRowWidth();

  const renderRow = (rowData) => {
    return (
      <div key={rowData.row} className="flex items-center justify-center mb-4">
        {/* Row label - Left */}
        <div className="w-8 flex justify-center">
          <span className={`${textColor} text-sm font-medium`}>
            {rowData.row}
          </span>
        </div>

        {/* Left side seats */}
        <div
          className="flex items-center justify-end"
          style={{ width: `${maxLeftWidth}px` }}
        >
          {rowData.leftSeats.map((seat, index) => (
            <div key={seat.seatId} className="last:mr-0">
              {renderSeat(seat)}
            </div>
          ))}
        </div>

        {/* Aisle */}
        <div
          className="flex items-center justify-center"
          style={{ width: `${aisleWidth}px` }}
        >
          <div className="w-px h-6 bg-gray-600 opacity-30"></div>
        </div>

        {/* Right side seats */}
        <div
          className="flex items-center justify-start"
          style={{ width: `${maxRightWidth}px` }}
        >
          {rowData.rightSeats.map((seat, index) => (
            <div key={seat.seatId} className="last:mr-0">
              {renderSeat(seat)}
            </div>
          ))}
        </div>

        {/* Row label - Right */}
        <div className="w-8 flex justify-center">
          <span className={`${textColor} text-sm font-medium`}>
            {rowData.row}
          </span>
        </div>
      </div>
    );
  };

  // Tính tổng giá của ghế đã chọn
  const getTotalPrice = () => {
    return Array.from(selectedSeats).reduce((total, seatNumber) => {
      const seat = seatMap[seatNumber];
      return total + (seat ? seat.price : 0);
    }, 0);
  };

  return (
    <div className="text-white rounded-lg" style={{ width: containerWidth }}>
      {/* Screen */}
      <div className="w-full h-[60px] relative overflow-hidden group mb-8">
        <svg
          width="100%"
          height="40"
          viewBox="0 0 800 40"
          className="absolute top-0 left-0 transition-transform duration-500 group-hover:scale-110"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6a57f5" stopOpacity="0.1" />
              <stop offset="25%" stopColor="#6a57f5" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#6a57f5" stopOpacity="1" />
              <stop offset="75%" stopColor="#6a57f5" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6a57f5" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d="M 0 20 Q 400 0 800 20"
            stroke="url(#purpleGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <div className={`text-center font-bold text-lg mt-6  ${textColor}`}>
          SCREEN
        </div>
      </div>

      {/* Seat Layout */}
      <div className="flex flex-col space-y-2"> {/* Tăng space-y từ space-y-1 lên space-y-2 */}
        {seatLayout.map((row) => renderRow(row))}
      </div>

      {/* Legend */}
      {/* <div className="mt-8 flex justify-center flex-wrap gap-6 text-sm">
        <div className="flex items-center space-x-2">
          <PiArmchairLight className={seatColors.normal} size={20} />
          <span className="text-gray-400">Normal</span>
        </div>
        <div className="flex items-center space-x-2">
          <PiArmchairLight className={seatColors.vip} size={20} />
          <span className="text-gray-400">VIP</span>
        </div>
        <div className="flex items-center space-x-2">
          <MdOutlineChair className={seatColors.couple} size={20} />
          <span className="text-gray-400">Couple</span>
        </div>
        <div className="flex items-center space-x-2">
          <PiArmchairFill className={seatColors.selected} size={20} />
          <span className="text-gray-400">Selecting</span>
        </div>
        <div className="flex items-center space-x-2">
          <PiArmchairFill className={seatColors.taken} size={20} />
          <span className="text-gray-400">Taken</span>
        </div>
         <div className="flex items-center space-x-2">
          <PiArmchairFill className={seatColors.holding} size={20} />
          <span className="text-gray-400">Holding</span>
        </div>
      </div> */}

      <div className="mt-8 overflow-x-auto w-full flex items-center justify-center">
        <div className="flex justify-center items-center flex-wrap gap-4 sm:gap-6 text-sm sm:text-lg w-full sm:px-3 max-w-full px-5">
          <div className="flex items-center space-x-2 min-w-fit">
            <PiArmchairLight className={seatColors.normal} size={20} />
            <span className="text-gray-400">Normal</span>
          </div>
          <div className="flex items-center space-x-2 min-w-fit">
            <PiArmchairLight className={seatColors.vip} size={20} />
            <span className="text-gray-400">VIP</span>
          </div>
          <div className="flex items-center space-x-2 min-w-fit">
            <MdOutlineChair className={seatColors.couple} size={20} />
            <span className="text-gray-400">Couple</span>
          </div>
          <div className="flex items-center space-x-2 min-w-fit">
            <PiArmchairFill className={seatColors.selected} size={20} />
            <span className="text-gray-400">Selecting</span>
          </div>
          <div className="flex items-center space-x-2 min-w-fit">
            <PiArmchairFill className={seatColors.taken} size={20} />
            <span className="text-gray-400">Taken</span>
          </div>
          <div className="flex items-center space-x-2 min-w-fit">
            <PiArmchairFill className={seatColors.holding} size={20} />
            <span className="text-gray-400">Holding</span>
          </div>
        </div>
      </div>



      {/* Selected Seats Info */}
      {selectedSeats.size > 0 && (
        <div className="mt-6 p-4 bg-white/5 rounded-lg backdrop-blur-sm">
          <div className="text-center">
            <p className="text-sm text-gray-300 mb-2">
              Selected: <span className="font-semibold">{selectedSeats.size}</span> seats
            </p>
            <p className="text-sm text-gray-300 mb-3">
              Seats: <span className="font-semibold">{Array.from(selectedSeats).join(', ')}</span>
            </p>
            <p className="text-xl font-bold text-white">
              Total price: <span className="text-[#ffffff] font-normal">{getTotalPrice().toLocaleString()}đ</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};