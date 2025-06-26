import React from "react";
import { Button, Tag, Card, Result } from "antd";
import { CheckCircleTwoTone, ExclamationCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { FaTicket, FaFire, FaCouch, FaLocationDot, FaUser, FaPhone} from "react-icons/fa6";
import { IoReloadOutline, IoTicketSharp, IoTime} from "react-icons/io5";
import { RiFilmAiFill, RiMovie2AiFill, RiDiscountPercentFill   } from "react-icons/ri";
import { FaMoneyBillWave, FaIdBadge, FaIdCard  } from "react-icons/fa";

const statusMap = {
  success: {
    icon: <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 80 }} />,
    title: "Success payment",
    color: "text-green-500",
    bg: "bg-green-50",
    btn: "New ticket(s)",
    btnColor: "white",
    backgroundColor: "#7254EF",
    btnIcon: <FaTicket />,
    font: "none",
  },
  warning: {
    icon: <ExclamationCircleTwoTone twoToneColor="#faad14" style={{ fontSize: 80 }} />,
    title: "Payment warning",
    color: "text-yellow-500",
    btnColor: "white",
    bg: "bg-yellow-50",
    btn: "Try again",
    backgroundColor: "#faad14",
    btnIcon: <i className="fa-solid fa-rotate-right"></i>,
    font: "bold",
  },
  error: {
    icon: <CloseCircleTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 80 }} />,
    title: "Payment failed",
    color: "text-red-500",
    bg: "bg-red-50",
    btn: "Retry",
    backgroundColor: "red",
    btnColor: "white",
    btnIcon: <IoReloadOutline />,
  },
};

export default function TicketInfomation() {
  const location = useLocation();
  const {
    bookingId,
    memberInfo,
    paymentMethod,
    amountPaid,
    promotionTitle,
    discount,
    isConfirmed,
    movie,
    day,
    version,
    time,
    room,
    selectedSeats = [],
    seatData = [],
    totalPrice = 0
  } = location.state || {};

  // Determine status based on payment confirmation
  const status = isConfirmed ? "success" : "error";
  const statusObj = statusMap[status];
  
  // Format price function
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN');
  };

  return (
    <div className="p-4 w-full ">
      <h1 className="text-3xl font-bold mb-4 text-fuchsia-700">Payment</h1>

      {/* Status */}
      <div className="flex flex-col items-center justify-center my-8">
        {statusObj.icon}
        <div className={`mt-4 text-3xl font-bold ${statusObj.color}`}>
          {statusObj.title}
        </div>
        {bookingId && (
          <div className="mt-2 text-gray-600">
            Booking ID: {bookingId}
          </div>
        )}
      </div>

      {/* Ticket & Member Info */}
      <div className="flex gap-2 justify-center w-full">
        {/* Ticket */}
        <div className="w-[70%] rounded-2xl shadow-md flex flex-col gap-4 p-4 bg-white border border-gray-200" >
          <div className="font-semibold text-lg  border-b border-gray-600 py-4">
            <i className="fa-solid fa-ticket mr-2"></i>Tickets
          </div>
        
          <div className="flex flex-col gap-2 text-base">
            <div className="border-b border-gray-300 mb-4">
              <div className="flex  py-2">
                <p className="w-[50%] font-semibold flex items-center gap-1"><IoTicketSharp /> Ticket ID</p> 
                <span className="text-gray-600">{bookingId || "N/A"}</span>
              </div>
              <div className="flex flex-col  py-2">
                <p className="w-[50%] font-semibold flex items-center gap-1"><RiFilmAiFill /> Movie</p> 
                <span className="text-gray-600">{movie?.NameOfEnglish || "N/A"}</span>
              </div>
              <div className="flex w-full">
                <div className="w-[50%]">
                  <div className="flex flex-col py-2">
                    <p className="w-[50%] font-semibold flex items-center gap-1"><RiMovie2AiFill /> Screen</p> 
                    <span className="text-gray-600">{version || "N/A"}</span>
                  </div>
                  <div className="flex flex-col py-2">
                    <p className="w-[50%] font-semibold flex items-center gap-1"><IoTime /> Showtime</p> 
                    <span className="text-gray-600">{day} - {time || "N/A"}</span>
                  </div>
                  <div className="flex flex-col py-2">
                    <p className="w-[50%] font-semibold flex items-center gap-1"><FaLocationDot /> Room</p> 
                    <span className="text-gray-600">{room || "N/A"}</span>
                  </div>
                </div>
                <div className="w-[50%]">
                  <div className="flex flex-col py-2">
                    <p className="w-[50%] font-semibold flex items-center gap-1"><FaCouch /> Seats</p> 
                    <span className="flex items-center gap-4 text-gray-600">
                      {selectedSeats.join(", ")} 
                      <div>-</div> 
                      <div className="text-xs font-medium text-gray-600">
                        {selectedSeats.length} ticket(s)
                      </div>
                    </span>
                  </div>
                  <div className="flex flex-col py-2">
                    <p className="w-full md:w-[50%] font-semibold flex items-center gap-1">
                      <FaMoneyBillWave /> Seat Prices
                    </p>
                    <div className="text-gray-600">
                      {selectedSeats.map((seatNumber, index) => {
                        const seat = seatData?.find(s => s.seatNumber === seatNumber);
                        const seatPrice = seat?.price; // Default price if not found
                        return (
                          <div key={index} className="flex justify-between">
                            <span>Seat {seatNumber}:</span>
                            <span>{formatPrice(seatPrice)} VNĐ</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col py-2">
                    <p className="w-[50%] font-semibold flex items-center gap-1"><RiDiscountPercentFill /> Discount</p>
                    <span className="text-red-500 font-bold">{discount ? discount : 0}%</span>
                  </div>
                </div>
              </div>
              <div className="flex py-2 w-full">
                <p className="w-[50%] font-semibold flex items-center gap-1">Payment Method</p> 
                <span className="text-gray-600 font-medium">{paymentMethod || "N/A"}</span>
              </div>
              {memberInfo && memberInfo.score !== undefined && (
                <div className="flex py-2 w-full">
                  <p className="w-[50%] font-semibold flex items-center gap-1">Score for ticket converting</p> 
                  <span className="flex items-center gap-1 text-green-700 font-bold">
                    <FaFire/>{memberInfo.score || 0}
                  </span>
                </div>
              )}
            </div>
            <div className="flex py-2 w-full">
              <p className="w-[50%] text-xl font-bold">Total</p>
              <span className="text-green-600 font-bold text-xl">
                {formatPrice(amountPaid || totalPrice)} VNĐ
              </span>
              {discount > 0 && (
                <span className="text-gray-500 text-base font-normal ml-2 line-through">
                  {formatPrice(totalPrice)} VNĐ
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Member */}
        {memberInfo && (
          <div className="w-[30%] rounded-2xl shadow-md flex flex-col gap-4 p-4 bg-white border border-gray-200">
            <div className="font-semibold text-lg  border-b border-gray-600 py-4">
              <i className="fa-solid fa-users mr-2"></i>Member
            </div>
          
            <div className="flex flex-col gap-2 text-base">
              <div className="flex items-center py-2 justify-between">
                <p className="w-[50%] text-gray-600 flex items-center gap-1"><FaIdBadge /> Member ID</p> 
                <span className="font-semibold">{memberInfo.id || "N/A"}</span>
              </div>
              <div className="flex items-center py-2 justify-between">
                <p className="w-[50%] text-gray-600 flex items-center gap-1"><FaIdCard /> Identity card</p> 
                <span className="font-semibold">{memberInfo.identityCard || "N/A"}</span>
              </div>
              <div className="flex items-center py-2 justify-between">
                <p className="w-[50%] text-gray-600 flex items-center gap-1"><FaUser /> Full name</p> 
                <span className="font-semibold">{memberInfo.fullName || "N/A"}</span>
              </div>
              <div className="flex items-center py-2 justify-between">
                <p className="w-[50%] text-gray-600 flex items-center gap-1"><FaPhone /> Phone number</p> 
                <span className="font-semibold">{memberInfo.phone || "N/A"}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 mt-8">
        <Link to="/staff/ticket-selling">
          <Button
            style={{ backgroundColor: statusObj.backgroundColor, color: statusObj.btnColor, fontWeight: statusObj.font }}
            size="large"
            className={`px-8 font-bold ${statusObj.btnColor}`}
            icon={statusObj.btnIcon}
          >
            {statusObj.btn}
          </Button>
        </Link>
        {bookingId && (
          <Link to={`/staff/ticket-selling/view-ticket/${bookingId}`}>
            <Button
              style={{ backgroundColor: "white", color: "#4F46E5", border: "1px solid #4F46E5" }}
              size="large"
              className="px-8 font-bold flex items-center gap-2"
              icon={<i className="fa-solid fa-eye"></i>}
            >
              View ticket
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}