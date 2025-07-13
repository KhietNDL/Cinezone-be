import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Spin } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { FaTicket, FaCouch, FaLocationDot, FaUser, FaPhone, FaCalendarDays, FaEnvelope, FaStar, FaFire } from "react-icons/fa6";
import { IoReloadOutline, IoTicketSharp, IoTime } from "react-icons/io5";
import { RiFilmAiFill, RiMovie2AiFill, RiDiscountPercentFill } from "react-icons/ri";
import { FaMoneyBillWave, FaIdCard, FaRegEye } from "react-icons/fa";
import { confirmBooking, checkInfoBookingById, cancelBookingById, getUserByPhone, getMovieById } from "../../../services/APIForStaff/API";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from 'react-redux';
import { resetBooking } from '../../../redux/features/sellingSlice'
import { resetMember } from '../../../redux/features/memberSlice'



const TicketInformation = () => {
  const hasRun = useRef(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bookingData = useSelector((state) => state.selling);
  const memberData = useSelector((state) => state.member);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [movieInfo, setMovieInfo] = useState(null);
  const [apiBookingData, setApiBookingData] = useState(null);
  const [apiCustomerData, setApiCustomerData] = useState(null);

  const statusMap = useMemo(() => ({
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
  }), []);

  const formatPrice = useCallback((price) => {
    return price?.toLocaleString('vi-VN');
  }, []);

  const processPaymentResult = useCallback(async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const resultCode = params.get('resultCode');
      const bookingId = bookingData?.bookingId || params.get('orderId')?.split('_')[1] || params.get('bookingId');

      if (!bookingId) {
        throw new Error("Missing booking ID");
      }

      //Bước 1: Luôn fetch thông tin booking trước
      const res = await checkInfoBookingById(bookingId);
      setApiBookingData(res);
      // console.log("Booking data from API:", res);

      //Nếu có thông tin khách hàng, lấy thêm info
      if (memberData?.member?.phone) {
        const customerData = await getUserByPhone(memberData?.member?.phone);
        setApiCustomerData(customerData);
        // console.log("Customer data from API:", customerData);
      }

      // Bước 2: Xác định trạng thái thanh toán
      if (resultCode) {
        if (resultCode === '0') {
          try {
            await confirmBooking(bookingId);
            setPaymentStatus('success');
            toast.success("Payment successful!");
          } catch (error) {
            setPaymentStatus('success'); // vẫn success nếu confirm thất bại
            toast.success("Payment successful (confirm failed)", error.message);
          }
        } else {
          setPaymentStatus('error'); //vẫn hiển thị vé nhưng báo thất bại
          toast.error("Payment failed");
        }
      } else {
        // Thanh toán tiền mặt hoặc truy cập trực tiếp
        setPaymentStatus(res?.status === 2 ? 'success' : 'error');
      }

    } catch (error) {
      console.error("Payment processing error:", error);
      setPaymentStatus('error');
      toast.error(error.message || "System error");
    } finally {
      setIsLoading(false);
    }
  }, [bookingData, memberData]);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      processPaymentResult();
    }
  }, []);

  useEffect(() => {
    if (!bookingData?.selectedMovie) {
      navigate("/staff/ticket-selling");
      return;
    }

    const loadMovie = async () => {
      try {
        const res = await getMovieById(bookingData?.selectedMovie?.MovieId);
        setMovieInfo(res?.data || bookingData?.selectedMovie);
      } catch {
        setMovieInfo(bookingData?.selectedMovie);
      }
    };
    loadMovie();
  }, [bookingData, navigate]);

  const handleTryAgain = useCallback(async () => {
    try {
      await cancelBookingById(bookingData?.bookingId);
      toast.info("Previous booking cancelled. Please try again.");
    } catch (err) {
      toast.error("Failed to cancel previous booking");
      console.error(err);
    } finally {
      navigate("/staff/ticket-selling/confirm-ticket");
    }
  }, [bookingData, navigate]);

  const handleNewTicket = useCallback(() => {
    dispatch(resetBooking());
    dispatch(resetMember());
    navigate("/staff/ticket-selling", { replace: true });
  }, [dispatch, navigate]);

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
    // movie,
    // day,
    // time,
    // room,
    // version,
    // selectedSeats,
    // totalPrice,
    // memberInfo,
    // paymentMethod,
    discount
  } = bookingData;

  // const finalAmount = totalPrice * (1 - (discount / 100));

  return (
    <div className="p-4 w-full mx-auto bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="text-center py-8">
        {status.icon}
        <h1 className={`text-3xl font-bold mt-4 ${status.color}`}>{status.title}</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Movie Details */}
        <div className="lg:col-span-2 rounded-xl  border border-gray-300 shadow-xl">
          <div className="bg-white p-6 rounded-xl">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <img
                src={movieInfo?.PosterImage}
                alt={`Poster ${apiBookingData?.movieNameEnglish}`}
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
                  {apiBookingData?.movieNameEnglish}
                  <span className="text-lg text-black block font-semibold">({apiBookingData?.movieNameVN})</span>
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {[
                    { icon: <RiMovie2AiFill />, label: "Sceen", value: apiBookingData?.versionType },
                    { icon: <FaLocationDot />, label: "Room", value: apiBookingData?.room },
                    { icon: <FaCalendarDays />, label: "Date", value: apiBookingData?.showDate },
                    { icon: <IoTime />, label: "Showtime", value: apiBookingData?.showTime },
                    { icon: <FaCouch />, label: "Seats", value: apiBookingData?.seats.join(", ") },
                    { icon: <RiDiscountPercentFill />, label: "Discount", value: discount > 0 ? `${discount}%` : "None" }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between lg:justify-start items-start lg:items-center lg:flex-row sm:flex-col flex-row gap-2 md:gap-0">
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
                  {bookingData?.paymentMethod === bookingData?.paymentMethod ? bookingData?.paymentMethod : "Convert points to tickets"}
                </span>
              </div>

              {/* {apiBookingData && ( */}

              {/* Thêm phần hiển thị giá từng ghế */}
              <div className="border-b pb-2">
                <h3 className="font-semibold mb-2">Ticket Details:</h3>
                {apiBookingData?.seats.map((seat, index) => {
                  const price = apiBookingData?.seatPrices[seat];
                  return (
                    <div key={index} className="flex justify-between">
                      <span>Seat {seat}:</span>
                      <span>{formatPrice(Number(price))} VNĐ</span>
                    </div>
                  );
                })}
              </div>
              {/* )} */}


              <div className="flex justify-between">
                <span className="font-semibold">Total ticket price:</span>
                <span>{formatPrice(apiBookingData?.totalPrice)} VNĐ</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discount}%):</span>
                  <span>-{formatPrice(apiBookingData?.totalPrice * discount / 100)} VNĐ</span>
                </div>
              )}

              <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                <span>Total Amount:</span>
                <span className="text-purple-600">
                  {formatPrice(Math.floor(apiBookingData?.TotalAmount))} VNĐ
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
              {!memberData?.member && (
                <p className="text-gray-500 italic">No customer information</p>
              )}
              {memberData?.member && (
                <div className="space-y-4">
                  {memberData?.member?.fullName && (
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 flex items-center gap-2">
                        <FaUser /> Full Name:
                      </p>
                      <p className="font-medium">{apiBookingData?.buyerName}</p>
                    </div>
                  )}

                  {memberData?.member?.identityCard && (
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 flex items-center gap-2">
                        <FaIdCard /> ID Card:
                      </p>
                      <p className="font-medium">{apiCustomerData?.user?.CCCD}</p>
                    </div>
                  )}

                  {memberData?.member?.phone && (
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 flex items-center gap-2">
                        <FaPhone /> Phone:
                      </p>
                      <p className="font-medium">{apiBookingData?.buyerPhone}</p>
                    </div>
                  )}

                  {memberData?.member?.email && (
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 flex items-center gap-2">
                        <FaEnvelope /> Email:
                      </p>
                      <p className="font-medium">{apiCustomerData?.user?.Email}</p>
                    </div>
                  )}

                  {memberData?.member?.score !== undefined && (
                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 flex items-center gap-2">
                        <FaStar /> Points:
                      </p>
                      <p className="font-medium flex items-center gap-1 text-green-600"><FaFire /> {apiCustomerData?.user?.ScoreBalance}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2">
              {paymentStatus === 'error' ? (
                <Button
                  onClick={handleTryAgain}
                  className={`w-full ${status.btnColor} text-white`}
                  size="large"
                  icon={status.btnIcon}
                  variant="solid"
                  color="danger"
                >
                  {status.btn}
                </Button>
              ) : (
                <Button
                  onClick={handleNewTicket}
                  className={`w-full ${status.btnColor} text-white`}
                  size="large"
                  icon={status.btnIcon}
                  color="primary"
                  variant="outlined"
                >
                  {status.btn}
                </Button>
              )}

              {paymentStatus === 'success' && (
                <Link to={`/staff/ticket-selling/view-ticket/${bookingData?.bookingId}`}>
                  <Button
                    className="view-btn hover:bg-white hover:text-purple-600"
                    type="primary"
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

export default TicketInformation;