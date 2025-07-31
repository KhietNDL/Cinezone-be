import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

const PromotionCards = ({
  promotions,
  handleEdit,
  setSelectedPromotion,
  setShowDeletePopup,
  formatDate,
}) => {
  const getStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end < now)
      return { status: "Expired", class: "bg-rose-200 text-red-700" };
    if (start <= now && now <= end)
      return { status: "Active", class: "bg-green-100 text-green-700" };
    return { status: "Coming Soon", class: "bg-yellow-100 text-yellow-700" };
  };

  return (
    <div className="block sm:hidden space-y-4">
      {promotions.map((promotion) => {
        const { status, class: statusClass } = getStatus(
          promotion.StartTime || promotion.startTime,
          promotion.EndTime || promotion.endTime
        );
        return (
          <article
            key={promotion.PromotionId}
            className="bg-white p-4 rounded-lg shadow-sm border border-slate-200"
          >
            <div className="flex items-center gap-4">
              {promotion.Image ? (
                <img
                  src={promotion.Image}
                  alt={promotion.Title}
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                <span className="text-gray-400 italic">No image</span>
              )}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {promotion.Title}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {promotion.Detail}
                </p>
              </div>
            </div>
            <div className="mt-4 text-xs grid grid-cols-2 space-x-2 space-y-4 text-gray-700">
              <p>
                <strong>Code:</strong>{" "}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                  {promotion.Code || "N/A"}
                </span>
              </p>
              <p>
                <strong>Value:</strong>{" "}
                {promotion.DiscountValue
                  ? Number(promotion.DiscountValue) % 1 === 0
                    ? Number(promotion.DiscountValue) + "%"
                    : Number(promotion.DiscountValue)
                        .toFixed(2)
                        .replace(/\.00$/, "") + "%"
                  : ""}
              </p>
              <p>
                <strong>Start:</strong> {formatDate(promotion.StartTime)}
              </p>
              <p>
                <strong>End:</strong> {formatDate(promotion.EndTime)}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs ${statusClass}`}
                >
                  {status}
                </span>
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(promotion)}
                className="text-blue-500 hover:text-blue-700"
                aria-label="Edit promotion"
              >
                <FaRegEdit size={16} />
              </button>
              <button
                onClick={() => {
                  setSelectedPromotion(promotion);
                  setShowDeletePopup(true);
                }}
                className="text-red-400 hover:text-red-600"
                aria-label="Delete promotion"
              >
                <RiDeleteBin5Line size={16} />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default PromotionCards;
