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
            className="bg-white p-4 sm:p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              {promotion.Image ? (
                <img
                  src={promotion.Image}
                  alt={promotion.Title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 italic text-xs">No image</span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {promotion.Title}
                </h3>
                <p className="text-xs text-gray-600 truncate mt-1">
                  {promotion.Detail}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-gray-500 font-medium">Code:</p>
                <span className="font-mono bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs">
                  {promotion.Code || "N/A"}
                </span>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Value:</p>
                <span className="font-semibold text-gray-900">
                  {promotion.DiscountValue
                    ? Number(promotion.DiscountValue) % 1 === 0
                      ? Number(promotion.DiscountValue) + "%"
                      : Number(promotion.DiscountValue)
                          .toFixed(2)
                          .replace(/\.00$/, "") + "%"
                    : ""}
                </span>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Start:</p>
                <span className="text-gray-900">
                  {formatDate(promotion.StartTime)}
                </span>
              </div>
              <div>
                <p className="text-gray-500 font-medium">End:</p>
                <span className="text-gray-900">
                  {formatDate(promotion.EndTime)}
                </span>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 font-medium mb-1">Status:</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}
                >
                  {status}
                </span>
              </div>
            </div>
            <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={() => handleEdit(promotion)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-200 text-sm font-medium"
                aria-label="Edit promotion"
              >
                <FaRegEdit size={14} />
                Edit
              </button>
              <button
                onClick={() => {
                  setSelectedPromotion(promotion);
                  setShowDeletePopup(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-50 to-rose-100 text-red-700 rounded-lg hover:from-red-100 hover:to-rose-200 transition-all duration-200 text-sm font-medium"
                aria-label="Delete promotion"
              >
                <RiDeleteBin5Line size={14} />
                Delete
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default PromotionCards;
