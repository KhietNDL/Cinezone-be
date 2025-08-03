import React from "react";
import { Card, Badge, Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { FaMoneyBillWave, FaFire, FaX } from "react-icons/fa6";
import { FiLoader } from "react-icons/fi";
import { Field } from "formik";
import PaymentMethod from '../../component/PaymentMethod';

const formatPrice = (price) => price?.toLocaleString("vi-VN");

const PaymentMethodCard = ({
  values,
  setFieldValue,
  isSubmitting,
  bookingData,
  memberChecked,
  member,
  discount,
  discountTicket,
  PointsToUse,
  finalPrice,
  membershipDiscountAmount,
  promotionDiscountAmount,
  cashChange,
  errors,
  touched,
  handleCancel
}) => {
  return (
    <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
            <FaMoneyBillWave className="text-white text-sm" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Payment Method
            </h2>
            <p className="text-gray-600 text-sm">
              Choose your payment option
            </p>
          </div>
          {values.paymentMethod && (
            <Badge
              count={<CheckOutlined style={{ color: "#52c41a" }} />}
              className="ml-auto"
            />
          )}
        </div>
      </div>

      <div className="p-3">
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-xl">
            Select Payment method: <span className="text-red-500">*</span>
          </h3>
          <PaymentMethod
            value={values.paymentMethod}
            onChange={val => setFieldValue('paymentMethod', val)}
            showCardType={values.paymentMethod === "Stripe"}
            cardType={values.cardType}
            onCardTypeChange={val => setFieldValue("cardType", val)}
            cardTypeError={!values.cardType ? "Please select a card type" : ""}
          />
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-purple-50 p-6 rounded-xl border border-purple-100 mb-6">
          <h3 className="font-semibold mb-4 text-lg">Payment Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total ticket price:</span>
              <span>{formatPrice(bookingData.totalPrice)} VNĐ</span>
            </div>
            {membershipDiscountAmount > 0 && (
              <div className="flex justify-between">
                <span>Membership discount ({discountTicket}%):</span>
                <span className="text-blue-600">-{formatPrice(membershipDiscountAmount)} VNĐ</span>
              </div>
            )}
            {promotionDiscountAmount > 0 && (
              <div className="flex justify-between">
                <span>Promotion code discount ({discount}%):</span>
                <span className="text-green-600">-{formatPrice(promotionDiscountAmount)} VNĐ</span>
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
                  <span className="text-gray-700">
                    {formatPrice(bookingData.totalPrice)} VNĐ
                  </span>
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
            <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
              <span>Total Amount:</span>
              <span className="text-purple-600">
                {formatPrice(finalPrice)} VNĐ
              </span>
            </div>
            {values.paymentMethod === "Cash" && (
              <div className="mt-4">
                <label className="font-semibold mb-2 block">
                  Cash given by customer: <span className="text-red-500">*</span>
                </label>
                <Field
                  name="cashGiven"
                  type="number"
                  min={finalPrice}
                  placeholder={`At least ${finalPrice}`}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                  onChange={e => setFieldValue("cashGiven", Number(e.target.value))}
                />
                {errors?.cashGiven && touched?.cashGiven && (
                  <div className="text-red-500 text-sm mt-1">{errors.cashGiven}</div>
                )}
                {values.cashGiven && values.cashGiven >= finalPrice && (
                  <div className="mt-2 text-green-600 font-semibold">
                    Change: {formatPrice(cashChange)} VNĐ
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
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
            className="px-6 py-2 rounded-lg flex items-center gap-2 disabled:!bg-gray-400 disabled:!border-gray-400 disabled:!text-white bg-gradient-to-r from-purple-600 to-purple-700 border-0 hover:from-purple-700 hover:to-purple-800 transition-all duration-300"
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
    </Card>
  );
};

export default PaymentMethodCard; 