import React from "react";
import { Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import PaymentMethod from "../../component/PaymentMethod";
import PaymentSummarySection from "./PaymentSummarySection";

const PaymentMethodSection = ({
  values,
  setFieldValue,
  isSubmitting,
  memberChecked,
  member,
  PointsToUse,
  handleCancel,
   // Các props mới:
   bookingData,
   errors,
   touched,
   finalPrice,
   membershipDiscountAmount,
   promotionDiscountAmount,
   discount,
   discountTicket,
   cashChange,
}) => {
  return (
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

      <PaymentSummarySection
        bookingData={bookingData}
        values={values}
        setFieldValue={setFieldValue}
        errors={errors}
        touched={touched}
        PointsToUse={PointsToUse}
        finalPrice={finalPrice}
        membershipDiscountAmount={membershipDiscountAmount}
        promotionDiscountAmount={promotionDiscountAmount}
        memberChecked={memberChecked}
        member={member}
        discount={discount}
        discountTicket={discountTicket}
        cashChange={cashChange}
      />

      {/* ActionButtons */}
      <div className="flex justify-center gap-4">
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
  );
};

export default PaymentMethodSection; 