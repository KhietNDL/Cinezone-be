import React from "react";
import { MdOutlineClose } from "react-icons/md";

const ComboDetailPopup = ({
  showComboDetail,
  setShowComboDetail,
  comboDetail,
}) => {
  if (!showComboDetail || !comboDetail) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-2">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-auto border border-gray-100 animate-slideUp relative">
        <button
          type="button"
          onClick={() => setShowComboDetail(false)}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <MdOutlineClose className="w-6 h-6 text-gray-700" />
        </button>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-2 text-indigo-700">
            {comboDetail.combo.ProductName}
          </h2>
          <img
            src={comboDetail.combo.ImageUrl}
            alt={comboDetail.combo.ProductName}
            className="w-32 h-32 object-cover rounded-lg mb-3"
          />
          <p className="mb-2 text-gray-700">{comboDetail.combo.Description}</p>
          <div className="mb-2">
            <span className="font-semibold">Price:</span>{" "}
            {Number(comboDetail.combo.Price).toLocaleString("vi-VN")} VND
          </div>
          <div className="mb-4">
            <span className="font-semibold">Quantity:</span>{" "}
            {comboDetail.combo.Quantity}
          </div>
          <h3 className="font-semibold text-lg mb-2 text-emerald-700">
            Combo Includes:
          </h3>
          <ul className="space-y-2">
            {comboDetail.children.map((item) => (
              <li
                key={item.ComboProductId}
                className="flex items-center gap-3 border-b pb-2"
              >
                <img
                  src={item.ImageUrl}
                  alt={item.ProductName}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <div className="font-medium">{item.ProductName}</div>
                  <div className="text-xs text-gray-500">
                    {item.Description}
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold">Unit:</span> {item.Unit} |{" "}
                    <span className="font-semibold">Qty:</span> {item.Quantity}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ComboDetailPopup;
