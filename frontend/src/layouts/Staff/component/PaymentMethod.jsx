import React from "react";
import momo from "../../../assets/momo-seeklogo.png";
import zalopay from "../../../assets/zalopay-seeklogo.svg";
import visa from "../../../assets/visa.svg"
import { FaMoneyBillWave } from "react-icons/fa6";

const PAYMENT_METHODS = [
  {
    value: "Cash",
    label: "Cash",
    icon: <FaMoneyBillWave className="text-3xl mx-auto mb-2"/>,
    color: "bg-[#F3E8FF] border border-pink-300 ring-4 ring-pink-400 focus:ring-4",
  },
  {
    value: "Momo",
    label: "Momo",
    icon: <img src={momo} alt="Momo" className="h-8 mx-auto mb-2" />,
    color: "bg-[#F3E8FF] border border-pink-300 ring-4 ring-pink-400 focus:ring-4",
  },
  {
    value: "Visa",
    label: "Visa",
    icon: <img src={visa} alt="Visa" className="h-10 mx-auto"/>,
    color: "bg-[#F3E8FF] border border-pink-300 ring-4 ring-pink-400 focus:ring-4",
  },
  {
    value: "ZaloPay",
    label: "ZaloPay",
    icon: <img src={zalopay} alt="ZaloPay" className="h-8 mx-auto mb-2" />,
    color: "bg-[#F3E8FF] border border-pink-300 ring-4 ring-pink-400 focus:ring-4",
  },
];

  const CARD_TYPES = [
    { value: "visa", label: "Visa" },
    { value: "mastercard", label: "MasterCard" },
    { value: "jcb", label: "JCB" },
    { value: "unionpay", label: "UnionPay" },
  ];

function PaymentMethod({
  value,
  onChange,
  showCardType = false,
  cardType = "",
  onCardTypeChange = () => {},
  cardTypes = CARD_TYPES,
  cardTypeError = ""
}) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full justify-center mx-auto">
        {PAYMENT_METHODS.map((method) => (
          <label
            key={method.value}
            className={`border rounded-lg p-3 cursor-pointer transition-all ${value === method.value
              ? "ring-4 ring-purple-500 " + method.color
              : "hover:border-purple-300 hover:ring-4 hover:ring-purple-500"
              }`}
            onClick={() => onChange(method.value)}
          >
            {method.icon}
            <div className="text-center font-medium">{method.label}</div>
          </label>
        ))}
      </div>
      {showCardType && (
        <div className="mt-4">
          <label className="font-semibold mb-2 block">
            Select Card Type: <span className="text-red-500">*</span>
          </label>
          <div className="lg:flex lg:gap-4 grid grid-cols-2 gap-2">
            {cardTypes.map(card => (
              <label key={card.value} className={`border rounded-lg px-4 py-2 cursor-pointer flex items-center gap-2 ${cardType === card.value ? "bg-purple-100 border-purple-500" : "hover:border-purple-300"}`}>
                <input
                  type="radio"
                  name="cardType"
                  value={card.value}
                  checked={cardType === card.value}
                  onChange={() => onCardTypeChange(card.value)}
                  className="accent-purple-500"
                />
                {card.label}
              </label>
            ))}
          </div>
          {cardTypeError && <div className="text-red-500 text-sm mt-1">{cardTypeError}</div>}
        </div>
      )}
    </div>
  );
}

export default PaymentMethod;