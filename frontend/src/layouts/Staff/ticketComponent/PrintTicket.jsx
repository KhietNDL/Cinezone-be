import { Button, Tag } from "antd";
import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaAlignLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTicket,
  FaCouch,
  FaLocationDot,
  FaMoneyBillWave,
} from "react-icons/fa6";
import { IoTime } from "react-icons/io5";
import { toast } from "react-toastify";
import logo from "../../../assets/logoWhite.png";
import { resetBooking } from "../../../redux/features/sellingSlice";
import { useDispatch, useSelector } from "react-redux";
import VersionCard from "../component/VersionCard";
import { getMovieById } from "../../../services/APIForStaff/API";
import BackButton from "../component/BackButton";
import { resetMember } from "../../../redux/features/memberSlice";

export default function PrintTicket() {
  const componentRef = useRef();
  const navigate = useNavigate();
  const bookingData = useSelector((state) => state.selling);
  const dispatch = useDispatch();
  const [movieInfo, setMovieInfo] = useState(null);

  const {
    selectedMovie = {},
    selectedDay: day = "",
    selectedTime: time = "",
    room = "",
    selectedVersion: version = "Standard",
    selectedSeats = [],
    totalPrice = 0,
    // memberInfo = {},
    // paymentMethod = "",
    discount = 0,
    amountPaid = totalPrice,
  } = bookingData;

  // Format price function
  const formatPrice = (price) => {
    return price?.toLocaleString("vi-VN");
  };

  const handleCancel = () => {
    dispatch(resetBooking());
    dispatch(resetMember());
    navigate("/staff/ticket-selling");
  };

  useEffect(() => {
    if (!selectedMovie?.MovieId) {
      navigate("/staff/ticket-selling");
      return;
    }

    const loadMovie = async () => {
      try {
        const res = await getMovieById(selectedMovie.MovieId);
        setMovieInfo(res.data || selectedMovie);
      } catch {
        setMovieInfo(selectedMovie);
      }
    };
    loadMovie();
  }, [selectedMovie, navigate]);

  const handleExportPdf = async () => {
    if (!componentRef.current) return;

    try {
      const input = componentRef.current;
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
      pdf.save("ticket.pdf");
    } catch (error) {
      toast.error("Failed to generate PDF" + error.message);
    }
  };

  console.log("Data:", bookingData);

  if (!movieInfo?.NameOfEnglish) {
    return <div>Loading ticket information...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 bg-white shadow-md rounded-lg mb-6">
        <div className="flex flex-row items-center gap-3 lg:gap-4">
          <BackButton />
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <FaTicket className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                Print Ticket
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Staff Portal - Ticket Preview
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl ">
        {/* Ticket Preview Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
              Ticket Preview
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Review your ticket before printing
            </p>
          </div>

          {/* Ticket Container - Responsive */}
          <div className="flex justify-center">
            <div ref={componentRef} className="w-full max-w-5xl">
              <div className="overflow-x-auto">
                <div className="min-w-[800px] bg-[linear-gradient(to_bottom_right,_#facc15,_#fde047,_#fbbf24)] rounded-xl p-3 sm:p-5">
                  <div className="relative flex h-[200px] sm:h-[250px] lg:h-[300px]">
                    {/* Left Section - Movie Info */}
                    <div className="w-[63%] h-full bg-[linear-gradient(to_right,_#4f46e5,_#7c3aed,_#2563eb)] p-3 sm:p-4 rounded-tl-xl rounded-bl-xl">
                      <div className="flex items-start gap-2 sm:gap-4 border-b border-white pb-2 w-[95%] text-white">
                        <div className="flex-1">
                          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                            <img
                              src={logo}
                              alt="CineZone"
                              className="w-[15%] sm:w-[20%] h-[25px] sm:h-[35px] object-cover"
                              style={{ filter: "brightness(0) invert(1)" }}
                            />
                            <div className="px-2 sm:px-3 rounded-full shadow-md flex items-center justify-center bg-[linear-gradient(to_right,_#facc15,_#eab308,_#ca8a04)] text-[#713f12]">
                              <p className="font-bold p-1 sm:p-2 text-xs sm:text-sm leading-4">
                                Now Showing
                              </p>
                            </div>
                            <VersionCard
                              version={version}
                              readonly={true}
                              className="text-xs sm:text-sm ring-2 ring-white"
                            />
                          </div>
                          <h2 className="text-sm sm:text-lg lg:text-xl font-bold mt-2 pt-2 pb-2 sm:pb-4 line-clamp-2">
                            {movieInfo?.NameOfEnglish || "Movie Title"}
                          </h2>
                          <div className="text-xs sm:text-sm space-y-1 sm:space-y-0 sm:flex sm:gap-3">
                            <div className="flex items-center gap-1">
                              <i className="fa-solid fa-clock"></i>
                              <span>
                                {day} - {time || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <i className="fa-solid fa-location-dot"></i>
                              <span>{room || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <i className="fa-solid fa-couch"></i>
                              <span>
                                Seats: {selectedSeats.join(", ") || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Synopsis - Hide on very small screens */}
                      <div className="text-white hidden sm:block">
                        <h5 className="flex items-center gap-2 mt-2 text-xs sm:text-sm font-bold">
                          <FaAlignLeft /> Synopsis:
                        </h5>
                        <p className="p-2 text-xs sm:text-sm leading-relaxed line-clamp-3 lg:line-clamp-none">
                          {movieInfo?.ContentSynopsis ||
                            "Movie description not available"}
                        </p>
                      </div>
                    </div>

                    {/* Right Section - Ticket Details */}
                    <div className="w-[37%] h-full bg-[linear-gradient(to_right,_#4f46e5,_#7c3aed,_#2563eb)] rounded-tr-xl rounded-br-xl">
                      <div className="flex flex-col justify-center h-full text-white p-2 sm:p-4 space-y-1 sm:space-y-2">
                        <div className="text-center pb-2 mb-2 hidden sm:block">
                          <h3 className="font-bold text-sm lg:text-base">
                            Ticket Details
                          </h3>
                        </div>

                        {[
                          { label: "Screen", value: version || "Standard" },
                          { label: "Time", value: `${day} - ${time || "N/A"}` },
                          { label: "Room", value: room || "N/A" },
                          {
                            label: "Seats",
                            value: selectedSeats.join(", ") || "N/A",
                          },
                          { label: "Discount", value: `${discount || 0}%` },
                          {
                            label: "Price",
                            value: `${formatPrice(totalPrice)} VNĐ`,
                          },
                          {
                            label: "Total",
                            value: `${formatPrice(amountPaid)} VNĐ`,
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-xs sm:text-sm pb-1"
                          >
                            <strong className="text-[#E9E9E9]">
                              {item.label}:
                            </strong>
                            <span className="text-right ml-1 break-all">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Perforated circles */}
                    <div className="absolute w-[30px] sm:w-[40px] lg:w-[50px] h-[30px] sm:h-[40px] lg:h-[50px] rounded-full bg-white top-[-25px] sm:top-[-35px] lg:top-[-40px] right-[37%] sm:right-[37%] transform translate-x-1/2"></div>
                    <div className="absolute w-[30px] sm:w-[40px] lg:w-[50px] h-[30px] sm:h-[40px] lg:h-[50px] rounded-full bg-white bottom-[-25px] sm:bottom-[-35px] lg:bottom-[-40px] right-[37%] sm:right-[37%] transform translate-x-1/2"></div>

                    {/* Dashed line */}
                    <div className="absolute h-[100%] sm:h-[90%] top-[10%] sm:top-[5%] border-dashed border-white border-2 right-[37%] transform translate-x-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Button
              type="primary"
              onClick={handleExportPdf}
              size="large"
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 border-purple-600 hover:border-purple-700 text-white font-medium px-6 sm:px-8"
              icon={<FaTicket />}
            >
              Print Ticket
            </Button>

            <Link to="/staff/ticket-selling" className="w-full sm:w-auto">
              <Button
                onClick={handleCancel}
                size="large"
                danger
                className="w-full font-medium px-6 sm:px-8"
                icon={<i className="fa-solid fa-xmark"></i>}
              >
                Cancel
              </Button>
            </Link>
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-600 text-xs sm:text-sm">
              💡 Click "Print Ticket" to save as PDF or print directly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
