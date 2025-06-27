import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Spin, message } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { FaTicket, FaCouch, FaLocationDot, FaUser, FaPhone, FaCalendarDays, FaEnvelope, FaStar } from "react-icons/fa6";
import { IoReloadOutline, IoTicketSharp, IoTime } from "react-icons/io5";
import { RiFilmAiFill, RiMovie2AiFill, RiDiscountPercentFill } from "react-icons/ri";
import { FaMoneyBillWave, FaIdCard } from "react-icons/fa";
import { confirmBooking, checkInfoBookingById } from "../../../services/APIForStaff/API";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusMap = {
  success: {
    icon: <CheckCircleTwoTone twoToneColor="#52c41a" className="text-6xl" />,
    title: "Payment Successful",
    color: "text-green-500",
    btn: "New Ticket",
    btnIcon: <FaTicket />,
    btnColor: "bg-green-600 hover:bg-green-700"
  },
  error: {
    icon: <CloseCircleTwoTone twoToneColor="#ff4d4f" className="text-6xl" />,
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

  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const resultCode = params.get('resultCode');
        const bookingId = params.get('orderId')?.split('_')[1] || params.get('bookingId');

        // Load from localStorage first (for both success and failed cases)
        const savedData = localStorage.getItem('currentBooking');
        if (!savedData) throw new Error("Ticket information not found");

        const parsedData = JSON.parse(savedData);
        if (!parsedData.bookingId) throw new Error("Invalid ticket data");

        // Load from API if coming from payment gateway
        if (bookingId && resultCode) {
          try {
            const res = await checkInfoBookingById(bookingId);
            if (resultCode === '0') {
              await confirmBooking(bookingId);
              setBookingData(formatBookingData(res));
              setPaymentStatus('success');
              toast.success("Payment successful!");
            } else {
              // Momo payment failed but still show local data
              setBookingData(parsedData);
              setPaymentStatus('error');
              toast.error("Payment failed");
            }
          } catch (apiError) {
            console.error("API call error:", apiError);
            // Fallback to local data if API call fails
            setBookingData(parsedData);
            setPaymentStatus('error');
            toast.error("Payment failed (could not verify from server)");
          }
          return;
        }

        // For cash payment or when no resultCode (direct access)
        setBookingData(parsedData);
        setPaymentStatus(parsedData.isConfirmed ? 'success' : 'error');
        console.log("data: ", parsedData);

      } catch (error) {
        console.error("Payment processing error:", error);
        setPaymentStatus('error');
        toast.error(error.message || "System error");
      } finally {
        setIsLoading(false);
      }
    };

    processPaymentResult();
  }, []);

  const formatBookingData = (apiData) => ({
    bookingId: apiData.bookingId,
    movie: {
      NameOfEnglish: apiData.movieNameEnglish,
      NameOfVietnamese: apiData.movieNameVN,
      PosterImage: apiData.moviePoster
    },
    day: apiData.showDate,
    time: apiData.showTime,
    room: apiData.room,
    version: apiData.version,
    selectedSeats: apiData.seats?.map(s => s.seatNumber) || [],
    seatData: apiData.seats || [],
    totalPrice: apiData.totalAmount || 0,
    memberInfo: {
      email: apiData.email,
      fullName: apiData.fullName,
      identityCard: apiData.identityCard,
      phone: apiData.phone,
      score: apiData.score,
      memberLevel: apiData.memberLevel,
      memberId: apiData.memberId
    },
    paymentMethod: apiData.paymentMethod || 'cash',
    discount: apiData.discountValue || 0
  });

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
    <div className="p-4 max-w-6xl mx-auto bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="text-center py-8 border-b">
        {status.icon}
        <h1 className={`text-3xl font-bold mt-4 ${status.color}`}>{status.title}</h1>
        <p className="text-gray-600 mt-2">Booking ID: <span className="font-mono">{bookingData.bookingId}</span></p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Movie Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row gap-6">
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
                <h2 className="text-2xl font-bold flex items-start gap-2">
                  <RiFilmAiFill className="mt-1" />
                  <span>
                    {movie.NameOfEnglish}
                    <span className="text-lg text-gray-600 block">({movie.NameOfVietnamese})</span>
                  </span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {[
                    { icon: <RiMovie2AiFill />, label: "Format", value: version },
                    { icon: <FaLocationDot />, label: "Room", value: room },
                    { icon: <FaCalendarDays />, label: "Date", value: day },
                    { icon: <IoTime />, label: "Showtime", value: time },
                    { icon: <FaCouch />, label: "Seats", value: selectedSeats.join(", ") },
                    { icon: <RiDiscountPercentFill />, label: "Discount", value: discount > 0 ? `${discount}%` : "None" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-gray-500">{item.icon}</span>
                      <span className="font-medium">{item.label}:</span>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaMoneyBillWave /> Payment Details
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="font-medium capitalize">
                  {paymentMethod === 'cash' ? 'Cash' : paymentMethod}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Total ticket price:</span>
                <span>{formatPrice(totalPrice)} VND</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discount}%):</span>
                  <span>-{formatPrice(totalPrice * discount / 100)} VND</span>
                </div>
              )}

              <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                <span>Amount due:</span>
                <span className="text-purple-600">
                  {formatPrice(finalAmount)} VND
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Info & Actions */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg sticky top-4 space-y-6">
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
                    <div>
                      <p className="text-gray-600 flex items-center gap-2">
                        <FaUser /> Full Name:
                      </p>
                      <p className="font-medium">{memberInfo.fullName}</p>
                    </div>
                  )}

                  {memberInfo.identityCard && (
                    <div>
                      <p className="text-gray-600 flex items-center gap-2">
                        <FaIdCard /> ID Card:
                      </p>
                      <p className="font-medium">{memberInfo.identityCard}</p>
                    </div>
                  )}

                  {memberInfo.phone && (
                    <div>
                      <p className="text-gray-600 flex items-center gap-2">
                        <FaPhone /> Phone:
                      </p>
                      <p className="font-medium">{memberInfo.phone}</p>
                    </div>
                  )}

                  {memberInfo.email && (
                    <div>
                      <p className="text-gray-600 flex items-center gap-2">
                        <FaEnvelope /> Email:
                      </p>
                      <p className="font-medium">{memberInfo.email}</p>
                    </div>
                  )}

                  {memberInfo.score !== undefined && (
                    <div>
                      <p className="text-gray-600 flex items-center gap-2">
                        <FaStar /> Points:
                      </p>
                      <p className="font-medium">{memberInfo.score} points</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleNewTicket}
                className={`w-full ${status.btnColor} text-white`}
                size="large"
                icon={status.btnIcon}
              >
                {status.btn}
              </Button>

              {paymentStatus === 'success' && (
                <Link to={`/staff/ticket-selling/view-ticket/${bookingData.bookingId}`}>
                  <Button
                    className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                    size="large"
                    icon={<IoTicketSharp />}
                  >
                    View Ticket Details
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