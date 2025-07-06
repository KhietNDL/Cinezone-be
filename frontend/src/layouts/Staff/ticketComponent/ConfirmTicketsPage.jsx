import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Tag, Spin, message, Switch } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiFilmAiFill } from "react-icons/ri";
import { FaMoneyBillWave, FaIdCard, FaUser, FaPhone, FaExchangeAlt } from "react-icons/fa";
import { FaCalendarDays, FaLocationDot, FaCouch, FaFire, FaStar, FaX } from "react-icons/fa6";
import { IoTime, IoSearch, IoAddOutline } from "react-icons/io5";
import { IoMdCash } from "react-icons/io";
import { FiLoader } from "react-icons/fi";
import vnpay from "../../../assets/vnpay-seeklogo.png";
import momo from "../../../assets/momo-seeklogo.png";
import zalopay from '../../../assets/zalopay-seeklogo.svg';
import {
  getMovieById, getUserByEmail, getUserByCCCD, getUserByPhone, convertScoreToMoney, cancelBookingById,
  checkPromotion, createBookingHold, createMomoPayment, createCashPayment, confirmBooking
} from "../../../services/APIForStaff/API";
import { useAuth } from "../../../context/AuthContext";
import { useDispatch, useSelector } from 'react-redux';
import {
  setCompleteBooking,
  resetBooking
} from '../../../redux/features/sellingSlice'
import {
  setMember,
  setMemberChecked,
  resetMember
} from '../../../redux/features/memberSlice'

const formatPrice = (price) => {
  return price?.toLocaleString('vi-VN');
};

const getPointsForSeat = (seatType) => {
  switch (seatType) {
    case 'vip': return 150;
    case 'couple': return 250;
    default: return 90; // normal
  }
};

const ConfirmTicketsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bookingData = useSelector((state) => state.selling);
  const { member, memberChecked } = useSelector((state) => state.member);

  const [discount, setDiscount] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [movieInfo, setMovieInfo] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!bookingData?.selectedMovie) {
      navigate("/staff/ticket-selling");
      return;
    }

    const loadMovie = async () => {
      try {
        const res = await getMovieById(bookingData.selectedMovie.MovieId);
        setMovieInfo(res.data || bookingData.selectedMovie);
      } catch {
        setMovieInfo(bookingData.selectedMovie);
      }
    };
    loadMovie();
  }, [bookingData, navigate]);

  const handleMemberSearch = async (searchValue) => {
    try {
      if (!searchValue.trim()) {
        dispatch(resetMember());
        setDiscount(null);
        return toast.error("Please enter information");
      }

      setIsSearching(true);
      let res = null;

      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(searchValue)) {
        res = await getUserByEmail(searchValue);
      }
      else if (/^0\d{9,10}$/.test(searchValue)) {
        res = await getUserByPhone(searchValue);
      }
      else if (/^\d{9,12}$/.test(searchValue)) {
        res = await getUserByCCCD(searchValue);
      }
      else {
        throw new Error("Invalid Email/Phone/ID");
      }

      const user = res.data?.user || res.user || res.data;
      if (!user?.UserId) throw new Error("Member not found");

      const memberData = {
        id: user.UserId,
        fullName: user.FullName || "Not updated",
        phone: user.PhoneNumber || user.Phone || "Not updated",
        identityCard: user.CCCD || user.IdentityCard || "Not updated",
        score: user.ScoreBalance || user.Score,
        email: user.Email || searchValue
      };

      dispatch(setMember(memberData));
      dispatch(setMemberChecked(true));
      toast.success("Member found!");
    } catch (error) {
      dispatch(resetMember());
      toast.error(error.message || "Search error");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddPromotion = async (promotionCode, setFieldValue) => {
    try {
      if (!promotionCode?.trim()) {
        toast.error("Please enter a promotion code");
        return;
      }

      const res = await checkPromotion(promotionCode);
      if (!res.promotions?.length) {
        throw new Error("Invalid promotion code");
      }

      const promotion = res.promotions[0];
      const now = new Date();
      const start = new Date(promotion.StartTime);
      const end = new Date(promotion.EndTime);

      if (now < start) {
        throw new Error("Promotion not yet valid");
      }
      if (now > end) {
        throw new Error("Promotion has expired");
      }

      setDiscount(promotion.DiscountValue);
      toast.success(`Successfully applied ${promotion.DiscountValue}% discount`);
    } catch (error) {
      setDiscount(null);
      setFieldValue("promotionCode", "");
      toast.error(error.message);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);

      // Validate form
      await validationSchema.validate(values, { abortEarly: false });

      // Check booking data
      if (!bookingData?.selectedSeats?.length || !bookingData.showtimeId) {
        throw new Error("Invalid ticket data, please select again");
      }

      // Prepare data
      const userId = memberChecked ? member?.id : user?.userId || user?.id;
      if (!userId) throw new Error("Could not determine user ID");

      const promotionTitle = values.promotionCode && values.convertToTicket === "Disagree"
        ? values.promotionCode
        : "";

      // Calculate points needed (1k = 1 point)
      let PointsToUse = 0;
      if (memberChecked && values.convertToTicket === "Agree") {
        PointsToUse = bookingData.selectedSeats.reduce((total, seatNumber) => {
          const seat = bookingData.seatData.find(s => s.seatNumber === seatNumber);
          if (!seat) return total;
          return total + getPointsForSeat(seat.type);
        }, 0);

        // Check if member has enough points
        if (member.score < PointsToUse) {
          throw new Error(`Not enough points. Needed: ${PointsToUse}, Available: ${member.score}`);
        }
      }

      // const PointsToUse = memberChecked && values.convertToTicket === "Agree"
      //   ? bookingData.selectedSeats.reduce((total, seatNumber) => {
      //     const seat = bookingData.seatData.find(s => s.seatNumber === seatNumber);
      //     return seat ? total + getPointsForSeat(seat.type) : total;
      //   }, 0)
      //   : 0;

      // Get seat IDs
      const seatIds = bookingData.selectedSeats.map(seat => {
        const seatData = bookingData.seatData.find(s => s.seatNumber === seat);
        if (!seatData?.seatId) {
          throw new Error(`Missing seat ID for seat ${seat}`);
        }
        return seatData.seatId;
      });

      // Create booking hold
      const bookingRes = await createBookingHold(
        userId,
        bookingData.showtimeId,
        seatIds,
        promotionTitle,
        PointsToUse
      );

      if (!bookingRes?.bookingId) {
        throw new Error("Failed to create booking");
      }

      // Calculate final amount
      let finalAmount = bookingData.totalPrice;
      if (memberChecked && values.convertToTicket === "Disagree" && discount) {
        finalAmount = Math.round(bookingData.totalPrice * (1 - discount / 100));
      } else if (memberChecked && values.convertToTicket === "Agree") {
        finalAmount = bookingData.totalPrice; // Fully covered by points
      }

      // Prepare complete booking data
      const completeBooking = {
        ...bookingData,
        bookingId: bookingRes.bookingId,
        memberInfo: memberChecked ? member : null,
        paymentMethod: values.paymentMethod,
        amountPaid: finalAmount,
        promotionTitle,
        isConfirmed: values.paymentMethod === "Cash",
        discount,
        pointsUsed: PointsToUse,
        seatDetails: bookingData.selectedSeats.map(seat => {
          const seatData = bookingData.seatData.find(s => s.seatNumber === seat);
          return {
            seatNumber: seat,
            type: seatData?.type || 'normal',
            price: seatData?.price || 90000,
            points: getPointsForSeat(seatData?.type)
          }
        })
      };

      // Update Redux state
      dispatch(setCompleteBooking(completeBooking));

      // Process payment
      if (values.paymentMethod === "Cash") {
        await createCashPayment(bookingRes.bookingId, finalAmount, `CASH-${Date.now()}`);
        await confirmBooking(bookingRes.bookingId);
        toast.success("Cash payment successful!");
        navigate("/staff/ticket-selling/ticket-infomation");
      }
      else if (values.paymentMethod === "Momo") {
        console.log("Processing Momo payment...");
        setIsRedirecting(true);

        try {
          const momoRes = await createMomoPayment(
            bookingRes.bookingId,
            finalAmount,
            `${window.location.origin}/staff/ticket-selling/ticket-infomation`,
          );

          console.log("Momo payment response:", momoRes);

          const payUrl = momoRes?.payUrl || momoRes?.data?.payUrl;

          if (!payUrl) {
            console.error("No pay URL received:", momoRes);
            setIsRedirecting(false);
            throw new Error("Did not receive payment URL from Momo");
          }

          console.log("Redirecting to:", payUrl);
          window.location.href = payUrl;
        } catch (error) {
          console.error("Momo payment error:", error);
          setIsRedirecting(false);
          throw error;
        }

      } else if (values.paymentMethod === "VNPay") {
        throw new Error("VNPay payment method not yet supported");

      } else if (values.paymentMethod === "ZaloPay") {
        throw new Error("ZaloPay payment method not yet supported");

      } else {
        throw new Error("Invalid payment method");
      }

    } catch (error) {
      console.error("Booking error:", error);
      if (error.inner) {
        error.inner.forEach(e => toast.error(`${e.path}: ${e.message}`));
      } else {
        toast.error(error.message || "Error processing booking");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    try {
      if (bookingData?.bookingId) {
        await cancelBookingById(bookingData.bookingId);
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      toast.error("Failed to cancel booking");
    }
    dispatch(resetBooking());
    dispatch(resetMember());
    navigate("/staff/ticket-selling");
  };

  const validationSchema = Yup.object().shape({
    convertToTicket: Yup.string().when([], {
      is: () => memberChecked,
      then: (schema) => schema
        .required("Please select point usage method")
        .oneOf(["Agree", "Disagree"], "Invalid method"),
      otherwise: (schema) => schema.notRequired()
    }),

    promotionCode: Yup.string().when(["convertToTicket"], {
      is: (convertToTicket) => memberChecked && convertToTicket === "Disagree",
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.test(
        "empty",
        "Cannot enter promotion code when not a member or converting points",
        val => !val || val.trim() === ""
      )
    }),

    paymentMethod: Yup.string()
      .required("Please select payment method")
      .oneOf(["Cash", "Momo", "VNPay", "ZaloPay"], "Invalid payment method"),
  });

  if (isRedirecting) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Redirecting to payment page..." />
      </div>
    );
  }

  if (!bookingData || !movieInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4 mx-auto w-full bg-white">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-4 text-[#9810FA] justify-between items-center flex flex-col sm:flex-row">
        Confirm Tickets
      </h1>

      <Formik
        initialValues={{
          memberSearch: "",
          convertToTicket: "Disagree",
          promotionCode: "",
          paymentMethod: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => {
          // Calculate points needed and final price
          let PointsToUse = 0;
          let finalPrice = bookingData.totalPrice;

          if (memberChecked && values.convertToTicket === "Agree") {
            PointsToUse = bookingData.selectedSeats.reduce((total, seatNumber) => {
              const seat = bookingData.seatData.find(s => s.seatNumber === seatNumber);
              if (!seat) return total;
              return total + getPointsForSeat(seat.type);
            }, 0);

            finalPrice = 0;
          }
          else if (memberChecked && values.convertToTicket === "Disagree" && discount) {
            finalPrice = Math.round(bookingData.totalPrice * (1 - discount / 100));
          }

          return (
            <Form>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Movie Info Section */}
                <div className="lg:w-2/3">
                  <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <RiFilmAiFill /> Ticket Information
                    </h2>

                    <div className="flex flex-col md:flex-row gap-6 items-center justify-center sm:items-start sm:justify-center">
                      <img
                        src={movieInfo.PosterImage}
                        alt={movieInfo.NameOfEnglish}
                        className="sm:h-[300px] object-cover rounded-lg shadow sm:w-[30%] w-[90%] h-auto"
                        onError={(e) => e.target.src = '/placeholder-poster.jpg'}
                      />

                      <div className="flex-1">
                        <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                          <div
                            className=" p-1 rounded-full shadow-md w-[110px] h-[25px] flex items-center justify-center"
                            style={{
                              background: "linear-gradient(90deg, #FACC15, #DDB61A, #DBBB3B, #CDB03D, #B1900C)",
                              color: "#FFF8A7"
                            }}
                          >
                            <p className="font-bold p-2 text-xs"
                              style={{
                                fontSize: "0.75rem",
                                lineHeight: "1rem",
                                textShadow: "0 1px 2px Orange"
                              }}>Now Showing</p>
                          </div>
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-md border border-purple-800 text-xs font-medium">
                            {bookingData.selectedVersion}
                          </span>
                        </div>

                        <div className="flex flex-col sm:items-start w-full py-4 items-center justify-center">
                          <h3 className="text-2xl font-bold">
                            {movieInfo.NameOfEnglish}
                          </h3>
                          <p className="text-xl text-gray-600 font-semibold text-center">
                            ({movieInfo.NameOfVietnamese})
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="flex items-center">
                            <div className="flex items-center gap-1 font-semibold w-[30%]">
                              <FaCalendarDays className="text-xl" /> Day:
                            </div>
                            <span className="text-gray-700">{bookingData.selectedDay}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="flex items-center gap-1 font-semibold w-[30%]">
                              <IoTime className="text-xl" /> Time:
                            </div>
                            <span className="text-gray-700">{bookingData.selectedTime}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="flex items-center gap-1 font-semibold w-[30%]">
                              <FaLocationDot className="text-xl" /> Room:
                            </div>
                            <span className="text-gray-700">{bookingData.room}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="flex items-center gap-1 font-semibold w-[30%]">
                              <FaCouch className="text-xl" /> Seats:
                            </div>
                            <span className="text-gray-700">
                              {bookingData.selectedSeats.join(", ")} - ({bookingData.selectedSeats.length} tickets)
                            </span>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h4 className="font-semibold mb-2">Price Details:</h4>
                          <div className="space-y-2">
                            {bookingData.selectedSeats.map((seat, index) => {
                              const seatInfo = bookingData.seatData.find(s => s.seatNumber === seat);
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
                              {formatPrice(bookingData.totalPrice)} VNĐ
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Section */}
                  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <FaMoneyBillWave /> Payment Method
                    </h2>

                    {/* Payment Options */}
                    <div className="mb-6">
                      <h3 className="font-semibold mb-3 text-xl">Select Payment method: <span className="text-red-500">*</span></h3>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          {
                            value: "Cash",
                            label: "Cash",
                            icon: <IoMdCash className="text-3xl mx-auto mb-2" />,
                            color: "bg-[#F3E8FF] border border-pink-300 ring-4 ring-pink-400 focus:ring-4"
                          },
                          {
                            value: "Momo",
                            label: "Momo Wallet",
                            icon: <img src={momo} alt="Momo" className="h-8 mx-auto mb-2" />,
                            color: "bg-[#F3E8FF] border border-pink-300 ring-4 ring-pink-400 focus:ring-4"
                          },
                          {
                            value: "VNPay",
                            label: "VNPay",
                            icon: <img src={vnpay} alt="VNPay" className="h-8 mx-auto mb-2" />,
                            color: "bg-[#F3E8FF] border border-pink-300 ring-4 ring-pink-400 focus:ring-4"
                          },
                          {
                            value: "ZaloPay",
                            label: "ZaloPay",
                            icon: <img src={zalopay} alt="ZaloPay" className="h-8 mx-auto mb-2" />,
                            color: "bg-[#F3E8FF] border border-pink-300 ring-4 ring-pink-400 focus:ring-4"
                          }
                        ].map((method) => (
                          <label
                            key={method.value}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${values.paymentMethod === method.value ? 'ring-4 ring-purple-500 ' + method.color : 'hover:border-purple-300 hover:ring-4 hover:ring-purple-500'}`}
                          >
                            <Field
                              type="radio"
                              name="paymentMethod"
                              value={method.value}
                              className="hidden"
                            />
                            {method.icon}
                            <div className="text-center font-medium">{method.label}</div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-white p-4 rounded-lg mb-6">
                      <h3 className="font-semibold mb-3 text-lg">Payment Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total ticket price:</span>
                          <span>{formatPrice(bookingData.totalPrice)} VNĐ</span>
                        </div>

                        {memberChecked && values.convertToTicket === "Disagree" && discount && (
                          <div className="flex justify-between">
                            <span>Discount {discount}%:</span>
                            <span className="text-green-600">
                              -{formatPrice(bookingData.totalPrice * discount / 100)} VNĐ
                            </span>
                          </div>
                        )}

                        {memberChecked && values.convertToTicket === "Agree" && (
                          <div className="flex justify-between">
                            <span>Points used:</span>
                            <span className="text-orange-500 flex items-center gap-1">
                              -{PointsToUse} <FaFire />
                            </span>
                          </div>
                        )}

                        <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                          <span>Total Amount:</span>
                          <span className="text-purple-600">
                            {formatPrice(finalPrice)} VNĐ
                          </span>
                        </div>

                        {memberChecked && values.convertToTicket === "Agree" && (
                          <div className="pt-2 mt-2 flex flex-col gap-2 text-md">
                            <div className="flex justify-between">
                              <span>Conversion rate:</span>
                              <span className="text-gray-600">1,000 VND = 1 point</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Points needed:</span>
                              <span className="text-orange-500 flex items-center gap-1">
                                <FaFire /> {PointsToUse} points
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Points available:</span>
                              <span className="text-green-600 flex items-center gap-1">
                                {/* <FaFire /> {member.score} points */}
                                <FaFire /> {member.score - (values.convertToTicket === "Agree" ? PointsToUse : 0)} points
                              </span>
                            </div>
                            {PointsToUse > member.score && (
                              <div className="text-red-500 text-sm">
                                Not enough points to complete this transaction
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-2 py-1 sm:px-4 sm:py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-500 transition flex items-center gap-2 cursor-pointer
                      hover:text-white "
                      >
                        <FaX /> Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !values.paymentMethod ||
                          (memberChecked && values.convertToTicket === "Agree" && PointsToUse > member.score)}
                        className="px-6 py-2 border-2 border-purple-600 bg-purple-600 text-white rounded-lg hover:bg-white hover:text-purple-600
                       disabled:bg-gray-400 disabled:border-gray-400 disabled:text-white transition flex items-center gap-2 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckOutlined />
                            Confirm Payment
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Summary Section */}
                <div className="lg:w-1/3">
                  <div className="bg-white rounded-lg shadow-md p-6 sticky top-4 border border-gray-300">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-1"><FaUser /> Member</h2>
                    <div className="flex gap-3 items-center justify-center">
                      <Field
                        name="memberSearch"
                        type="text"
                        placeholder="Email / Phone / ID"
                        className="flex-1 border border-gray-300 rounded-4xl px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => handleMemberSearch(values.memberSearch)}
                        disabled={isSearching}
                        className="bg-purple-600 text-white px-4 py-2 rounded-4xl hover:bg-purple-700 disabled:bg-gray-400 flex items-center gap-2 cursor-pointer"
                      >
                        {isSearching ? (
                          <>
                            <FiLoader className="animate-spin h-4 w-4 text-white" /> Checking...
                          </>
                        ) : (
                          <>
                            <IoSearch className="text-xl" /> Check
                          </>
                        )}
                      </button>
                    </div>

                    {/* Member Info */}
                    {memberChecked && member && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-300">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <p className="text-gray-600 flex items-center gap-2">
                              <FaIdCard /> Identity card:
                            </p>
                            <p className="font-medium">{member.identityCard}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-gray-600 flex items-center gap-2">
                              <FaUser /> Full Name:
                            </p>
                            <p className="font-medium">{member.fullName}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-gray-600 flex items-center gap-2">
                              <FaPhone /> Phone:
                            </p>
                            <p className="font-medium">{member.phone}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-gray-600 flex items-center gap-2">
                              <FaStar /> Points:
                            </p>
                            <p className="font-medium flex items-center gap-1 text-green-600"><FaFire /> {member.score}</p>
                          </div>
                        </div>

                        {/* Convert Points */}
                        {memberChecked && (
                          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                            <label className="text-gray-700 flex items-center gap-2 sm:w-[80%] w-full ">
                              <FaExchangeAlt /> Convert points to tickets:
                              <span className="text-red-500">*</span>
                            </label>
                            <Field name="convertToTicket">
                              {({ field }) => (
                                <Switch
                                  style={{
                                    width: "100px"
                                  }}
                                  checked={field.value === "Agree"}
                                  onChange={(checked) => {
                                    setFieldValue('convertToTicket', checked ? "Agree" : "Disagree");
                                  }}
                                  checkedChildren="Agree"
                                  unCheckedChildren="Disagree"
                                />
                              )}
                            </Field>
                          </div>
                        )}

                        {/* Promotion Code */}
                        <div className="mt-4">
                          <label className="block text-gray-700 mb-2">
                            Promotion code:
                          </label>
                          <div className="flex gap-3 items-center justify-center">
                            <Field
                              name="promotionCode"
                              type="text"
                              disabled={values.convertToTicket === "Agree"}
                              placeholder="Enter promotion code"
                              className="flex-1 border border-gray-300 rounded-4xl px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddPromotion(values.promotionCode, setFieldValue)}
                              disabled={values.convertToTicket === "Agree" || !values.promotionCode}
                              className="bg-purple-600 text-white px-4 py-2 rounded-4xl hover:bg-purple-700 disabled:bg-gray-400 cursor-pointer flex items-center gap-1"
                            >
                              <IoAddOutline className="text-xl" /> Add
                            </button>
                          </div>
                          {discount && values.convertToTicket === "Disagree" && (
                            <p className="mt-2 text-green-600">
                              Applied {discount}% discount
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ConfirmTicketsPage;