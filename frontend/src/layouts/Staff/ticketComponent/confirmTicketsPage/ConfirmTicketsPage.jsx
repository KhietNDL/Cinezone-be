import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiFilmAiFill } from "react-icons/ri";
import {
  FaMoneyBillWave,
  FaIdCard,
  FaUser,
  FaPhone,
  FaExchangeAlt,
} from "react-icons/fa";
import {
  FaCalendarDays,
  FaLocationDot,
  FaCouch,
  FaFire,
  FaStar,
  FaX,
} from "react-icons/fa6";
import { BiSolidDiscount } from "react-icons/bi";
import { IoTime, IoSearch, IoAddOutline } from "react-icons/io5";
import { FiLoader } from "react-icons/fi";
import {
  getMovieById,
  cancelBookingById,
  checkPromotion,
  createBookingHold,
  checkMemberShip,
  getUserInfo,
} from "../../../../services/APIForStaff/API";
import { useAuth } from "../../../../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import {
  setCompleteBooking,
  resetBooking,
  setPaymentId,
  setStripeClientSecret,
} from "../../../../redux/features/sellingSlice";
import {
  setMember,
  setMemberChecked,
  resetMember,
} from "../../../../redux/features/memberSlice";
import { Button, Spin, Switch } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Formik, Form, Field } from "formik";
import VersionCard from "../../component/VersionCard";
import PaymentMethod from "../../component/PaymentMethod";
import { processPayment } from "../../../../hooks/useProcessPayment";
import MemberRank from "../../component/MemberRank";
import BackButton from "../../component/BackButton";

const formatPrice = (price) => price?.toLocaleString("vi-VN");

// Sửa hàm calculatePointsAndPrice để cộng dồn DiscountTicket và discount (promotion)
const calculatePointsAndPrice = (
  selectedSeats,
  seatData,
  memberChecked,
  convertToTicket,
  discount,
  totalPrice,
  memberScore,
  discountTicket
) => {
  let PointsToUse = 0;
  let finalPrice = totalPrice;
  let membershipDiscountAmount = 0;
  let promotionDiscountAmount = 0;

  if (memberChecked && convertToTicket === "Agree") {
    const totalAmount = selectedSeats.reduce((total, seatNumber) => {
      const seat = seatData.find((s) => s.seatNumber === seatNumber);
      return total + (seat?.price || 0);
    }, 0);

    const pointsOfAmount = Math.floor(totalAmount / 1000);
    if (memberScore >= pointsOfAmount) {
      PointsToUse = pointsOfAmount;
      finalPrice = totalAmount - PointsToUse * 1000;
    } else {
      PointsToUse = 0;
      finalPrice = totalAmount;
    }
  } else {
    // Áp dụng giảm giá thành viên trước nếu có
    if (memberChecked && discountTicket && Number(discountTicket) > 0) {
      membershipDiscountAmount = Math.round(
        (finalPrice * Number(discountTicket)) / 100
      );
      finalPrice = finalPrice - membershipDiscountAmount;
    }
    // Sau đó áp dụng tiếp mã khuyến mãi nếu có
    if (discount && convertToTicket === "Disagree") {
      promotionDiscountAmount = Math.round(
        (finalPrice * Number(discount)) / 100
      );
      finalPrice = finalPrice - promotionDiscountAmount;
    }
  }

  return {
    PointsToUse,
    finalPrice,
    membershipDiscountAmount,
    promotionDiscountAmount,
  };
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
        res = await getUserInfo("email", searchValue);
      } else if (/^0\d{9,10}$/.test(searchValue)) {
        res = await getUserInfo("phone", searchValue);
      } else if (/^\d{9,12}$/.test(searchValue)) {
        res = await getUserInfo("cccd", searchValue);
      } else if (searchValue.length >= 6) {
        res = await getUserInfo("name", searchValue);
      } else {
        throw new Error("Invalid Email/Phone/ID/Full Name");
      }

      const user = res?.users?.[0] || res?.data?.users?.[0];
      const memberShip = await checkMemberShip(user?.UserId || user?.id);

      if (!user?.UserId) throw new Error("Member not found");

      const memberData = {
        id: user.UserId,
        fullName: user.FullName || "Not updated",
        phone: user.PhoneNumber || user.Phone || "Not updated",
        identityCard: user.CCCD || user.IdentityCard || "Not updated",
        score: user.ScoreBalance || user.Score,
        email: user.Email || searchValue,
        rank: memberShip?.membership?.MembershipName,
        pointsMemberShip: memberShip?.membership?.TotalAccumulatedPoints,
        discountTicket: memberShip?.membership?.DiscountTicket,
      };

      dispatch(setMember(memberData));
      dispatch(setMemberChecked(true));

      if (memberData.discountTicket && Number(memberData.discountTicket) > 0) {
        toast.success(
          `Member found! Applied membership discount (${memberData.discountTicket}%)`
        );
      } else {
        setDiscount(null);
        toast.success("Member found!");
      }
    } catch (error) {
      dispatch(resetMember());
      setDiscount(null);
      toast.error(error || "Search error");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddPromotion = useCallback(
    async (promotionCode, setFieldValue) => {
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
        if (now < new Date(promotion.StartTime))
          throw new Error("Promotion not yet valid");
        if (now > new Date(promotion.EndTime))
          throw new Error("Promotion has expired");

        setDiscount(promotion.DiscountValue);
        toast.success(
          `Successfully applied ${promotion.DiscountValue}% discount`
        );
      } catch (error) {
        setDiscount(null);
        setFieldValue("promotionCode", "");
        toast.error(error);
      }
    },
    [setDiscount]
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);

      await validationSchema.validate(values, { abortEarly: false });

      if (!bookingData?.selectedSeats?.length || !bookingData.showtimeId) {
        throw new Error("Invalid ticket data, please select again");
      }

      const userId = memberChecked ? member?.id : user?.userId || user?.id;
      if (!userId) throw new Error("Could not determine user ID");

      const promotionTitle =
        values.promotionCode && values.convertToTicket === "Disagree"
          ? values.promotionCode
          : "";

      const discountTicket =
        memberChecked && member && member.discountTicket
          ? Number(member.discountTicket)
          : 0;

      const { PointsToUse, finalPrice } = calculatePointsAndPrice(
        bookingData.selectedSeats,
        bookingData.seatData,
        memberChecked,
        values.convertToTicket,
        discount,
        bookingData.totalPrice,
        member?.score || 0,
        discountTicket
      );

      if (
        values.convertToTicket === "Agree" &&
        memberChecked &&
        PointsToUse > (member?.score || 0)
      ) {
        throw new Error("Not enough points to complete this transaction");
      }

      const seatIds = bookingData.selectedSeats.map((seat) => {
        const seatData = bookingData.seatData.find(
          (s) => s.seatNumber === seat
        );
        if (!seatData?.seatId) {
          throw new Error(`Missing seat ID for seat ${seat}`);
        }
        return seatData.seatId;
      });

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

      const completeBooking = {
        ...bookingData,
        bookingId: bookingRes.bookingId,
        memberInfo: memberChecked ? member : null,
        paymentMethod: values.paymentMethod,
        amountPaid: finalPrice,
        promotionTitle,
        isConfirmed: values.paymentMethod === "Cash",
        discount,
        pointsUsed: PointsToUse,
        seatDetails: bookingData.selectedSeats.map((seat) => {
          const seatData = bookingData.seatData.find(
            (s) => s.seatNumber === seat
          );
          return {
            seatNumber: seat,
            type: seatData?.type || "normal",
            price: seatData?.price || 90000,
          };
        }),
      };

      dispatch(setCompleteBooking(completeBooking));

      let successUrl = `${window.location.origin}/staff/ticket-selling/ticket-information`;

      if (values.paymentMethod === "Cash") {
        successUrl = "/staff/ticket-selling/ticket-information";
      } else if (values.paymentMethod === "Stripe") {
        successUrl = "/staff/ticket-selling/waiting-payment";
      }

      const paymentResult = await processPayment({
        paymentMethod: values.paymentMethod,
        orderId: bookingRes.bookingId,
        amount: finalPrice,
        type: "ticket",
        cardType:
          values.paymentMethod === "Stripe" ? values.cardType : undefined,
        navigate,
        setIsRedirecting,
        successUrl,
      });

      if (
        values.paymentMethod === "Stripe" &&
        paymentResult?.data?.clientSecret
      ) {
        dispatch(setStripeClientSecret(paymentResult.data));
      }

      if (
        (values.paymentMethod && paymentResult?.data?.paymentId) ||
        paymentResult?.data?.payment?.PaymentId
      ) {
        dispatch(
          setPaymentId(
            paymentResult.data.paymentId || paymentResult.data.payment.PaymentId
          )
        );
      }
    } catch (error) {
      console.error("Booking error:", error);

      // Handle specific error messages from backend
      const errorMessage =
        error?.response?.data?.message || error?.message || error;

      if (typeof errorMessage === "string") {
        // Check for specific error types
        if (errorMessage.toLowerCase().includes("seats must be adjacent")) {
          toast.error(
            "Ghế phải được chọn liền kề nhau (ngang hoặc dọc). Vui lòng chọn lại ghế!",
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        } else if (
          errorMessage.toLowerCase().includes("seat") &&
          errorMessage.toLowerCase().includes("already")
        ) {
          toast.error("Một số ghế đã được đặt. Vui lòng chọn ghế khác!", {
            position: "top-right",
            autoClose: 4000,
          });
        } else if (errorMessage.toLowerCase().includes("not enough points")) {
          toast.error("Không đủ điểm để thực hiện giao dịch này!", {
            position: "top-right",
            autoClose: 4000,
          });
        } else if (
          errorMessage.toLowerCase().includes("invalid ticket") ||
          errorMessage.toLowerCase().includes("ticket data")
        ) {
          toast.error("Dữ liệu vé không hợp lệ. Vui lòng chọn lại!", {
            position: "top-right",
            autoClose: 4000,
          });
        } else {
          // Generic error message
          toast.error(errorMessage || "Lỗi xử lý đặt vé. Vui lòng thử lại!", {
            position: "top-right",
            autoClose: 4000,
          });
        }
      } else {
        toast.error("Lỗi xử lý đặt vé. Vui lòng thử lại!", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = useCallback(async () => {
    try {
      if (bookingData?.bookingId) {
        await cancelBookingById(bookingData.bookingId);
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error || error);
      toast.error("Failed to cancel booking");
    }
    dispatch(resetBooking());
    dispatch(resetMember());
    navigate("/staff/ticket-selling");
  }, [bookingData?.bookingId, dispatch, navigate]);

  const validationSchema = Yup.object().shape({
    convertToTicket: Yup.string().when([], {
      is: () => memberChecked,
      then: (schema) =>
        schema
          .required("Please select point usage method")
          .oneOf(["Agree", "Disagree"], "Invalid method"),
      otherwise: (schema) => schema.notRequired(),
    }),

    promotionCode: Yup.string().when(["convertToTicket"], {
      is: (convertToTicket) => memberChecked && convertToTicket === "Disagree",
      then: (schema) => schema.optional(),
      otherwise: (schema) =>
        schema.test(
          "empty",
          "Cannot enter promotion code when not a member or converting points",
          (val) => !val || val.trim() === ""
        ),
    }),

    paymentMethod: Yup.string()
      .required("Please select payment method")
      .oneOf(
        ["Cash", "Momo", "VNPay", "ZaloPay", "Stripe"],
        "Invalid payment method"
      ),

    cardType: Yup.string().when("paymentMethod", {
      is: "Stripe",
      then: (schema) =>
        schema
          .required("Please select a card type")
          .oneOf(["visa", "mastercard", "jcb", "unionpay"]),
      otherwise: (schema) => schema.notRequired(),
    }),

    cashGiven: Yup.number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value
      )
      .when("paymentMethod", {
        is: (val) => val === "Cash",
        then: (schema) => schema.required("Please enter cash given"),
        otherwise: (schema) => schema.notRequired(),
      }),
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

  const discountTicket =
    memberChecked && member && member.discountTicket
      ? Number(member.discountTicket)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 bg-white shadow-md rounded-lg mb-6">
        <div className="flex flex-row items-center gap-3 lg:gap-4">
          <BackButton />
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <FaMoneyBillWave className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                Confirm Tickets
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Staff Portal - Ticket Selling
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto ">
        <Formik
          initialValues={{
            memberSearch: "",
            convertToTicket: "Disagree",
            promotionCode: "",
            paymentMethod: "",
            cardType: "",
            cashGiven: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formikProps) => (
            <ConfirmFormBody
              {...formikProps}
              bookingData={bookingData}
              memberChecked={memberChecked}
              member={member}
              discount={discount}
              discountTicket={discountTicket}
              isSearching={isSearching}
              handleMemberSearch={handleMemberSearch}
              handleAddPromotion={handleAddPromotion}
              handleCancel={handleCancel}
              movieInfo={movieInfo}
              setDiscount={setDiscount}
            />
          )}
        </Formik>
      </div>
    </div>
  );
};

// Component form body
function ConfirmFormBody({
  values,
  setFieldValue,
  isSubmitting,
  bookingData,
  memberChecked,
  member,
  discount,
  discountTicket,
  isSearching,
  handleMemberSearch,
  handleAddPromotion,
  handleCancel,
  movieInfo,
  errors,
  touched,
  setDiscount,
}) {
  const {
    PointsToUse,
    finalPrice,
    membershipDiscountAmount,
    promotionDiscountAmount,
  } = useMemo(
    () =>
      calculatePointsAndPrice(
        bookingData.selectedSeats,
        bookingData.seatData,
        memberChecked,
        values.convertToTicket,
        discount,
        bookingData.totalPrice,
        member?.score || 0,
        discountTicket
      ),
    [
      bookingData.selectedSeats,
      bookingData.seatData,
      memberChecked,
      values.convertToTicket,
      discount,
      bookingData.totalPrice,
      member?.score,
      discountTicket,
    ]
  );

  const cashChange =
    values.paymentMethod === "Cash" && values.cashGiven
      ? values.cashGiven - finalPrice
      : 0;

  return (
    <Form>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Movie Info */}
        <div className="lg:col-span-2">
          {/* MovieInfoSection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold flex items-center gap-3 text-gray-800">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <RiFilmAiFill className="text-purple-600 text-lg" />
                </div>
                Ticket Information
              </h2>
            </div>

            <div className="p-6 flex-1">
              {/* Top Section: Movie Poster + Movie Details */}
              <div className="flex flex-col lg:flex-row gap-6 mb-6">
                {/* Movie Poster */}
                <div className="flex-shrink-0">
                  <div className="relative group">
                    <img
                      src={movieInfo.PosterImage}
                      alt={movieInfo.NameOfEnglish}
                      className="w-full lg:w-52 h-98 object-cover rounded-xl shadow-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300"
                      onError={(e) =>
                        (e.target.src = "/placeholder-poster.jpg")
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {/* Movie Status Badge on Image */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500 text-white shadow-lg">
                        ● Now Showing
                      </span>
                    </div>
                    {/* Version Badge */}
                    <div className="absolute top-3 right-3">
                      <VersionCard
                        version={bookingData.selectedVersion}
                        readonly={true}
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Movie Information Details */}
                <div className="flex-1 space-y-4">
                  {/* Movie Title */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                      {movieInfo.NameOfEnglish}
                    </h3>
                    <p className="text-lg text-gray-600 font-medium">
                      ({movieInfo.NameOfVietnamese})
                    </p>
                  </div>

                  {/* Movie Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Director */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-purple-600 font-bold text-sm">
                            🎬
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Director
                          </p>
                          <p className="font-bold text-gray-900">
                            {movieInfo.Director || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IoTime className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Duration
                          </p>
                          <p className="font-bold text-gray-900">
                            {movieInfo.RunningTime || "N/A"} minutes
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Genre */}
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <span className="text-emerald-600 font-bold text-sm">
                            🎭
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 mb-2">
                            Genre
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {(movieInfo.Genre || "Action")
                              .split(",")
                              .map((genre, index) => (
                                <span
                                  key={index}
                                  clas
                                  className="font-bold text-gray-900"
                                  // className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200"
                                >
                                  {genre.trim()}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Age Rating */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <FaStar className="text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Rating
                          </p>
                          <p className="font-bold text-gray-900">
                            {movieInfo.AverageRating || "General"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Synopsis */}
                  {movieInfo.ContentSynopsis && (
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-100">
                      <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="text-gray-600">📝</span>
                        Synopsis
                      </h5>
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                        {movieInfo.ContentSynopsis}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Section: Booking Information */}
              <div className="mt-10">
                <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaCalendarDays className="text-blue-600" />
                  </div>
                  Booking Information
                </h4>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Date Card */}
                  <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaCalendarDays className="text-blue-600 text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Date
                        </p>
                        <p className="font-semibold text-gray-900">
                          {bookingData.selectedDay}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Time Card */}
                  <div className="bg-white rounded-lg p-4 border border-purple-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <IoTime className="text-purple-600 text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Time
                        </p>
                        <p className="font-semibold text-gray-900">
                          {bookingData.selectedTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Room Card */}
                  <div className="bg-white rounded-lg p-4 border border-emerald-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <FaLocationDot className="text-emerald-600 text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Room
                        </p>
                        <p className="font-semibold text-gray-900">
                          {bookingData.room}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tickets Card */}
                  <div className="bg-white rounded-lg p-4 border border-orange-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <FaCouch className="text-orange-600 text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Tickets
                        </p>
                        <p className="font-semibold text-gray-900">
                          {bookingData.selectedSeats.length} seats
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Member Search */}
        <div className="lg:col-span-1">
          {/* MemberSection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold flex items-center gap-3 text-gray-800">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaUser className="text-purple-600" />
                </div>
                Member Search
              </h2>
            </div>

            <div className="p-6 space-y-4 flex-1">
              {/* Search Input */}
              <div className="flex gap-3">
                <Field
                  name="memberSearch"
                  type="text"
                  placeholder="Email / Phone / ID / Name"
                  className="flex-1 focus:outline-none border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-0 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-purple-400"
                />
                <Button
                  type="primary"
                  onClick={() => handleMemberSearch(values.memberSearch)}
                  loading={isSearching}
                  icon={<IoSearch />}
                  style={{ height: "40px" }}
                  className="bg-purple-600 hover:bg-purple-700 border-purple-600 hover:border-purple-700 flex items-center justify-center"
                >
                  {isSearching ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>

              {/* Member Information Display */}
              {memberChecked && member && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckOutlined className="text-green-600 text-xs" />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm">
                      Member Found
                    </h3>
                  </div>

                  {/* Member Details Grid */}
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-xs font-medium flex items-center gap-2">
                          <FaIdCard className="text-purple-600" />
                          Identity Card
                        </span>
                        <span className="font-semibold text-gray-800 text-xs">
                          {member.identityCard}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-xs font-medium flex items-center gap-2">
                          <FaUser className="text-purple-600" />
                          Full Name
                        </span>
                        <span className="font-semibold text-gray-800 text-xs">
                          {member.fullName}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-xs font-medium flex items-center gap-2">
                          <FaPhone className="text-purple-600" />
                          Phone Number
                        </span>
                        <span className="font-semibold text-gray-800 text-xs">
                          {member.phone}
                        </span>
                      </div>
                    </div>

                    {/* Member Rank */}
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <MemberRank
                        rank={member.rank}
                        pointsMemberShip={member.pointsMemberShip}
                      />
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-xs font-medium flex items-center gap-2">
                          <FaStar className="text-purple-600" />
                          Available Points
                        </span>
                        <span
                          className={`font-semibold flex items-center gap-1 text-xs ${
                            member.score ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          <FaFire className="text-orange-500" />
                          {member.score || 0} pts
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Convert Points Section */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
                    <div className="flex items-center justify-between">
                      <label className="text-gray-700 flex items-center gap-2 font-medium text-sm">
                        <FaExchangeAlt className="text-purple-600" />
                        Use Points for Payment
                        <span className="text-red-500">*</span>
                      </label>
                      <Field name="convertToTicket">
                        {({ field }) => (
                          <Switch
                            checked={field.value === "Agree"}
                            onChange={(checked) => {
                              setFieldValue(
                                "convertToTicket",
                                checked ? "Agree" : "Disagree"
                              );
                            }}
                            checkedChildren="Yes"
                            unCheckedChildren="No"
                            className="bg-gray-300"
                          />
                        )}
                      </Field>
                    </div>
                    {values.convertToTicket === "Agree" && (
                      <div className="mt-2 p-2 bg-orange-50 rounded text-orange-700 text-xs">
                        💡 Rate: 1 point = 1,000 VNĐ
                      </div>
                    )}
                  </div>

                  {/* Promotion Code Section */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <label className="text-gray-700 mb-3 font-medium flex items-center gap-2 text-sm">
                      <BiSolidDiscount className="text-purple-600" />
                      Promotion Code
                    </label>
                    <div className="flex gap-2 w-full">
                      <Field
                        name="promotionCode"
                        type="text"
                        disabled={values.convertToTicket === "Agree"}
                        placeholder="Enter promotion code"
                        className="flex-1 focus:outline-none min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-0 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:text-gray-500 transition-all duration-200 hover:border-purple-400"
                      />
                      {!discount ? (
                        <Button
                          type="primary"
                          style={{ height: "40px" }}
                          onClick={() =>
                            handleAddPromotion(
                              values.promotionCode,
                              setFieldValue
                            )
                          }
                          disabled={
                            values.convertToTicket === "Agree" ||
                            !values.promotionCode
                          }
                          icon={<IoAddOutline />}
                          className="bg-purple-600 hover:bg-purple-700 border-purple-600 hover:border-purple-700 px-3 h-10 flex items-center justify-center flex-shrink-0"
                        >
                          Apply
                        </Button>
                      ) : (
                        <Button
                          type="default"
                          style={{ height: "40px" }}
                          danger
                          onClick={() => {
                            setDiscount(null);
                            setFieldValue("promotionCode", "");
                          }}
                          icon={<FaX />}
                          className="px-3 h-10 flex items-center justify-center flex-shrink-0"
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    {/* Discount Information */}
                    {discountTicket > 0 && (
                      <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <CheckOutlined className="text-white text-xs" />
                          </div>
                          <span className="text-blue-700 text-xs font-medium">
                            Membership discount: {discountTicket}% applied
                          </span>
                        </div>
                      </div>
                    )}

                    {discount && values.convertToTicket === "Disagree" && (
                      <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckOutlined className="text-white text-xs" />
                          </div>
                          <span className="text-green-700 text-xs font-medium">
                            Promotion discount: {discount}% applied
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full Width Payment Section */}
        <div className="lg:col-span-3">
          {/* PaymentMethodSection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
              <FaMoneyBillWave className="text-purple-600" /> Payment Method
            </h2>

            {/* PaymentOptions */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4 text-gray-800">
                Select Payment Method <span className="text-red-500">*</span>
              </h3>
              <PaymentMethod
                value={values.paymentMethod}
                onChange={(val) => setFieldValue("paymentMethod", val)}
                showCardType={values.paymentMethod === "Stripe"}
                cardType={values.cardType}
                onCardTypeChange={(val) => setFieldValue("cardType", val)}
                cardTypeError={
                  !values.cardType ? "Please select a card type" : ""
                }
              />
            </div>

            {/* Payment Summary */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <FaMoneyBillWave className="text-purple-600" /> Payment Summary
              </h3>

              {/* Seat Types & Pricing */}
              <div className="space-y-3 mb-4">
                {(() => {
                  // Group seats by price
                  const seatsByPrice = bookingData.selectedSeats.reduce(
                    (acc, seat) => {
                      const seatInfo = bookingData.seatData.find(
                        (s) => s.seatNumber === seat
                      );
                      const price = seatInfo?.price || 0;
                      const type = seatInfo?.type || "Standard";

                      if (!acc[price]) {
                        acc[price] = { seats: [], type, price };
                      }
                      acc[price].seats.push(seat);
                      return acc;
                    },
                    {}
                  );

                  return Object.values(seatsByPrice).map((group, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <FaCouch className="text-emerald-600" />
                        <div>
                          <span className="font-medium text-gray-800">
                            {group.type} Seat × {group.seats.length}
                          </span>
                          <p className="text-sm text-gray-600">
                            Seats: {group.seats.join(", ")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(group.price * group.seats.length)} VNĐ
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatPrice(group.price)} VNĐ each
                        </p>
                      </div>
                    </div>
                  ));
                })()}
              </div>

              {/* Discounts */}
              {membershipDiscountAmount > 0 && (
                <div className="flex justify-between p-2 bg-white rounded-lg mb-2">
                  <span className="text-gray-700">
                    Membership discount ({discountTicket}%):
                  </span>
                  <span className="text-blue-600 font-medium">
                    -{formatPrice(membershipDiscountAmount)} VNĐ
                  </span>
                </div>
              )}
              {promotionDiscountAmount > 0 && (
                <div className="flex justify-between p-2 bg-white rounded-lg mb-2">
                  <span className="text-gray-700">
                    Promotion code discount ({discount}%):
                  </span>
                  <span className="text-green-600 font-medium">
                    -{formatPrice(promotionDiscountAmount)} VNĐ
                  </span>
                </div>
              )}
              {memberChecked && values.convertToTicket === "Agree" && (
                <div className="flex justify-between p-2 bg-white rounded-lg mb-2">
                  <span className="text-gray-700">Points used:</span>
                  <span className="text-orange-500 font-medium flex items-center gap-1">
                    -{PointsToUse} <FaFire />
                  </span>
                </div>
              )}

              {/* Points conversion info */}
              {memberChecked && values.convertToTicket === "Agree" && (
                <div className="p-3 bg-orange-50 rounded-lg mb-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Conversion rate:</span>
                      <span className="text-gray-600">1,000 VNĐ = 1 point</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Points needed:</span>
                      <span className="text-orange-500 font-medium flex items-center gap-1">
                        <FaFire /> {Math.floor(bookingData.totalPrice / 1000)}{" "}
                        points
                      </span>
                    </div>
                    {(PointsToUse > member?.score || PointsToUse === 0) && (
                      <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded">
                        Not enough points to complete this transaction
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Total Amount */}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FaMoneyBillWave className="text-purple-600" />
                    </div>
                    <span className="font-bold text-xl text-gray-800">
                      Total Amount
                    </span>
                  </div>
                  <span className="text-purple-600 font-bold text-2xl">
                    {formatPrice(finalPrice)} VNĐ
                  </span>
                </div>
              </div>

              {/* Cash input for Cash payment */}
              {values.paymentMethod === "Cash" && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaMoneyBillWave className="text-blue-600 text-sm" />
                    </div>
                    <label className="font-semibold text-gray-800 text-sm">
                      Cash given by customer{" "}
                      <span className="text-red-500">*</span>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <Field
                        name="cashGiven"
                        type="number"
                        min={finalPrice}
                        placeholder={`Minimum: ${formatPrice(finalPrice)} VNĐ`}
                        className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-0 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-base font-medium transition-all duration-200 hover:border-purple-400 pr-12"
                        onChange={(e) =>
                          setFieldValue("cashGiven", Number(e.target.value))
                        }
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                        VNĐ
                      </div>
                    </div>

                    {errors?.cashGiven && touched?.cashGiven && (
                      <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                        <span className="text-red-500">⚠</span>
                        {errors.cashGiven}
                      </div>
                    )}

                    {values.cashGiven && values.cashGiven >= finalPrice && (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckOutlined className="text-white text-xs" />
                          </div>
                          <span className="text-green-700 font-medium text-sm">
                            Change:
                          </span>
                        </div>
                        <span className="text-green-800 font-bold text-lg">
                          {formatPrice(cashChange)} VNĐ
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ActionButtons */}
            <div className="flex justify-end gap-4">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                disabled={
                  isSubmitting ||
                  !values.paymentMethod ||
                  (memberChecked &&
                    values.convertToTicket === "Agree" &&
                    PointsToUse > member.score)
                }
                loading={isSubmitting}
                icon={<CheckOutlined />}
                className="bg-purple-600 hover:bg-purple-700 border-purple-600 hover:border-purple-700 px-8"
              >
                {isSubmitting ? "Processing..." : "Confirm Payment"}
              </Button>
              <Button
                type="default"
                danger
                size="large"
                onClick={handleCancel}
                icon={<FaX />}
                className="px-6"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}

export default ConfirmTicketsPage;
