import React from "react";
import { Field } from "formik";
import { CheckOutlined } from "@ant-design/icons";
import {
  FaMoneyBillWave,
  FaCouch,
  FaFire,
} from "react-icons/fa";

const formatPrice = (price) => price?.toLocaleString("vi-VN");

const PaymentSummarySection = ({
  bookingData,
  values,
  setFieldValue,
  errors,
  touched,
  PointsToUse,
  finalPrice,
  membershipDiscountAmount,
  promotionDiscountAmount,
  memberChecked,
  member,
  discount,
  discountTicket,
  cashChange,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg mb-6">
      <h3 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <FaMoneyBillWave className="text-purple-600" /> Payment Summary
      </h3>

      {/* Seat Types & Pricing */}
      <div className="space-y-3 mb-4">
        {(() => {
          // Group seats by price
          const seatsByPrice = bookingData.selectedSeats.reduce((acc, seat) => {
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
          }, {});

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
          <span className="text-blue-700">
            Membership discount ({discountTicket}%):
          </span>
          <span className="text-blue-600 font-medium">
            -{formatPrice(membershipDiscountAmount)} VNĐ
          </span>
        </div>
      )}
      {promotionDiscountAmount > 0 && (
        <div className="flex justify-between p-2 bg-white rounded-lg mb-2">
          <span className="text-green-700">
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
                <FaFire /> {Math.floor(bookingData.totalPrice / 1000)} points
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
            <span className="font-bold text-xl text-gray-800">Total Amount</span>
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
              Cash given by customer <span className="text-red-500">*</span>
            </label>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Field
                name="cashGiven"
                type="number"
                min={finalPrice}
                placeholder={`Minimum: ${formatPrice(finalPrice)} VNĐ`}
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-0 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-base font-medium transition-all duration-200 hover:border-purple-400 pr-12"
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
  );
};

export default PaymentSummarySection; 