import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaMoneyBillWave } from "react-icons/fa";
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
import { Spin } from "antd";
import { Formik } from "formik";
import { processPayment } from "../../../../hooks/useProcessPayment";
import BackButton from "../../component/BackButton";
// import ConfirmFormBody from "./ConfirmFormBody";
import ConfirmFormBody, { calculatePointsAndPrice } from "./ConfirmFormBody";

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
      toast.error(error.message || "Search error");
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
        if(res.promotions.length > 1) 
          throw new Error("Multiple promotions found, please refine your search");

        setDiscount(promotion.DiscountValue);
        toast.success(
          `Successfully applied ${promotion.DiscountValue}% discount`
        );
      } catch (error) {
        setDiscount(null);
        setFieldValue("promotionCode", "");
        toast.error(error.message);
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

      // const PointsToUse = 0; // Placeholder, as calculatePointsAndPrice is removed
      // const finalPrice = bookingData.totalPrice; // Placeholder, as calculatePointsAndPrice is removed
      const { PointsToUse, finalPrice } = calculatePointsAndPrice(
        bookingData.selectedSeats,
        bookingData.seatData,
        memberChecked,
        values.convertToTicket,
        discount,
        bookingData.totalPrice,
        member?.score || 0,
        member?.discountTicket || 0
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
            type: seatData?.type,
            price: seatData?.price,
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
      console.error("Booking error:", error || error.message);
      toast.error(error.message);
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
      console.error("Failed to cancel booking:", error.message || error);
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

export default ConfirmTicketsPage;