import React, { useMemo } from "react";
import { Form } from "formik";
import TicketInformationCard from "./TicketInformationCard";
import MemberInformationCard from "./MemberInformationCard";
import PaymentMethodCard from "./PaymentMethodCard";

// Sửa hàm calculatePointsAndPrice để cộng dồn DiscountTicket và discount (promotion)
const calculatePointsAndPrice = (selectedSeats, seatData, memberChecked, convertToTicket,
  discount, totalPrice, memberScore, discountTicket) => {
  let PointsToUse = 0;
  let finalPrice = totalPrice;
  let membershipDiscountAmount = 0;
  let promotionDiscountAmount = 0;

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
  } else {
    // Áp dụng giảm giá thành viên trước nếu có
    if (memberChecked && discountTicket && Number(discountTicket) > 0) {
      membershipDiscountAmount = Math.round(finalPrice * Number(discountTicket) / 100);
      finalPrice = finalPrice - membershipDiscountAmount;
    }
    // Sau đó áp dụng tiếp mã khuyến mãi nếu có
    if (discount && convertToTicket === "Disagree") {
      promotionDiscountAmount = Math.round(finalPrice * Number(discount) / 100);
      finalPrice = finalPrice - promotionDiscountAmount;
    }
  }

  return { PointsToUse, finalPrice, membershipDiscountAmount, promotionDiscountAmount };
};

const ConfirmFormBody = ({
  values,
  setFieldValue,
  isSubmitting,
  bookingData,
  memberChecked,
  member,
  discount,
  setDiscount,
  discountTicket,
  isSearching,
  handleMemberSearch,
  handleAddPromotion,
  handleCancel,
  movieInfo,
  errors,
  touched
}) => {
  const { PointsToUse, finalPrice, membershipDiscountAmount, promotionDiscountAmount } = useMemo(
    () => calculatePointsAndPrice(
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
      discountTicket
    ]
  );

  const cashChange = values.paymentMethod === "Cash" && values.cashGiven
    ? values.cashGiven - finalPrice
    : 0;

  return (
    <Form>
      <div className="flex flex-col gap-6">
        <div className="flex lg:flex-row flex-col gap-3">
          {/* Left Column */}
          <div className="lg:w-2/3 w-full">
            <TicketInformationCard 
              bookingData={bookingData}
              movieInfo={movieInfo}
            />
          </div>

          {/* Right Column */}
          <div className="lg:w-1/3 w-full">
            <div className="sticky top-4">
              <MemberInformationCard
                memberChecked={memberChecked}
                member={member}
                isSearching={isSearching}
                handleMemberSearch={handleMemberSearch}
                handleAddPromotion={handleAddPromotion}
                values={values}
                setFieldValue={setFieldValue}
                discount={discount}
                setDiscount={setDiscount}
                discountTicket={discountTicket}
              />
            </div>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="lg:w-2/3 w-full">
          <PaymentMethodCard
            values={values}
            setFieldValue={setFieldValue}
            isSubmitting={isSubmitting}
            bookingData={bookingData}
            memberChecked={memberChecked}
            member={member}
            discount={discount}
            discountTicket={discountTicket}
            PointsToUse={PointsToUse}
            finalPrice={finalPrice}
            membershipDiscountAmount={membershipDiscountAmount}
            promotionDiscountAmount={promotionDiscountAmount}
            cashChange={cashChange}
            errors={errors}
            touched={touched}
            handleCancel={handleCancel}
          />
        </div>
      </div>
    </Form>
  );
};

export default ConfirmFormBody; 