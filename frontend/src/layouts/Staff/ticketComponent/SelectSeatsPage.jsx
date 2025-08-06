import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Tag, Spin, message } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import {
  FaCalendarDays,
  FaClock,
  FaCouch,
  FaLocationDot,
} from "react-icons/fa6";
import { LayoutSelectSeat } from "../../../component/LayoutSelectSeat";
import { getMovieById, getSeatsByShowtimeId } from "../../../services/APIForStaff/API";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedSeats,
  setSeatData,
  setTotalPrice,
  resetBooking,
} from "../../../redux/features/sellingSlice";
import { resetMember } from "../../../redux/features/memberSlice";
import VersionCard from "../component/VersionCard";
import BackButton from "../component/BackButton";

const SelectSeatsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bookingData = useSelector((state) => state.selling);
  const { seatData, selectedSeats, selectedMovie, showtimeId } = bookingData;

  const [movieInfo, setMovieInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetchedData = useRef(false);

  useEffect(() => {
    if (!selectedMovie?.MovieId || !showtimeId) {
      message.error("No booking data found");
      navigate("/staff/ticket-selling");
      return;
    }

    if (hasFetchedData.current) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const movieRes = await getMovieById(selectedMovie.MovieId);
        setMovieInfo(movieRes.data || selectedMovie);

        const seatsRes = await getSeatsByShowtimeId(showtimeId);
        dispatch(setSeatData(seatsRes.seats || []));

        hasFetchedData.current = true;
      } catch (err) {
        setError("Failed to load seat data");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMovie?.MovieId, showtimeId, navigate, dispatch, selectedMovie]);

  const formatPrice = useCallback((price) => {
    return price.toLocaleString("vi-VN");
  }, []);

  const handleSeatSelect = useCallback(
    (selection) => {
      const newSelectedSeats = selection.seats.map((s) => s.seatNumber);
      dispatch(setSelectedSeats(newSelectedSeats));
    },
    [dispatch]
  );

  const handleCancel = useCallback(() => {
    dispatch(resetBooking());
    dispatch(resetMember());
    navigate("/staff/ticket-selling");
  }, [dispatch, navigate]);

  const handleContinue = useCallback(() => {
    if (selectedSeats.length === 0) {
      message.warning("Please select at least one seat");
      return;
    }

    const totalPrice = selectedSeats.reduce((total, seatNumber) => {
      const seat = seatData.find((s) => s.seatNumber === seatNumber);
      return total + (seat ? seat.price : 0);
    }, 0);

    dispatch(setTotalPrice(totalPrice));
    navigate("/staff/ticket-selling/confirm-ticket");
  }, [selectedSeats, seatData, dispatch, navigate]);

  const seatStats = useMemo(() => {
    const totalSeats = seatData.length;
    const lockedSeats = seatData.filter((seat) => seat.status === "taken").length;
    const selectableSeats = totalSeats - lockedSeats;
    const selectedCount = selectedSeats.length;
    const totalPrice = selectedSeats.reduce((total, seatNumber) => {
      const seat = seatData.find((s) => s.seatNumber === seatNumber);
      return total + (seat ? seat.price : 0);
    }, 0);

    return { totalSeats, lockedSeats, selectableSeats, selectedCount, totalPrice };
  }, [seatData, selectedSeats]);

  const selectedSeatTags = useMemo(() => {
    return selectedSeats.map((seatNumber) => {
      const seat = seatData.find((s) => s.seatNumber === seatNumber);
      return (
        <Tag key={seatNumber} color="purple">
          {seatNumber} - {formatPrice(seat?.price || 0)} VNĐ
        </Tag>
      );
    });
  }, [selectedSeats, seatData, formatPrice]);

  if (loading || !movieInfo) {
    return (
      <div className="text-center my-8">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center my-8 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 bg-white shadow-md rounded-lg mb-6">
        <div className="flex flex-row items-center gap-3 lg:gap-4">
          <BackButton />
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <FaCouch className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                Select Seats
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Staff Portal - Ticket Selling
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        `{/* Movie Info Card */}
        <div className="bg-white rounded-xl shadow-lg border-0 overflow-hidden mb-6">
          <div className="flex items-center sm:items-start gap-6 p-6 flex-col sm:flex-row">
            <div className="flex-shrink-0">
              <img
                src={movieInfo.PosterImage}
                alt={movieInfo.NameOfEnglish || ""}
                className="w-32 h-48 rounded-xl shadow-lg object-cover"
              />
            </div>

            <div className="flex-1 flex flex-col items-center sm:items-start">
              {/* Movie Status and Version */}
              <div className="flex items-center gap-3 mb-4 w-full">
                <div className="px-4 w-[190px] md:w-[160px] lg:w-[140px] text-center py-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-md">
                  <p className="font-semibold text-sm text-white">
                    Now Showing
                  </p>
                </div>
                {bookingData.selectedVersion && (
                  <VersionCard
                    version={bookingData.selectedVersion}
                    readonly
                    className="text-sm"
                  />
                )}
              </div>

              {/* Movie Title */}
              <div className="text-center sm:text-left mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                  {movieInfo.NameOfEnglish}
                </h2>
                {movieInfo.NameOfVietnamese && (
                  <p className="text-lg font-medium text-gray-600">
                    ({movieInfo.NameOfVietnamese})
                  </p>
                )}
              </div>

              {/* Booking Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                {bookingData.selectedDay && (
                  <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                    <FaCalendarDays className="text-purple-600 text-lg" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Date</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {bookingData.selectedDay}
                      </p>
                    </div>
                  </div>
                )}
                {bookingData.selectedTime && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <FaClock className="text-blue-600 text-lg" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Time</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {bookingData.selectedTime}
                      </p>
                    </div>
                  </div>
                )}
                {bookingData.room && (
                  <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                    <FaLocationDot className="text-orange-600 text-lg" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Room</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {bookingData.room}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <FaCouch className="text-gray-600 text-lg" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Rows</p>
                    <p className="text-sm font-semibold text-gray-800">A - J</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Main Layout - Seat Selection */}
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Seat Layout */}
          <div className="flex-1 bg-white rounded-xl shadow-lg border-0 overflow-hidden">
            <div className="p-6">

              <div className="flex justify-center items-center overflow-x-auto">
                <div className="min-w-[50%]">
                  <LayoutSelectSeat
                    seatDataFromAPI={seatData}
                    initialSelectedSeats={selectedSeats}
                    onSeatSelect={handleSeatSelect}
                    containerWidth="1000px"
                    textColor="text-purple-600"
                    width={30}
                    height={30}
                    widthDouble={65}
                    heightDouble={40}
                    seatColors={{
                      selected: "text-[#8600E1]",
                      taken: "text-gray-400",
                      holding: "text-blue-400",
                      normal: "text-purple-600",
                      vip: "text-yellow-600",
                      couple: "text-red-600",
                    }}
                    showInfo={false}
                    className="w-full px-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seat Information Panel */}
          <div className="w-full lg:w-[25%] bg-white rounded-xl shadow-lg border-0 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <FaCouch className="text-white text-sm" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Seat Information
                </h3>
              </div>

              {/* Seat Statistics */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Total seats:</span>
                  <span className="font-bold text-gray-800">
                    {seatStats.totalSeats}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600">Available:</span>
                  <span className="font-bold text-blue-700">
                    {seatStats.selectableSeats}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-red-600">Sold:</span>
                  <span className="font-bold text-red-700">
                    {seatStats.lockedSeats}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600">Selected:</span>
                  <span className="font-bold text-green-700">
                    {seatStats.selectedCount}
                  </span>
                </div>
              </div>

              {/* Total Price */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-purple-700 font-semibold">
                    Total Price:
                  </span>
                  <span className="text-xl font-bold text-purple-800">
                    {formatPrice(seatStats.totalPrice)} VNĐ
                  </span>
                </div>
              </div>

              {/* Selected Seats Tags */}
              {seatStats.selectedCount > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Selected Seats:
                  </h4>
                  <div className="flex flex-wrap gap-2">{selectedSeatTags}</div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={handleContinue}
                  disabled={seatStats.selectedCount === 0}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 border-0 hover:from-purple-700 hover:to-purple-800 font-semibold text-white rounded-lg"
                >
                  Continue to Payment
                </Button>
                <Button
                  danger
                  icon={<CloseOutlined />}
                  onClick={handleCancel}
                  className="w-full h-12 font-semibold rounded-lg border-red-300 text-red-600 hover:bg-red-50"
                >
                  Cancel Booking
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectSeatsPage;
