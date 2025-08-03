import React from "react";
import { Card, Badge } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { RiFilmAiFill } from "react-icons/ri";
import { FaCalendarDays, FaLocationDot, FaCouch } from "react-icons/fa6";
import { IoTime } from "react-icons/io5";
import VersionCard from "../../component/VersionCard";

const formatPrice = (price) => price?.toLocaleString("vi-VN");

const TicketInformationCard = ({ bookingData, movieInfo }) => {
  return (
    <Card className="shadow-lg border-0 rounded-xl overflow-hidden" style={{ height: "100%" }}>
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
            <RiFilmAiFill className="text-white text-sm" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Ticket Information
            </h2>
            <p className="text-gray-600 text-sm">
              Review your booking details
            </p>
          </div>
          <Badge
            count={<CheckOutlined style={{ color: "#52c41a" }} />}
            className="ml-auto"
          />
        </div>
      </div>

      <div className="p-3">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center sm:items-start sm:justify-center">
          <img
            src={movieInfo.PosterImage}
            alt={movieInfo.NameOfEnglish}
            className="lg:h-[300px] object-cover rounded-lg shadow sm:w-[30%] w-[90%] h-auto mx-auto text-center"
            onError={(e) => (e.target.src = "/placeholder-poster.jpg")}
          />
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <div className="px-3 py-2 rounded-full shadow-md flex items-center justify-center 
                bg-[linear-gradient(to_right,_#FACC15,_#DDB61A,_#DBBB3B,_#CDB03D,_#B1900C)]">
                <p className="font-bold text-sm leading-4 text-[#FFF8A7] [text-shadow:_0_1px_2px_orange]">
                  Now Showing
                </p>
              </div>
              <VersionCard
                version={bookingData.selectedVersion}
                readonly={true}
                className="text-sm"
              />
            </div>
            <div className="flex flex-col sm:items-start w-full py-4 items-center justify-center">
              <h3 className="text-2xl font-bold">{movieInfo.NameOfEnglish}</h3>
              <p className="text-xl text-gray-600 font-semibold text-center">
                ({movieInfo.NameOfVietnamese})
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center justify-between lg:justify-start">
                <div className="flex items-center gap-1 font-semibold w-[30%]">
                  <FaCalendarDays /> Day:
                </div>
                <span className="text-gray-700">{bookingData.selectedDay}</span>
              </div>
              <div className="flex items-center justify-between lg:justify-start">
                <div className="flex items-center gap-1 font-semibold w-[30%]">
                  <IoTime /> Time:
                </div>
                <span className="text-gray-700">{bookingData.selectedTime}</span>
              </div>
              <div className="flex items-center justify-between lg:justify-start">
                <div className="flex items-center gap-1 font-semibold w-[30%]">
                  <FaLocationDot /> Room:
                </div>
                <span className="text-gray-700">{bookingData.room}</span>
              </div>
              <div className="flex items-center justify-between lg:justify-start">
                <div className="flex items-center gap-1 font-semibold w-[30%]">
                  <FaCouch /> Seats:
                </div>
                <span className="text-gray-700">
                  {`${bookingData.selectedSeats.join(", ")} - (${bookingData.selectedSeats.length} tickets)`}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Price Details:</h4>
              <div className="space-y-2">
                {bookingData.selectedSeats.map((seat, index) => {
                  const seatInfo = bookingData.seatData.find((s) => s.seatNumber === seat);
                  return (
                    <div key={index} className="flex justify-between">
                      <span>Seat {seat}:</span>
                      <span>{formatPrice(seatInfo?.price || 0)} VNĐ</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="font-bold text-lg">Total:</span>
                <span className="text-green-600 font-bold text-xl">
                  {formatPrice(
                    bookingData.selectedSeats.reduce((total, seatNumber) => {
                      const seat = bookingData.seatData.find((s) => s.seatNumber === seatNumber);
                      return total + (seat?.price || 0);
                    }, 0)
                  )}{" "}
                  VNĐ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TicketInformationCard; 