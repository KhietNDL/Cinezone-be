import React, { useMemo } from "react";
import { Form } from "formik";
import MovieInfoSection from "./MovieInfoSection";
import MemberSearchSection from "./MemberSearchSection";
import PaymentMethodSection from "./PaymentMethodSection";
import PaymentSummarySection from "./PaymentSummarySection";

export const calculatePointsAndPrice = (
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

const ConfirmFormBody = ({
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
}) => {
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
          <MovieInfoSection movieInfo={movieInfo} bookingData={bookingData} />
        </div>

        {/* Right Column - Member Search */}
        <div className="lg:col-span-1">
          <MemberSearchSection
            values={values}
            setFieldValue={setFieldValue}
            memberChecked={memberChecked}
            member={member}
            discount={discount}
            discountTicket={discountTicket}
            isSearching={isSearching}
            handleMemberSearch={handleMemberSearch}
            handleAddPromotion={handleAddPromotion}
            setDiscount={setDiscount}
          />
        </div>

        {/* Full Width Payment Section */}
        <div className="lg:col-span-3">
          <PaymentMethodSection
            values={values}
            setFieldValue={setFieldValue}
            isSubmitting={isSubmitting}
            memberChecked={memberChecked}
            member={member}
            PointsToUse={PointsToUse}
            handleCancel={handleCancel}
            // Các props dưới đây là mới, cần thêm:
            bookingData={bookingData}
            errors={errors}
            touched={touched}
            finalPrice={finalPrice}
            membershipDiscountAmount={membershipDiscountAmount}
            promotionDiscountAmount={promotionDiscountAmount}
            discount={discount}
            discountTicket={discountTicket}
            cashChange={cashChange}
          />
        </div>
      </div>
    </Form>
  );
};

export default ConfirmFormBody; 