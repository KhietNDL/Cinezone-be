import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Tag, Spin, message } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiFilmAiFill, RiMovie2AiFill, RiDiscountPercentFill } from "react-icons/ri";
import { FaMoneyBillWave, FaIdCard, FaUser, FaPhone, FaExchangeAlt } from "react-icons/fa";
import { FaCalendarDays, FaLocationDot, FaCouch, FaFire } from "react-icons/fa6";
import { IoTime } from "react-icons/io5";
import { IoMdCash } from "react-icons/io";
import vnpay from "../../../assets/vnpay-seeklogo.png";
import momo from "../../../assets/momo-seeklogo.png";
import zalopay from '../../../assets/zalopay-seeklogo.svg';
import {
  getMovieById, getUserByEmail, getUserByCCCD, getUserByPhone,
  checkPromotion, createBookingHold, createMomoPayment, createCashPayment, confirmBooking
} from "../../../services/APIForStaff/API";
import { useAuth } from "../../../context/AuthContext";

const formatPrice = (price) => {
  return price?.toLocaleString('vi-VN');
};

const ConfirmTicketsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [discount, setDiscount] = useState(null);
  const [memberChecked, setMemberChecked] = useState(false);
  const [member, setMember] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [movieInfo, setMovieInfo] = useState(null);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Load booking data from localStorage
  // Modified useEffect to load data
  useEffect(() => {
    const loadBookingData = () => {
      const savedData = localStorage.getItem('currentBooking');
      if (!savedData) {
        // MOVED navigate INSIDE useEffect
        navigate("/staff/ticket-selling");
        return;
      }

      try {
        const parsedData = JSON.parse(savedData);
        setBookingData(parsedData);
      } catch (err) {
        // MOVED navigate INSIDE useEffect
        navigate("/staff/ticket-selling");
      }
    };

    loadBookingData();
  }, [navigate]); // Ensure navigate is in dependencies

  // Load movie info
  useEffect(() => {
    if (!bookingData?.movie) return;
    const loadMovie = async () => {
      try {
        const res = await getMovieById(bookingData.movie.MovieId);
        setMovieInfo(res.data || bookingData.movie);
      } catch {
        setMovieInfo(bookingData.movie);
      }
    };
    loadMovie();
  }, [bookingData]);

  // Load member data from localStorage
  useEffect(() => {
    const savedMember = localStorage.getItem('current_member');
    if (savedMember) {
      setMember(JSON.parse(savedMember));
      setMemberChecked(true);
    }
  }, []);

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
    console.log("=== SUBMIT STARTED ===");
    console.log("Form values:", values);
    console.log("Booking data:", bookingData);

    try {
      // 1. Validate form before processing
      console.log("Validating form...");
      await validationSchema.validate(values, { abortEarly: false });
      console.log("Form validation passed");

      // 2. Check booking data
      if (!bookingData?.selectedSeats?.length || !bookingData.showtimeId) {
        console.error("Invalid booking data:", {
          selectedSeats: bookingData?.selectedSeats,
          showtimeId: bookingData?.showtimeId
        });
        throw new Error("Invalid ticket data, please select again");
      }
      console.log("Booking data validation passed");

      // 3. Prepare data
      const userId = memberChecked ? member?.id : user?.userId || user?.id;
      console.log("User ID:", userId);

      if (!userId) {
        throw new Error("Could not determine user ID");
      }

      const promotionTitle = values.promotionCode && values.convertToTicket === "Disagree"
        ? values.promotionCode
        : "";
      console.log("Promotion title:", promotionTitle);

      // 4. Calculate final amount
      let finalAmount = bookingData.totalPrice;
      let usedPoints = 0;

      if (memberChecked) {
        if (values.convertToTicket === "Agree") {
          usedPoints = bookingData.selectedSeats.length * 10000;
          console.log("Used points:", usedPoints, "Member score:", member.score);

          if (member.score < usedPoints) {
            throw new Error(`Not enough points. Need ${usedPoints} points, you have ${member.score} points`);
          }
          finalAmount = 0;
        } else if (values.convertToTicket === "Disagree" && discount) {
          finalAmount = bookingData.totalPrice * (1 - discount / 100);
        }
      }

      console.log("Final amount:", finalAmount);

      // 5. Create booking hold
      console.log("Creating booking hold...");
      const seatIds = bookingData.selectedSeats.map(seat => {
        const seatData = bookingData.seatData.find(s => s.seatNumber === seat);
        return seatData?.seatId || seat;
      });

      console.log("Seat IDs:", seatIds);

      const bookingRes = await createBookingHold(
        userId,
        bookingData.showtimeId,
        seatIds,
        [], // combo items - empty array
        promotionTitle
      );

      console.log("Booking hold response:", bookingRes);

      if (!bookingRes?.bookingId) {
        console.error("Booking creation failed:", bookingRes);
        throw new Error("Failed to create booking");
      }

      // 6. Save complete booking data
      const completeBooking = {
        ...bookingData,
        bookingId: bookingRes.bookingId,
        memberInfo: memberChecked ? member : null,
        paymentMethod: values.paymentMethod,
        amountPaid: finalAmount,
        promotionTitle,
        isConfirmed: values.paymentMethod === "Cash",
        discount,
        usedPoints
      };
      localStorage.setItem('currentBooking', JSON.stringify(completeBooking));
      console.log("Complete booking saved:", completeBooking);

      // 7. Process payment based on method
      console.log("Processing payment method:", values.paymentMethod);

      if (values.paymentMethod === "Cash") {
        console.log("Processing cash payment...");

        const cashRes = await createCashPayment(
          bookingRes.bookingId,
          finalAmount,
          `CASH-${Date.now()}`
        );

        console.log("Cash payment response:", cashRes);
        const confirmRes = await confirmBooking(bookingRes.bookingId);
        console.log("Confirm booking response:", confirmRes);
        // Don't throw error if cashRes.success doesn't exist
        // Because API might not return success field
        setIsBookingConfirmed(true);
        await confirmBooking(bookingRes.bookingId);
        toast.success("Cash payment successful!");

        setTimeout(() => {
          console.log("Redirecting to ticket information...");
          navigate("/staff/ticket-selling/ticket-infomation");
        }, 1000);

      } else if (values.paymentMethod === "Momo") {
        console.log("Processing Momo payment...");
        setIsRedirecting(true);

        try {
          const momoRes = await createMomoPayment(
            bookingRes.bookingId,
            finalAmount,
            `${window.location.origin}/staff/ticket-selling/ticket-infomation`,
            userId
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
        console.log("VNPay not implemented yet");
        throw new Error("VNPay payment method not yet supported");

      } else if (values.paymentMethod === "ZaloPay") {
        console.log("ZaloPay not implemented yet");
        throw new Error("ZaloPay payment method not yet supported");

      } else {
        throw new Error("Invalid payment method");
      }

    } catch (error) {
      console.error("=== PAYMENT ERROR ===");
      console.error("Error details:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);

      // Show detailed validation errors
      if (error.inner && Array.isArray(error.inner)) {
        console.error("Validation errors:", error.inner);
        error.inner.forEach(e => {
          console.error("Field error:", e.path, e.message);
          toast.error(`${e.path}: ${e.message}`);
        });
      } else {
        toast.error(error.message || "Error processing ticket booking");
      }

    } finally {
      console.log("=== SUBMIT FINISHED ===");
      setSubmitting(false);
    }
  };

  const handleMemberSearch = async (searchValue) => {
    try {
      if (!searchValue.trim()) {
        setMember(null);
        setMemberChecked(false);
        localStorage.removeItem('current_member');
        return toast.error("Please enter information");
      }

      setIsSearching(true);
      let res = null;

      // Determine search type
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
        score: user.score || 0,
        email: user.Email || searchValue
      };

      setMember(memberData);
      setMemberChecked(true);
      localStorage.setItem('current_member', JSON.stringify(memberData));
      toast.success("Member found!");
    } catch (error) {
      setMember(null);
      setMemberChecked(false);
      localStorage.removeItem('current_member');
      toast.error(error.message || "Search error");
    } finally {
      setIsSearching(false);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem('currentBooking');
    localStorage.removeItem('current_member');
    localStorage.removeItem('selectedSeats');
    navigate("/staff/ticket-selling");
  };

  // Modified validation schema for easier debugging
const validationSchema = Yup.object().shape({
  convertToTicket: Yup.string().when([], {
    is: () => memberChecked, // Only validate when memberChecked = true
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

  // Added debug function to test validation
  const debugFormValidation = async (values) => {
    console.log("=== DEBUGGING FORM VALIDATION ===");
    console.log("Form values:", values);
    console.log("Member checked:", memberChecked);
    console.log("Member data:", member);

    try {
      await validationSchema.validate(values, { abortEarly: false });
      console.log("✅ Validation passed");
      return true;
    } catch (error) {
      console.log("❌ Validation failed");
      console.log("Validation errors:", error.errors);
      if (error.inner) {
        error.inner.forEach(err => {
          console.log(`Field: ${err.path}, Error: ${err.message}`);
        });
      }
      return false;
    }
  };

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
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Confirm Tickets</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Movie Info Section */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <RiFilmAiFill /> Ticket Information
            </h2>

            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={movieInfo.PosterImage}
                alt={movieInfo.NameOfEnglish}
                className="w-40 h-56 object-cover rounded-lg shadow"
                onError={(e) => e.target.src = '/placeholder-poster.jpg'}
              />

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    Now Showing
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {bookingData.version}
                  </span>
                </div>

                <h3 className="text-2xl font-bold">
                  {movieInfo.NameOfEnglish}
                  <span className="text-lg text-gray-600 ml-2">
                    ({movieInfo.NameOfVietnamese})
                  </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <FaCalendarDays className="text-gray-500" />
                    <span>{bookingData.day}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IoTime className="text-gray-500" />
                    <span>{bookingData.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaLocationDot className="text-gray-500" />
                    <span>{bookingData.room}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCouch className="text-gray-500" />
                    <span>
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
                          <span>{formatPrice(seatInfo?.price || 0)} VND</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="text-green-600 font-bold text-xl">
                      {formatPrice(bookingData.totalPrice)} VND
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FaMoneyBillWave /> Payment Method
            </h2>

            <Formik
              initialValues={{
                memberSearch: "",
                convertToTicket: "",
                promotionCode: "",
                paymentMethod: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue, isSubmitting }) => {
                // Calculate final price
                let finalPrice = bookingData.totalPrice;
                let usedPoints = 0;
                let remainingPoints = member?.score || 0;

                if (memberChecked && values.convertToTicket === "Disagree" && discount) {
                  finalPrice = bookingData.totalPrice * (1 - discount / 100);
                }
                else if (memberChecked && values.convertToTicket === "Agree") {
                  usedPoints = bookingData.selectedSeats.length * 10000;
                  if (member.score >= usedPoints) {
                    finalPrice = 0;
                    remainingPoints = member.score - usedPoints;
                  }
                }

                return (
                  <Form>
                    {/* Member Search Section */}
                    <div className="mb-6">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <FaUser /> Member
                      </h3>
                      <div className="flex gap-3">
                        <Field
                          name="memberSearch"
                          type="text"
                          placeholder="Email/Phone/ID"
                          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => handleMemberSearch(values.memberSearch)}
                          disabled={isSearching}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center gap-2"
                        >
                          {isSearching ? (
                            <>
                              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Searching...
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              Search
                            </>
                          )}
                        </button>
                      </div>

                      {/* Member Info */}
                      {memberChecked && member && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-gray-600 flex items-center gap-2">
                                <FaIdCard /> ID:
                              </p>
                              <p className="font-medium">{member.identityCard}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 flex items-center gap-2">
                                <FaUser /> Full Name:
                              </p>
                              <p className="font-medium">{member.fullName}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 flex items-center gap-2">
                                <FaPhone /> Phone:
                              </p>
                              <p className="font-medium">{member.phone}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 flex items-center gap-2">
                                <FaFire /> Points:
                              </p>
                              <p className="font-medium">{member.score}</p>
                            </div>
                          </div>

                          {/* Convert Points */}
                          {memberChecked && (
                            <div className="mt-4">
                              <label className=" text-gray-700 mb-2 flex items-center gap-2">
                                <FaExchangeAlt /> Convert points to tickets:
                                <span className="text-red-500">*</span>
                              </label>
                              <div className="flex gap-4">
                                <label className="inline-flex items-center">
                                  <Field
                                    type="radio"
                                    name="convertToTicket"
                                    value="Agree"
                                    className="form-radio text-purple-600"
                                  />
                                  <span className="ml-2">Agree</span>
                                </label>
                                <label className="inline-flex items-center">
                                  <Field
                                    type="radio"
                                    name="convertToTicket"
                                    value="Disagree"
                                    className="form-radio text-purple-600"
                                  />
                                  <span className="ml-2">Disagree</span>
                                </label>
                              </div>
                            </div>
                          )}

                          {/* Promotion Code */}
                          <div className="mt-4">
                            <label className="block text-gray-700 mb-2">
                              Promotion code:
                            </label>
                            <div className="flex gap-3">
                              <Field
                                name="promotionCode"
                                type="text"
                                disabled={values.convertToTicket === "Agree"}
                                placeholder="Enter promotion code"
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddPromotion(values.promotionCode, setFieldValue)}
                                disabled={values.convertToTicket === "Agree" || !values.promotionCode}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
                              >
                                Apply
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

                    {/* Payment Options */}
                    <div className="mb-6">
                      <h3 className="font-semibold mb-3">Select payment method:</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          {
                            value: "Cash",
                            label: "Cash",
                            icon: <IoMdCash className="text-3xl mx-auto mb-2" />,
                            color: "bg-green-100 border-green-300"
                          },
                          {
                            value: "Momo",
                            label: "Momo Wallet",
                            icon: <img src={momo} alt="Momo" className="h-8 mx-auto mb-2" />,
                            color: "bg-pink-100 border-pink-300"
                          },
                          {
                            value: "VNPay",
                            label: "VNPay",
                            icon: <img src={vnpay} alt="VNPay" className="h-8 mx-auto mb-2" />,
                            color: "bg-blue-100 border-blue-300"
                          },
                          {
                            value: "ZaloPay",
                            label: "ZaloPay",
                            icon: <img src={zalopay} alt="ZaloPay" className="h-8 mx-auto mb-2" />,
                            color: "bg-cyan-100 border-cyan-300"
                          }
                        ].map((method) => (
                          <label
                            key={method.value}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${values.paymentMethod === method.value ? 'ring-2 ring-purple-500 ' + method.color : 'hover:border-purple-300'}`}
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
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h3 className="font-semibold mb-3">Payment Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total ticket price:</span>
                          <span>{formatPrice(bookingData.totalPrice)} VND</span>
                        </div>

                        {memberChecked && values.convertToTicket === "Disagree" && discount && (
                          <div className="flex justify-between">
                            <span>Discount {discount}%:</span>
                            <span className="text-green-600">
                              -{formatPrice(bookingData.totalPrice * discount / 100)} VND
                            </span>
                          </div>
                        )}

                        {memberChecked && values.convertToTicket === "Agree" && (
                          <div className="flex justify-between">
                            <span>Points used:</span>
                            <span className="text-orange-500">
                              -{formatPrice(usedPoints)} points
                            </span>
                          </div>
                        )}

                        <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                          <span>Amount due:</span>
                          <span className="text-purple-600">
                            {formatPrice(finalPrice)} VND
                          </span>
                        </div>

                        {memberChecked && values.convertToTicket === "Agree" && (
                          <div className="pt-2 mt-2 text-sm">
                            <div className="flex justify-between">
                              <span>Points used:</span>
                              <span className="text-orange-500">{usedPoints}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Points remaining:</span>
                              <span className="text-green-500">{remainingPoints}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !values.paymentMethod}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition flex items-center gap-2"
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
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Your Order</h2>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">{movieInfo.NameOfEnglish}</h3>
              <div className="text-gray-600 space-y-1">
                <p className="flex justify-between">
                  <span>Showtime:</span>
                  <span>{bookingData.day} - {bookingData.time}</span>
                </p>
                <p className="flex justify-between">
                  <span>Room:</span>
                  <span>{bookingData.room}</span>
                </p>
                <p className="flex justify-between">
                  <span>Seats:</span>
                  <span>{bookingData.selectedSeats.join(", ")}</span>
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Price Details</h3>
              <div className="space-y-2">
                {bookingData.selectedSeats.map((seat, index) => {
                  const seatInfo = bookingData.seatData.find(s => s.seatNumber === seat);
                  return (
                    <div key={index} className="flex justify-between">
                      <span>Seat {seat}:</span>
                      <span>{formatPrice(seatInfo?.price || 0)} VND</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-purple-600">
                    {formatPrice(bookingData.totalPrice)} VND
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmTicketsPage;