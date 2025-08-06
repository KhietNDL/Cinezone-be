import React from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

const PromotionTable = ({
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
    <div className="hidden sm:block overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-purple-50 border-b border-gray-200">
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 w-[200px]">
              Image
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 w-[200px]">
              Promotion Name
            </th>
            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700 w-[120px]">
              Code
            </th>
            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700 w-[100px]">
              Value
            </th>
            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700 w-[120px]">
              Start Date
            </th>
            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700 w-[120px]">
              End Date
            </th>
            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700 w-[120px]">
              Status
            </th>
            <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700 w-[100px]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promotion) => {
            const { status, class: statusClass } = getStatus(
              promotion.StartTime || promotion.startTime,
              promotion.EndTime || promotion.endTime
            );
            return (
              <tr
                key={promotion.PromotionId}
                className="group border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-200"
              >
                <td className="py-3 px-4">
                  {promotion.Image ? (
                    <img
                      src={promotion.Image}
                      alt={promotion.Title}
                      className="w-16 h-16 object-cover rounded-lg mx-auto shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                      <span className="text-gray-400 italic text-xs">
                        No image
                      </span>
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-900 group-hover:text-purple-900 transition-colors">
                      {promotion.Title}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {promotion.Detail}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-sm font-mono bg-purple-50 text-purple-700 px-3 py-1 rounded-lg">
                    {promotion.Code}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-sm font-semibold text-gray-900">
                    {promotion.DiscountValue
                      ? Number(promotion.DiscountValue) % 1 === 0
                        ? Number(promotion.DiscountValue) + "%"
                        : Number(promotion.DiscountValue)
                            .toFixed(2)
                            .replace(/\.00$/, "") + "%"
                      : ""}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="text-sm text-gray-900">
                    {formatDate(promotion.StartTime)}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="text-sm text-gray-900">
                    {formatDate(promotion.EndTime)}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full font-medium text-xs ${statusClass}`}
                  >
                    {status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(promotion)}
                      className="w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 hover:scale-110 transition-all duration-200"
                      title="Edit"
                      aria-label="Edit promotion"
                    >
                      <FaRegEdit size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPromotion(promotion);
                        setShowDeletePopup(true);
                      }}
                      className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-700 rounded-lg hover:bg-red-200 hover:scale-110 transition-all duration-200"
                      title="Delete"
                      aria-label="Delete promotion"
                    >
                      <RiDeleteBin5Line size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PromotionTable;
