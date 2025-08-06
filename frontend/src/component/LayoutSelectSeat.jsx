import React, { useState, useEffect, useRef } from "react";
import { PiArmchairLight, PiArmchairFill } from "react-icons/pi";
import { MdOutlineChair } from "react-icons/md";
import { TbSofa } from "react-icons/tb";

export const LayoutSelectSeat = ({
  onSeatSelect = () => {},
  initialSelectedSeats = [],
  seatDataFromAPI = [],
  containerWidth = "100%",
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
  const scrollContainerRef = useRef(null);

  const seatMap = {};
  seatDataFromAPI.forEach((seat) => {
    seatMap[seat.seatNumber] = seat;
  });

  // Group seats by row from API data
  const groupSeatsByRow = () => {
    const rows = {};

    seatDataFromAPI.forEach((seat) => {
      if (
        !seat ||
        typeof seat.seatNumber !== "string" ||
        seat.seatNumber.length === 0
      ) {
        return;
      }

      const row = seat.seatNumber[0];
      const number = parseInt(seat.seatNumber.slice(1));

      if (!row || isNaN(number)) {
        return;
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

  // Tính toán minimum width cần thiết cho toàn bộ layout
  const calculateMinWidth = () => {
    if (seatLayout.length === 0) return 750;

    let maxRowWidth = 0;
    
    seatLayout.forEach((row) => {
      // Width của left side
      const leftWidth = row.leftSeats.reduce((total, seat) => {
        const seatWidth = seat.type === "Couple" ? widthDouble : width;
        return total + seatWidth + seatSpacing;
      }, 0);

      // Width của right side
      const rightWidth = row.rightSeats.reduce((total, seat) => {
        const seatWidth = seat.type === "Couple" ? widthDouble : width;
        return total + seatWidth + seatSpacing;
      }, 0);

      // Total width: row labels (16px each) + left seats + aisle + right seats
      const totalWidth = 32 + leftWidth + aisleWidth + rightWidth;
      maxRowWidth = Math.max(maxRowWidth, totalWidth);
    });

    return Math.max(maxRowWidth, 750); // Minimum 750px
  };

  const wouldCreateGap = (seatNumber, currentSelectedSeats) => {
    const seat = seatMap[seatNumber];
    if (!seat) return false;

    const row = seat.seatNumber[0];

    const rowSeats = seatDataFromAPI
      .filter((s) => s.seatNumber[0] === row)
      .sort(
        (a, b) =>
          parseInt(a.seatNumber.slice(1)) - parseInt(b.seatNumber.slice(1))
      );

    const availableSeats = rowSeats
      .filter((s) => s.status === "available" && s.seatNumber !== seatNumber)
      .map((s) => parseInt(s.seatNumber.slice(1)));

    const occupiedInRow = rowSeats
      .filter(
        (s) =>
          currentSelectedSeats.has(s.seatNumber) ||
          s.status === "taken" ||
          s.status === "holding"
      )
      .map((s) => parseInt(s.seatNumber.slice(1)));

    if (occupiedInRow.length === 0) return false;

    const currentSeatNumber = parseInt(seatNumber.slice(1));
    const allOccupied = [...occupiedInRow, currentSeatNumber].sort(
      (a, b) => a - b
    );

    for (let i = 0; i < allOccupied.length - 1; i++) {
      const currentNum = allOccupied[i];
      const nextNum = allOccupied[i + 1];

      if (nextNum - currentNum === 2) {
        const gapSeatNum = currentNum + 1;
        const seatToCheck = `${row}${gapSeatNum}`;
        const seatData = seatMap[seatToCheck];

        if (seatData && seatData.status === "available") {
          if (availableSeats.length <= 3) {
            return false;
          }

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

          return hasConsecutivePair;
        }
      }
    }

    return false;
  };

  const wouldCreateGapOnDeselect = (seatNumber, currentSelectedSeats) => {
    const seat = seatMap[seatNumber];
    if (!seat) return false;

    const row = seat.seatNumber[0];

    const newSelectedSeats = new Set(currentSelectedSeats);
    newSelectedSeats.delete(seatNumber);

    const remainingSelectedInRow = seatDataFromAPI.filter(
      (s) => s.seatNumber[0] === row && newSelectedSeats.has(s.seatNumber)
    );

    if (remainingSelectedInRow.length === 0) return false;

    const availableSeats = seatDataFromAPI
      .filter(
        (s) =>
          s.seatNumber[0] === row &&
          (s.status === "available" || s.seatNumber === seatNumber)
      )
      .map((s) => parseInt(s.seatNumber.slice(1)));

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

    for (let i = 0; i < occupiedInRow.length - 1; i++) {
      const currentNum = occupiedInRow[i];
      const nextNum = occupiedInRow[i + 1];

      if (nextNum - currentNum === 2) {
        const gapSeatNum = currentNum + 1;
        const seatToCheck = `${row}${gapSeatNum}`;
        const seatData = seatMap[seatToCheck];

        if (seatData && seatData.status === "available") {
          const currentSeatNumber = parseInt(seatNumber.slice(1));
          const otherAvailableSeats = availableSeats.filter(
            (num) => num !== currentSeatNumber && num !== gapSeatNum
          );

          if (otherAvailableSeats.length <= 2) {
            return false;
          }

          let hasConsecutivePair = false;
          for (let j = 0; j < otherAvailableSeats.length - 1; j++) {
            if (otherAvailableSeats[j + 1] - otherAvailableSeats[j] === 1) {
              hasConsecutivePair = true;
              break;
            }
          }

          return hasConsecutivePair && otherAvailableSeats.length > 3;
        }
      }
    }

    return false;
  };

  // Function to center the scroll position
  const centerScrollPosition = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      
      if (scrollWidth > clientWidth) {
        const centerPosition = (scrollWidth - clientWidth) / 2;
        container.scrollLeft = centerPosition;
      }
    }
  };

  useEffect(() => {
    if (seatDataFromAPI.length > 0) {
      const layout = groupSeatsByRow();
      setSeatLayout(layout);
      setTimeout(() => {
        setIsLoaded(true);
        // Center the scroll position after layout is loaded
        setTimeout(() => centerScrollPosition(), 100);
      }, 100);
    }
  }, [seatDataFromAPI]);

  // Re-center when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (isLoaded) {
        setTimeout(() => centerScrollPosition(), 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoaded]);

  const handleSeatClick = (seatNumber) => {
    if (readOnly) return;

    const seat = seatMap[seatNumber];
    if (!seat || seat.status === "taken" || seat.status === "holding") return;

    const isCurrentlySelected = selectedSeats.has(seatNumber);

    if (isCurrentlySelected) {
      if (wouldCreateGapOnDeselect(seatNumber, selectedSeats)) {
        setWarningMessage(
          "Cannot deselect this seat as it will create a gap between the selected seats in the same row!"
        );
        setShowWarning(true);
        return;
      }
    } else {
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

    const getSeatColorByRow = () => {
      if (status === "taken") return seatColors.taken;
      if (status === "holding") return seatColors.holding;
      if (isSelected) return seatColors.selected;

      if (rowIndex < 3) return seatColors.normal;
      if (rowIndex === seatLayout.length - 1) return seatColors.couple;
      return seatColors.vip;
    };

    const seatColor = getSeatColorByRow();

    if (isCouple) {
      return (
        <div
          key={seatId}
          className="inline-block flex-shrink-0"
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
            <TbSofa 
              style={{
                width: `${widthDouble}px`,
                height: `${heightDouble}px`,
                display: "block",
                pointerEvents: "none",
              }}
            />
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              {seatNumber} - {price.toLocaleString()}đ
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={seatId}
        className="inline-block flex-shrink-0"
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

          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
            {seatNumber} - {price.toLocaleString()}đ
          </div>
        </div>
      </div>
    );
  };

  const getMaxRowWidth = () => {
    let maxLeftWidth = 0;
    let maxRightWidth = 0;

    seatLayout.forEach((row) => {
      const leftWidth = row.leftSeats.reduce((total, seat) => {
        const seatWidth = seat.type === "Couple" ? widthDouble : width;
        return total + seatWidth + seatSpacing;
      }, 0);

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
  const minLayoutWidth = calculateMinWidth();

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
        <div className="w-8 flex justify-center flex-shrink-0">
          <span className={`${textColor} text-sm font-medium`}>
            {rowData.row}
          </span>
        </div>

        {/* Left side seats */}
        <div
          className="flex items-center justify-end flex-shrink-0"
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
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: `${aisleWidth}px` }}
        >
          <div className="w-px h-0 bg-gray-600 opacity-30"></div>
        </div>

        {/* Right side seats */}
        <div
          className="flex items-center justify-start flex-shrink-0"
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
        <div className="w-8 flex justify-center flex-shrink-0">
          <span className={`${textColor} text-sm font-medium`}>
            {rowData.row}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="text-white rounded-lg w-full" style={{ maxWidth: containerWidth }}>
      {/* Container chung cho screen và seat map - căn giữa trong viewport */}
      <div className="w-full flex justify-center">
        <div 
          ref={scrollContainerRef}
          className={`scroll-smooth ${isLoaded ? 'overflow-x-auto' : 'overflow-x-hidden'} overflow-y-hidden`}
          style={{ maxWidth: '100%' }}
        >
          <div 
            style={{ 
              minWidth: `${minLayoutWidth}px`,
              width: 'max-content',
            }}
          >
            {/* Screen - Aligned with seat map */}
            <div
              className={`h-[60px] relative overflow-hidden mb-8 transition-all duration-700 flex justify-center ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
              }`}
            >
              <div style={{ width: `${Math.min(minLayoutWidth * 0.8, 800)}px` }}>
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
            </div>

            {/* Seat Layout - Same width as container */}
            <div className="flex flex-col space-y-2">
              {seatLayout.map((row, index) => renderRow(row, index))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend - Fixed and centered */}
      <div className="mt-8 w-full flex items-center justify-center">
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
            <TbSofa className={seatColors.couple} size={20} />
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
        
        /* Custom scrollbar styles - only show when loaded */
        .overflow-x-auto {
          scrollbar-width: thin;
          scrollbar-color: rgba(139, 92, 246, 0.3) transparent;
        }
        
        .overflow-x-auto::-webkit-scrollbar {
          height: 8px;
        }
        
        .overflow-x-auto::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.1);
          border-radius: 4px;
        }
        
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 4px;
        }
        
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }

        /* Hide scrollbar when loading */
        .overflow-x-hidden {
          scrollbar-width: none;
        }
        
        .overflow-x-hidden::-webkit-scrollbar {
          display: none;
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