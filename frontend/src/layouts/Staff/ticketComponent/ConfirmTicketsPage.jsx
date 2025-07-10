import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { Button, Tag, Spin, message, Switch } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Formik, Form, Field } from "formik";
import VersionCard from "../component/VersionCard";

// Constants
const PAYMENT_METHODS = [
  {
    value: "Cash",
    label: "Cash",
    icon: <IoMdCash className="text-3xl mx-auto mb-2" />,
    color: "bg-[#F3E8FF] border border-pink-300 ring-4 ring-pink-400 focus:ring-4",
  },
  {
    value: "Momo",
    label: "Momo",
    icon: <img src={momo} alt="Momo" className="h-8 mx-auto mb-2" />,
    color: "bg-[#F3E8FF] border border-pink-300 ring-4 ring-pink-400 focus:ring-4",
  },
  {
    value: "VNPay",
    label: "VNPay",
    icon: <img src={vnpay} alt="VNPay" className="h-8 mx-auto mb-2" />,
    color: "bg-[#F3E8FF] border border-pink-300 ring-4 ring-pink-400 focus:ring-4",
  },
  {
    value: "ZaloPay",
    label: "ZaloPay",
    icon: <img src={zalopay} alt="ZaloPay" className="h-8 mx-auto mb-2" />,
    color: "bg-[#F3E8FF] border border-pink-300 ring-4 ring-pink-400 focus:ring-4",
  },
];

// Helper functions
const formatPrice = (price) => price?.toLocaleString("vi-VN");

const calculatePointsAndPrice = (selectedSeats, seatData, memberChecked, convertToTicket, discount, totalPrice) => {
  let PointsToUse = 0;
  let finalPrice = totalPrice;

  if (memberChecked && convertToTicket === "Agree") {
    const totalAmount = selectedSeats.reduce((total, seatNumber) => {
      const seat = seatData.find((s) => s.seatNumber === seatNumber);
      return total + (seat?.price || 0);
    }, 0);
    PointsToUse = Math.floor(totalAmount / 1000);
    finalPrice = 0;
  } else if (memberChecked && convertToTicket === "Disagree" && discount) {
    finalPrice = Math.round(totalPrice * (1 - discount / 100));
  }

  return { PointsToUse, finalPrice };
};

// Sub-components
const MovieInfoSection = React.memo(({ movieInfo, bookingData }) => (
  <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 mb-6">
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
            bg-[linear-gradient(to_right,_#FACC15,_#DDB61A,_#DBBB3B,_#CDB03D,_#B1900C)] text-[#FFF8A7]">
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
          <InfoItem icon={<FaCalendarDays />} label="Day:" value={bookingData.selectedDay} />
          <InfoItem icon={<IoTime />} label="Time:" value={bookingData.selectedTime} />
          <InfoItem icon={<FaLocationDot />} label="Room:" value={bookingData.room} />
          <InfoItem icon={<FaCouch />} label="Seats:" value={`${bookingData.selectedSeats.join(", ")} - (${bookingData.selectedSeats.length} tickets)`}/>
        </div>

        <PriceDetails selectedSeats={bookingData.selectedSeats} seatData={bookingData.seatData} />
      </div>
    </div>
  </div>
));

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center justify-between lg:justify-start">
    <div className="flex items-center gap-1 font-semibold w-[30%]">
      {icon} {label}
    </div>
    <span className="text-gray-700">{value}</span>
  </div>
);

const PriceDetails = React.memo(({ selectedSeats, seatData }) => (
  <div className="mt-6">
    <h4 className="font-semibold mb-2">Price Details:</h4>
    <div className="space-y-2">
      {selectedSeats.map((seat, index) => {
        const seatInfo = seatData.find((s) => s.seatNumber === seat);
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
          selectedSeats.reduce((total, seatNumber) => {
            const seat = seatData.find((s) => s.seatNumber === seatNumber);
            return total + (seat?.price || 0);
          }, 0)
        )}{" "}
        VNĐ
      </span>
    </div>
  </div>
));

const PaymentMethodSection = React.memo(({
  values,
  isSubmitting,
  memberChecked,
  member,
  bookingData,
  discount,
  PointsToUse,
  finalPrice,
  handleCancel,
  setFieldValue
}) => (
  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300">
    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
      <FaMoneyBillWave /> Payment Method
    </h2>

    <PaymentOptions values={values} setFieldValue={setFieldValue} />
    <PriceSummary
      values={values}
      memberChecked={memberChecked}
      member={member}
      bookingData={bookingData}
      discount={discount}
      PointsToUse={PointsToUse}
      finalPrice={finalPrice}
    />
    <ActionButtons
      isSubmitting={isSubmitting}
      values={values}
      memberChecked={memberChecked}
      PointsToUse={PointsToUse}
      member={member}
      handleCancel={handleCancel}
    />
  </div>
));

const PaymentOptions = React.memo(({ values, setFieldValue }) => (
  <div className="mb-6">
    <h3 className="font-semibold mb-3 text-xl">
      Select Payment method: <span className="text-red-500">*</span>
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {PAYMENT_METHODS.map((method) => (
        <label
          key={method.value}
          className={`border rounded-lg p-3 cursor-pointer transition-all ${values.paymentMethod === method.value
            ? "ring-4 ring-purple-500 " + method.color
            : "hover:border-purple-300 hover:ring-4 hover:ring-purple-500"
            }`}
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
));

const PriceSummary = React.memo(({
  values,
  memberChecked,
  member,
  bookingData,
  discount,
  PointsToUse,
  finalPrice
}) => (
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
        <PointsInfo
          bookingData={bookingData}
          member={member}
          PointsToUse={PointsToUse}
        />
      )}
    </div>
  </div>
));

const PointsInfo = React.memo(({ bookingData, member, PointsToUse }) => (
  <div className="pt-2 mt-2 flex flex-col gap-2 text-md">
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
    <div className="flex justify-between">
      <span>Points available:</span>
      <span className="text-green-600 flex items-center gap-1">
        <FaFire /> {member.score} points
      </span>
    </div>
    {PointsToUse > member.score && (
      <div className="text-red-500 text-sm">
        Not enough points to complete this transaction
      </div>
    )}
  </div>
));

const ActionButtons = React.memo(({
  isSubmitting,
  values,
  memberChecked,
  PointsToUse,
  member,
  handleCancel
}) => (
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
));

const MemberSection = React.memo(({
  values,
  isSearching,
  memberChecked,
  member,
  handleMemberSearch,
  setFieldValue,
  discount,
  handleAddPromotion
}) => (
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
        <MemberInfo member={member} />
        <ConvertPoints values={values} setFieldValue={setFieldValue} />
        <PromotionCode
          values={values}
          setFieldValue={setFieldValue}
          discount={discount}
          handleAddPromotion={handleAddPromotion}
        />
      </div>
    )}
  </div>
));

const MemberInfo = React.memo(({ member }) => (
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
      <p className="font-medium flex items-center gap-1 text-green-600">
        <FaFire /> {member.score}
      </p>
    </div>
  </div>
));

const ConvertPoints = React.memo(({ values, setFieldValue }) => (
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
));

const PromotionCode = React.memo(({
  values,
  setFieldValue,
  discount,
  handleAddPromotion
}) => (
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
));

// Main Component
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

      const promotionTitle =
        values.promotionCode && values.convertToTicket === "Disagree"
          ? values.promotionCode
          : "";

      // Calculate points and final price
      const { PointsToUse, finalPrice } = calculatePointsAndPrice(
        bookingData.selectedSeats,
        bookingData.seatData,
        memberChecked,
        values.convertToTicket,
        discount,
        bookingData.totalPrice
      );

      // Get seat IDs
      const seatIds = bookingData.selectedSeats.map((seat) => {
        const seatData = bookingData.seatData.find((s) => s.seatNumber === seat);
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

      // Prepare complete booking data
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

      // Update Redux state
      dispatch(setCompleteBooking(completeBooking));

      // Process payment
      await processPayment(
        values.paymentMethod,
        bookingRes.bookingId,
        finalPrice,
        navigate,
        setIsRedirecting
      );
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
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => {
          const { PointsToUse, finalPrice } = calculatePointsAndPrice(
            bookingData.selectedSeats,
            bookingData.seatData,
            memberChecked,
            values.convertToTicket,
            discount,
            bookingData.totalPrice
          );

          return (
            <Form>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-2/3">
                  <MovieInfoSection movieInfo={movieInfo} bookingData={bookingData} />
                  <PaymentMethodSection
                    values={values}
                    isSubmitting={isSubmitting}
                    memberChecked={memberChecked}
                    member={member}
                    bookingData={bookingData}
                    discount={discount}
                    PointsToUse={PointsToUse}
                    finalPrice={finalPrice}
                    handleCancel={handleCancel}
                    setFieldValue={setFieldValue}
                  />
                </div>
                <div className="lg:w-1/3">
                  <MemberSection
                    values={values}
                    isSearching={isSearching}
                    memberChecked={memberChecked}
                    member={member}
                    handleMemberSearch={handleMemberSearch}
                    setFieldValue={setFieldValue}
                    discount={discount}
                    handleAddPromotion={handleAddPromotion}
                  />
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

// Helper function for payment processing
async function processPayment(paymentMethod, bookingId, finalAmount, navigate, setIsRedirecting) {
  switch (paymentMethod) {
    case "Cash":
      await createCashPayment(bookingId, finalAmount, `CASH-${Date.now()}`);
      await confirmBooking(bookingId);
      toast.success("Cash payment successful!");
      navigate("/staff/ticket-selling/ticket-infomation");
      break;
    case "Momo":
      setIsRedirecting(true);
      try {
        const momoRes = await createMomoPayment(
          bookingId,
          finalAmount,
          `${window.location.origin}/staff/ticket-selling/ticket-infomation`
        );
        const payUrl = momoRes?.payUrl || momoRes?.data?.payUrl;
        if (!payUrl) {
          setIsRedirecting(false);
          throw new Error("Did not receive payment URL from Momo");
        }
        window.location.href = payUrl;
      } catch (error) {
        setIsRedirecting(false);
        throw error;
      }
      break;
    case "VNPay":
      throw new Error("VNPay payment method not yet supported");
    case "ZaloPay":
      throw new Error("ZaloPay payment method not yet supported");
    default:
      throw new Error("Invalid payment method");
  }
}

export default ConfirmTicketsPage;