import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Spin, message } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { FaTicket, FaCouch, FaLocationDot, FaUser, FaPhone, FaCalendarDays, FaEnvelope, FaStar, FaFire } from "react-icons/fa6";
import { IoReloadOutline, IoTicketSharp, IoTime } from "react-icons/io5";
import { RiFilmAiFill, RiMovie2AiFill, RiDiscountPercentFill } from "react-icons/ri";
import { FaMoneyBillWave, FaIdCard, FaRegEye } from "react-icons/fa";
import { confirmBooking, checkInfoBookingById } from "../../../services/APIForStaff/API";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusMap = {
  success: {
    icon: <CheckCircleTwoTone twoToneColor="#52c41a" className="text-8xl" />,
    title: "Payment Successful",
    color: "text-green-500",
    btn: "New Ticket",
    btnIcon: <FaTicket />,
    btnColor: "bg-green-600 hover:bg-green-700"
  },
  error: {
    icon: <CloseCircleTwoTone twoToneColor="#ff4d4f" className="text-8xl" />,
    title: "Payment Failed",
    color: "text-red-500",
    btn: "Try Again",
    btnIcon: <IoReloadOutline />,
    btnColor: "bg-red-600 hover:bg-red-700"
  }
};

const formatPrice = (price) => {
  return price?.toLocaleString('vi-VN') || "0";
};

const TicketInfomation = () => {
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingData, setBookingData] = useState(null);

   const processPaymentResult = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const resultCode = params.get('resultCode');
        const bookingId = params.get('orderId')?.split('_')[1] || params.get('bookingId');

        // Always load from localStorage first
        const savedData = localStorage.getItem('currentBooking');
        if (!savedData) throw new Error("Ticket information not found");

        const parsedData = JSON.parse(savedData);
        if (!parsedData.bookingId) throw new Error("Invalid ticket data");

        // If coming from payment gateway (Momo)
        if (bookingId && resultCode) {
          if (resultCode === '0') {
            // Momo payment success - confirm with server but show local data
            try {
              await confirmBooking(parsedData.bookingId);
              setBookingData(parsedData); // Use local data instead of API response
              setPaymentStatus('success');
              toast.success("Payment successful!");
            } catch (apiError) {
              console.error("Confirmation error:", apiError);
              // Still show local data even if confirmation fails
              setBookingData(parsedData);
              setPaymentStatus('success');
              toast.success("Payment successful (could not confirm with server)");
            }
          } else {
            // Momo payment failed
            setBookingData(parsedData);
            setPaymentStatus('error');
            toast.error("Payment failed");
          }
          return;
        }

        // For cash payment or direct access
        setBookingData(parsedData);
        setPaymentStatus(parsedData.isConfirmed ? 'success' : 'error');

      } catch (error) {
        console.error("Payment processing error:", error);
        setPaymentStatus('error');
        toast.error(error.message || "System error");
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    processPaymentResult();
  }, []);

  // const formatBookingData = (apiData) => ({
  //   bookingId: apiData.bookingId,
  //   movie: {
  //     NameOfEnglish: apiData.movieNameEnglish,
  //     NameOfVietnamese: apiData.movieNameVN,
  //     PosterImage: apiData.moviePoster
  //   },
  //   day: apiData.showDate,
  //   time: apiData.showTime,
  //   room: apiData.room,
  //   version: apiData.version,
  //   selectedSeats: apiData.seats?.map(s => s.seatNumber) || [],
  //   seatData: apiData.seats || [],
  //   totalPrice: apiData.totalAmount || 0,
  //   memberInfo: {
  //     email: apiData.email,
  //     fullName: apiData.fullName,
  //     identityCard: apiData.identityCard,
  //     phone: apiData.phone,
  //     score: apiData.score,
  //     memberLevel: apiData.memberLevel,
  //     memberId: apiData.memberId
  //   },
  //   paymentMethod: apiData.paymentMethod || 'cash',
  //   discount: apiData.discountValue || 0
  // });

  const handleNewTicket = () => {
    localStorage.removeItem('currentBooking');
    localStorage.removeItem('current_member');
    localStorage.removeItem('selectedSeats');
    navigate("/staff/ticket-selling", { replace: true });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Processing payment..." />
      </div>
    );
  }

  if (!bookingData || !paymentStatus) {
    return (
      <div className="text-center my-8 p-6 bg-red-50 rounded-lg max-w-md mx-auto">
        <CloseCircleTwoTone twoToneColor="#ff4d4f" className="text-4xl mb-4" />
        <h3 className="text-xl font-bold text-red-600 mb-2">Failed to load ticket information</h3>
        <p className="mb-4">Please check again or contact support</p>
        <Button
          type="primary"
          onClick={() => navigate("/staff/ticket-selling")}
        >
          Return to ticket booking
        </Button>
      </div>
    );
  }

  const status = statusMap[paymentStatus];
  const {
    movie,
    day,
    time,
    room,
    version,
    selectedSeats,
    totalPrice,
    memberInfo,
    paymentMethod,
    discount
  } = bookingData;

  const finalAmount = totalPrice * (1 - (discount / 100));

  return (
    <div className="p-4 w-full mx-auto bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="text-center py-8 border-b">
        {status.icon}
        <h1 className={`text-3xl font-bold mt-4 ${status.color}`}>{status.title}</h1>
        <p className="text-gray-600 mt-2">Booking ID: <span className="font-mono">{bookingData.bookingId}</span></p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Movie Details */}
        <div className="lg:col-span-2 rounded-xl  border border-gray-300 shadow-xl">
          <div className="bg-white p-6 rounded-xl">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <img
                src={movie.PosterImage}
                alt={`Poster ${movie.NameOfEnglish}`}
                className="w-40 h-56 object-cover rounded-lg shadow border"
                onError={(e) => {
                  e.target.src = '/placeholder-poster.jpg';
                  e.target.className += ' bg-gray-200';
                }}
              />

              <div className="flex-1">
                <h2 className="text-xl font-semibold flex items-start gap-2 text-gray-700">
                  <RiFilmAiFill className="mt-1" /> Movie:
                </h2>
                <span className="text-2xl font-bold flex flex-col items-start gap-2">
                  {movie.NameOfEnglish}
                  <span className="text-lg text-black block font-semibold">({movie.NameOfVietnamese})</span>
                </span>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {[
                    { icon: <RiMovie2AiFill />, label: "Sceen", value: version },
                    { icon: <FaLocationDot />, label: "Room", value: room },
                    { icon: <FaCalendarDays />, label: "Date", value: day },
                    { icon: <IoTime />, label: "Showtime", value: time },
                    { icon: <FaCouch />, label: "Seats", value: selectedSeats.join(", ") },
                    { icon: <RiDiscountPercentFill />, label: "Discount", value: discount > 0 ? `${discount}%` : "None" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex items-center gap-2 w-[40%]">
                        <span className="text-gray-700">{item.icon}</span>
                        <span className="font-semibold text-gray-700">{item.label}:</span>
                      </div>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaMoneyBillWave /> Payment Details
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-semibold">Method:</span>
                <span className="font-medium capitalize">
                  {paymentMethod === 'cash' ? 'Cash' : paymentMethod}
                </span>
              </div>

              {/* Thêm phần hiển thị giá từng ghế */}
              <div className="border-b pb-2">
                <h3 className="font-semibold mb-2">Ticket Details:</h3>
                {bookingData.seatData?.map((seat, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      Seat {seat.seatNumber}:
                      {/* <span className="ml-1 text-gray-600">{seat.seatType || 'Standard'}</span> */}
                    </span>
                    <span>{formatPrice(seat.price)} VNĐ</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Total ticket price:</span>
                <span>{formatPrice(totalPrice)} VNĐ</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discount}%):</span>
                  <span>-{formatPrice(totalPrice * discount / 100)} VNĐ</span>
                </div>
              )}

              <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                <span>Total Amount:</span>
                <span className="text-purple-600">
                  {formatPrice(finalAmount)} VNĐ
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Info & Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-300 shadow-xl p-6 rounded-lg sticky top-4 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaUser /> Customer Information
              </h2>
              {!memberInfo && (
                <p className="text-gray-500 italic">No customer information</p>
              )}
              {memberInfo && (
                <div className="space-y-4">
                  {memberInfo.memberId && (
                    <div>
                      <p className="text-gray-600 flex items-center gap-2">
                        <FaIdCard /> Member ID:
                      </p>
                      <p className="font-medium">{memberInfo.memberId}</p>
                    </div>
                  )}

                  {memberInfo.fullName && (
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 flex items-center gap-2">
                        <FaUser /> Full Name:
                      </p>
                      <p className="font-medium">{memberInfo.fullName}</p>
                    </div>
                  )}

                  {memberInfo.identityCard && (
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 flex items-center gap-2">
                        <FaIdCard /> ID Card:
                      </p>
                      <p className="font-medium">{memberInfo.identityCard}</p>
                    </div>
                  )}

                  {memberInfo.phone && (
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 flex items-center gap-2">
                        <FaPhone /> Phone:
                      </p>
                      <p className="font-medium">{memberInfo.phone}</p>
                    </div>
                  )}

                  {memberInfo.email && (
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 flex items-center gap-2">
                        <FaEnvelope /> Email:
                      </p>
                      <p className="font-medium">{memberInfo.email}</p>
                    </div>
                  )}

                  {memberInfo.score !== undefined && (
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 flex items-center gap-2">
                        <FaStar /> Points:
                      </p>
                      <p className="font-medium flex items-center gap-1 text-green-600"><FaFire /> {memberInfo.score}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2">
              <Button
                onClick={handleNewTicket}
                className={`w-full ${status.btnColor} text-white`}
                size="large"
                icon={status.btnIcon}
                style={{
                  color: '#7c3aed',
                  borderColor: '#7c3aed',
                  backgroundColor: 'white'
                }}
              >
                {status.btn}
              </Button>

              {paymentStatus === 'success' && (
                <Link to={`/staff/ticket-selling/view-ticket/${bookingData.bookingId}`}>
                  <Button
                    className="view-btn hover:bg-white hover:text-purple-600"
                    style={{
                      width: '100%',
                      color: 'white',
                      borderColor: '#7c3aed',
                      backgroundColor: '#7c3aed'
                    }}
                    size="large"
                    icon={<FaRegEye />}
                  >
                    View Ticket
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketInfomation;