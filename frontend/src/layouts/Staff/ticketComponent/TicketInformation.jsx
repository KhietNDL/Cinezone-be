import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Spin } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import {
  FaTicket,
  FaCouch,
  FaLocationDot,
  FaUser,
  FaPhone,
  FaCalendarDays,
  FaEnvelope,
  FaStar,
  FaFire,
  FaX,
} from "react-icons/fa6";
import { IoReloadOutline, IoTicketSharp, IoTime } from "react-icons/io5";
import {
  RiFilmAiFill,
  RiMovie2AiFill,
  RiDiscountPercentFill,
} from "react-icons/ri";
import { FaMoneyBillWave, FaIdCard, FaRegEye } from "react-icons/fa";
import {
  checkInfoBookingById,
  cancelBookingById,
  getMovieById,
  confirmPayment,
  getUserByEmail,
} from "../../../services/APIForStaff/API";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { resetBooking } from "../../../redux/features/sellingSlice";
import { resetMember } from "../../../redux/features/memberSlice";
import BackButton from "../component/BackButton";
import VersionCard from "../component/VersionCard";

// Tạo hiệu ứng pháo hoa chúc mừng
const createFireworks = () => {
  const colors = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#ffa500",
    "#800080",
  ];

  // Tạo nhiều đợt pháo hoa
  for (let round = 0; round < 3; round++) {
    setTimeout(() => {
      const fireworks = document.createElement("div");
      fireworks.style.cssText = `
        position: fixed;
        top: ${20 + round * 10}%;
        left: ${40 + round * 10}%;
        transform: translateX(-50%);
        z-index: 9999;
        pointer-events: none;
      `;

      for (let i = 0; i < 60; i++) {
        const particle = document.createElement("div");
        particle.style.cssText = `
          position: absolute;
          width: 6px;
          height: 6px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          border-radius: 50%;
          box-shadow: 0 0 6px currentColor;
          animation: firework ${0.8 + Math.random() * 0.6}s ease-out forwards;
        `;

        const angle = (Math.PI * 2 * i) / 60;
        const velocity = 80 + Math.random() * 60;
        particle.style.setProperty("--dx", Math.cos(angle) * velocity + "px");
        particle.style.setProperty("--dy", Math.sin(angle) * velocity + "px");

        fireworks.appendChild(particle);
      }

      document.body.appendChild(fireworks);

      setTimeout(() => {
        if (document.body.contains(fireworks)) {
          document.body.removeChild(fireworks);
        }
      }, 1500);
    }, round * 300);
  }

  // Thêm CSS keyframes nếu chưa có
  if (!document.getElementById("fireworks-style")) {
    const style = document.createElement("style");
    style.id = "fireworks-style";
    style.textContent = `
      @keyframes firework {
        0% { 
          transform: translate(0, 0) scale(1); 
          opacity: 1; 
        }
        50% {
          opacity: 1;
        }
        100% { 
          transform: translate(var(--dx), var(--dy)) scale(0.3); 
          opacity: 0; 
        }
      }
      
      @keyframes celebration {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
    `;
    document.head.appendChild(style);
  }
};

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
  const visaResponse = useSelector((state) => state.selling.visaResponse);

  const statusMap = useMemo(
    () => ({
      succeeded: {
        icon: (
          <CheckCircleTwoTone twoToneColor="#52c41a" className="text-8xl" />
        ),
        title: "Payment Successful",
        color: "text-green-500",
        btn: "New Ticket",
        btnIcon: <FaTicket />,
        btnColor: "bg-green-600 hover:bg-green-700",
      },
      error: {
        icon: (
          <CloseCircleTwoTone twoToneColor="#ff4d4f" className="text-8xl" />
        ),
        title: "Payment Failed",
        color: "text-red-500",
        btn: "Try Again",
        btnIcon: <IoReloadOutline />,
        btnColor: "bg-red-600 hover:bg-red-700",
      },
    }),
    []
  );

  const formatPrice = useCallback((price) => {
    return price?.toLocaleString("vi-VN");
  }, []);

  const processPaymentResult = useCallback(async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const resultCode = params.get("resultCode"); // MOMO
      const zaloStatus = params.get("status"); // ZaloPay

      let bookingId = params.get("bookingId") || bookingData?.bookingId;
      let paymentId = params.get("paymentId") || bookingData?.paymentId;

      if ((!bookingId || !paymentId) && params.get("extraData")) {
        try {
          const extra = JSON.parse(decodeURIComponent(params.get("extraData")));
          bookingId = extra.bookingId || bookingId;
          paymentId = extra.paymentId || paymentId;
        } catch (e) {
          console.error("Failed to parse extraData:", e);
        }
      }

      const res = await checkInfoBookingById(bookingId);
      setApiBookingData(res);

      let status = "error";

      // MOMO
      if (resultCode !== null) {
        if (resultCode === "0") {
          if (paymentId) await confirmPayment(paymentId);

          status = "succeeded";
          toast.success("MoMo payment successful!");
        } else {
          toast.error("MoMo payment failed!");
        }
      }

      // ZaloPay
      else if (zaloStatus !== null) {
        if (zaloStatus === "1") {
          if (paymentId) await confirmPayment(paymentId);
          status = "succeeded";
          toast.success("ZaloPay payment successful!");
        } else {
          toast.error("ZaloPay payment failed!");
        }
      }

      // VISA hoặc truy cập trực tiếp
      else if (visaResponse?.status === "succeeded") {
        if (paymentId) {
          try {
            await confirmPayment(paymentId);
          } catch (err) {
            console.warn("Confirm failed:", err.message);
          }
        }
        status = "succeeded";
        toast.success("Payment successful!");
      } else if (res?.status === 2) {
        status = "succeeded";
      } else {
        toast.error("Payment failed!");
      }

      setPaymentStatus(status);

      // Bắn pháo hoa khi thanh toán thành công
      if (status === "succeeded") {
        setTimeout(() => {
          createFireworks();
        }, 500);
      }

      window.history.replaceState({}, document.title, window.location.pathname);
      // Fetch thêm thông tin khách hàng
      if (memberData?.member?.email && memberData.memberChecked === true) {
        const customerData = await getUserByEmail(memberData?.member?.email);

        setApiCustomerData(customerData);
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      setPaymentStatus("error");
      toast.error(error.message || "System error");
    } finally {
      setIsLoading(false);
    }
  }, [bookingData, memberData, visaResponse]);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      processPaymentResult();
    }
  }, [processPaymentResult]);

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
    } catch (error) {
      toast.error("Failed to cancel previous booking");
      console.error(error);
    } finally {
      navigate("/staff/ticket-selling/confirm-ticket");
    }
  }, [bookingData, navigate]);

  const handleClose = useCallback(async () => {
    try {
      await cancelBookingById(bookingData.bookingId);
      toast.success("Booking cancelled.");
    } catch (error) {
      toast.error("Failed to cancel booking: " + error.message);
      console.error(error.message);
    } finally {
      dispatch(resetBooking());
      dispatch(resetMember());
      navigate("/staff/ticket-selling");
    }
  }, [bookingData, navigate, dispatch]);

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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl  ">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CloseCircleTwoTone twoToneColor="#ff4d4f" className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-red-600 mb-2">
              Failed to load ticket information
            </h3>
            <p className="text-gray-600 mb-6">
              Please check again or contact support
            </p>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/staff/ticket-selling")}
              className="bg-purple-600 hover:bg-purple-700 border-purple-600 hover:border-purple-700"
            >
              Return to ticket booking
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const status = statusMap[paymentStatus];
  const { discount } = bookingData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 bg-white shadow-md rounded-lg mb-6">
        <div className="flex flex-row items-center gap-3 lg:gap-4">
          <BackButton />
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <IoTicketSharp className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                Ticket Information
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Staff Portal - Payment Result
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl ">
        {/* Payment Status Section - Improved Design */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Status Header with Gradient */}
            <div
              className={`${
                paymentStatus === "succeeded"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : "bg-gradient-to-r from-red-500 to-rose-600"
              } px-6 py-4`}
            >
              <div className="flex items-center justify-center gap-4 text-white">
                <div className="text-4xl">{status.icon}</div>
                <div className="text-center">
                  <h1 className="text-2xl font-bold">{status.title}</h1>
                  {paymentStatus === "succeeded" && (
                    <p className="text-green-100 mt-1 text-sm">
                      🎉 Your ticket has been successfully processed
                    </p>
                  )}
                  {paymentStatus === "error" && (
                    <p className="text-red-100 mt-1 text-sm">
                      ⚠️ Please try again or contact support
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl ">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Movie Details */}
          <div className="lg:col-span-2">
            {/* Movie Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold flex items-center gap-3 text-gray-800">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <RiFilmAiFill className="text-purple-600 text-lg" />
                  </div>
                  Movie Information
                </h2>
              </div>

              <div className="p-6">
                {/* Movie Section */}
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Movie Poster */}
                  <div className="flex-shrink-0">
                    <div className="relative group">
                      <img
                        src={movieInfo?.PosterImage}
                        alt={`Poster ${apiBookingData?.movieNameEnglish}`}
                        className="w-full lg:w-48 h-64 object-cover rounded-xl shadow-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300"
                        onError={(e) => {
                          e.target.src = "/placeholder-poster.jpg";
                          e.target.className += " bg-gray-200";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500 text-white shadow-lg">
                          ● Completed
                        </span>
                      </div>
                      {/* Version */}
                      <div className="absolute bottom-3 right-3 text-[10px]">
                        <VersionCard
                          version={apiBookingData?.versionType}
                          readonly={true}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Movie Information Details */}
                  <div className="flex-1 space-y-4">
                    {/* Movie Title */}
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                        {apiBookingData?.movieNameEnglish}
                      </h3>
                      <p className="text-lg text-gray-600 font-medium">
                        ({apiBookingData?.movieNameVN})
                      </p>
                    </div>

                    {/* Booking Information Grid - Simplified */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-100">
                        <div className="flex items-center gap-2">
                          <FaLocationDot className="text-blue-600" />
                          <div>
                            <p className="text-xs font-medium text-gray-600">
                              Room
                            </p>
                            <p className="font-bold text-gray-900">
                              {apiBookingData?.room}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-3 border border-emerald-100">
                        <div className="flex items-center gap-2">
                          <FaCalendarDays className="text-emerald-600" />
                          <div>
                            <p className="text-xs font-medium text-gray-600">
                              Date
                            </p>
                            <p className="font-bold text-gray-900">
                              {apiBookingData?.showDate}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 border border-yellow-100">
                        <div className="flex items-center gap-2">
                          <IoTime className="text-yellow-600" />
                          <div>
                            <p className="text-xs font-medium text-gray-600">
                              Time
                            </p>
                            <p className="font-bold text-gray-900">
                              {apiBookingData?.showTime}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 border border-orange-100">
                        <div className="flex items-center gap-2">
                          <FaCouch className="text-orange-600" />
                          <div>
                            <p className="text-xs font-medium text-gray-600">
                              Seats
                            </p>
                            <p className="font-bold text-gray-900">
                              {apiBookingData?.seats.join(", ")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold flex items-center gap-3 text-gray-800">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FaMoneyBillWave className="text-purple-600 text-lg" />
                  </div>
                  Payment Details
                </h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {/* Payment Method */}
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-100">
                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                      <span className="text-purple-600">💳</span>
                      Payment Method:
                    </span>
                    <span className="font-bold text-gray-900 capitalize bg-white px-3 py-1 rounded-lg shadow-sm">
                      {bookingData?.paymentMethod}
                    </span>
                  </div>

                  {/* Ticket Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                    <h3 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
                      <span className="text-blue-600">🎫</span>
                      Ticket Summary:
                    </h3>

                    {/* Compact ticket list */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
                      {apiBookingData?.seats.map((seat, index) => {
                        const price = apiBookingData?.seatPrices[seat];
                        return (
                          <div
                            key={index}
                            className="bg-white rounded-lg p-2 border border-blue-200 text-center"
                          >
                            <div className="text-xs font-medium text-gray-600">
                              Seat {seat}
                            </div>
                            <div className="font-bold text-gray-900 text-sm">
                              {formatPrice(Number(price))} VNĐ
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Total summary */}
                    <div className="border-t border-blue-200 pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">
                          {formatPrice(apiBookingData?.totalPrice)} VNĐ
                        </span>
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount ({discount}%):</span>
                          <span>
                            -
                            {formatPrice(
                              (apiBookingData?.totalPrice * discount) / 100
                            )}{" "}
                            VNĐ
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                        <span className="font-bold text-gray-800">
                          Total Amount:
                        </span>
                        <span className="text-purple-600 font-bold text-lg">
                          {formatPrice(Math.floor(apiBookingData?.TotalAmount))}{" "}
                          VNĐ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold flex items-center gap-3 text-gray-800">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FaUser className="text-purple-600" />
                  </div>
                  Customer Information
                </h2>
              </div>

              <div className="p-6">
                {!memberData?.member && memberData.memberChecked === false && (
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-6 border border-gray-200 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <FaUser className="text-gray-400 text-xl" />
                    </div>
                    <p className="text-gray-500 italic">
                      No customer information
                    </p>
                  </div>
                )}

                {(memberData?.member ||
                  apiCustomerData?.users?.[0] ||
                  apiBookingData?.buyerName) &&
                  memberData.memberChecked === true && (
                    <div className="space-y-3">
                      {(memberData?.member?.fullName ||
                        apiCustomerData?.users?.[0]?.FullName ||
                        apiBookingData?.buyerName) && (
                        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                          <span className="text-gray-600 font-medium flex items-center gap-2">
                            <FaUser className="text-blue-600" />
                            Name:
                          </span>
                          <span className="font-bold text-gray-900 text-sm text-right">
                            {apiCustomerData?.users?.[0]?.FullName ||
                              memberData?.member?.fullName ||
                              apiBookingData?.buyerName}
                          </span>
                        </div>
                      )}

                      {(memberData?.member?.identityCard ||
                        apiCustomerData?.users?.[0]?.CCCD) && (
                        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
                          <span className="text-gray-600 font-medium flex items-center gap-2">
                            <FaIdCard className="text-emerald-600" />
                            ID:
                          </span>
                          <span className="font-bold text-gray-900 text-sm">
                            {apiCustomerData?.users?.[0]?.CCCD ||
                              memberData?.member?.identityCard}
                          </span>
                        </div>
                      )}

                      {(memberData?.member?.phone ||
                        apiBookingData?.buyerPhone) && (
                        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
                          <span className="text-gray-600 font-medium flex items-center gap-2">
                            <FaPhone className="text-purple-600" />
                            Phone:
                          </span>
                          <span className="font-bold text-gray-900 text-sm">
                            {apiBookingData?.buyerPhone ||
                              memberData?.member?.phone}
                          </span>
                        </div>
                      )}

                      {(memberData?.member?.email ||
                        apiCustomerData?.users?.[0]?.Email) && (
                        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
                          <span className="text-gray-600 font-medium flex items-center gap-2">
                            <FaEnvelope className="text-yellow-600" />
                            Email:
                          </span>
                          <span className="font-bold text-gray-900 text-xs text-right break-all">
                            {apiCustomerData?.users?.[0]?.Email ||
                              memberData?.member?.email}
                          </span>
                        </div>
                      )}

                      {(memberData?.member?.score !== undefined ||
                        apiCustomerData?.users?.[0]?.ScoreBalance !==
                          undefined) && (
                        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100">
                          <span className="text-gray-600 font-medium flex items-center gap-2">
                            <FaStar className="text-orange-600" />
                            Points:
                          </span>
                          <span className="font-bold text-green-600 flex items-center gap-1">
                            <FaFire className="text-orange-500" />
                            {apiCustomerData?.users?.[0]?.ScoreBalance ||
                              memberData?.member?.score ||
                              0}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
              </div>

              {/* Action Buttons */}
              <div className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-200">
                <div className="space-y-3">
                  {paymentStatus === "error" ? (
                    <>
                      <Button
                        onClick={handleTryAgain}
                        className="w-full font-medium"
                        size="large"
                        icon={status.btnIcon}
                        color="orange"
                        variant="solid"
                      >
                        {status.btn}
                      </Button>
                      <Button
                        onClick={handleClose}
                        className="w-full font-medium"
                        size="large"
                        icon={<FaX />}
                        danger
                      >
                        Close
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleNewTicket}
                      className="w-full font-medium"
                      size="large"
                      icon={status.btnIcon}
                      type="primary"
                    >
                      {status.btn}
                    </Button>
                  )}

                  {paymentStatus === "succeeded" && (
                    <Link
                      to={`/staff/ticket-selling/view-ticket/${bookingData?.bookingId}`}
                      className="block"
                    >
                      <Button
                        className="w-full font-medium"
                        color="primary"
                        variant="outlined"
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
      </div>
    </div>
  );
};

export default TicketInformation;
