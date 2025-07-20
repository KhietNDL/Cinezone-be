import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiFilmAiFill } from "react-icons/ri";
import { FaMoneyBillWave, FaIdCard, FaUser, FaPhone, FaExchangeAlt } from "react-icons/fa";
import { FaCalendarDays, FaLocationDot, FaCouch, FaFire, FaStar, FaX } from "react-icons/fa6";
import { BiSolidDiscount } from "react-icons/bi";
import { IoTime, IoSearch, IoAddOutline } from "react-icons/io5";
import { IoMdCash } from "react-icons/io";
import { FiLoader } from "react-icons/fi";
import {
  getMovieById, getUserByEmail, getUserByCCCD, getUserByPhone, cancelBookingById,
  // checkPromotion, createBookingHold, createMomoPayment, createCashPayment, confirmBooking
  checkPromotion, createBookingHold
} from "../../../services/APIForStaff/API";
import { useAuth } from "../../../context/AuthContext";
import { useDispatch, useSelector } from 'react-redux';
import {
  setCompleteBooking,
  resetBooking,
  setPaymentId
} from '../../../redux/features/sellingSlice'
import {
  setMember,
  setMemberChecked,
  resetMember
} from '../../../redux/features/memberSlice'
import { Button, Tag, Spin, Switch } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Formik, Form, Field } from "formik";
import VersionCard from "../component/VersionCard";
import PaymentMethod from '../component/PaymentMethod'
import { processPayment } from '../../../hooks/useProcessPayment';

const formatPrice = (price) => price?.toLocaleString("vi-VN");

const calculatePointsAndPrice = (selectedSeats, seatData, memberChecked, convertToTicket, discount, totalPrice, memberScore) => {
  let PointsToUse = 0;
  let finalPrice = totalPrice;

  if (memberChecked && convertToTicket === "Agree") {
    const totalAmount = selectedSeats.reduce((total, seatNumber) => {
      const seat = seatData.find((s) => s.seatNumber === seatNumber);
      return total + (seat?.price || 0);
    }, 0);

    const pointsOfAmount = Math.floor(totalAmount / 1000)
    if (memberScore >= pointsOfAmount) {
      PointsToUse = pointsOfAmount;
      finalPrice = totalAmount - PointsToUse * 1000;
    } else {
      PointsToUse = 0;
      finalPrice = totalAmount;
    }
  } else if (memberChecked && convertToTicket === "Disagree" && discount) {
    finalPrice = Math.round(totalPrice * (1 - discount / 100));
  }

  return { PointsToUse, finalPrice };
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

      } else if (/^0\d{9,10}$/.test(searchValue)) {
        res = await getUserByPhone(searchValue);

      } else if (/^\d{9,12}$/.test(searchValue)) {
        res = await getUserByCCCD(searchValue);

      } else {
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
        email: user.Email || searchValue,
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

  const handleAddPromotion = useCallback(async (promotionCode, setFieldValue) => {
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
      if (now < new Date(promotion.StartTime)) throw new Error("Promotion not yet valid");
      if (now > new Date(promotion.EndTime)) throw new Error("Promotion has expired");

      setDiscount(promotion.DiscountValue);
      toast.success(`Successfully applied ${promotion.DiscountValue}% discount`);
    } catch (error) {
      setDiscount(null);
      setFieldValue("promotionCode", "");
      toast.error(error.message);
    }
  }, [setDiscount]);

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

      const { PointsToUse, finalPrice } = calculatePointsAndPrice(
        bookingData.selectedSeats,
        bookingData.seatData,
        memberChecked,
        values.convertToTicket,
        discount,
        bookingData.totalPrice,
        member?.score || 0
      );

      if (values.convertToTicket === "Agree" && memberChecked && PointsToUse > (member?.score || 0)) {
        throw new Error("Not enough points to complete this transaction");
      }

      const seatIds = bookingData.selectedSeats.map((seat) => {
        const seatData = bookingData.seatData.find((s) => s.seatNumber === seat);
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
          const seatData = bookingData.seatData.find((s) => s.seatNumber === seat);
          return {
            seatNumber: seat,
            type: seatData?.type || "normal",
            price: seatData?.price || 90000,
          };
        }),
      };

      dispatch(setCompleteBooking(completeBooking));

      const paymentResult = await processPayment({
        paymentMethod: values.paymentMethod,
        orderId: bookingRes.bookingId,
        amount: finalPrice,
        type: "ticket",
        cardType: values.paymentMethod === "Visa" ? values.cardType : undefined,
        navigate,
        setIsRedirecting,
        successUrl: `${values.paymentMethod === "Cash" || values.paymentMethod === "Visa" ? "/staff/ticket-selling/ticket-information" : `${window.location.origin}/staff/ticket-selling/ticket-information`}`,
      });

      if (values.paymentMethod && paymentResult?.data?.paymentId || paymentResult?.data?.payment?.PaymentId ) {
        dispatch(setPaymentId(paymentResult.data.paymentId || paymentResult.data.payment.PaymentId));
      }
    } catch (error) {
      console.error("Booking error:", error);
      if (error.inner) {
        error.inner.forEach((e) => toast.error(`${e.path}: ${e.message}`));
      } else {
        toast.error(error.message || "Error processing booking");
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
      console.error("Failed to cancel booking:", error);
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
      .oneOf(["Cash", "Momo", "VNPay", "ZaloPay", "Visa"], "Invalid payment method"),

    cardType: Yup.string().when("paymentMethod", {
      is: "Visa",
      then: (schema) =>
        schema.required("Please select a card type").oneOf(["visa", "mastercard", "jcb", "unionpay"]),
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

  return (
    <div className="p-4 mx-auto w-full bg-[#fafbfc]">
      <h1 className="text-3xl font-bold mb-4 text-[#9810FA] justify-between items-center flex flex-col sm:flex-row">
        Confirm Tickets
      </h1>
      <Formik
        initialValues={{
          memberSearch: "",
          convertToTicket: "Disagree",
          promotionCode: "",
          paymentMethod: "",
          cardType: "",
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
            isSearching={isSearching}
            handleMemberSearch={handleMemberSearch}
            handleAddPromotion={handleAddPromotion}
            handleCancel={handleCancel}
            movieInfo={movieInfo}
          />
        )}
      </Formik>
    </div>
  );
};

// Component thực sự, dùng hook thoải mái
function ConfirmFormBody({
  values,
  setFieldValue,
  isSubmitting,
  bookingData,
  memberChecked,
  member,
  discount,
  isSearching,
  handleMemberSearch,
  handleAddPromotion,
  handleCancel,
  movieInfo
}) {
  const { PointsToUse, finalPrice } = useMemo(
    () => calculatePointsAndPrice(
      bookingData.selectedSeats,
      bookingData.seatData,
      memberChecked,
      values.convertToTicket,
      discount,
      bookingData.totalPrice,
      member?.score || 0
    ),
    [
      bookingData.selectedSeats,
      bookingData.seatData,
      memberChecked,
      values.convertToTicket,
      discount,
      bookingData.totalPrice,
      member?.score
    ]
  );

  // Các loại thẻ hỗ trợ
  const CARD_TYPES = [
    { value: "visa", label: "Visa" },
    { value: "mastercard", label: "MasterCard" },
    { value: "jcb", label: "JCB" },
    { value: "unionpay", label: "UnionPay" },
  ];

  return (
    <Form>
      <div className="flex flex-col gap-3">
        <div className=" flex lg:flex-row flex-col gap-3">
          <div className="lg:w-2/3">
            {/* MovieInfoSection inline */}
            <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <RiFilmAiFill /> Ticket Information
              </h2>
              <div className="flex flex-col md:flex-row gap-6 items-center justify-center sm:items-start sm:justify-center">
                <img
                  src={movieInfo.PosterImage}
                  alt={movieInfo.NameOfEnglish}
                  className="lg:h-[300px] object-cover rounded-lg shadow sm:w-[30%] w-[90%] h-auto"
                  onError={(e) => (e.target.src = "/placeholder-poster.jpg")}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                    <div className="px-3 py-2 rounded-full shadow-md  flex items-center justify-center 
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
                    {/* InfoItem inline */}
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
                  {/* PriceDetails inline */}
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
          </div>
          <div className="lg:w-1/3">
            {/* MemberSection inline */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4 border border-gray-300">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-1">
                <FaUser /> Member
              </h2>
              <div className="flex gap-3 items-center justify-center">
                <Field
                  name="memberSearch"
                  type="text"
                  placeholder="Email / Phone / ID"
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => handleMemberSearch(values.memberSearch)}
                  disabled={isSearching}
                  className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 disabled:bg-gray-400 flex items-center gap-2 cursor-pointer"
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
              {memberChecked && member && (
                <div className="mt-4">
                  {/* MemberInfo inline */}
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
                      <p className={`font-medium flex items-center gap-1 ${member.score ? "text-green-600" : "text-red-600"}`}>
                        <FaFire /> {member.score ? member.score : 0}
                      </p>
                    </div>
                  </div>
                  {/* ConvertPoints inline */}
                  <div className="mt-4 flex flex-row items-center justify-between">
                    <label className="text-gray-700 flex items-center gap-2 sm:w-[80%] w-full">
                      <FaExchangeAlt /> Convert points to tickets:
                      <span className="text-red-500">*</span>
                    </label>
                    <Field name="convertToTicket">
                      {({ field }) => (
                        <Switch
                          style={{ width: "100px" }}
                          checked={field.value === "Agree"}
                          onChange={(checked) => {
                            setFieldValue("convertToTicket", checked ? "Agree" : "Disagree");
                          }}
                          checkedChildren="Agree"
                          unCheckedChildren="Disagree"
                        />
                      )}
                    </Field>
                  </div>
                  {/* PromotionCode inline */}
                  <div className="mt-4">
                    <label className=" text-gray-700 mb-2 text-lg font-semibold flex items-center gap-2">
                      <BiSolidDiscount />  Promotion code:
                    </label>
                    <div className="flex gap-3 items-center justify-center">
                      <Field
                        name="promotionCode"
                        type="text"
                        disabled={values.convertToTicket === "Agree"}
                        placeholder="Enter promotion code"
                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddPromotion(values.promotionCode, setFieldValue)}
                        disabled={values.convertToTicket === "Agree" || !values.promotionCode}
                        className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 disabled:bg-gray-400 cursor-pointer flex items-center gap-1"
                      >
                        <IoAddOutline className="text-xl" /> Add
                      </button>
                    </div>
                    {discount && values.convertToTicket === "Disagree" && (
                      <p className="mt-2 text-green-600">Applied {discount}% discount</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="lg:w-2/3 lg:pr-2">
          {/* PaymentMethodSection inline */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FaMoneyBillWave /> Payment Method
            </h2>
            {/* PaymentOptions inline */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-xl">
                Select Payment method: <span className="text-red-500">*</span>
              </h3>
              <PaymentMethod
                value={values.paymentMethod}
                onChange={val => setFieldValue('paymentMethod', val)}
              />
              {/* Nếu chọn Visa thì show lựa chọn loại thẻ */}
              {values.paymentMethod === "Visa" && (
                <div className="mt-4">
                  <label className="font-semibold mb-2 block">Select Card Type: <span className="text-red-500">*</span></label>
                  <div className="lg:flex lg:gap-4 grid grid-cols-2 gap-2">
                    {CARD_TYPES.map(card => (
                      <label key={card.value} className={`border rounded-lg px-4 py-2 cursor-pointer flex items-center gap-2 ${values.cardType === card.value ? "bg-purple-100 border-purple-500" : "hover:border-purple-300"}`}>
                        <Field
                          type="radio"
                          name="cardType"
                          value={card.value}
                          checked={values.cardType === card.value}
                          onChange={() => setFieldValue("cardType", card.value)}
                          
                        />
                        {card.label}
                      </label>
                    ))}
                  </div>
                  {!values.cardType && <div className="text-red-500 text-sm mt-1">Please select a card type</div>}
                </div>
              )}
            </div>
            {/* PriceSummary inline */}
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
                {memberChecked && values.convertToTicket === "Agree" && (
                  <div className="flex flex-col gap-2 text-md">
                    <div className="flex justify-between">
                      <span>Conversion rate:</span>
                      <span className="text-gray-600">1,000 VNĐ = 1 point</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total amount:</span>
                      <span className="text-gray-700">{formatPrice(bookingData.totalPrice)} VNĐ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Points needed:</span>
                      <span className="text-orange-500 flex items-center gap-1">
                        <FaFire /> {Math.floor(bookingData.totalPrice / 1000)} points
                      </span>
                    </div>
                    {(PointsToUse > member.score || PointsToUse === 0) && (
                      <div className="text-red-500 text-sm">
                        Not enough points to complete this transaction
                      </div>
                    )}
                  </div>
                )}
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                  <span>Total Amount:</span>
                  <span className="text-purple-600">
                    {formatPrice(finalPrice)} VNĐ
                  </span>
                </div>
              </div>
            </div>
            {/* ActionButtons inline */}
            <div className="flex justify-end gap-4">
              <Button
                type="primary"
                htmlType="submit"
                disabled={
                  isSubmitting ||
                  !values.paymentMethod ||
                  (memberChecked &&
                    values.convertToTicket === "Agree" &&
                    PointsToUse > member.score)
                }
                className="px-6 py-2 rounded-lg flex items-center gap-2 disabled:!bg-gray-400 disabled:!border-gray-400 disabled:!text-white"
                icon={
                  isSubmitting ? <FiLoader className="animate-spin h-4 w-4 text-white" /> : <CheckOutlined />
                }
              >
                {isSubmitting ? "Processing..." : "Confirm Payment"}
              </Button>
              <Button
                type="default"
                danger
                onClick={handleCancel}
                icon={<FaX />}
                className="px-2 py-1 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2"
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