import React, { useState } from "react";
import { PiArmchairLight, PiArmchairFill } from "react-icons/pi";
import DoubleSeatSelectingNight from "../assets/DoubleSeatSelectingNight.svg";
import DoubleSeatSelectingLight from "../assets/DoubleSeatSelectingLight.svg";
import DoubleSeatNoneNight from "../assets/DoubleSeatNoneNight.svg";
import DoubleSeatNoneLight from "../assets/DoubleSeatNoneLight.svg";
import DoubleSeatSelected from "../assets/DoubleSeatSelected.svg";
import DoubleSeatSelected4 from "../assets/DoubleSeatSelected4.svg"

export const LayoutSelectSeat = ({
  onSeatSelect = () => { },
  initialSelectedSeats = [],
  //   seatPrice = 150000,
  //   currency = "VND",
  width = 10,
  height = 10,
  textColor = "text-gray-500", 
  widthDouble = 10,
  heightDouble = 10,

  gapX = 2,

}) => {
  const [selectedSeats, setSelectedSeats] = useState(
    new Set(initialSelectedSeats)
  );

  const seatLayout = [
    {
      row: "A",
      seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    { row: "B", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }, // Hàng trống
    {
      row: "C",
      seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    {
      row: "D",
      seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    {
      row: "E",
      seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    { row: "F", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }, // Ghế bên trái
    { row: "G", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }, // Ghế ở giữa
    { 
      row: "H",
      seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    { row: "I", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }, // Ghế ở giữa
    { row: "J", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
  ];

  const takenSeats = new Set([
    "J2",
    "J3",
    "H5",
    "H6",
    "H12",
    "H13",
    "G2",
    "G3",
    "G4",
    "G13",
    "G14",
    "G15",
    "G16",
    "F1",
    "F2",
    "F3",
    "F15",
    "F16",
    "E1",
    "E2",
    "E3",
    "C1",
    "C2",
    "C3",
    "C4",
    "C5",
    "C6",
    "B5",
    "B6",
    "B7",
    "B8",
    "B9",
    "A3",
    "A4",
    "A5",
    "A6",
    "A7",
    "A8",
    "A9",
  ]);

  const handleSeatClick = (seatId) => {
    if (takenSeats.has(seatId)) return;

    const newSelectedSeats = new Set(selectedSeats);
    if (newSelectedSeats.has(seatId)) {
      newSelectedSeats.delete(seatId);
    } else {
      newSelectedSeats.add(seatId);
    }

    setSelectedSeats(newSelectedSeats);
    onSeatSelect(Array.from(newSelectedSeats));
  };

  const getSeatColor = (seatId) => {
    if (takenSeats.has(seatId)) {
      return "text-[#5341dbea]";
    } else if (selectedSeats.has(seatId)) {
      return "text-[#6a57f5]";
    } else {
      return "text-gray-500";
    }
  };

  const renderSeat = (row, seatNumber) => {
    const seatId = `${row}${seatNumber}`;
    const isSelected = selectedSeats.has(seatId);
    const isTaken = takenSeats.has(seatId);
    const isCoupleSeat = row === "J";
    if (isCoupleSeat) {
      let seatIcon = DoubleSeatNoneLight;
      if (isTaken) {
        seatIcon = DoubleSeatSelected;
      } else if (isSelected) {
        seatIcon = DoubleSeatSelectingLight;
      }
      return (
        <button
          key={seatId}
          onClick={() => handleSeatClick(seatId)}
          className={`transition-all duration-200  hover:scale-105 ${isTaken ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          disabled={isTaken}
          title={`Seat ${seatId}`}
        >
          <img src={seatIcon} alt="Double Seat" className={`w-${widthDouble} h-${heightDouble}`} />
        </button>
      );
    }
    return (
      <button
        key={seatId}
        onClick={() => handleSeatClick(seatId)}
        className={`transition-all duration-200 hover:scale-110 ${isTaken ? "cursor-not-allowed" : "cursor-pointer"
          } ${getSeatColor(seatId)}`}
        disabled={isTaken}
        title={`Chair ${seatId}`}
      >
        {isSelected ? (
          <PiArmchairFill className={`w-${width} h-${height}`} />
        ) : (
          <PiArmchairLight className={`w-${width} h-${height}`} />
        )}
      </button>
    );
  };

  const renderRow = (rowData) => {
    const isFirstRow = rowData.row === "A";
    const isCoupleRow = rowData.row === "J";

    const seatElements = rowData.seats.map((seatNumber) => {
      const seatId = `${rowData.row}${seatNumber}`;
      const isGapAfter = !isCoupleRow && (seatNumber === 3 || seatNumber === 9);

      return (
        <div key={seatId} className={isGapAfter ? "mr-10" : ""}>
          {renderSeat(rowData.row, seatNumber)}
        </div>
      );
    });

    return (
      <div key={rowData.row} className="my-2">
        {isFirstRow && (
          <div className="flex justify-center mx-6 mb-1">
            <span className="w-6 mr-4"></span>
            <div className={`flex space-x-${gapX}`}>
              {rowData.seats.map((seatNumber) => {
                const isGapAfter =
                  !isCoupleRow && (seatNumber === 3 || seatNumber === 9);
                return (
                  <div
                    key={`label-${seatNumber}`}
                    className={isGapAfter ? "mr-10" : ""}
                  >
                    <span className={`text-xs ${textColor} block text-center w-6 my-2`}>
                      {seatNumber}
                    </span>
                  </div>
                );
              })}
            </div>
            <span className="w-6 ml-4"></span>
          </div>
        )}

        <div className="flex items-center justify-evenly">
          <span className={`${textColor} w-6 text-sm font-medium mr-4`}>
            {rowData.row}
          </span>

          <div className="flex space-x-2 mt-1 justify-evenly">
            {seatElements}
          </div>

          <span className={`${textColor} w-6 text-sm font-medium ml-4`}>
            {rowData.row}
          </span>
        </div>
      </div>
    );
  };

  //   const totalPrice = selectedSeats.size * seatPrice;

  return (
    <div className=" text-white rounded-lg ">
      {/* Screen */}
      <div className="w-full h-[40px] relative overflow-hidden group">
        {/* SVG cho đường cong gradient */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 40"
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
          preserveAspectRatio="none"
          style={{ background: "transparent" }}
        >
          {/* Định nghĩa gradient từ nhạt đến đậm ở giữa */}
          <defs>
            <linearGradient
              id="purpleGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#6a57f5" stopOpacity="0.1" />
              <stop offset="25%" stopColor="#6a57f5" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#6a57f5" stopOpacity="1" />
              <stop offset="75%" stopColor="#6a57f5" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6a57f5" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6a57f5" stopOpacity="0.1" />
              <stop offset="25%" stopColor="#6a57f5" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#6a57f5" stopOpacity="1" />
              <stop offset="75%" stopColor="#6a57f5" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#6a57f5" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient
              id="purpleGlowHover"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#b0a8ff" stopOpacity="0" />
              <stop offset="25%" stopColor="#b0a8ff" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#c9c2ff" stopOpacity="1" />
              <stop offset="75%" stopColor="#b0a8ff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#b0a8ff" stopOpacity="0" />
            </linearGradient>

            <linearGradient
              id="purpleGradientHover"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#b0a8ff" stopOpacity="0.01" />
              <stop offset="25%" stopColor="#b0a8ff" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#c9c2ff" stopOpacity="1" />
              <stop offset="75%" stopColor="#b0a8ff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#b0a8ff" stopOpacity="0.01" />
            </linearGradient>

            <linearGradient
              id="lightGlowBelow"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#c9c2ff" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#c9c2ff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#c9c2ff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Đường cong với hiệu ứng glow */}
          <path
            d="M 0 20 Q 400 0 800 20"
            stroke="url(#purpleGlow)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            className="blur-[1px] transition-all duration-500 group-hover:blur-[0px] group-hover:stroke-[7px] group-hover:[stroke:url(#purpleGlowHover)]"
          />

          {/* Đường cong chính */}
          <path
            d="M 0 20 Q 400 0 800 20"
            stroke="url(#purpleGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-500 group-hover:stroke-[6px] group-hover:[stroke:url(#purpleGradientHover)]"
          />

          {/* Ánh sáng nhẹ phía dưới khi hover */}
          <path
            d="M 0 20 Q 400 0 800 20"
            stroke="url(#lightGlowBelow)"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            className="opacity-0 blur-[2px] transition-opacity duration-500 group-hover:opacity-100"
          />
        </svg>
        <div className={`text-center font-bold text-[20px] mt-4 ${textColor}`}>
          SCREEN
        </div>
      </div>

      {/* Seat Layout */}
      <div className=" mt-8">{seatLayout.map((rowData) => renderRow(rowData))}</div>

      {/* Legend */}
      <div className="flex justify-center items-center space-x-6 mb-6">
        <div className="flex items-center space-x-2">
          <PiArmchairFill size={20}  className= {`w-${width} h-${height} text-[#6957f5ea]`} />
          <span className="text-sm text-gray-500">Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <PiArmchairLight size={20}  className= {`w-${width} h-${height} text-gray-400`}  />
          <span className="text-sm text-gray-500">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <PiArmchairLight size={20} className= {`w-${width} h-${height} text-[#5341dbea]`}  />
          <span className="text-sm text-gray-500">Taken</span>
        </div>
        <div className="flex items-center space-x-2">
          <img
            src={DoubleSeatSelected}
            alt="Double Seat"
            className= {`w-${width} h-${height} `}
          />
          <span className="text-sm text-gray-500">Couple seat</span>
        </div>
      </div>
    </div>
  );
};
