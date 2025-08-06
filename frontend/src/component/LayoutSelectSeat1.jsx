import React, { useState, useEffect } from "react";
import { PiArmchairLight, PiArmchairFill } from "react-icons/pi";
import { MdOutlineChair } from "react-icons/md";

export const LayoutSelectSeat1 = ({
  onSeatSelect = () => {},
  initialSelectedSeats = [],
  seatDataFromAPI = [],
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
    available: "text-purple-300",
    selected: "text-purple-100",
    taken: "text-purple-600",
    holding: "text-blue-600",
    vip: "text-purple-200",
    normal: "text-purple-300",
    couple: "text-purple-400",
  },
}) => {
  const [selectedSeats, setSelectedSeats] = useState(
    new Set(initialSelectedSeats)
  );
  const [seatLayout, setSeatLayout] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Tạo seat map từ API data với seatNumber làm key
  const seatMap = {};
  seatDataFromAPI.forEach((seat) => {
    seatMap[seat.seatNumber] = seat;
  });

  // Group seats by row và column từ API data
  const groupSeatsByRowCol = () => {
    if (seatDataFromAPI.length === 0) return [];

    // Tìm số hàng và cột tối đa
    const maxRow = Math.max(...seatDataFromAPI.map((seat) => seat.row));
    const maxCol = Math.max(...seatDataFromAPI.map((seat) => seat.col));
    const layout = [];
    // Tạo layout theo từng hàng
    for (let rowIndex = 1; rowIndex <= maxRow; rowIndex++) {
      const rowLabel = String.fromCharCode(64 + rowIndex); // A, B, C...
      // Lấy tất cả ghế trong hàng này
      const seatsInRow = seatDataFromAPI.filter(
        (seat) => seat.row === rowIndex
      );
      if (seatsInRow.length === 0) continue;
      // Sắp xếp theo cột
      seatsInRow.sort((a, b) => a.col - b.col);
      // Xác định loại ghế dựa trên vị trí hàng
      let seatType = "normal";
      if (rowIndex <= 3) {
        seatType = "normal"; // 3 dãy đầu
      } else if (rowIndex === maxRow) {
        seatType = "couple"; // dãy cuối
      } else {
        seatType = "vip"; // còn lại
      }

      // Tạo danh sách ghế cho hàng này
      const rowSeats = [];

      if (seatType === "couple") {
        // Ghế couple: gộp 2 ghế thành 1
        for (let i = 0; i < seatsInRow.length; i += 2) {
          const seat1 = seatsInRow[i];
          const seat2 = seatsInRow[i + 1];

          if (seat1 && seat2) {
            // Tạo ghế couple với tên gộp
            const coupleSeat = {
              ...seat1,
              seatNumber: `${rowLabel}${seat1.col}-${seat2.col}`,
              seatId: `${seat1.seatId}-${seat2.seatId}`,
              type: "Couple",
              price: seat1.price + (seat2 ? seat2.price : 0),
              isCouple: true,
              originalSeats: [seat1, seat2].filter(Boolean),
            };
            rowSeats.push(coupleSeat);
          }
        }
      } else {
        // Ghế đơn: normal hoặc vip
        seatsInRow.forEach((seat) => {
          rowSeats.push({
            ...seat,
            type: seatType === "normal" ? "Normal" : "VIP",
            isCouple: false,
          });
        });
      }

      // Chia ghế thành 2 bên với lối đi ở giữa
      const totalSeats = rowSeats.length;
      const leftSideCount = Math.ceil(totalSeats / 2);

      layout.push({
        row: rowLabel,
        rowIndex,
        seats: rowSeats,
        leftSeats: rowSeats.slice(0, leftSideCount),
        rightSeats: rowSeats.slice(leftSideCount),
        seatType,
      });
    }

    return layout;
  };

  useEffect(() => {
    if (seatDataFromAPI.length > 0) {
      const layout = groupSeatsByRowCol();

      setSeatLayout(layout);
      setTimeout(() => setIsLoaded(true), 100);
    }
  }, [seatDataFromAPI]);

  const handleSeatClick = (seat) => {
    const seatNumber = seat.seatNumber;

    // Kiểm tra trạng thái ghế
    if (seat.status === "taken" || seat.status === "holding") return;

    const newSelectedSeats = new Set(selectedSeats);
    if (newSelectedSeats.has(seatNumber)) {
      newSelectedSeats.delete(seatNumber);
    } else {
      newSelectedSeats.add(seatNumber);
    }

    setSelectedSeats(newSelectedSeats);

    // Tính toán thông tin ghế đã chọn
    const selectedSeatDetails = [];
    const selectedSeatIds = [];
    let totalPrice = 0;

    newSelectedSeats.forEach((seatNum) => {
      // Tìm ghế trong layout
      for (let row of seatLayout) {
        const foundSeat = row.seats.find((s) => s.seatNumber === seatNum);
        if (foundSeat) {
          selectedSeatDetails.push(foundSeat);
          if (foundSeat.isCouple) {
            // Với ghế couple, lấy ID của cả 2 ghế gốc
            foundSeat.originalSeats.forEach((originalSeat) => {
              selectedSeatIds.push(originalSeat.seatId);
            });
          } else {
            selectedSeatIds.push(foundSeat.seatId);
          }
          totalPrice += foundSeat.price;
          break;
        }
      }
    });

    onSeatSelect({
      seats: selectedSeatDetails,
      seatIds: selectedSeatIds,
      totalPrice: totalPrice,
      count: selectedSeatDetails.length,
    });
  };

  const getSeatColor = (seat) => {
    const { seatNumber, status, type } = seat;

    if (status === "taken") return seatColors.taken;
    else if (status === "holding") return seatColors.holding;
    else if (selectedSeats.has(seatNumber)) return seatColors.selected;

    switch (type) {
      case "VIP":
        return seatColors.vip;
      case "Normal":
        return seatColors.normal;
      case "Couple":
        return seatColors.couple;
      default:
        return "text-purple-300";
    }
  };

  const renderSeat = (seat) => {
    const { seatId, seatNumber, status, type, price } = seat;
    const isSelected = selectedSeats.has(seatNumber);
    const isTaken = status === "taken";
    const isHolding = status === "holding";
    const isCouple = seat.isCouple;
    const isClickable = !isTaken && !isHolding;

    // Ghế đôi
    if (isCouple) {
      return (
        <div
          key={seatId}
          className="inline-block"
          style={{
            marginRight: `${seatSpacingCouple}px`,
            width: `${widthDouble}px`,
            height: `${heightDouble}px`,
            position: "relative",
          }}
        >
          <div
            onClick={isClickable ? () => handleSeatClick(seat) : undefined}
            className={`
              ${getSeatColor(seat)} 
              transition-opacity duration-200
              ${!isClickable ? "opacity-50" : "opacity-100"}
              ${!isClickable ? "cursor-not-allowed" : "cursor-pointer"}
              group relative
            `}
            style={{
              width: `${widthDouble}px`,
              height: `${heightDouble}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title={`${type} Seat ${seatNumber} - ${price.toLocaleString()}đ - ${status}`}
          >
            <MdOutlineChair
              style={{
                width: `${widthDouble}px`,
                height: `${heightDouble}px`,
                display: "block",
                pointerEvents: "none",
              }}
            />

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              {seatNumber} - {price.toLocaleString()}đ
            </div>
          </div>
        </div>
      );
    }

    // Ghế đơn (Normal/VIP)
    return (
      <div
        key={seatId}
        className="inline-block"
        style={{
          marginRight: `${seatSpacing}px`,
          width: `${width}px`,
          height: `${height}px`,
          position: "relative",
        }}
      >
        <div
          onClick={isClickable ? () => handleSeatClick(seat) : undefined}
          className={`
            ${getSeatColor(seat)} 
            transition-opacity duration-200
            ${!isClickable ? "opacity-50" : "opacity-100"}
            ${!isClickable ? "cursor-not-allowed" : "cursor-pointer"}
            group relative
          `}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title={`${type} Seat ${seatNumber} - ${price.toLocaleString()}đ - ${status}`}
        >
          {isTaken || isHolding || isSelected ? (
            <PiArmchairFill
              style={{
                width: `${width}px`,
                height: `${height}px`,
                display: "block",
                pointerEvents: "none",
              }}
            />
          ) : (
            <PiArmchairLight
              style={{
                width: `${width}px`,
                height: `${height}px`,
                display: "block",
                pointerEvents: "none",
              }}
            />
          )}

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
            {seatNumber} - {price.toLocaleString()}đ
          </div>
        </div>
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
        const seatWidth = seat.isCouple ? widthDouble : width;
        return total + seatWidth + seatSpacing;
      }, 0);

      // Tính width của right side
      const rightWidth = row.rightSeats.reduce((total, seat) => {
        const seatWidth = seat.isCouple ? widthDouble : width;
        return total + seatWidth + seatSpacing;
      }, 0);

      maxLeftWidth = Math.max(maxLeftWidth, leftWidth);
      maxRightWidth = Math.max(maxRightWidth, rightWidth);
    });

    return { maxLeftWidth, maxRightWidth };
  };

  const { maxLeftWidth, maxRightWidth } = getMaxRowWidth();

  const renderRow = (rowData, index) => {
    return (
      <div
        key={rowData.row}
        className={`flex items-center justify-center mb-3 transition-all duration-500 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{
          transitionDelay: `${index * 100}ms`,
        }}
      >
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
          {rowData.leftSeats.map((seat, seatIndex) => (
            <div
              key={seat.seatId}
              className={`last:mr-0 transition-all duration-300 ${
                isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
              style={{
                transitionDelay: `${index * 100 + seatIndex * 50}ms`,
              }}
            >
              {renderSeat(seat)}
            </div>
          ))}
        </div>

        {/* Aisle */}
        <div
          className="flex items-center justify-center"
          style={{ width: `${aisleWidth}px` }}
        >
          <div className="w-px h-4 bg-gray-600 opacity-30"></div>
        </div>

        {/* Right side seats */}
        <div
          className="flex items-center justify-start"
          style={{ width: `${maxRightWidth}px` }}
        >
          {rowData.rightSeats.map((seat, seatIndex) => (
            <div
              key={seat.seatId}
              className={`last:mr-0 transition-all duration-300 ${
                isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
              style={{
                transitionDelay: `${
                  index * 100 + (rowData.leftSeats.length + seatIndex) * 50
                }ms`,
              }}
            >
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

  return (
    <div className="text-white rounded-lg" style={{ width: containerWidth }}>
      {/* Screen */}
      <div
        className={`w-full h-[60px] relative overflow-hidden mb-8 transition-all duration-700 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <svg
          width="100%"
          height="40"
          viewBox="0 0 800 40"
          className="absolute top-0 left-0"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="purpleGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            d="M 0 20 Q 400 5 800 20"
            stroke="url(#purpleGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <div
          className={`text-center font-medium text-base mt-6 ${textColor} tracking-wider`}
        >
          SCREEN
        </div>
      </div>

      {/* Seat Layout */}
      <div className="flex flex-col space-y-2">
        {seatLayout.map((row, index) => renderRow(row, index))}
      </div>

      {/* Legend */}
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

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
