import React from "react";
import momo from "../../../assets/momo-seeklogo.png";
import zalopay from "../../../assets/zalopay-seeklogo.svg";
import stripe from "../../../assets/Stripe-Symbol.png";
import { FaMoneyBillWave } from "react-icons/fa6";

const PAYMENT_METHODS = [
  {
    value: "Cash",
    label: "Cash",
    icon: <FaMoneyBillWave className="text-3xl mx-auto mb-2 text-purple-600" />,
    color: "bg-purple-50 border-purple-300",
  },
  {
    value: "Momo",
    label: "Momo",
    icon: <img src={momo} alt="Momo" className="h-8 mx-auto mb-2" />,
    color: "bg-purple-50 border-purple-300",
  },
  {
    value: "Stripe",
    label: "Stripe",
    icon: (
      <img src={stripe} alt="Stripe" className="h-8 mx-auto mb-2 rounded-sm" />
    ),
    color: "bg-purple-50 border-purple-300",
  },
  {
    value: "ZaloPay",
    label: "ZaloPay",
    icon: <img src={zalopay} alt="ZaloPay" className="h-8 mx-auto mb-2" />,
    color: "bg-purple-50 border-purple-300",
  },
];

const CARD_TYPES = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "MasterCard" },
  { value: "jcb", label: "JCB" },
  { value: "americanexpress", label: "American Express" },
];

function PaymentMethod({
  value,
  onChange,
  showCardType = false,
  cardType = "",
  onCardTypeChange = () => {},
  cardTypes = CARD_TYPES,
  cardTypeError = "",
}) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {PAYMENT_METHODS.map((method) => (
          <label
            key={method.value}
            className={`
              border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ease-in-out
              hover:shadow-lg hover:transform hover:translate-y-[-2px]
              ${
                value === method.value
                  ? `ring-2 ring-purple-500 shadow-xl transform translate-y-[-4px] bg-gradient-to-br from-purple-50 to-purple-100 border-purple-500`
                  : "bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50"
              }
            `}
            onClick={() => onChange(method.value)}
          >
            <div className="flex flex-col items-center">
              {method.icon}
              <div
                className={`text-center font-semibold ${
                  value === method.value ? "text-purple-700" : "text-gray-700"
                }`}
              >
                {method.label}
              </div>
            </div>
          </label>
        ))}
      </div>

      {showCardType && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="text-lg font-semibold text-gray-800 mb-3 block">
            Select Card Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {cardTypes.map((card) => (
              <label
                key={card.value}
                className={`
                  border-2 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200
                  flex items-center gap-3 font-medium
                  ${
                    cardType === card.value
                      ? "bg-purple-100 border-purple-500 text-purple-700 shadow-md"
                      : "bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50"
                  }
                `}
              >
                <input
                  type="radio"
                  name="cardType"
                  value={card.value}
                  checked={cardType === card.value}
                  onChange={() => onCardTypeChange(card.value)}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 focus:ring-2"
                />
                <span>{card.label}</span>
              </label>
            ))}
          </div>
          {cardTypeError && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-600 text-sm font-medium">
                {cardTypeError}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PaymentMethod;
