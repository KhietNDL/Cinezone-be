import React, { useState, useEffect } from "react";
import { PiArmchairLight, PiArmchairFill } from "react-icons/pi";
import { MdOutlineChair } from "react-icons/md";

export const LayoutSelectSeat = ({
  onSeatSelect = () => {},
  initialSelectedSeats = [],
  seatDataFromAPI = [],
  containerWidth = "750px",
  width = 30,
  height = 30,
  textColor = "text-gray-500",
  widthDouble = 60,
  heightDouble = 30,
  readOnly = false,

  aisleWidth = 60,
  seatSpacing = 12,
  seatSpacingCouple = 0,
  seatColors = {
    available: "text-purple-300",
    selected: "text-purple-100",
    taken: "text-purple-600",
    holding: "text-blue-600",
    vip: "text-[#FFE3B3]/70",
    normal: "text-[#752090]",
    couple: "text-[#C957BC]",
  },
}) => {
  const [selectedSeats, setSelectedSeats] = useState(
    new Set(initialSelectedSeats)
  );
  const [seatLayout, setSeatLayout] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const seatMap = {};
  seatDataFromAPI.forEach((seat) => {
    seatMap[seat.seatNumber] = seat;
  });

  // Group seats by row from API data
  const groupSeatsByRow = () => {
    const rows = {};

    seatDataFromAPI.forEach((seat) => {
      // Validate seat data before processing
      if (
        !seat ||
        typeof seat.seatNumber !== "string" ||
        seat.seatNumber.length === 0
      ) {
        return; // Skip this seat
      }

      const row = seat.seatNumber[0]; // A, B, C...
      const number = parseInt(seat.seatNumber.slice(1));

      // Validate row and number
      if (!row || isNaN(number)) {
        return; // Skip this seat
      }

      if (!rows[row]) {
        rows[row] = [];
      }

      rows[row].push({
        ...seat,
        number,
        isCouple: seat.type === "Couple",
      });
    });

    const sortedRows = Object.entries(rows)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([row, seats]) => {
        const sortedSeats = seats.sort((a, b) => a.number - b.number);

        const totalSeats = sortedSeats.length;
        const leftSideCount = Math.ceil(totalSeats / 2);

        return {
          row,
          seats: sortedSeats,
          leftSeats: sortedSeats.slice(0, leftSideCount),
          rightSeats: sortedSeats.slice(leftSideCount),
          isDouble: sortedSeats.some((s) => s.type === "Couple"),
        };
      });

    // **Assign type based on row index**
    return sortedRows.map((rowData, index, arr) => {
      if (index < 3) {
        rowData.seats.forEach((seat) => (seat.type = "Normal"));
      } else if (index === arr.length - 1) {
        rowData.seats.forEach((seat) => (seat.type = "Couple"));
      } else {
        rowData.seats.forEach((seat) => (seat.type = "VIP"));
      }
      return rowData;
    });
  };

  const wouldCreateGap = (seatNumber, currentSelectedSeats) => {
    const seat = seatMap[seatNumber];
    if (!seat) return false;

    const row = seat.seatNumber[0];

    // Lấy tất cả ghế trong hàng hiện tại
    const rowSeats = seatDataFromAPI
      .filter((s) => s.seatNumber[0] === row)
      .sort(
        (a, b) =>
          parseInt(a.seatNumber.slice(1)) - parseInt(b.seatNumber.slice(1))
      );

    // Lấy ghế available trong hàng này (không bao gồm ghế đang chọn)
    const availableSeats = rowSeats
      .filter((s) => s.status === "available" && s.seatNumber !== seatNumber)
      .map((s) => parseInt(s.seatNumber.slice(1)));

    // Lấy ghế đã chọn + taken + holding trong hàng này
    const occupiedInRow = rowSeats
      .filter(
        (s) =>
          currentSelectedSeats.has(s.seatNumber) ||
          s.status === "taken" ||
          s.status === "holding"
      )
      .map((s) => parseInt(s.seatNumber.slice(1)));

    if (occupiedInRow.length === 0) return false;

    // Thêm ghế hiện tại vào danh sách để kiểm tra
    const currentSeatNumber = parseInt(seatNumber.slice(1));
    const allOccupied = [...occupiedInRow, currentSeatNumber].sort(
      (a, b) => a - b
    );

    // Tìm khoảng trống sẽ được tạo ra
    for (let i = 0; i < allOccupied.length - 1; i++) {
      const currentNum = allOccupied[i];
      const nextNum = allOccupied[i + 1];

      // Kiểm tra khoảng cách đúng 2 (có 1 ghế ở giữa)
      if (nextNum - currentNum === 2) {
        const gapSeatNum = currentNum + 1;
        const seatToCheck = `${row}${gapSeatNum}`;
        const seatData = seatMap[seatToCheck];

        // Nếu ghế ở giữa tồn tại và available
        if (seatData && seatData.status === "available") {
          // **LOGIC THỰC TẾ**:
          // - Nếu chỉ còn lại ít ghế available (≤ 3), cho phép chọn
          // - Nếu không còn cặp ghế kề nhau nào khác, cho phép chọn
          // - Chỉ cấm khi còn nhiều lựa chọn tốt hơn

          if (availableSeats.length <= 3) {
            return false; // Cho phép chọn nếu ít ghế còn lại
          }

          // Kiểm tra xem có cặp ghế kề nhau khác không (không tính ghế gap)
          const seatsExcludingGap = availableSeats.filter(
            (num) => num !== gapSeatNum
          );
          let hasConsecutivePair = false;

          for (let j = 0; j < seatsExcludingGap.length - 1; j++) {
            if (seatsExcludingGap[j + 1] - seatsExcludingGap[j] === 1) {
              hasConsecutivePair = true;
              break;
            }
          }

          // Chỉ cấm nếu vẫn còn cặp ghế kề nhau khác
          return hasConsecutivePair;
        }
      }
    }

    return false;
  };

  // **LOGIC CẢI THIỆN CHO BỎ CHỌN GHẾ**
  const wouldCreateGapOnDeselect = (seatNumber, currentSelectedSeats) => {
    const seat = seatMap[seatNumber];
    if (!seat) return false;

    const row = seat.seatNumber[0];

    // Tạo set mới không bao gồm ghế đang bỏ chọn
    const newSelectedSeats = new Set(currentSelectedSeats);
    newSelectedSeats.delete(seatNumber);

    // Nếu sau khi bỏ chọn không còn ghế nào được chọn trong hàng, cho phép
    const remainingSelectedInRow = seatDataFromAPI.filter(
      (s) => s.seatNumber[0] === row && newSelectedSeats.has(s.seatNumber)
    );

    if (remainingSelectedInRow.length === 0) return false;

    // Lấy ghế available trong hàng này (bao gồm ghế đang bỏ chọn)
    const availableSeats = seatDataFromAPI
      .filter(
        (s) =>
          s.seatNumber[0] === row &&
          (s.status === "available" || s.seatNumber === seatNumber)
      )
      .map((s) => parseInt(s.seatNumber.slice(1)));

    // Lấy ghế đã chọn + taken + holding trong hàng này sau khi bỏ chọn
    const occupiedInRow = seatDataFromAPI
      .filter(
        (s) =>
          s.seatNumber[0] === row &&
          (newSelectedSeats.has(s.seatNumber) ||
            s.status === "taken" ||
            s.status === "holding")
      )
      .map((s) => parseInt(s.seatNumber.slice(1)))
      .sort((a, b) => a - b);

    if (occupiedInRow.length <= 1) return false;

    // Kiểm tra khoảng trống sẽ được tạo ra
    for (let i = 0; i < occupiedInRow.length - 1; i++) {
      const currentNum = occupiedInRow[i];
      const nextNum = occupiedInRow[i + 1];

      if (nextNum - currentNum === 2) {
        const gapSeatNum = currentNum + 1;
        const seatToCheck = `${row}${gapSeatNum}`;
        const seatData = seatMap[seatToCheck];

        if (seatData && seatData.status === "available") {
          // **LOGIC THỰC TẾ**: Cho phép bỏ chọn trong hầu hết trường hợp
          // Chỉ cấm khi việc bỏ chọn tạo ra gap MÀ người dùng có thể chọn cách khác tốt hơn

          const currentSeatNumber = parseInt(seatNumber.slice(1));
          const otherAvailableSeats = availableSeats.filter(
            (num) => num !== currentSeatNumber && num !== gapSeatNum
          );

          // Nếu ít ghế available còn lại, cho phép bỏ chọn
          if (otherAvailableSeats.length <= 2) {
            return false;
          }

          // Kiểm tra có cặp ghế kề nhau khác không
          let hasConsecutivePair = false;
          for (let j = 0; j < otherAvailableSeats.length - 1; j++) {
            if (otherAvailableSeats[j + 1] - otherAvailableSeats[j] === 1) {
              hasConsecutivePair = true;
              break;
            }
          }

          // Chỉ cấm nếu vẫn còn nhiều lựa chọn tốt hơn
          return hasConsecutivePair && otherAvailableSeats.length > 3;
        }
      }
    }

    return false;
  };

  useEffect(() => {
    if (seatDataFromAPI.length > 0) {
      const layout = groupSeatsByRow();
      setSeatLayout(layout);
      // Trigger animation after layout is set
      setTimeout(() => setIsLoaded(true), 100);
    }
  }, [seatDataFromAPI]);

  const handleSeatClick = (seatNumber) => {
    // If readOnly mode is enabled, don't allow seat selection
    if (readOnly) return;

    const seat = seatMap[seatNumber];
    if (!seat || seat.status === "taken" || seat.status === "holding") return;

    const isCurrentlySelected = selectedSeats.has(seatNumber);

    if (isCurrentlySelected) {
      // Kiểm tra việc bỏ chọn có tạo khoảng trống không
      if (wouldCreateGapOnDeselect(seatNumber, selectedSeats)) {
        setWarningMessage(
          "Cannot deselect this seat as it will create a gap between the selected seats in the same row!"
        );
        setShowWarning(true);
        return;
      }
    } else {
      // Kiểm tra việc chọn có tạo khoảng trống không
      if (wouldCreateGap(seatNumber, selectedSeats)) {
        setWarningMessage(
          "Cannot select this seat because it will create a gap between the seats in the same row!"
        );
        setShowWarning(true);
        return;
      }
    }

    const newSelectedSeats = new Set(selectedSeats);
    if (isCurrentlySelected) {
      newSelectedSeats.delete(seatNumber);
    } else {
      newSelectedSeats.add(seatNumber);
    }

    setSelectedSeats(newSelectedSeats);

    // Trả về thông tin ghế đã chọn với tổng giá
    const selectedSeatDetails = Array.from(newSelectedSeats).map(
      (seatNum) => seatMap[seatNum]
    );
    const totalPrice = selectedSeatDetails.reduce(
      (sum, seat) => sum + seat.price,
      0
    );
    const selectedSeatIds = selectedSeatDetails.map((seat) => seat.seatId);

    onSeatSelect({
      seats: selectedSeatDetails,
      seatIds: selectedSeatIds,
      totalPrice: totalPrice,
      count: selectedSeatDetails.length,
    });
  };

  const renderSeat = (seat, rowIndex) => {
    const { seatId, seatNumber, status, type, price } = seat;
    const isSelected = selectedSeats.has(seatNumber);
    const isTaken = status === "taken";
    const isHolding = status === "holding";
    const isCouple = type === "Couple";
    const isClickable = !isTaken && !isHolding && !readOnly;

    // Chọn màu dựa vào hàng
    const getSeatColorByRow = () => {
      if (status === "taken") return seatColors.taken;
      if (status === "holding") return seatColors.holding;
      if (isSelected) return seatColors.selected;

      if (rowIndex < 3) return seatColors.normal; // 3 hàng đầu = Normal
      if (rowIndex === seatLayout.length - 1) return seatColors.couple; // Hàng cuối = Couple
      return seatColors.vip; // Còn lại = VIP
    };

    const seatColor = getSeatColorByRow();

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
            onClick={
              isClickable ? () => handleSeatClick(seatNumber) : undefined
            }
            className={`
              ${seatColor}
              transition-opacity duration-200
              ${
                !isClickable
                  ? readOnly
                    ? "cursor-default"
                    : "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }
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

    // Ghế đơn
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
          onClick={isClickable ? () => handleSeatClick(seatNumber) : undefined}
          className={`
            ${seatColor}
            transition-opacity duration-200
            ${
              !isClickable
                ? readOnly
                  ? "cursor-default"
                  : "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }
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
        const seatWidth = seat.type === "Couple" ? widthDouble : width;
        return total + seatWidth + seatSpacing;
      }, 0);

      // Tính width của right side
      const rightWidth = row.rightSeats.reduce((total, seat) => {
        const seatWidth = seat.type === "Couple" ? widthDouble : width;
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
              {renderSeat(seat, index)}
            </div>
          ))}
        </div>

        {/* Aisle */}
        <div
          className="flex items-center justify-center"
          style={{ width: `${aisleWidth}px` }}
        >
          <div className="w-px h-0 bg-gray-600 opacity-30"></div>
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
              {renderSeat(seat, index)}
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

      {/* Warning Popup */}
      {showWarning && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl transform transition-all duration-300">
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Note!</h3>
            </div>
            <p className="text-gray-700 mb-6">{warningMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowWarning(false)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
