import React from "react";
import momo from "../../../assets/momo-seeklogo.png";
// import vnpay from "../../../assets/vnpay-seeklogo.png";
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

function PaymentMethod({ value, onChange }) {
  return (
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
  );
}

export default PaymentMethod;